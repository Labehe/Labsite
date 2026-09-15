import { TeamMember, TeamCategory } from "./types";
import { INITIAL_TEAM_MEMBERS } from "./seed-data";
import { createClient } from "@/lib/supabase/client";
import { idbGet, idbSet, idbDelete, safeLocalStorageSet, safeLocalStorageGet } from "@/lib/storage/idb-storage";

const LOCAL_STORAGE_KEY = "ecotox_lab_team_members_v1";

export async function getTeamMembers(): Promise<TeamMember[]> {
  // 1. Try Supabase first
  try {
    const supabase = createClient();
    const { data, error } = await (supabase as any)
      .from("people")
      .select("*")
      .order("order_index", { ascending: true });

    if (!error && data && data.length > 0) {
      const mapped: TeamMember[] = data.map((row: any) => ({
        id: row.id,
        name: row.name,
        slug: row.slug || row.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        role: row.role || row.designation || "Researcher",
        category: (row.category as TeamCategory) || "graduate",
        department: row.department || "Department of Environmental Sciences",
        affiliation: row.affiliation || "Jahangirnagar University",
        bio: row.bio || "",
        researchInterests: Array.isArray(row.research_interests)
          ? row.research_interests
          : row.research_interests ? row.research_interests.split(",") : [],
        education: Array.isArray(row.education) ? row.education : [],
        email: row.email || "",
        phone: row.phone || "",
        officeLocation: row.office_location || "",
        googleScholarUrl: row.google_scholar_url || "",
        orcid: row.orcid || "",
        researchGateUrl: row.researchgate_url || "",
        linkedinUrl: row.linkedin_url || "",
        websiteUrl: row.website_url || "",
        imageSrc: row.image_url || row.image_src || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80",
        quote: row.quote || "",
        publicationsCount: row.publications_count,
        citationsCount: row.citations_count,
        hIndex: row.h_index,
        grantsCount: row.grants_count,
        advisingCount: row.advising_count,
        thesisTopic: row.thesis_topic || "",
        advisor: row.advisor || "",
        expectedGraduation: row.expected_graduation || "",
        currentPosition: row.current_position || "",
        currentInstitution: row.current_institution || "",
        alumniYear: row.alumni_year || "",
        pastRole: row.past_role || "",
        orderIndex: row.order_index || 0,
        isActive: row.is_active ?? true,
      }));

      // Cache locally
      await idbSet(LOCAL_STORAGE_KEY, mapped);
      safeLocalStorageSet(LOCAL_STORAGE_KEY, mapped);
      return mapped;
    }
  } catch (err) {
    // Supabase query failed, fallback
  }

  // 2. Check IndexedDB in browser (unlimited quota)
  if (typeof window !== "undefined") {
    try {
      const idbData = await idbGet<TeamMember[]>(LOCAL_STORAGE_KEY);
      if (Array.isArray(idbData) && idbData.length > 0) {
        return idbData;
      }
    } catch (e) {
      console.warn("IndexedDB read error:", e);
    }

    // 3. Check localStorage in browser
    const cached = safeLocalStorageGet<TeamMember[]>(LOCAL_STORAGE_KEY);
    if (Array.isArray(cached) && cached.length > 0) {
      // Migrate to IndexedDB
      await idbSet(LOCAL_STORAGE_KEY, cached);
      return cached;
    }
  }

  // 4. Fallback to rich seed data
  if (typeof window !== "undefined") {
    await idbSet(LOCAL_STORAGE_KEY, INITIAL_TEAM_MEMBERS);
    safeLocalStorageSet(LOCAL_STORAGE_KEY, INITIAL_TEAM_MEMBERS);
  }
  return INITIAL_TEAM_MEMBERS;
}

export async function saveTeamMember(member: Partial<TeamMember>): Promise<TeamMember> {
  const current = await getTeamMembers();
  let updatedList: TeamMember[];

  const isNew = !member.id || !current.some((m) => m.id === member.id);
  const nowId = member.id || `team-${Date.now()}`;
  const slug = member.slug || (member.name ? member.name.toLowerCase().replace(/[^a-z0-9]+/g, "-") : `member-${Date.now()}`);

  const completeMember: TeamMember = {
    id: nowId,
    name: member.name || "Unnamed Researcher",
    slug,
    role: member.role || "Research Fellow",
    category: member.category || "graduate",
    department: member.department || "Department of Environmental Sciences",
    affiliation: member.affiliation || "Jahangirnagar University",
    bio: member.bio || "",
    researchInterests: member.researchInterests || [],
    education: member.education || [],
    email: member.email || "",
    phone: member.phone || "",
    officeLocation: member.officeLocation || "",
    googleScholarUrl: member.googleScholarUrl || "",
    orcid: member.orcid || "",
    researchGateUrl: member.researchGateUrl || "",
    linkedinUrl: member.linkedinUrl || "",
    websiteUrl: member.websiteUrl || "",
    imageSrc: member.imageSrc || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80",
    quote: member.quote || "",
    publicationsCount: member.publicationsCount,
    citationsCount: member.citationsCount,
    hIndex: member.hIndex,
    grantsCount: member.grantsCount,
    advisingCount: member.advisingCount,
    thesisTopic: member.thesisTopic || "",
    undergradThesis: member.undergradThesis || "",
    undergradDescription: member.undergradDescription || "",
    mscThesis: member.mscThesis || "",
    mscDescription: member.mscDescription || "",
    phdThesis: member.phdThesis || "",
    phdDescription: member.phdDescription || "",
    skills: member.skills || [],
    awards: member.awards || [],
    publications: member.publications || [],
    curriculumVitae: member.curriculumVitae,
    advisor: member.advisor || "",
    expectedGraduation: member.expectedGraduation || "",
    currentPosition: member.currentPosition || "",
    currentInstitution: member.currentInstitution || "",
    alumniYear: member.alumniYear || "",
    pastRole: member.pastRole || "",
    orderIndex: member.orderIndex ?? (isNew ? current.length + 1 : 0),
    isActive: member.isActive ?? true,
  };

  if (isNew) {
    updatedList = [completeMember, ...current];
  } else {
    updatedList = current.map((m) => (m.id === completeMember.id ? completeMember : m));
  }

  // 1. Always save directly into IndexedDB (guaranteed success)
  if (typeof window !== "undefined") {
    await idbSet(LOCAL_STORAGE_KEY, updatedList);
    // 2. Mirror into localStorage safely with quota protection
    safeLocalStorageSet(LOCAL_STORAGE_KEY, updatedList);
  }

  // 3. Try saving to Supabase if table exists
  try {
    const supabase = createClient();
    const payload = {
      id: completeMember.id,
      name: completeMember.name,
      slug: completeMember.slug,
      designation: completeMember.role,
      category: completeMember.category,
      department: completeMember.department,
      affiliation: completeMember.affiliation,
      bio: completeMember.bio,
      email: completeMember.email,
      phone: completeMember.phone,
      google_scholar_url: completeMember.googleScholarUrl,
      researchgate_url: completeMember.researchGateUrl,
      orcid: completeMember.orcid,
      image_url: completeMember.imageSrc,
      is_active: completeMember.isActive,
    };

    if (isNew) {
      await (supabase as any).from("people").insert([payload]);
    } else {
      await (supabase as any).from("people").update(payload).eq("id", completeMember.id);
    }
  } catch (err) {
    // Ignore Supabase sync error for offline/client mode
  }

  return completeMember;
}

export async function deleteTeamMember(id: string): Promise<boolean> {
  const current = await getTeamMembers();
  const updatedList = current.filter((m) => m.id !== id);

  if (typeof window !== "undefined") {
    await idbSet(LOCAL_STORAGE_KEY, updatedList);
    safeLocalStorageSet(LOCAL_STORAGE_KEY, updatedList);
  }

  try {
    const supabase = createClient();
    await (supabase as any).from("people").delete().eq("id", id);
  } catch (err) {
    // Ignore
  }

  return true;
}

export async function getTeamMemberBySlug(slug: string): Promise<TeamMember | null> {
  const members = await getTeamMembers();
  const found = members.find(
    (m) =>
      m.slug === slug ||
      m.id === slug ||
      m.name.toLowerCase().replace(/[^a-z0-9]+/g, "-") === slug
  );
  if (found) return found;

  // Check initial seed data fallback
  const seedFound = INITIAL_TEAM_MEMBERS.find(
    (m) =>
      m.slug === slug ||
      m.id === slug ||
      m.name.toLowerCase().replace(/[^a-z0-9]+/g, "-") === slug
  );
  return seedFound || null;
}

export async function getRelatedTeamMembers(
  currentId: string,
  category: TeamCategory,
  limit: number = 3
): Promise<TeamMember[]> {
  const members = await getTeamMembers();
  return members
    .filter((m) => m.id !== currentId && (m.category === category || category === "pi"))
    .slice(0, limit);
}
