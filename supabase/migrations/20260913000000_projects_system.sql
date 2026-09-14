-- ==============================================================================
-- Environmental Health & Ecotoxicology Laboratory - Projects Schema & Migration
-- Version: 1.1.0
-- ==============================================================================

-- Ensure UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- If project_status enum exists, ensure 'archived' is supported
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'project_status') THEN
    CREATE TYPE project_status AS ENUM ('upcoming', 'ongoing', 'completed', 'archived');
  ELSE
    -- Check if 'archived' value exists in enum
    IF NOT EXISTS (
      SELECT 1 FROM pg_enum 
      WHERE enumtypid = 'project_status'::regtype 
      AND enumlabel = 'archived'
    ) THEN
      ALTER TYPE project_status ADD VALUE 'archived';
    END IF;
  END IF;
END $$;

-- ------------------------------------------------------------------------------
-- 1. PROJECTS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  short_description TEXT NOT NULL,
  full_description TEXT,
  status project_status NOT NULL DEFAULT 'ongoing',
  start_date DATE,
  end_date DATE,
  year TEXT,
  funding_info TEXT,
  funding_org TEXT,
  grant_amount TEXT,
  research_question TEXT,
  objectives TEXT[] DEFAULT ARRAY[]::TEXT[],
  methodology TEXT,
  study_area TEXT,
  study_area_description TEXT,
  findings TEXT,
  outputs TEXT,
  hero_image TEXT,
  image_alt TEXT,
  featured_image TEXT,
  gallery TEXT[] DEFAULT ARRAY[]::TEXT[],
  display_order INTEGER NOT NULL DEFAULT 0,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  is_published BOOLEAN NOT NULL DEFAULT true,
  published_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()),
  created_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc', NOW())
);

-- Ensure all columns exist in case projects table was created previously with older schema
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'projects' AND column_name = 'year') THEN
    ALTER TABLE public.projects ADD COLUMN year TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'projects' AND column_name = 'grant_amount') THEN
    ALTER TABLE public.projects ADD COLUMN grant_amount TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'projects' AND column_name = 'research_question') THEN
    ALTER TABLE public.projects ADD COLUMN research_question TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'projects' AND column_name = 'objectives') THEN
    ALTER TABLE public.projects ADD COLUMN objectives TEXT[] DEFAULT ARRAY[]::TEXT[];
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'projects' AND column_name = 'study_area_description') THEN
    ALTER TABLE public.projects ADD COLUMN study_area_description TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'projects' AND column_name = 'hero_image') THEN
    ALTER TABLE public.projects ADD COLUMN hero_image TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'projects' AND column_name = 'image_alt') THEN
    ALTER TABLE public.projects ADD COLUMN image_alt TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'projects' AND column_name = 'display_order') THEN
    ALTER TABLE public.projects ADD COLUMN display_order INTEGER NOT NULL DEFAULT 0;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'projects' AND column_name = 'published_at') THEN
    ALTER TABLE public.projects ADD COLUMN published_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW());
  END IF;
END $$;

-- ------------------------------------------------------------------------------
-- 2. RESEARCH AREAS TABLE & JUNCTIONS
-- ------------------------------------------------------------------------------
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

-- Projects <-> Research Areas Junction
CREATE TABLE IF NOT EXISTS public.project_research_areas (
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  research_area_id UUID REFERENCES public.research_areas(id) ON DELETE CASCADE,
  PRIMARY KEY (project_id, research_area_id)
);

-- ------------------------------------------------------------------------------
-- 3. PEOPLE & PROJECT RESEARCHERS JUNCTION
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.people (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  position TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'researcher',
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

-- Projects <-> Researchers Junction
CREATE TABLE IF NOT EXISTS public.project_researchers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  person_id UUID REFERENCES public.people(id) ON DELETE CASCADE,
  role_in_project TEXT DEFAULT 'Researcher',
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc', NOW()),
  UNIQUE (project_id, person_id)
);

-- Projects <-> Collaborators Table / Junction
CREATE TABLE IF NOT EXISTS public.project_collaborators (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  institution TEXT NOT NULL,
  role TEXT DEFAULT 'Partner Institution',
  logo_url TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc', NOW())
);

-- Publications <-> Projects Junction
CREATE TABLE IF NOT EXISTS public.publications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  authors TEXT NOT NULL,
  abstract TEXT,
  journal TEXT NOT NULL,
  publication_year INTEGER NOT NULL,
  publication_type TEXT NOT NULL DEFAULT 'journal_article',
  doi TEXT,
  external_url TEXT,
  pdf_url TEXT,
  keywords TEXT[] DEFAULT ARRAY[]::TEXT[],
  is_featured BOOLEAN NOT NULL DEFAULT false,
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc', NOW())
);

CREATE TABLE IF NOT EXISTS public.publication_projects (
  publication_id UUID REFERENCES public.publications(id) ON DELETE CASCADE,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  PRIMARY KEY (publication_id, project_id)
);

-- Admin Activity Log
CREATE TABLE IF NOT EXISTS public.admin_activity (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc', NOW())
);

-- ------------------------------------------------------------------------------
-- 4. INDEXES
-- ------------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_projects_slug ON public.projects(slug);
CREATE INDEX IF NOT EXISTS idx_projects_status ON public.projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_is_published ON public.projects(is_published);
CREATE INDEX IF NOT EXISTS idx_projects_is_featured ON public.projects(is_featured);
CREATE INDEX IF NOT EXISTS idx_projects_display_order ON public.projects(display_order);
CREATE INDEX IF NOT EXISTS idx_project_researchers_proj ON public.project_researchers(project_id);
CREATE INDEX IF NOT EXISTS idx_project_research_areas_proj ON public.project_research_areas(project_id);
CREATE INDEX IF NOT EXISTS idx_project_collaborators_proj ON public.project_collaborators(project_id);

-- ------------------------------------------------------------------------------
-- 5. ROW LEVEL SECURITY (RLS) POLICIES
-- ------------------------------------------------------------------------------
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_research_areas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_researchers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_collaborators ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.publication_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_activity ENABLE ROW LEVEL SECURITY;

-- Public read policies (Published projects only for public anon, all for authenticated)
DROP POLICY IF EXISTS "Public can view published projects" ON public.projects;
CREATE POLICY "Public can view published projects" ON public.projects 
  FOR SELECT USING (is_published = true OR auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated users full access to projects" ON public.projects;
CREATE POLICY "Authenticated users full access to projects" ON public.projects 
  FOR ALL USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');

-- Junction tables read/write
DROP POLICY IF EXISTS "Public can view project researchers" ON public.project_researchers;
CREATE POLICY "Public can view project researchers" ON public.project_researchers FOR SELECT USING (true);

DROP POLICY IF EXISTS "Authenticated manage project researchers" ON public.project_researchers;
CREATE POLICY "Authenticated manage project researchers" ON public.project_researchers 
  FOR ALL USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');

DROP POLICY IF EXISTS "Public can view project research areas" ON public.project_research_areas;
CREATE POLICY "Public can view project research areas" ON public.project_research_areas FOR SELECT USING (true);

DROP POLICY IF EXISTS "Authenticated manage project research areas" ON public.project_research_areas;
CREATE POLICY "Authenticated manage project research areas" ON public.project_research_areas 
  FOR ALL USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');

DROP POLICY IF EXISTS "Public can view project collaborators" ON public.project_collaborators;
CREATE POLICY "Public can view project collaborators" ON public.project_collaborators FOR SELECT USING (true);

DROP POLICY IF EXISTS "Authenticated manage project collaborators" ON public.project_collaborators;
CREATE POLICY "Authenticated manage project collaborators" ON public.project_collaborators 
  FOR ALL USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');

DROP POLICY IF EXISTS "Public can view publication projects" ON public.publication_projects;
CREATE POLICY "Public can view publication projects" ON public.publication_projects FOR SELECT USING (true);

DROP POLICY IF EXISTS "Authenticated manage publication projects" ON public.publication_projects;
CREATE POLICY "Authenticated manage publication projects" ON public.publication_projects 
  FOR ALL USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');

-- Activity log
DROP POLICY IF EXISTS "Anyone can insert activity" ON public.admin_activity;
CREATE POLICY "Anyone can insert activity" ON public.admin_activity FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated view activity" ON public.admin_activity;
CREATE POLICY "Authenticated view activity" ON public.admin_activity FOR SELECT USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');

-- ------------------------------------------------------------------------------
-- 6. STORAGE BUCKET: project-media
-- ------------------------------------------------------------------------------
INSERT INTO storage.buckets (id, name, public)
VALUES ('project-media', 'project-media', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Storage policies for project-media
DROP POLICY IF EXISTS "Public read project media" ON storage.objects;
CREATE POLICY "Public read project media" ON storage.objects
  FOR SELECT USING (bucket_id = 'project-media');

DROP POLICY IF EXISTS "Public upload project media" ON storage.objects;
CREATE POLICY "Public upload project media" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'project-media');

DROP POLICY IF EXISTS "Authenticated manage project media" ON storage.objects;
CREATE POLICY "Authenticated manage project media" ON storage.objects
  FOR ALL USING (bucket_id = 'project-media');
