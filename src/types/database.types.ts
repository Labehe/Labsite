export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type UserRole = "ADMIN" | "EDITOR" | "REVIEWER";

export type ProjectStatus = "upcoming" | "ongoing" | "completed";

export type PersonCategory =
  | "pi"
  | "faculty"
  | "researcher"
  | "graduate_student"
  | "undergraduate_student"
  | "alumni"
  | "collaborator";

export type PublicationType =
  | "journal_article"
  | "conference_paper"
  | "book_chapter"
  | "review"
  | "report";

export type NewsCategory =
  | "lab_news"
  | "research_update"
  | "event"
  | "publication_news"
  | "achievement"
  | "insight";

export type OpportunityType =
  | "internship"
  | "research_assistant"
  | "student_research"
  | "collaboration"
  | "other";

export type ApplicationStatus =
  | "new"
  | "reviewing"
  | "shortlisted"
  | "interview"
  | "accepted"
  | "rejected";

export type MessageInquiryType =
  | "general"
  | "internship"
  | "collaboration"
  | "partnership"
  | "student";

export type MessageStatus = "unread" | "read" | "replied" | "archived";

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          email: string;
          role: UserRole;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          email: string;
          role?: UserRole;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string | null;
          email?: string;
          role?: UserRole;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      research_areas: {
        Row: {
          id: string;
          title: string;
          slug: string;
          description: string;
          long_description: string | null;
          image_url: string | null;
          icon_name: string | null;
          research_questions: string[] | null;
          methods: string[] | null;
          display_order: number;
          is_featured: boolean;
          is_published: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          slug: string;
          description: string;
          long_description?: string | null;
          image_url?: string | null;
          icon_name?: string | null;
          research_questions?: string[] | null;
          methods?: string[] | null;
          display_order?: number;
          is_featured?: boolean;
          is_published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          slug?: string;
          description?: string;
          long_description?: string | null;
          image_url?: string | null;
          icon_name?: string | null;
          research_questions?: string[] | null;
          methods?: string[] | null;
          display_order?: number;
          is_featured?: boolean;
          is_published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      projects: {
        Row: {
          id: string;
          title: string;
          slug: string;
          short_description: string;
          full_description: string | null;
          status: ProjectStatus;
          start_date: string | null;
          end_date: string | null;
          funding_info: string | null;
          funding_org: string | null;
          study_area: string | null;
          methodology: string | null;
          findings: string | null;
          outputs: string | null;
          featured_image: string | null;
          gallery: string[] | null;
          is_featured: boolean;
          is_published: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          slug: string;
          short_description: string;
          full_description?: string | null;
          status?: ProjectStatus;
          start_date?: string | null;
          end_date?: string | null;
          funding_info?: string | null;
          funding_org?: string | null;
          study_area?: string | null;
          methodology?: string | null;
          findings?: string | null;
          outputs?: string | null;
          featured_image?: string | null;
          gallery?: string[] | null;
          is_featured?: boolean;
          is_published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          slug?: string;
          short_description?: string;
          full_description?: string | null;
          status?: ProjectStatus;
          start_date?: string | null;
          end_date?: string | null;
          funding_info?: string | null;
          funding_org?: string | null;
          study_area?: string | null;
          methodology?: string | null;
          findings?: string | null;
          outputs?: string | null;
          featured_image?: string | null;
          gallery?: string[] | null;
          is_featured?: boolean;
          is_published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      people: {
        Row: {
          id: string;
          name: string;
          slug: string;
          position: string;
          category: PersonCategory;
          biography: string | null;
          research_interests: string[] | null;
          education: string[] | null;
          email: string | null;
          orcid: string | null;
          google_scholar: string | null;
          linkedin: string | null;
          website: string | null;
          photo_url: string | null;
          display_order: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          position: string;
          category?: PersonCategory;
          biography?: string | null;
          research_interests?: string[] | null;
          education?: string[] | null;
          email?: string | null;
          orcid?: string | null;
          google_scholar?: string | null;
          linkedin?: string | null;
          website?: string | null;
          photo_url?: string | null;
          display_order?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          position?: string;
          category?: PersonCategory;
          biography?: string | null;
          research_interests?: string[] | null;
          education?: string[] | null;
          email?: string | null;
          orcid?: string | null;
          google_scholar?: string | null;
          linkedin?: string | null;
          website?: string | null;
          photo_url?: string | null;
          display_order?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      publications: {
        Row: {
          id: string;
          title: string;
          slug: string;
          authors: string;
          abstract: string | null;
          journal: string;
          publication_year: number;
          publication_type: PublicationType;
          doi: string | null;
          external_url: string | null;
          pdf_url: string | null;
          keywords: string[] | null;
          is_featured: boolean;
          is_published: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          slug: string;
          authors: string;
          abstract?: string | null;
          journal: string;
          publication_year: number;
          publication_type?: PublicationType;
          doi?: string | null;
          external_url?: string | null;
          pdf_url?: string | null;
          keywords?: string[] | null;
          is_featured?: boolean;
          is_published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          slug?: string;
          authors?: string;
          abstract?: string | null;
          journal?: string;
          publication_year?: number;
          publication_type?: PublicationType;
          doi?: string | null;
          external_url?: string | null;
          pdf_url?: string | null;
          keywords?: string[] | null;
          is_featured?: boolean;
          is_published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      news_posts: {
        Row: {
          id: string;
          title: string;
          slug: string;
          excerpt: string;
          content: string;
          cover_image: string | null;
          category: NewsCategory;
          author_id: string | null;
          published_at: string;
          tags: string[] | null;
          is_published: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          slug: string;
          excerpt: string;
          content: string;
          cover_image?: string | null;
          category?: NewsCategory;
          author_id?: string | null;
          published_at?: string;
          tags?: string[] | null;
          is_published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          slug?: string;
          excerpt?: string;
          content?: string;
          cover_image?: string | null;
          category?: NewsCategory;
          author_id?: string | null;
          published_at?: string;
          tags?: string[] | null;
          is_published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      opportunities: {
        Row: {
          id: string;
          title: string;
          slug: string;
          type: OpportunityType;
          description: string;
          requirements: string[] | null;
          eligibility: string | null;
          duration: string | null;
          deadline: string | null;
          application_instructions: string | null;
          featured_image: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          slug: string;
          type?: OpportunityType;
          description: string;
          requirements?: string[] | null;
          eligibility?: string | null;
          duration?: string | null;
          deadline?: string | null;
          application_instructions?: string | null;
          featured_image?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          slug?: string;
          type?: OpportunityType;
          description?: string;
          requirements?: string[] | null;
          eligibility?: string | null;
          duration?: string | null;
          deadline?: string | null;
          application_instructions?: string | null;
          featured_image?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      applications: {
        Row: {
          id: string;
          opportunity_id: string | null;
          applicant_name: string;
          email: string;
          phone: string | null;
          university: string | null;
          department: string | null;
          academic_level: string | null;
          research_interests: string | null;
          preferred_duration: string | null;
          message: string | null;
          cv_url: string;
          supporting_docs_urls: string[] | null;
          status: ApplicationStatus;
          admin_notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          opportunity_id?: string | null;
          applicant_name: string;
          email: string;
          phone?: string | null;
          university?: string | null;
          department?: string | null;
          academic_level?: string | null;
          research_interests?: string | null;
          preferred_duration?: string | null;
          message?: string | null;
          cv_url: string;
          supporting_docs_urls?: string[] | null;
          status?: ApplicationStatus;
          admin_notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          opportunity_id?: string | null;
          applicant_name?: string;
          email?: string;
          phone?: string | null;
          university?: string | null;
          department?: string | null;
          academic_level?: string | null;
          research_interests?: string | null;
          preferred_duration?: string | null;
          message?: string | null;
          cv_url?: string;
          supporting_docs_urls?: string[] | null;
          status?: ApplicationStatus;
          admin_notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      messages: {
        Row: {
          id: string;
          name: string;
          email: string;
          phone: string | null;
          organization: string | null;
          inquiry_type: MessageInquiryType;
          subject: string;
          message: string;
          status: MessageStatus;
          admin_notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          phone?: string | null;
          organization?: string | null;
          inquiry_type?: MessageInquiryType;
          subject: string;
          message: string;
          status?: MessageStatus;
          admin_notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          phone?: string | null;
          organization?: string | null;
          inquiry_type?: MessageInquiryType;
          subject?: string;
          message?: string;
          status?: MessageStatus;
          admin_notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      media: {
        Row: {
          id: string;
          filename: string;
          file_path: string;
          file_url: string;
          file_size: number;
          mime_type: string;
          alt_text: string | null;
          caption: string | null;
          uploaded_by: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          filename: string;
          file_path: string;
          file_url: string;
          file_size: number;
          mime_type: string;
          alt_text?: string | null;
          caption?: string | null;
          uploaded_by?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          filename?: string;
          file_path?: string;
          file_url?: string;
          file_size?: number;
          mime_type?: string;
          alt_text?: string | null;
          caption?: string | null;
          uploaded_by?: string | null;
          created_at?: string;
        };
      };
      site_settings: {
        Row: {
          key: string;
          value: Json;
          description: string | null;
          updated_at: string;
          updated_by: string | null;
        };
        Insert: {
          key: string;
          value: Json;
          description?: string | null;
          updated_at?: string;
          updated_by?: string | null;
        };
        Update: {
          key?: string;
          value?: Json;
          description?: string | null;
          updated_at?: string;
          updated_by?: string | null;
        };
      };
      homepage_sections: {
        Row: {
          id: string;
          section_key: string;
          title: string;
          subtitle: string | null;
          content: Json;
          is_enabled: boolean;
          display_order: number;
          updated_at: string;
        };
        Insert: {
          id?: string;
          section_key: string;
          title: string;
          subtitle?: string | null;
          content?: Json;
          is_enabled?: boolean;
          display_order?: number;
          updated_at?: string;
        };
        Update: {
          id?: string;
          section_key?: string;
          title?: string;
          subtitle?: string | null;
          content?: Json;
          is_enabled?: boolean;
          display_order?: number;
          updated_at?: string;
        };
      };
      admin_activity: {
        Row: {
          id: string;
          user_id: string | null;
          action: string;
          entity_type: string;
          entity_id: string | null;
          metadata: Json | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          action: string;
          entity_type: string;
          entity_id?: string | null;
          metadata?: Json | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          action?: string;
          entity_type?: string;
          entity_id?: string | null;
          metadata?: Json | null;
          created_at?: string;
        };
      };
      // Relational junction tables
      project_researchers: {
        Row: {
          project_id: string;
          person_id: string;
          role_in_project: string | null;
        };
        Insert: {
          project_id: string;
          person_id: string;
          role_in_project?: string | null;
        };
        Update: {
          project_id?: string;
          person_id?: string;
          role_in_project?: string | null;
        };
      };
      project_research_areas: {
        Row: {
          project_id: string;
          research_area_id: string;
        };
        Insert: {
          project_id: string;
          research_area_id: string;
        };
        Update: {
          project_id?: string;
          research_area_id?: string;
        };
      };
      publication_authors: {
        Row: {
          publication_id: string;
          person_id: string;
          author_order: number;
        };
        Insert: {
          publication_id: string;
          person_id: string;
          author_order?: number;
        };
        Update: {
          publication_id?: string;
          person_id?: string;
          author_order?: number;
        };
      };
      publication_research_areas: {
        Row: {
          publication_id: string;
          research_area_id: string;
        };
        Insert: {
          publication_id: string;
          research_area_id: string;
        };
        Update: {
          publication_id?: string;
          research_area_id?: string;
        };
      };
      publication_projects: {
        Row: {
          publication_id: string;
          project_id: string;
        };
        Insert: {
          publication_id: string;
          project_id: string;
        };
        Update: {
          publication_id?: string;
          project_id?: string;
        };
      };
    };
  };
}
