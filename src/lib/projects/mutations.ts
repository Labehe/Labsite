import { createClient } from "@/lib/supabase/client";
import { ProjectFormData, ProjectStatus, ProjectWithRelations } from "./types";
import { getLocalProjects, saveLocalProjects } from "./queries";
import { SEED_RESEARCH_AREAS, SEED_RESEARCHERS } from "./seed-data";
import { getAllResearchAreas } from "@/lib/research-areas/store";

/**
 * Upload an image to Supabase Storage 'project-media' bucket
 */
export async function uploadProjectMedia(file: File): Promise<string> {
  const supabase = createClient();
  const fileExt = file.name.split(".").pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
  const filePath = `projects/${fileName}`;

  const { data, error } = await supabase.storage
    .from("project-media")
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error) {
    console.warn("Storage upload failed or bucket restricted, generating local object URL:", error.message);
    return URL.createObjectURL(file);
  }

  const { data: { publicUrl } } = supabase.storage
    .from("project-media")
    .getPublicUrl(data.path);

  return publicUrl;
}

/**
 * Record an action to the admin_activity audit table
 */
export async function logProjectActivity(
  action: string,
  projectId: string,
  metadata: Record<string, any> = {}
) {
  try {
    const supabase = createClient();
    await (supabase as any).from("admin_activity").insert([
      {
        action,
        entity_type: "project",
        entity_id: projectId,
        metadata,
      },
    ]);
  } catch {
    // silently catch if activity table not accessible
  }
}

/**
 * Create a new project with relations
 */
export async function createProject(formData: ProjectFormData): Promise<ProjectWithRelations> {
  const supabase = createClient();
  const slug = formData.slug || formData.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const newId = formData.id || `proj-${Date.now()}`;

  const projectPayload = {
    title: formData.title,
    slug,
    short_description: formData.short_description,
    full_description: formData.full_description,
    status: formData.status,
    start_date: formData.start_date || null,
    end_date: formData.end_date || null,
    year: formData.year || (formData.start_date ? new Date(formData.start_date).getFullYear().toString() : "2026"),
    funding_info: formData.funding_info || null,
    funding_org: formData.funding_org || null,
    grant_amount: formData.grant_amount || null,
    research_question: formData.research_question || null,
    objectives: formData.objectives || [],
    methodology: formData.methodology || null,
    study_area: formData.study_area || null,
    study_area_description: formData.study_area_description || null,
    findings: formData.findings || null,
    outputs: formData.outputs || null,
    hero_image: formData.hero_image || null,
    image_alt: formData.image_alt || formData.title,
    featured_image: formData.hero_image || null,
    gallery: formData.gallery || [],
    display_order: formData.display_order ?? 0,
    is_featured: formData.is_featured,
    is_published: formData.is_published,
    published_at: formData.is_published ? new Date().toISOString() : null,
  };

  // Attempt remote Supabase insert
  try {
    const { data: created, error } = await (supabase as any)
      .from("projects")
      .insert([projectPayload])
      .select()
      .single();

    if (!error && created) {
      // Insert research area junctions
      if (formData.research_area_ids?.length) {
        const areaRows = formData.research_area_ids.map((areaId) => ({
          project_id: created.id,
          research_area_id: areaId,
        }));
        await (supabase as any).from("project_research_areas").insert(areaRows);
      }

      // Insert researcher junctions
      if (formData.researcher_assignments?.length) {
        const researcherRows = formData.researcher_assignments.map((ra, idx) => ({
          project_id: created.id,
          person_id: ra.person_id,
          role_in_project: ra.role_in_project,
          display_order: idx + 1,
        }));
        await (supabase as any).from("project_researchers").insert(researcherRows);
      }

      // Insert collaborators
      if (formData.collaborators?.length) {
        const collabRows = formData.collaborators.map((c, idx) => ({
          project_id: created.id,
          name: c.name,
          institution: c.institution,
          role: c.role || "Collaborator",
          display_order: idx + 1,
        }));
        await (supabase as any).from("project_collaborators").insert(collabRows);
      }

      await logProjectActivity("Project created", created.id, { title: created.title, slug: created.slug });
    }
  } catch (err) {
    console.warn("Supabase project insert failed, fallback to local store:", err);
  }

  // Update local memory and localStorage store
  const allAreas = getAllResearchAreas();
  const matchedAreas = allAreas.filter((a) => formData.research_area_ids.includes(a.id));
  const matchedResearchers = formData.researcher_assignments.map((ra) => {
    const found = SEED_RESEARCHERS.find((p) => p.id === ra.person_id);
    return {
      id: ra.person_id,
      name: found?.name || "Researcher",
      slug: found?.slug || "researcher",
      position: found?.position || "Researcher",
      photo_url: found?.photo_url || null,
      role_in_project: ra.role_in_project,
    };
  });

  const fullProject: ProjectWithRelations = {
    id: newId,
    ...projectPayload,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    research_areas: matchedAreas,
    researchers: matchedResearchers,
    collaborators: formData.collaborators || [],
    publications: [],
  };

  const existing = getLocalProjects();
  saveLocalProjects([fullProject, ...existing]);
  return fullProject;
}

/**
 * Update an existing project
 */
export async function updateProject(
  id: string,
  formData: Partial<ProjectFormData>
): Promise<ProjectWithRelations> {
  const supabase = createClient();
  const slug = formData.slug || (formData.title ? formData.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") : undefined);

  const updatePayload: Record<string, any> = {
    updated_at: new Date().toISOString(),
  };

  if (formData.title !== undefined) updatePayload.title = formData.title;
  if (slug !== undefined) updatePayload.slug = slug;
  if (formData.short_description !== undefined) updatePayload.short_description = formData.short_description;
  if (formData.full_description !== undefined) updatePayload.full_description = formData.full_description;
  if (formData.status !== undefined) updatePayload.status = formData.status;
  if (formData.start_date !== undefined) updatePayload.start_date = formData.start_date;
  if (formData.end_date !== undefined) updatePayload.end_date = formData.end_date;
  if (formData.year !== undefined) updatePayload.year = formData.year;
  if (formData.funding_info !== undefined) updatePayload.funding_info = formData.funding_info;
  if (formData.funding_org !== undefined) updatePayload.funding_org = formData.funding_org;
  if (formData.grant_amount !== undefined) updatePayload.grant_amount = formData.grant_amount;
  if (formData.research_question !== undefined) updatePayload.research_question = formData.research_question;
  if (formData.objectives !== undefined) updatePayload.objectives = formData.objectives;
  if (formData.methodology !== undefined) updatePayload.methodology = formData.methodology;
  if (formData.study_area !== undefined) updatePayload.study_area = formData.study_area;
  if (formData.study_area_description !== undefined) updatePayload.study_area_description = formData.study_area_description;
  if (formData.findings !== undefined) updatePayload.findings = formData.findings;
  if (formData.outputs !== undefined) updatePayload.outputs = formData.outputs;
  if (formData.hero_image !== undefined) {
    updatePayload.hero_image = formData.hero_image;
    updatePayload.featured_image = formData.hero_image;
  }
  if (formData.image_alt !== undefined) updatePayload.image_alt = formData.image_alt;
  if (formData.gallery !== undefined) updatePayload.gallery = formData.gallery;
  if (formData.display_order !== undefined) updatePayload.display_order = formData.display_order;
  if (formData.is_featured !== undefined) updatePayload.is_featured = formData.is_featured;
  if (formData.is_published !== undefined) {
    updatePayload.is_published = formData.is_published;
    if (formData.is_published) {
      updatePayload.published_at = new Date().toISOString();
    }
  }

  try {
    await (supabase as any).from("projects").update(updatePayload).eq("id", id);
    await logProjectActivity("Project updated", id, { fields: Object.keys(updatePayload) });
  } catch (err) {
    console.warn("Supabase project update failed, updating local store:", err);
  }

  // Update local memory and storage
  const existing = getLocalProjects();
  const index = existing.findIndex((p) => p.id === id);
  if (index !== -1) {
    const matchedResearchers = formData.researcher_assignments
      ? formData.researcher_assignments.map((ra) => {
          const found = SEED_RESEARCHERS.find((p) => p.id === ra.person_id);
          return {
            id: ra.person_id,
            name: found?.name || "Researcher",
            slug: found?.slug || "researcher",
            position: found?.position || "Researcher",
            photo_url: found?.photo_url || null,
            role_in_project: ra.role_in_project,
          };
        })
      : existing[index].researchers;

    const allAreas = getAllResearchAreas();
    const updated = {
      ...existing[index],
      ...updatePayload,
      research_areas: formData.research_area_ids
        ? allAreas.filter((a) => formData.research_area_ids?.includes(a.id))
        : existing[index].research_areas,
      researchers: matchedResearchers,
      collaborators: formData.collaborators !== undefined ? formData.collaborators : existing[index].collaborators,
    };
    existing[index] = updated;
    saveLocalProjects([...existing]);
    return updated;
  }

  return existing[0];
}

/**
 * Delete a project
 */
export async function deleteProject(id: string): Promise<boolean> {
  const supabase = createClient();
  try {
    const { error } = await (supabase as any).from("projects").delete().eq("id", id);
    if (error) {
      console.warn("Supabase delete restricted, removing locally:", error.message);
    }
  } catch (err) {
    console.warn("Supabase delete failed, removing locally:", err);
  }

  try {
    await logProjectActivity("Project deleted", id);
  } catch {}

  const existing = getLocalProjects();
  saveLocalProjects(existing.filter((p) => p.id !== id));
  return true;
}

/**
 * Toggle Published / Draft State
 */
export async function toggleProjectPublish(id: string, is_published: boolean): Promise<void> {
  await updateProject(id, { is_published });
}

/**
 * Toggle Featured State
 */
export async function toggleProjectFeatured(id: string, is_featured: boolean): Promise<void> {
  await updateProject(id, { is_featured });
}

/**
 * Update Project Status (ongoing | completed | archived)
 */
export async function updateProjectStatus(id: string, status: ProjectStatus): Promise<void> {
  await updateProject(id, { status });
}
