import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/public/navbar";
import { Footer } from "@/components/public/footer";
import { getTeamMemberBySlug, getRelatedTeamMembers } from "@/lib/team/store";
import { TEAM_CATEGORIES_META } from "@/lib/team/seed-data";
import {
  ChevronRight,
  ArrowLeft,
  Mail,
  Building2,
  MapPin,
  Calendar,
  GraduationCap,
  Sparkles,
  BookOpen,
  Award,
  FlaskConical,
  ExternalLink,
  ArrowUpRight,
  FileText,
  Compass,
  Layers,
  CheckCircle2,
  Globe,
  Quote,
} from "lucide-react";

interface TeamMemberPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: TeamMemberPageProps): Promise<Metadata> {
  const resolvedParams = await Promise.resolve(params);
  const slug = resolvedParams?.slug;
  if (!slug) {
    return { title: "Researcher Profile | Laboratory of Environmental Health and Ecotoxicology (LabEHE)" };
  }

  const member = await getTeamMemberBySlug(slug);

  if (!member) {
    return {
      title: "Member Not Found | Laboratory of Environmental Health and Ecotoxicology (LabEHE)",
    };
  }

  return {
    title: `${member.name} — ${member.role} | Laboratory of Environmental Health and Ecotoxicology (LabEHE)`,
    description: member.bio || `${member.name}, ${member.role} at the Laboratory of Environmental Health and Ecotoxicology (LabEHE).`,
    openGraph: {
      title: `${member.name} | Laboratory of Environmental Health and Ecotoxicology (LabEHE)`,
      description: member.bio,
      images: [
        {
          url: member.imageSrc,
          width: 800,
          height: 800,
          alt: member.name,
        },
      ],
    },
  };
}

export default async function TeamMemberDetailPage({ params }: TeamMemberPageProps) {
  const resolvedParams = await Promise.resolve(params);
  const slug = resolvedParams?.slug;
  if (!slug) {
    notFound();
  }

  const member = await getTeamMemberBySlug(slug);
  if (!member) {
    notFound();
  }

  const relatedMembers = await getRelatedTeamMembers(member.id, member.category, 3);
  const meta = TEAM_CATEGORIES_META[member.category] || {
    label: member.category,
    badgeColor: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
  };

  const isAlumni = member.category === "alumni";
  const isPI = member.category === "pi";

  return (
    <div className="min-h-screen bg-[var(--bg-page)] text-[var(--text-main)] flex flex-col justify-between">
      {/* Global Navbar */}
      <Navbar />

      <main className="flex-grow pt-24 pb-24">
        {/* Breadcrumb Bar */}
        <div className="border-b border-slate-200/80 dark:border-slate-800 bg-white/60 dark:bg-[#0F172A]/60 backdrop-blur-md py-3.5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400 truncate">
                <Link href="/" className="hover:text-emerald-700 dark:hover:text-emerald-400 transition">
                  Home
                </Link>
                <ChevronRight className="w-3.5 h-3.5 opacity-40 shrink-0" />
                <Link href="/team" className="hover:text-emerald-700 dark:hover:text-emerald-400 transition">
                  Team
                </Link>
                <ChevronRight className="w-3.5 h-3.5 opacity-40 shrink-0" />
                <span className="text-slate-900 dark:text-white font-semibold truncate">
                  {member.name}
                </span>
              </div>

              <Link
                href="/team"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition shrink-0"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Team</span>
              </Link>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-10">
          
          {/* ============================================================ */}
          {/* 1. MEMBER PROFILE HEADER CARD */}
          {/* ============================================================ */}
          <div className="rounded-3xl bg-white dark:bg-[#0F172A] border border-slate-200/90 dark:border-slate-800 p-6 sm:p-8 lg:p-10 shadow-sm relative overflow-hidden">
            {/* Ambient Background Glow */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 dark:bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -z-0" />

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Column: Portrait & Quick Badges */}
              <div className="lg:col-span-4 flex flex-col items-center sm:items-start text-center sm:text-left space-y-4">
                <div className="relative w-48 h-48 sm:w-56 sm:h-56 lg:w-64 lg:h-64 rounded-3xl overflow-hidden border-4 border-white dark:border-slate-800 shadow-xl ring-1 ring-slate-900/10 dark:ring-emerald-500/20 bg-slate-900">
                  <img
                    src={member.imageSrc}
                    alt={member.name}
                    className="w-full h-full object-cover object-top filter brightness-[0.98]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                </div>

                {/* Category Pill */}
                <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border shadow-xs ${
                      isAlumni
                        ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30"
                        : meta.badgeColor
                    }`}
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>{meta.label}</span>
                  </span>

                  {member.alumniYear && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold border border-slate-200 dark:border-slate-700">
                      {member.alumniYear}
                    </span>
                  )}
                </div>
              </div>

              {/* Right Column: Name, Designation, Affiliation, Metadata, & Action Handles */}
              <div className="lg:col-span-8 space-y-5">
                <div className="space-y-2">
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-slate-900 dark:text-white font-[family-name:var(--font-manrope)]">
                    {member.name}
                  </h1>
                  
                  {/* Designation / Role */}
                  <p className="text-base sm:text-lg font-bold text-emerald-600 dark:text-emerald-400">
                    {member.role}
                  </p>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs sm:text-sm text-slate-600 dark:text-slate-400 pt-1">
                    {member.department && (
                      <span className="flex items-center gap-1.5">
                        <Building2 className="w-4 h-4 text-slate-400 shrink-0" />
                        <span>{member.department}</span>
                      </span>
                    )}
                    {member.affiliation && (
                      <span className="flex items-center gap-1.5">
                        <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                        <span>{member.affiliation}</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Alumni Current Destination Banner (If Alumni) */}
                {isAlumni && (member.currentPosition || member.currentInstitution) && (
                  <div className="p-4 rounded-2xl bg-amber-500/5 dark:bg-[#0B1120] border border-amber-500/20 dark:border-amber-500/30 space-y-1">
                    <div className="flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                      <Compass className="w-3.5 h-3.5" />
                      <span>Current Career Destination & Placement</span>
                    </div>
                    <div className="text-sm sm:text-base font-bold text-slate-900 dark:text-amber-400">
                      {member.currentPosition}
                    </div>
                    {member.currentInstitution && (
                      <div className="text-xs text-slate-600 dark:text-slate-300">
                        {member.currentInstitution}
                      </div>
                    )}
                  </div>
                )}

                {/* Academic Quick Metadata Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
                  {member.email && (
                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                      <Mail className="w-4 h-4 text-emerald-500 shrink-0" />
                      <a href={`mailto:${member.email}`} className="hover:underline truncate font-medium">
                        {member.email}
                      </a>
                    </div>
                  )}

                  {member.expectedGraduation && (
                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                      <Calendar className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>Expected Completion: <strong>{member.expectedGraduation}</strong></span>
                    </div>
                  )}

                  {member.advisor && (
                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                      <GraduationCap className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>Primary Advisor: <strong>{member.advisor}</strong></span>
                    </div>
                  )}

                  {member.officeLocation && (
                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                      <MapPin className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span className="truncate">{member.officeLocation}</span>
                    </div>
                  )}
                </div>

                {/* Social Media & Research Profile Handles */}
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-2.5">
                  {member.googleScholarUrl && (
                    <a
                      href={member.googleScholarUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-[#0B1120] border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:text-emerald-600 dark:hover:text-emerald-400 hover:border-emerald-500/50 transition-colors text-xs font-bold shadow-2xs"
                    >
                      <span>Google Scholar</span>
                      <ArrowUpRight className="w-3.5 h-3.5 text-emerald-500" />
                    </a>
                  )}

                  {member.orcid && (
                    <a
                      href={`https://orcid.org/${member.orcid}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-[#0B1120] border border-slate-200 dark:border-slate-800 text-[#A6CE39] hover:border-emerald-500 transition-colors text-xs font-bold shadow-2xs"
                    >
                      <span className="w-2 h-2 rounded-full bg-[#A6CE39]" />
                      <span>ORCID: {member.orcid}</span>
                    </a>
                  )}

                  {member.researchGateUrl && (
                    <a
                      href={member.researchGateUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-[#0B1120] border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:text-emerald-600 dark:hover:text-emerald-400 hover:border-emerald-500/50 transition-colors text-xs font-bold shadow-2xs"
                    >
                      <span>ResearchGate</span>
                      <ArrowUpRight className="w-3.5 h-3.5 text-emerald-500" />
                    </a>
                  )}

                  {member.linkedinUrl && (
                    <a
                      href={member.linkedinUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-[#0B1120] border border-slate-200 dark:border-slate-800 text-[#0A66C2] hover:border-[#0A66C2] transition-colors text-xs font-bold shadow-2xs"
                    >
                      <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                        <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.45a1.64 1.64 0 1 0 0 3.28 1.64 1.64 0 0 0 0-3.28" />
                      </svg>
                      <span>LinkedIn Profile</span>
                    </a>
                  )}

                  {member.websiteUrl && (
                    <a
                      href={member.websiteUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-[#0B1120] border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:text-emerald-600 transition-colors text-xs font-bold shadow-2xs"
                    >
                      <Globe className="w-3.5 h-3.5 text-emerald-500" />
                      <span>Website</span>
                    </a>
                  )}

                  {member.email && (
                    <a
                      href={`mailto:${member.email}`}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white transition-colors text-xs font-bold shadow-xs ml-auto"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span>Contact Directly</span>
                    </a>
                  )}
                </div>

              </div>

            </div>
          </div>

          {/* ============================================================ */}
          {/* 2. MAIN CONTENT SECTIONS: BIOGRAPHY & RESEARCH TOPICS */}
          {/* ============================================================ */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Column (8 cols): Bio, Theses & Publications */}
            <div className="lg:col-span-8 space-y-8">
              
              {/* Professional Summary / Biography */}
              {member.bio && (
                <div className="rounded-3xl bg-white dark:bg-[#0F172A] border border-slate-200/90 dark:border-slate-800 p-6 sm:p-8 space-y-4 shadow-sm">
                  <div className="flex items-center gap-2 text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
                    <FileText className="w-4 h-4 text-emerald-500" />
                    <span>Professional Summary & Background</span>
                  </div>
                  <p className="text-slate-700 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
                    {member.bio}
                  </p>

                  {member.quote && (
                    <div className="p-4 rounded-2xl bg-emerald-500/5 border-l-4 border-emerald-500 text-slate-700 dark:text-slate-300 text-sm italic flex gap-3 mt-4">
                      <Quote className="w-5 h-5 text-emerald-500 shrink-0" />
                      <span>{member.quote}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Research Focus & Areas of Interest */}
              {member.researchInterests && member.researchInterests.length > 0 && (
                <div className="rounded-3xl bg-white dark:bg-[#0F172A] border border-slate-200/90 dark:border-slate-800 p-6 sm:p-8 space-y-4 shadow-sm">
                  <div className="flex items-center gap-2 text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
                    <FlaskConical className="w-4 h-4 text-emerald-500" />
                    <span>Core Research Interests & Focus Areas</span>
                  </div>

                  <div className="flex flex-wrap gap-2.5">
                    {member.researchInterests.map((interest, idx) => (
                      <span
                        key={idx}
                        className="px-3.5 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-900 dark:text-emerald-300 text-xs sm:text-sm font-semibold border border-emerald-500/20"
                      >
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Research Projects & Theses (Undergraduate, M.Sc, PhD) */}
              {(member.undergradThesis || member.mscThesis || member.phdThesis) && (
                <div className="rounded-3xl bg-white dark:bg-[#0F172A] border border-slate-200/90 dark:border-slate-800 p-6 sm:p-8 space-y-6 shadow-sm">
                  <div className="flex items-center gap-2 text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
                    <BookOpen className="w-4 h-4 text-emerald-500" />
                    <span>Academic Theses & Research Projects</span>
                  </div>

                  <div className="space-y-4">
                    {/* Ph.D. Dissertation */}
                    {member.phdThesis && (
                      <div className="p-5 rounded-2xl bg-slate-50 dark:bg-[#0B1120] border border-slate-200 dark:border-slate-800 space-y-2">
                        <div className="flex items-center gap-2 text-xs font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wider">
                          <Layers className="w-3.5 h-3.5" />
                          <span>Ph.D. Doctoral Dissertation</span>
                        </div>
                        <h4 className="text-base font-bold text-slate-900 dark:text-white font-[family-name:var(--font-manrope)]">
                          {member.phdThesis}
                        </h4>
                        {member.phdDescription && (
                          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed pt-1">
                            {member.phdDescription}
                          </p>
                        )}
                      </div>
                    )}

                    {/* M.Sc. Thesis */}
                    {member.mscThesis && (
                      <div className="p-5 rounded-2xl bg-slate-50 dark:bg-[#0B1120] border border-slate-200 dark:border-slate-800 space-y-2">
                        <div className="flex items-center gap-2 text-xs font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-wider">
                          <BookOpen className="w-3.5 h-3.5" />
                          <span>Master of Science (M.Sc.) Thesis</span>
                        </div>
                        <h4 className="text-base font-bold text-slate-900 dark:text-white font-[family-name:var(--font-manrope)]">
                          {member.mscThesis}
                        </h4>
                        {member.mscDescription && (
                          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed pt-1">
                            {member.mscDescription}
                          </p>
                        )}
                      </div>
                    )}

                    {/* Undergraduate 4th Year Thesis */}
                    {member.undergradThesis && (
                      <div className="p-5 rounded-2xl bg-slate-50 dark:bg-[#0B1120] border border-slate-200 dark:border-slate-800 space-y-2">
                        <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                          <GraduationCap className="w-3.5 h-3.5" />
                          <span>Undergraduate 4th-Year Capstone Thesis</span>
                        </div>
                        <h4 className="text-base font-bold text-slate-900 dark:text-white font-[family-name:var(--font-manrope)]">
                          {member.undergradThesis}
                        </h4>
                        {member.undergradDescription && (
                          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed pt-1">
                            {member.undergradDescription}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Works & Authored Publications List */}
              {((member.publications && member.publications.length > 0) ||
                (isPI && member.curriculumVitae?.selectedPublications)) && (
                <div className="rounded-3xl bg-white dark:bg-[#0F172A] border border-slate-200/90 dark:border-slate-800 p-6 sm:p-8 space-y-5 shadow-sm">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2 text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
                      <FileText className="w-4 h-4 text-emerald-500" />
                      <span>Works & Published Papers</span>
                    </div>

                    <Link
                      href="/publications"
                      className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline inline-flex items-center gap-1"
                    >
                      <span>Explore Lab Archive</span>
                      <ChevronRight className="w-3 h-3" />
                    </Link>
                  </div>

                  <div className="space-y-3.5">
                    {(member.publications || member.curriculumVitae?.selectedPublications || []).map(
                      (pub, idx) => (
                        <div
                          key={idx}
                          className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0B1120] border border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 transition-colors space-y-1.5"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-snug">
                              {pub.title}
                            </h4>
                            <span className="px-2.5 py-0.5 rounded-md bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px] font-bold shrink-0">
                              {pub.year}
                            </span>
                          </div>

                          <p className="text-xs text-slate-600 dark:text-slate-400 italic">
                            {pub.journal}
                          </p>

                          {pub.doi && (
                            <div className="pt-1">
                              <a
                                href={`https://doi.org/${pub.doi}`}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
                              >
                                <span>DOI: {pub.doi}</span>
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            </div>
                          )}
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}

              {/* PI Specific Grants Section */}
              {isPI && member.curriculumVitae?.grants && (
                <div className="rounded-3xl bg-white dark:bg-[#0F172A] border border-slate-200/90 dark:border-slate-800 p-6 sm:p-8 space-y-4 shadow-sm">
                  <div className="flex items-center gap-2 text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
                    <Award className="w-4 h-4 text-emerald-500" />
                    <span>Competitive Research Grants & Funding</span>
                  </div>

                  <div className="space-y-3">
                    {member.curriculumVitae.grants.map((grant, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0B1120] border border-slate-200 dark:border-slate-800 space-y-1"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                            {grant.title}
                          </h4>
                          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 shrink-0">
                            {grant.period}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-400">
                          {grant.fundingAgency} • <strong>{grant.amount}</strong> ({grant.role})
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>

            {/* Right Column (4 cols): Education, Skills & Awards */}
            <div className="lg:col-span-4 space-y-8">
              
              {/* Education Credentials */}
              {member.education && member.education.length > 0 && (
                <div className="rounded-3xl bg-white dark:bg-[#0F172A] border border-slate-200/90 dark:border-slate-800 p-6 space-y-4 shadow-sm">
                  <div className="flex items-center gap-2 text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
                    <GraduationCap className="w-4 h-4 text-emerald-500" />
                    <span>Academic Education</span>
                  </div>

                  <div className="space-y-3">
                    {member.education.map((edu, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#0B1120] border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 leading-relaxed flex items-start gap-2.5"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{edu}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Specialized Laboratory & Computational Skills */}
              {member.skills && member.skills.length > 0 && (
                <div className="rounded-3xl bg-white dark:bg-[#0F172A] border border-slate-200/90 dark:border-slate-800 p-6 space-y-4 shadow-sm">
                  <div className="flex items-center gap-2 text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
                    <FlaskConical className="w-4 h-4 text-emerald-500" />
                    <span>Technical & Lab Competencies</span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {member.skills.map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 rounded-xl bg-slate-100 dark:bg-[#0B1120] text-slate-800 dark:text-slate-200 text-xs font-medium border border-slate-200 dark:border-slate-800"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Honors, Grants & Fellowships */}
              {member.awards && member.awards.length > 0 && (
                <div className="rounded-3xl bg-white dark:bg-[#0F172A] border border-slate-200/90 dark:border-slate-800 p-6 space-y-4 shadow-sm">
                  <div className="flex items-center gap-2 text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
                    <Award className="w-4 h-4 text-amber-500" />
                    <span>Honors & Fellowships</span>
                  </div>

                  <div className="space-y-2.5">
                    {member.awards.map((award, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-2xl bg-amber-500/5 border border-amber-500/20 text-xs text-slate-800 dark:text-amber-200 flex items-start gap-2"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                        <span>{award}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Direct Inquiries Callout */}
              <div className="p-6 rounded-3xl bg-gradient-to-br from-emerald-950 via-[#0B1120] to-[#0F172A] border border-emerald-500/30 text-white space-y-3 shadow-md">
                <h4 className="text-sm font-black uppercase tracking-wider text-emerald-400">
                  Collaborative Inquiries
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Interested in collaborating on research projects or learning more about this work?
                </p>
                {member.email ? (
                  <a
                    href={`mailto:${member.email}`}
                    className="inline-flex items-center justify-center w-full gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Send Email Inquiry</span>
                  </a>
                ) : (
                  <Link
                    href="/contact"
                    className="inline-flex items-center justify-center w-full gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors"
                  >
                    <span>Contact Lab Office</span>
                  </Link>
                )}
              </div>

            </div>

          </div>

          {/* ============================================================ */}
          {/* 3. RELATED LAB MEMBERS / PEERS */}
          {/* ============================================================ */}
          {relatedMembers.length > 0 && (
            <div className="pt-10 border-t border-slate-200 dark:border-slate-800 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-[family-name:var(--font-manrope)]">
                    Other Researchers in this Group
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                    Explore colleagues and collaborative investigators in our laboratory.
                  </p>
                </div>

                <Link
                  href="/team"
                  className="text-xs sm:text-sm font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
                >
                  <span>View All Team</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedMembers.map((rel) => (
                  <Link
                    key={rel.id}
                    href={`/team/${rel.slug}`}
                    className="group rounded-3xl bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 p-5 hover:border-emerald-500/60 dark:hover:border-emerald-400/50 transition-all duration-300 flex items-center gap-4 shadow-sm hover:shadow-lg hover:-translate-y-0.5"
                  >
                    <img
                      src={rel.imageSrc}
                      alt={rel.name}
                      className="w-16 h-16 rounded-2xl object-cover object-top filter brightness-[0.98] shrink-0 border border-slate-200 dark:border-slate-800"
                    />
                    <div className="min-w-0 space-y-0.5">
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-emerald-500 dark:group-hover:text-emerald-400 transition truncate">
                        {rel.name}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                        {rel.role}
                      </p>
                      <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 inline-flex items-center gap-0.5 pt-1">
                        <span>View Profile</span>
                        <ChevronRight className="w-3 h-3" />
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

        </div>
      </main>

      {/* Global Footer */}
      <Footer />
    </div>
  );
}
