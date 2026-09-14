# Environmental Health & Ecotoxicology Laboratory Platform

An enterprise-grade, modern international research laboratory website and Content Management System (CMS) built with Next.js App Router, TypeScript, Tailwind CSS, and Supabase (PostgreSQL, Auth, Storage, and Row Level Security).

---

## 1. Project Overview & Scientific Vision

The platform is designed around the core scientific progression of ecotoxicology and environmental health:
$$\text{Environment} \longrightarrow \text{Contaminant} \longrightarrow \text{Exposure} \longrightarrow \text{Biological Response} \longrightarrow \text{Ecosystem \& Human Health} \longrightarrow \text{Impact}$$

The architecture separates concerns into two integrated layers:
1. **Public Research Portal**: An accessible, high-performance, scientific showcase for research areas, projects, peer-reviewed publications, faculty/researchers, laboratory updates, opportunities, and collaboration inquiries.
2. **Administrative CMS**: A role-protected content operations dashboard for managing laboratory entities, publication links, team rosters, student applications, messages, and site configuration without code modifications.

---

## 2. Technology Stack & Design System

### Technology Stack
- **Framework**: Next.js 15+ (App Router, Server Components & Actions)
- **Language**: TypeScript (strict type checking & normalized database types)
- **Styling**: Tailwind CSS with custom design tokens
- **Icons**: Lucide React
- **Database & Auth**: Supabase (PostgreSQL 15+, Supabase Auth, Storage)
- **Utilities**: `clsx`, `tailwind-merge`

### Brand & Design Tokens
- **Deep Forest**: `#14532D` (Primary Brand / Nav / Dark Accents)
- **Botanical Green**: `#2F7D4A` (Secondary Brand / Action Buttons)
- **Scientific Teal**: `#0F766E` (Accents, Tags, Scientific Labels)
- **Light Background**: `#F4F8F5` (Card backgrounds, subtle sections)
- **Warm White**: `#FAFAF7` (Page background)
- **Primary Text**: `#17201B`
- **Secondary Text**: `#64706A`
- **Highlight**: `#84CC16`

### Typography
- **Headings**: `Manrope` (600, 700, 800)
- **Body**: `Inter` (400, 500, 600)
- **Data / Scientific**: `IBM Plex Mono` (400, 500, 600)

---

## 3. Directory & Folder Structure

```
├── .env.example                     # Environment variable blueprint
├── .env.local                       # Local environment settings (not in VCS)
├── supabase/
│   └── migrations/
│       └── 20260910000000_initial_schema.sql # PostgreSQL schema, RLS, Storage & Indexes
├── src/
│   ├── app/
│   │   ├── (public)/                # Public research portal routes
│   │   │   ├── about/
│   │   │   ├── contact/
│   │   │   ├── news/
│   │   │   ├── opportunities/
│   │   │   ├── people/
│   │   │   ├── projects/
│   │   │   ├── publications/
│   │   │   └── research/
│   │   ├── admin/                   # Protected CMS routes
│   │   │   ├── applications/
│   │   │   ├── media/
│   │   │   ├── messages/
│   │   │   ├── news/
│   │   │   ├── opportunities/
│   │   │   ├── people/
│   │   │   ├── projects/
│   │   │   ├── publications/
│   │   │   ├── research/
│   │   │   └── settings/
│   │   ├── auth/                    # Login and recovery routes
│   │   ├── api/                     # Backend API handlers
│   │   ├── globals.css              # Tailwind theme & token configurations
│   │   ├── layout.tsx               # Root layout with Google Fonts
│   │   └── page.tsx                 # Home page
│   ├── components/
│   │   ├── ui/                      # Atoms (Button, Badge, Card, SectionHeader, Skeleton, EmptyState, ErrorState)
│   │   ├── public/                  # Public components (Navbar, Footer, Hero, ResearchNetwork)
│   │   └── admin/                   # Admin components (Sidebar, Header, DataTable, StatsCard)
│   ├── constants/                   # Navigation items, scientific workflow, site configuration
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts            # Browser Supabase client
│   │   │   ├── server.ts            # Server-side Supabase client (SSR)
│   │   │   ├── middleware.ts        # Auth token renewal & route protection
│   │   │   └── admin.ts             # Service Role admin client (Server only)
│   │   └── utils.ts                 # ClassName merger (cn utility)
│   ├── middleware.ts                # Next.js root middleware
│   └── types/
│       ├── database.types.ts        # Generated & typed PostgreSQL schema interfaces
│       └── index.ts                 # Domain view models & entity definitions
└── package.json
```

---

## 4. Database Entities & Relational Architecture

The PostgreSQL schema (`supabase/migrations/20260910000000_initial_schema.sql`) implements full relational integrity:

1. **`profiles`**: User records with RBAC roles (`ADMIN`, `EDITOR`, `REVIEWER`).
2. **`research_areas`**: Lab focus areas with methods, research questions, and slug routes.
3. **`projects`**: Lab research projects with statuses (`upcoming`, `ongoing`, `completed`), funding info, findings, and outputs.
4. **`people`**: Researchers and personnel across academic tiers (`pi`, `faculty`, `researcher`, `graduate_student`, `undergraduate_student`, `alumni`, `collaborator`).
5. **`publications`**: Peer-reviewed outputs with DOIs, journals, years, abstracts, and direct download links.
6. **`news_posts`**: Lab announcements, breakthroughs, achievements, and insights.
7. **`opportunities`**: Open student research positions, postdocs, and assistantships.
8. **`applications`**: Submitted applications with CV URLs and review workflow statuses (`new`, `reviewing`, `shortlisted`, `interview`, `accepted`, `rejected`).
9. **`messages`**: Multi-category contact inquiries with reply tracking.
10. **`media`**: Uploaded assets stored in Supabase Storage with metadata.
11. **`site_settings` & `homepage_sections`**: Dynamic configuration for homepage and global settings.
12. **`admin_activity`**: Audit trail for tracking CMS modifications.
13. **Relational Junction Tables**:
    - `project_researchers`
    - `project_research_areas`
    - `publication_authors`
    - `publication_research_areas`
    - `publication_projects`

---

## 5. Security & Authentication Strategy

1. **Role-Based Access Control (RBAC)**:
   - `ADMIN`: Full administrative control, user role management, system settings, deletion rights.
   - `EDITOR`: Content creation, updating, publishing, and media management.
   - `REVIEWER`: Read-only access to applications, inquiries, and unpublished drafts.
2. **Row Level Security (RLS)**:
   - Enabled on **100%** of tables.
   - Public users can only read content where `is_published = true` or `is_active = true`.
   - Public users can insert into `applications` and `messages` but cannot read submitted records.
   - Resume and document storage buckets are isolated and inaccessible to unauthenticated users.
3. **Route Protection**:
   - `src/middleware.ts` automatically guards `/admin/*` routes, redirecting unauthenticated sessions to `/auth/login`.

---

## 6. Development Workflow & Next Steps

1. **Phase 0 (Completed)**: Architecture, Design Tokens, Supabase Client & Relational Schema, Component Primitives.
2. **Phase 1 (Next)**: Frontend Foundation & Shared Layouts (Navbar, Footer, Section Layouts, Interactive Elements).
3. **Phase 2**: Full Homepage implementation with scientific network visualization.
4. **Phase 3**: Supabase live connection & database seeding.
5. **Phase 4**: Admin CMS interface.
6. **Phase 5**: Connecting CMS to Frontend.
7. **Phase 6**: Applications & Messages submission workflows.
8. **Phase 7**: Dedicated public research pages (`/research`, `/projects`, `/people`, `/publications`, `/news`, `/opportunities`, `/about`, `/contact`).
9. **Phase 8**: Production QA, Accessibility & Performance audit.
