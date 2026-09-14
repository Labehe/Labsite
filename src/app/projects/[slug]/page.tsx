import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/public/navbar";
import { Footer } from "@/components/public/footer";
import { getProjectBySlug, getRelatedProjects } from "@/lib/projects/queries";
import { ProjectGallery } from "@/components/public/projects/project-gallery";
import {
  ArrowLeft,
  Calendar,
  Building2,
  Users,
  Target,
  ChevronRight,
  ArrowRight,
  Award
} from "lucide-react";

interface ProjectDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProjectDetailPageProps): Promise<Metadata> {
  const resolvedParams = await Promise.resolve(params);
  const slug = resolvedParams?.slug;
  if (!slug) {
    return { title: "Research Project | Laboratory of Environmental Health and Ecotoxicology (LabEHE)" };
  }
  const project = await getProjectBySlug(slug, false);

  if (!project) {
    return {
      title: "Project Not Found | Laboratory of Environmental Health and Ecotoxicology (LabEHE)",
    };
  }

  return {
    title: `${project.title} | Laboratory of Environmental Health and Ecotoxicology (LabEHE)`,
    description: project.short_description,
    openGraph: {
      title: project.title,
      description: project.short_description,
      images: [
        {
          url: project.hero_image || project.featured_image || "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80",
          width: 1200,
          height: 630,
          alt: project.image_alt || project.title,
        },
      ],
    },
  };
}

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const resolvedParams = await Promise.resolve(params);
  const slug = resolvedParams?.slug;
  if (!slug) {
    notFound();
  }
  const project = await getProjectBySlug(slug, false);

  if (!project) {
    notFound();
  }

  // Fetch related projects
  const areaIds = (project.research_areas || []).map((a) => a.id);
  const relatedProjects = await getRelatedProjects(project.id, areaIds);

  const fallbackImage = "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1600&q=85";
  const heroImageSrc = project.hero_image || project.featured_image || fallbackImage;

  const statusBadges: Record<string, string> = {
    ongoing: "bg-blue-50 text-blue-800 dark:bg-blue-950/50 dark:text-blue-300 border-blue-200 dark:border-blue-800/60",
    completed: "bg-emerald-50 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60",
    archived: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700",
    upcoming: "bg-purple-50 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300 border-purple-200 dark:border-purple-800/60",
  };

  return (
    <div className="min-h-screen bg-[var(--bg-page)] text-[var(--text-main)] flex flex-col justify-between">
      {/* 1. Global Navigation */}
      <Navbar />

      <main className="flex-grow pt-24 pb-24">
        {/* Breadcrumb Bar */}
        <div className="border-b border-slate-200/80 dark:border-slate-800 bg-white/60 dark:bg-[#0F172A]/60 backdrop-blur-md py-3.5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
              <Link href="/" className="hover:text-emerald-700 dark:hover:text-emerald-400 transition">
                Home
              </Link>
              <ChevronRight className="w-3.5 h-3.5 opacity-40" />
              <Link href="/projects" className="hover:text-emerald-700 dark:hover:text-emerald-400 transition">
                Projects
              </Link>
              <ChevronRight className="w-3.5 h-3.5 opacity-40" />
              <span className="text-slate-900 dark:text-white font-semibold truncate max-w-xs sm:max-w-md">
                {project.title}
              </span>
            </div>
          </div>
        </div>

        {/* SECTION 01 — PROJECT HERO & OVERVIEW */}
        <section className="py-10 lg:py-14 border-b border-slate-200/80 dark:border-slate-800 bg-gradient-to-b from-white via-[var(--bg-page)] to-[var(--bg-page)] dark:from-[#090D16] dark:via-[var(--bg-page)] dark:to-[var(--bg-page)] relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              {/* Left 7 Columns: Title, Badges, and Short Summary */}
              <div className="lg:col-span-7 space-y-5 text-left">
                {/* Unified Metadata Badge Row */}
                <div className="flex flex-wrap items-center gap-2.5">
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide border shadow-xs ${
                      statusBadges[project.status?.toLowerCase()] || statusBadges.ongoing
                    }`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                    <span>{project.status}</span>
                  </span>

                  <div className="flex items-center gap-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 bg-white dark:bg-[#0F172A] px-3 py-1 rounded-full border border-slate-200/80 dark:border-slate-800 shadow-xs">
                    <Calendar className="w-3.5 h-3.5 text-emerald-600 dark:text-[#34D399]" />
                    <span>{project.year || "2025 — 2027"}</span>
                  </div>

                  {project.funding_org && (
                    <div className="flex items-center gap-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 bg-white dark:bg-[#0F172A] px-3 py-1 rounded-full border border-slate-200/80 dark:border-slate-800 shadow-xs">
                      <Award className="w-3.5 h-3.5 text-emerald-600 dark:text-[#34D399]" />
                      <span>{project.funding_org}</span>
                    </div>
                  )}

                  {project.research_areas && project.research_areas.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {project.research_areas.map((ra) => (
                        <Link
                          key={ra.id}
                          href={`/projects?area=${ra.slug}`}
                          className="px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 dark:bg-emerald-950/60 text-emerald-900 dark:text-[#34D399] border border-emerald-200/80 dark:border-emerald-800/60 hover:bg-emerald-100 transition shadow-xs"
                        >
                          {ra.title}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>

                {/* Project Title - Balanced, Editorial & Eye-Pleasing */}
                <h1 className="text-2xl sm:text-3xl lg:text-[34px] xl:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white font-[family-name:var(--font-manrope)] leading-[1.25]">
                  {project.title}
                </h1>

                {/* Short Description */}
                {project.short_description && (
                  <p className="text-sm sm:text-[15px] text-slate-600 dark:text-slate-300 leading-relaxed font-[family-name:var(--font-inter)]">
                    {project.short_description}
                  </p>
                )}
              </div>

              {/* Right 5 Columns: Compact, High-End Framed Visual Card */}
              <div className="lg:col-span-5">
                <div className="relative rounded-3xl overflow-hidden border border-slate-200/80 dark:border-slate-800 bg-slate-900 shadow-xl group aspect-[16/11]">
                  <Image
                    src={heroImageSrc}
                    alt={project.image_alt || project.title}
                    fill
                    priority
                    className="object-cover group-hover:scale-105 transition-transform duration-700 filter brightness-[0.96]"
                    sizes="(max-width: 1024px) 100vw, 500px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/20 pointer-events-none" />

                  {/* Top Floating Badge */}
                  <div className="absolute top-3 right-3 z-10">
                    <span className="text-[11px] font-bold text-white px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 shadow">
                      {project.status?.toUpperCase() || "ACTIVE RESEARCH"}
                    </span>
                  </div>

                  {/* Bottom Caption Overlay */}
                  {project.image_alt && (
                    <div className="absolute bottom-3 left-3 right-3 text-[11px] text-white/95 bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/15 line-clamp-1 shadow-md">
                      {project.image_alt}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 02 — SCIENTIFIC BODY GRID */}
        <section className="py-14 md:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
              {/* Left 8-Columns: Project Summary & Narrative */}
              <div className="lg:col-span-8 space-y-8">
                {/* Core Research Question Callout */}
                {project.research_question && (
                  <div className="p-7 sm:p-9 rounded-3xl border border-emerald-700/20 dark:border-emerald-500/30 bg-gradient-to-br from-emerald-50/50 via-emerald-100/10 to-transparent dark:from-emerald-950/40 dark:via-transparent dark:to-transparent space-y-3.5 shadow-sm">
                    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-800 dark:text-emerald-400">
                      <Target className="w-4 h-4 text-emerald-600" />
                      <span>Primary Research Question</span>
                    </div>
                    <p className="text-lg sm:text-xl font-bold text-slate-900 dark:text-emerald-100 italic leading-relaxed font-[family-name:var(--font-manrope)]">
                      &quot;{project.research_question}&quot;
                    </p>
                  </div>
                )}

                {/* Project Summary Card */}
                <div className="space-y-6">
                  <div className="space-y-2">
                    <div className="text-xs uppercase tracking-wider text-emerald-800 dark:text-emerald-400 font-semibold">
                      Project Overview
                    </div>
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white font-[family-name:var(--font-manrope)]">
                      Project Summary &amp; Scientific Scope
                    </h2>
                  </div>

                  <div className="p-7 sm:p-9 rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#0F172A] shadow-sm space-y-6">
                    {project.short_description && (
                      <p className="text-base sm:text-lg text-slate-800 dark:text-slate-200 font-medium leading-relaxed font-[family-name:var(--font-inter)]">
                        {project.short_description}
                      </p>
                    )}

                    {project.full_description && (
                      <div className="text-sm sm:text-base text-slate-600 dark:text-slate-300 font-[family-name:var(--font-inter)] leading-relaxed space-y-4 whitespace-pre-line pt-5 border-t border-slate-100 dark:border-slate-800">
                        {project.full_description}
                      </div>
                    )}
                  </div>
                </div>

                {/* Project Objectives */}
                {project.objectives && project.objectives.length > 0 && (
                  <div className="space-y-6 pt-4">
                    <div className="space-y-2">
                      <div className="text-xs uppercase tracking-wider text-emerald-800 dark:text-emerald-400 font-semibold">
                        Core Milestones
                      </div>
                      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white font-[family-name:var(--font-manrope)]">
                        Project Objectives
                      </h2>
                    </div>

                    <div className="grid grid-cols-1 gap-3.5">
                      {project.objectives.map((obj, idx) => (
                        <div
                          key={idx}
                          className="flex items-start gap-4 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#0F172A] hover:border-emerald-700/40 dark:hover:border-emerald-500/40 transition shadow-xs group"
                        >
                          <span className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-800 dark:bg-emerald-950/80 dark:text-[#34D399] font-bold text-xs flex items-center justify-center shrink-0 border border-emerald-200/80 dark:border-emerald-800/60 mt-0.5 group-hover:scale-105 transition-transform">
                            0{idx + 1}
                          </span>
                          <p className="text-sm sm:text-[15px] text-slate-700 dark:text-slate-200 leading-relaxed font-[family-name:var(--font-inter)] font-medium">
                            {obj}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Project Fieldwork & Laboratory Visual Gallery (Max 4 Images) */}
                <ProjectGallery images={project.gallery} projectTitle={project.title} />
              </div>

              {/* Right 4-Columns: Luxury Sidebar with Researchers & Metadata */}
              <aside className="lg:col-span-4 space-y-8 sticky top-24">
                {/* Researchers & Team */}
                <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#0F172A] p-6 sm:p-7 space-y-4 shadow-sm">
                  <div className="flex items-center gap-2.5 pb-3.5 border-b border-slate-100 dark:border-slate-800/80">
                    <Users className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
                    <h3 className="text-xs uppercase tracking-wider font-bold text-slate-900 dark:text-white">
                      Assigned Researchers
                    </h3>
                  </div>

                  <div className="space-y-3">
                    {project.researchers && project.researchers.length > 0 ? (
                      project.researchers.map((researcher, idx) => (
                        <Link
                          key={researcher.id || idx}
                          href={`/people/${researcher.slug || researcher.id || "researcher"}`}
                          className="flex items-center gap-3.5 p-2.5 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/60 transition group"
                        >
                          <div className="w-11 h-11 rounded-full overflow-hidden bg-slate-200 dark:bg-slate-800 relative shrink-0 border border-slate-200 dark:border-slate-700">
                            {researcher.photo_url ? (
                              <Image
                                src={researcher.photo_url}
                                alt={researcher.name || "Researcher"}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-xs font-bold text-slate-500">
                                {(researcher.name || "R").charAt(0)}
                              </div>
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition truncate">
                              {researcher.name || "Researcher"}
                            </div>
                            <div className="text-xs text-slate-500 dark:text-slate-400 truncate">
                              {researcher.role_in_project || researcher.position || "Research Staff"}
                            </div>
                          </div>
                        </Link>
                      ))
                    ) : (
                      <div className="text-xs text-slate-400 italic">
                        Lab Research Fellows &amp; PI
                      </div>
                    )}
                  </div>
                </div>

                {/* Collaborating Institutions */}
                {project.collaborators && project.collaborators.length > 0 && (
                  <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#0F172A] p-6 sm:p-7 space-y-4 shadow-sm">
                    <div className="flex items-center gap-2.5 pb-3.5 border-b border-slate-100 dark:border-slate-800/80">
                      <Building2 className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
                      <h3 className="text-xs uppercase tracking-wider font-bold text-slate-900 dark:text-white">
                        Collaborating Partners
                      </h3>
                    </div>

                    <div className="space-y-3">
                      {project.collaborators.map((collab, idx) => (
                        <div key={idx} className="p-3 rounded-xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/70 dark:bg-[#090D16] space-y-1">
                          <div className="text-xs font-bold text-slate-900 dark:text-white">{collab.name}</div>
                          <div className="text-xs text-slate-500 dark:text-slate-400">{collab.institution}</div>
                          {collab.role && (
                            <div className="text-xs text-emerald-700 dark:text-emerald-400 font-semibold">{collab.role}</div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Grant & Funding Summary */}
                <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#0F172A] p-6 sm:p-7 space-y-3.5 text-xs text-slate-500 shadow-sm">
                  <div className="text-xs uppercase tracking-wider text-slate-900 dark:text-white font-bold pb-2.5 border-b border-slate-100 dark:border-slate-800/80">
                    Grant Metadata
                  </div>
                  {project.funding_org && (
                    <div>
                      <span className="block text-xs uppercase text-slate-400">Funding Agency</span>
                      <span className="text-slate-900 dark:text-white font-bold text-sm">{project.funding_org}</span>
                    </div>
                  )}
                  {project.grant_amount && (
                    <div>
                      <span className="block text-xs uppercase text-slate-400">Grant Allocation</span>
                      <span className="text-slate-900 dark:text-white font-bold text-sm">{project.grant_amount}</span>
                    </div>
                  )}
                  {project.funding_info && (
                    <div>
                      <span className="block text-xs uppercase text-slate-400">Award Reference</span>
                      <span className="text-slate-900 dark:text-white">{project.funding_info}</span>
                    </div>
                  )}
                </div>

                {/* Back to Explorer CTA */}
                <div>
                  <Link
                    href="/projects"
                    className="w-full py-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#0F172A] hover:bg-slate-50 dark:hover:bg-slate-800/80 text-xs font-semibold text-slate-900 dark:text-white flex items-center justify-center gap-2 transition shadow-xs cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back to Research Explorer</span>
                  </Link>
                </div>
              </aside>
            </div>
          </div>
        </section>

        {/* SECTION 03 — RELATED RESEARCH PROJECTS */}
        {relatedProjects.length > 0 && (
          <section className="py-16 border-t border-slate-200/80 dark:border-slate-800 bg-white/70 dark:bg-[#090D16]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs uppercase tracking-wider text-emerald-800 dark:text-emerald-400 font-semibold">
                    Connected Research
                  </div>
                  <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white font-[family-name:var(--font-manrope)]">
                    Related Projects &amp; Grants
                  </h3>
                </div>
                <Link
                  href="/projects"
                  className="text-xs font-semibold text-emerald-800 dark:text-emerald-400 hover:underline flex items-center gap-1.5"
                >
                  <span>View All Projects</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedProjects.map((rel) => (
                  <Link
                    key={rel.id}
                    href={`/projects/${rel.slug}`}
                    className="group block border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#0F172A] rounded-2xl p-6 hover:border-emerald-700/50 dark:hover:border-emerald-500/50 hover:shadow-xl transition-all duration-300 shadow-xs space-y-3"
                  >
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span className="uppercase font-bold text-emerald-700 dark:text-emerald-400">
                        ● {rel.status}
                      </span>
                      <span>{rel.year || "2025"}</span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition line-clamp-2">
                      {rel.title}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                      {rel.short_description}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      {/* 3. Global Footer */}
      <Footer />
    </div>
  );
}
