export type NewsCategory =
  | "breakthrough"
  | "expedition"
  | "grant_award"
  | "symposium"
  | "lab_update"
  | "press"
  | "opportunity";

export interface NewsArticle {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string; // Markdown or structured rich text
  category: NewsCategory;
  cover_image_url?: string | null;
  image_caption?: string | null;
  image_credit?: string | null;
  author_name: string;
  author_role?: string | null;
  author_avatar?: string | null;
  published_at: string; // YYYY-MM-DD
  read_time_minutes: number;
  is_featured: boolean;
  is_published: boolean;
  display_order?: number;
  tags?: string[];
  research_area_ids?: string[];
  project_ids?: string[];
  // Relational mappings
  research_areas?: { id: string; title: string; slug: string }[];
  projects?: { id: string; title: string; slug: string }[];
  created_at: string;
  updated_at: string;
}

export interface NewsFormData {
  id?: string;
  title: string;
  slug?: string;
  summary: string;
  content: string;
  category: NewsCategory;
  cover_image_url?: string;
  image_caption?: string;
  image_credit?: string;
  author_name: string;
  author_role?: string;
  author_avatar?: string;
  published_at?: string;
  read_time_minutes?: number | string;
  is_featured: boolean;
  is_published: boolean;
  display_order?: number;
  tags?: string[] | string;
  research_area_ids?: string[];
  project_ids?: string[];
}

export interface NewsFilterParams {
  search?: string;
  category?: string;
  year?: string | number | number[];
  author?: string;
  tag?: string;
}

export interface NewsStats {
  totalArticles: number;
  breakthroughCount: number;
  expeditionCount: number;
  grantCount: number;
  symposiumCount: number;
}
