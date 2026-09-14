export type PublicationType =
  | "journal_article"
  | "review"
  | "conference_paper"
  | "book_chapter"
  | "technical_report"
  | "preprint";

export interface PublicationAuthor {
  id?: string;
  name: string;
  slug?: string;
  is_lab_member?: boolean;
  is_corresponding?: boolean;
  display_order?: number;
  affiliation?: string;
}

export interface PublicationResearchArea {
  id: string;
  title: string;
  slug: string;
  icon_name?: string;
}

export interface PublicationRelatedProject {
  id: string;
  title: string;
  slug: string;
  status?: string;
}

export interface Publication {
  id: string;
  title: string;
  slug: string;
  abstract: string;
  publication_type: PublicationType;
  journal: string;
  volume?: string | null;
  issue?: string | null;
  pages?: string | null;
  publication_year: number;
  publication_date?: string | null;
  doi?: string | null;
  doi_url?: string | null;
  pdf_url?: string | null;
  external_url?: string | null;
  impact_factor?: number | null;
  citation_count?: number | null;
  quartile?: "Q1" | "Q2" | "Q3" | "Q4" | null;
  is_featured: boolean;
  is_published: boolean;
  display_order: number;
  authors_text: string;
  bibtex?: string | null;
  created_at: string;
  updated_at: string;
}

export interface PublicationWithRelations extends Publication {
  authors: PublicationAuthor[];
  research_areas: PublicationResearchArea[];
  projects: PublicationRelatedProject[];
}

export interface PublicationStats {
  totalPublications: number;
  totalCitations: number;
  topImpactFactor: number;
  q1JournalCount: number;
  journalCount: number;
  openAccessRatio: string;
}

export interface PublicationFilterParams {
  year?: string | string[];
  area?: string;
  type?: string;
  author?: string;
  search?: string;
  sort?: "latest" | "oldest" | "citations" | "impact" | "az";
}

export interface PublicationFormData {
  id?: string;
  title: string;
  slug: string;
  abstract: string;
  publication_type: PublicationType;
  journal: string;
  volume?: string;
  issue?: string;
  pages?: string;
  publication_year: number;
  publication_date?: string;
  doi?: string;
  doi_url?: string;
  pdf_url?: string;
  external_url?: string;
  impact_factor?: string;
  citation_count?: string;
  quartile?: string;
  is_featured: boolean;
  is_published: boolean;
  display_order?: number;
  authors_text: string;
  author_ids?: string[];
  research_area_ids?: string[];
  project_ids?: string[];
  bibtex?: string;
}
