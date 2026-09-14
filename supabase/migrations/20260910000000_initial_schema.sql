-- ==============================================================================
-- Environmental Health & Ecotoxicology Laboratory Database Schema
-- Version: 1.0.0
-- Description: Relational PostgreSQL schema with Row Level Security (RLS),
--              Role-Based Access Control (RBAC), junction tables, and storage buckets.
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ------------------------------------------------------------------------------
-- 1. ENUMS & DOMAINS
-- ------------------------------------------------------------------------------
CREATE TYPE user_role AS ENUM ('ADMIN', 'EDITOR', 'REVIEWER');
CREATE TYPE project_status AS ENUM ('upcoming', 'ongoing', 'completed');
CREATE TYPE person_category AS ENUM (
  'pi',
  'faculty',
  'researcher',
  'graduate_student',
  'undergraduate_student',
  'alumni',
  'collaborator'
);
CREATE TYPE publication_type AS ENUM (
  'journal_article',
  'conference_paper',
  'book_chapter',
  'review',
  'report'
);
CREATE TYPE news_category AS ENUM (
  'lab_news',
  'research_update',
  'event',
  'publication_news',
  'achievement',
  'insight'
);
CREATE TYPE opportunity_type AS ENUM (
  'internship',
  'research_assistant',
  'student_research',
  'collaboration',
  'other'
);
CREATE TYPE application_status AS ENUM (
  'new',
  'reviewing',
  'shortlisted',
  'interview',
  'accepted',
  'rejected'
);
CREATE TYPE message_inquiry_type AS ENUM (
  'general',
  'internship',
  'collaboration',
  'partnership',
  'student'
);
CREATE TYPE message_status AS ENUM ('unread', 'read', 'replied', 'archived');

-- ------------------------------------------------------------------------------
-- 2. CORE SYSTEM & PROFILE TABLES
-- ------------------------------------------------------------------------------

-- User Profiles (linked to auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  email TEXT NOT NULL UNIQUE,
  role user_role NOT NULL DEFAULT 'REVIEWER',
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc', NOW())
);

-- Site Settings (Key-Value configuration for CMS)
CREATE TABLE IF NOT EXISTS public.site_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL DEFAULT '{}'::jsonb,
  description TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc', NOW()),
  updated_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL
);

-- Homepage Dynamic Sections
CREATE TABLE IF NOT EXISTS public.homepage_sections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  section_key TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  subtitle TEXT,
  content JSONB NOT NULL DEFAULT '{}'::jsonb,
  is_enabled BOOLEAN NOT NULL DEFAULT true,
  display_order INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc', NOW())
);

-- Admin Audit Activity Log
CREATE TABLE IF NOT EXISTS public.admin_activity (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc', NOW())
);

-- ------------------------------------------------------------------------------
-- 3. CONTENT ENTITIES
-- ------------------------------------------------------------------------------

-- Research Areas
CREATE TABLE IF NOT EXISTS public.research_areas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  long_description TEXT,
  image_url TEXT,
  icon_name TEXT,
  research_questions TEXT[] DEFAULT ARRAY[]::TEXT[],
  methods TEXT[] DEFAULT ARRAY[]::TEXT[],
  display_order INTEGER NOT NULL DEFAULT 0,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc', NOW())
);

-- People / Researchers
CREATE TABLE IF NOT EXISTS public.people (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  position TEXT NOT NULL,
  category person_category NOT NULL DEFAULT 'researcher',
  biography TEXT,
  research_interests TEXT[] DEFAULT ARRAY[]::TEXT[],
  education TEXT[] DEFAULT ARRAY[]::TEXT[],
  email TEXT,
  orcid TEXT,
  google_scholar TEXT,
  linkedin TEXT,
  website TEXT,
  photo_url TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc', NOW())
);

-- Projects
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  short_description TEXT NOT NULL,
  full_description TEXT,
  status project_status NOT NULL DEFAULT 'ongoing',
  start_date DATE,
  end_date DATE,
  funding_info TEXT,
  funding_org TEXT,
  study_area TEXT,
  methodology TEXT,
  findings TEXT,
  outputs TEXT,
  featured_image TEXT,
  gallery TEXT[] DEFAULT ARRAY[]::TEXT[],
  is_featured BOOLEAN NOT NULL DEFAULT false,
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc', NOW())
);

-- Publications
CREATE TABLE IF NOT EXISTS public.publications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  authors TEXT NOT NULL,
  abstract TEXT,
  journal TEXT NOT NULL,
  publication_year INTEGER NOT NULL,
  publication_type publication_type NOT NULL DEFAULT 'journal_article',
  doi TEXT,
  external_url TEXT,
  pdf_url TEXT,
  keywords TEXT[] DEFAULT ARRAY[]::TEXT[],
  is_featured BOOLEAN NOT NULL DEFAULT false,
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc', NOW())
);

-- News & Insights Posts
CREATE TABLE IF NOT EXISTS public.news_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  cover_image TEXT,
  category news_category NOT NULL DEFAULT 'lab_news',
  author_id UUID REFERENCES public.people(id) ON DELETE SET NULL,
  published_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc', NOW()),
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc', NOW())
);

-- Opportunities (Internships, RA, Collaborations)
CREATE TABLE IF NOT EXISTS public.opportunities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  type opportunity_type NOT NULL DEFAULT 'internship',
  description TEXT NOT NULL,
  requirements TEXT[] DEFAULT ARRAY[]::TEXT[],
  eligibility TEXT,
  duration TEXT,
  deadline DATE,
  application_instructions TEXT,
  featured_image TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc', NOW())
);

-- ------------------------------------------------------------------------------
-- 4. RELATIONAL JUNCTION TABLES
-- ------------------------------------------------------------------------------

-- Projects <-> Researchers (Many-to-Many)
CREATE TABLE IF NOT EXISTS public.project_researchers (
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  person_id UUID REFERENCES public.people(id) ON DELETE CASCADE,
  role_in_project TEXT,
  PRIMARY KEY (project_id, person_id)
);

-- Projects <-> Research Areas (Many-to-Many)
CREATE TABLE IF NOT EXISTS public.project_research_areas (
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  research_area_id UUID REFERENCES public.research_areas(id) ON DELETE CASCADE,
  PRIMARY KEY (project_id, research_area_id)
);

-- Publications <-> Authors/People (Many-to-Many)
CREATE TABLE IF NOT EXISTS public.publication_authors (
  publication_id UUID REFERENCES public.publications(id) ON DELETE CASCADE,
  person_id UUID REFERENCES public.people(id) ON DELETE CASCADE,
  author_order INTEGER NOT NULL DEFAULT 1,
  PRIMARY KEY (publication_id, person_id)
);

-- Publications <-> Research Areas (Many-to-Many)
CREATE TABLE IF NOT EXISTS public.publication_research_areas (
  publication_id UUID REFERENCES public.publications(id) ON DELETE CASCADE,
  research_area_id UUID REFERENCES public.research_areas(id) ON DELETE CASCADE,
  PRIMARY KEY (publication_id, research_area_id)
);

-- Publications <-> Projects (Many-to-Many)
CREATE TABLE IF NOT EXISTS public.publication_projects (
  publication_id UUID REFERENCES public.publications(id) ON DELETE CASCADE,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  PRIMARY KEY (publication_id, project_id)
);

-- ------------------------------------------------------------------------------
-- 5. OPERATIONAL & USER SUBMISSIONS TABLES
-- ------------------------------------------------------------------------------

-- Internship / Research Applications
CREATE TABLE IF NOT EXISTS public.applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  opportunity_id UUID REFERENCES public.opportunities(id) ON DELETE SET NULL,
  applicant_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  university TEXT,
  department TEXT,
  academic_level TEXT,
  research_interests TEXT,
  preferred_duration TEXT,
  message TEXT,
  cv_url TEXT NOT NULL,
  supporting_docs_urls TEXT[] DEFAULT ARRAY[]::TEXT[],
  status application_status NOT NULL DEFAULT 'new',
  admin_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc', NOW())
);

-- Contact Messages
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  organization TEXT,
  inquiry_type message_inquiry_type NOT NULL DEFAULT 'general',
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status message_status NOT NULL DEFAULT 'unread',
  admin_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc', NOW())
);

-- Media Library
CREATE TABLE IF NOT EXISTS public.media (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  filename TEXT NOT NULL,
  file_path TEXT NOT NULL UNIQUE,
  file_url TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  mime_type TEXT NOT NULL,
  alt_text TEXT,
  caption TEXT,
  uploaded_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc', NOW())
);

-- ------------------------------------------------------------------------------
-- 6. INDEXES
-- ------------------------------------------------------------------------------
CREATE INDEX idx_research_areas_slug ON public.research_areas(slug);
CREATE INDEX idx_projects_slug ON public.projects(slug);
CREATE INDEX idx_projects_status ON public.projects(status);
CREATE INDEX idx_people_slug ON public.people(slug);
CREATE INDEX idx_people_category ON public.people(category);
CREATE INDEX idx_publications_year ON public.publications(publication_year DESC);
CREATE INDEX idx_publications_slug ON public.publications(slug);
CREATE INDEX idx_news_posts_slug ON public.news_posts(slug);
CREATE INDEX idx_news_posts_published ON public.news_posts(published_at DESC);
CREATE INDEX idx_opportunities_slug ON public.opportunities(slug);
CREATE INDEX idx_applications_opportunity ON public.applications(opportunity_id);
CREATE INDEX idx_applications_status ON public.applications(status);
CREATE INDEX idx_messages_status ON public.messages(status);

-- ------------------------------------------------------------------------------
-- 7. AUTOMATIC TIMESTAMP UPDATER FUNCTION
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc', NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers
CREATE TRIGGER set_profiles_timestamp BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER set_research_areas_timestamp BEFORE UPDATE ON public.research_areas FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER set_people_timestamp BEFORE UPDATE ON public.people FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER set_projects_timestamp BEFORE UPDATE ON public.projects FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER set_publications_timestamp BEFORE UPDATE ON public.publications FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER set_news_posts_timestamp BEFORE UPDATE ON public.news_posts FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER set_opportunities_timestamp BEFORE UPDATE ON public.opportunities FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER set_applications_timestamp BEFORE UPDATE ON public.applications FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER set_messages_timestamp BEFORE UPDATE ON public.messages FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ------------------------------------------------------------------------------
-- 8. ROW LEVEL SECURITY (RLS) POLICIES
-- ------------------------------------------------------------------------------
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.homepage_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_activity ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.research_areas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.people ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.publications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_researchers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_research_areas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.publication_authors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.publication_research_areas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.publication_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media ENABLE ROW LEVEL SECURITY;

-- Helper security function: Check user role
CREATE OR REPLACE FUNCTION public.has_role(required_role user_role)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid()
    AND (
      role = 'ADMIN' OR
      (required_role = 'EDITOR' AND role IN ('ADMIN', 'EDITOR')) OR
      (required_role = 'REVIEWER' AND role IN ('ADMIN', 'EDITOR', 'REVIEWER'))
    )
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Profiles: Users can read their own profile, Admins can read all profiles
CREATE POLICY "Users can read own profile" ON public.profiles FOR SELECT USING (auth.uid() = id OR public.has_role('ADMIN'));
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins full access to profiles" ON public.profiles FOR ALL USING (public.has_role('ADMIN'));

-- Public Read Policies (Published/Active content only)
CREATE POLICY "Public can view published research areas" ON public.research_areas FOR SELECT USING (is_published = true OR public.has_role('REVIEWER'));
CREATE POLICY "Public can view active people" ON public.people FOR SELECT USING (is_active = true OR public.has_role('REVIEWER'));
CREATE POLICY "Public can view published projects" ON public.projects FOR SELECT USING (is_published = true OR public.has_role('REVIEWER'));
CREATE POLICY "Public can view published publications" ON public.publications FOR SELECT USING (is_published = true OR public.has_role('REVIEWER'));
CREATE POLICY "Public can view published news" ON public.news_posts FOR SELECT USING (is_published = true OR public.has_role('REVIEWER'));
CREATE POLICY "Public can view active opportunities" ON public.opportunities FOR SELECT USING (is_active = true OR public.has_role('REVIEWER'));
CREATE POLICY "Public can view enabled homepage sections" ON public.homepage_sections FOR SELECT USING (is_enabled = true OR public.has_role('REVIEWER'));
CREATE POLICY "Public can view site settings" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Public can view media" ON public.media FOR SELECT USING (true);

-- Junction tables public read
CREATE POLICY "Public can view project researchers" ON public.project_researchers FOR SELECT USING (true);
CREATE POLICY "Public can view project research areas" ON public.project_research_areas FOR SELECT USING (true);
CREATE POLICY "Public can view publication authors" ON public.publication_authors FOR SELECT USING (true);
CREATE POLICY "Public can view publication research areas" ON public.publication_research_areas FOR SELECT USING (true);
CREATE POLICY "Public can view publication projects" ON public.publication_projects FOR SELECT USING (true);

-- Admin & Editor Management Policies for Content
CREATE POLICY "Editors manage research areas" ON public.research_areas FOR ALL USING (public.has_role('EDITOR'));
CREATE POLICY "Editors manage people" ON public.people FOR ALL USING (public.has_role('EDITOR'));
CREATE POLICY "Editors manage projects" ON public.projects FOR ALL USING (public.has_role('EDITOR'));
CREATE POLICY "Editors manage publications" ON public.publications FOR ALL USING (public.has_role('EDITOR'));
CREATE POLICY "Editors manage news" ON public.news_posts FOR ALL USING (public.has_role('EDITOR'));
CREATE POLICY "Editors manage opportunities" ON public.opportunities FOR ALL USING (public.has_role('EDITOR'));
CREATE POLICY "Editors manage homepage sections" ON public.homepage_sections FOR ALL USING (public.has_role('EDITOR'));
CREATE POLICY "Editors manage site settings" ON public.site_settings FOR ALL USING (public.has_role('EDITOR'));
CREATE POLICY "Editors manage media" ON public.media FOR ALL USING (public.has_role('EDITOR'));
CREATE POLICY "Editors manage project researchers" ON public.project_researchers FOR ALL USING (public.has_role('EDITOR'));
CREATE POLICY "Editors manage project research areas" ON public.project_research_areas FOR ALL USING (public.has_role('EDITOR'));
CREATE POLICY "Editors manage publication authors" ON public.publication_authors FOR ALL USING (public.has_role('EDITOR'));
CREATE POLICY "Editors manage publication research areas" ON public.publication_research_areas FOR ALL USING (public.has_role('EDITOR'));
CREATE POLICY "Editors manage publication projects" ON public.publication_projects FOR ALL USING (public.has_role('EDITOR'));

-- Public Form Submissions (INSERT ONLY, NO PUBLIC SELECT)
CREATE POLICY "Anyone can submit application" ON public.applications FOR INSERT WITH CHECK (true);
CREATE POLICY "Reviewers and Admins can view applications" ON public.applications FOR SELECT USING (public.has_role('REVIEWER'));
CREATE POLICY "Editors and Admins can update applications" ON public.applications FOR UPDATE USING (public.has_role('EDITOR'));
CREATE POLICY "Admins can delete applications" ON public.applications FOR DELETE USING (public.has_role('ADMIN'));

CREATE POLICY "Anyone can submit contact message" ON public.messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Reviewers and Admins can view messages" ON public.messages FOR SELECT USING (public.has_role('REVIEWER'));
CREATE POLICY "Editors and Admins can update messages" ON public.messages FOR UPDATE USING (public.has_role('EDITOR'));
CREATE POLICY "Admins can delete messages" ON public.messages FOR DELETE USING (public.has_role('ADMIN'));

-- Admin Activity Log
CREATE POLICY "Admins can view activity logs" ON public.admin_activity FOR SELECT USING (public.has_role('ADMIN'));
CREATE POLICY "Authenticated users can create activity logs" ON public.admin_activity FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- ------------------------------------------------------------------------------
-- 9. SUPABASE STORAGE BUCKETS SETUP
-- ------------------------------------------------------------------------------
-- Insert buckets into storage.buckets if they do not exist
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('media', 'media', true),
  ('documents', 'documents', true),
  ('resumes', 'resumes', false)
ON CONFLICT (id) DO NOTHING;

-- Storage Policies:
-- Media & Documents (Public Read, Editor Upload/Delete)
CREATE POLICY "Public Access to Media" ON storage.objects FOR SELECT USING (bucket_id = 'media' OR bucket_id = 'documents');
CREATE POLICY "Editors Upload Media" ON storage.objects FOR INSERT WITH CHECK (
  (bucket_id IN ('media', 'documents')) AND (public.has_role('EDITOR'))
);

-- Resumes: Public can upload CVs, but only Reviewers/Admins can view/download
CREATE POLICY "Public Upload Resume" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'resumes');
CREATE POLICY "Reviewers View Resumes" ON storage.objects FOR SELECT USING (
  bucket_id = 'resumes' AND public.has_role('REVIEWER')
);
