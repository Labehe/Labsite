export type ProjectStatus = "ongoing" | "completed" | "archived" | "upcoming";

export interface ProjectResearchArea {
  id: string;
  title: string;
  slug: string;
  description?: string;
  icon_name?: string;
}

export interface ProjectResearcher {
  id: string;
  name: string;
  slug: string;
  position: string;
  photo_url?: string | null;
  role_in_project?: string;
  display_order?: number;
}

export interface ProjectCollaborator {
  id?: string;
  name: string;
  institution: string;
  role?: string;
  logo_url?: string | null;
  display_order?: number;
}

export interface ProjectPublication {
  id: string;
  title: string;
  slug: string;
  journal: string;
  publication_year: number;
  doi?: string | null;
  authors: string;
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  short_description: string;
  full_description?: string | null;
  status: ProjectStatus;
  start_date?: string | null;
  end_date?: string | null;
  year?: string | null;
  funding_info?: string | null;
  funding_org?: string | null;
  grant_amount?: string | null;
  research_question?: string | null;
  objectives?: string[] | null;
  methodology?: string | null;
  study_area?: string | null;
  study_area_description?: string | null;
  findings?: string | null;
  outputs?: string | null;
  hero_image?: string | null;
  image_alt?: string | null;
  featured_image?: string | null;
  gallery?: string[] | null;
  display_order: number;
  is_featured: boolean;
  is_published: boolean;
  published_at?: string | null;
  created_at: string;
  updated_at: string;
}

export interface ProjectWithRelations extends Project {
  research_areas: ProjectResearchArea[];
  researchers: ProjectResearcher[];
  collaborators: ProjectCollaborator[];
  publications: ProjectPublication[];
}

export interface ProjectStats {
  totalProjects: number;
  ongoingCount: number;
  completedCount: number;
  partnersCount: number;
}

export interface ProjectFilterParams {
  status?: string;
  area?: string;
  year?: string;
  sort?: "latest" | "oldest" | "az" | "featured";
  search?: string;
}

export interface ProjectFormData {
  id?: string;
  title: string;
  slug: string;
  short_description: string;
  full_description: string;
  status: ProjectStatus;
  start_date: string;
  end_date: string;
  year: string;
  funding_org: string;
  grant_amount: string;
  funding_info: string;
  research_question: string;
  objectives: string[];
  methodology: string;
  study_area: string;
  study_area_description: string;
  hero_image: string;
  image_alt: string;
  gallery: string[];
  outputs: string;
  findings: string;
  is_featured: boolean;
  is_published: boolean;
  display_order: number;
  // Relation IDs
  research_area_ids: string[];
  researcher_assignments: { person_id: string; role_in_project: string }[];
  collaborators: ProjectCollaborator[];
  publication_ids: string[];
}
