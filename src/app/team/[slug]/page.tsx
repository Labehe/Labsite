"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Navbar } from "@/components/public/navbar";
import { Footer } from "@/components/public/footer";
import { getTeamMemberBySlug, getRelatedTeamMembers, getTeamMembers } from "@/lib/team/store";
import { TeamMember } from "@/lib/team/types";
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
  Loader2,
  Users,
} from "lucide-react";

export default function TeamMemberDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const [member, setMember] = useState<TeamMember | null>(null);
  const [relatedMembers, setRelatedMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadMember() {
      if (!slug) return;
      setIsLoading(true);
      try {
        let found = await getTeamMemberBySlug(slug);

        // Fallback fuzzy search if exact slug wasn't matched
        if (!found) {
          const all = await getTeamMembers();
          const cleanSlug = decodeURIComponent(slug).toLowerCase().trim();
          found =
            all.find(
              (m) =>
                m.slug?.toLowerCase() === cleanSlug ||
                m.id?.toLowerCase() === cleanSlug ||
                m.name?.toLowerCase().replace(/[^a-z0-9]+/g, "-") === cleanSlug
            ) || null;
        }

        setMember(found);

        if (found) {
          const related = await getRelatedTeamMembers(found.id, found.category, 3);
          setRelatedMembers(related);
        }
      } catch (err) {
        console.error("Error loading team member detail:", err);
      } finally {
        setIsLoading(false);
      }
    }

    loadMember();
  }, [slug]);

  // Loading Skeleton State
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--bg-page)] text-[var(--text-main)] flex flex-col justify-between">
        <Navbar />
        <main className="flex-grow pt-28 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full space-y-8">
          <div className="flex items-center gap-3 text-sm text-slate-400">
            <Loader2 className="w-5 h-5 animate-spin text-emerald-500" />
            <span>Loading researcher profile...</span>
          </div>
          <div className="rounded-3xl bg-white dark:bg-[#0F172A] border border-slate-200/90 dark:border-slate-800 p-8 sm:p-12 animate-pulse space-y-6">
            <div className="flex flex-col sm:flex-row gap-8 items-center sm:items-start">
              <div className="w-48 h-48 sm:w-56 sm:h-56 rounded-3xl bg-slate-200 dark:bg-slate-800 shrink-0" />
              <div className="space-y-4 w-full">
                <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded-xl w-2/3" />
                <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-lg w-1/3" />
                <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-lg w-1/2" />
                <div className="h-20 bg-slate-200 dark:bg-slate-800 rounded-2xl w-full" />
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Not Found State
  if (!member) {
    return (
      <div className="min-h-screen bg-[var(--bg-page)] text-[var(--text-main)] flex flex-col justify-between">
        <Navbar />
        <main className="flex-grow pt-32 pb-24 max-w-4xl mx-auto px-4 text-center space-y-6">
          <div className="w-20 h-20 rounded-3xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center">
            <Users className="w-10 h-10" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              Researcher Profile Not Found
            </h1>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-md mx-auto">
              We couldn't locate a member profile matching &quot;{slug}&quot;. The researcher may have moved or the link might be outdated.
            </p>
          </div>
          <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/team"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow-lg shadow-emerald-600/20"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Research Team</span>
            </Link>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold transition"
            >
              <span>Homepage</span>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

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
                  {member.isActive === false && (
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center">
                      <span className="px-3 py-1 bg-amber-500/90 text-black text-xs font-bold uppercase tracking-wider rounded-full">
                        Alumnus / Inactive
                      </span>
                    </div>
                  )}
                </div>

                {/* Category & Graduation Pill */}
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${
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
                      <span>Current Career Destination &amp; Placement</span>
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
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-[#0B1120] border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:text-emerald-600 transition-colors text-xs font-bold shadow-2xs"
                    >
                      <GraduationCap className="w-3.5 h-3.5 text-emerald-500" />
                      <span>Scholar</span>
                    </a>
                  )}

                  {member.orcid && (
                    <a
                      href={member.orcid.startsWith("http") ? member.orcid : `https://orcid.org/${member.orcid}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-[#0B1120] border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:text-emerald-600 transition-colors text-xs font-bold shadow-2xs"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
                      <span>ORCID</span>
                    </a>
                  )}

                  {member.researchGateUrl && (
                    <a
                      href={member.researchGateUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-[#0B1120] border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:text-emerald-600 transition-colors text-xs font-bold shadow-2xs"
                    >
                      <FlaskConical className="w-3.5 h-3.5 text-emerald-500" />
                      <span>ResearchGate</span>
                    </a>
                  )}

                  {member.linkedinUrl && (
                    <a
                      href={member.linkedinUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-[#0B1120] border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:text-emerald-600 transition-colors text-xs font-bold shadow-2xs"
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-emerald-500" />
                      <span>LinkedIn</span>
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
                    <span>Professional Summary &amp; Background</span>
                  </div>
                  <p className="text-slate-700 dark:text-slate-300 text-sm sm:text-base leading-relaxed whitespace-pre-line">
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
                    <span>Core Research Interests &amp; Focus Areas</span>
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

              {/* Research Projects & Theses (Undergraduate, M.Sc, PhD, or Active Topic) */}
              {(member.undergradThesis || member.mscThesis || member.phdThesis || member.thesisTopic) && (
                <div className="rounded-3xl bg-white dark:bg-[#0F172A] border border-slate-200/90 dark:border-slate-800 p-6 sm:p-8 space-y-6 shadow-sm">
                  <div className="flex items-center gap-2 text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
                    <BookOpen className="w-4 h-4 text-emerald-500" />
                    <span>Academic Theses &amp; Research Projects</span>
                  </div>

                  <div className="space-y-4">
                    {/* Active / Ongoing Thesis Topic */}
                    {member.thesisTopic && (
                      <div className="p-5 rounded-2xl bg-slate-50 dark:bg-[#0B1120] border border-slate-200 dark:border-slate-800 space-y-2">
                        <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Active / Ongoing Research Topic</span>
                        </div>
                        <h4 className="text-base font-bold text-slate-900 dark:text-white font-[family-name:var(--font-manrope)]">
                          {member.thesisTopic}
                        </h4>
                        {(member.advisor || member.expectedGraduation) && (
                          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 dark:text-slate-400 pt-1">
                            {member.advisor && (
                              <span>Principal Advisor: <strong className="text-slate-800 dark:text-slate-200">{member.advisor}</strong></span>
                            )}
                            {member.expectedGraduation && (
                              <span>Expected Completion: <strong className="text-slate-800 dark:text-slate-200">{member.expectedGraduation}</strong></span>
                            )}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Doctoral Dissertation */}
                    {member.phdThesis && (
                      <div className="p-5 rounded-2xl bg-slate-50 dark:bg-[#0B1120] border border-slate-200 dark:border-slate-800 space-y-2">
                        <div className="flex items-center gap-2 text-xs font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wider">
                          <Layers className="w-3.5 h-3.5" />
                          <span>Doctoral (Ph.D.) Dissertation</span>
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

                    {/* Master's Thesis */}
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
                          <span>Undergraduate (B.Sc.) 4th-Year Capstone Thesis</span>
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
                      <span>Works &amp; Published Papers</span>
                    </div>

                    <Link
                      href="/publications"
                      className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
                    >
                      <span>Full Bibliography</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>

                  <div className="space-y-3">
                    {member.publications && member.publications.length > 0 ? (
                      member.publications.map((pub, idx) => (
                        <div
                          key={idx}
                          className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0B1120] border border-slate-200/80 dark:border-slate-800/80 space-y-1.5"
                        >
                          <div className="flex items-start justify-between gap-4">
                            <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-snug">
                              {pub.title}
                            </h4>
                            <span className="px-2.5 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-[10px] font-bold text-slate-700 dark:text-slate-300 shrink-0">
                              {pub.year}
                            </span>
                          </div>
                          <p className="text-xs text-slate-600 dark:text-slate-400">
                            {pub.journal} {pub.doi && `• doi:${pub.doi}`}
                          </p>
                        </div>
                      ))
                    ) : (
                      member.curriculumVitae?.selectedPublications?.map((pub, idx) => (
                        <div
                          key={idx}
                          className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0B1120] border border-slate-200/80 dark:border-slate-800/80 space-y-1.5"
                        >
                          <div className="flex items-start justify-between gap-4">
                            <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-snug">
                              {pub.title}
                            </h4>
                            <span className="px-2.5 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-[10px] font-bold text-slate-700 dark:text-slate-300 shrink-0">
                              {pub.year}
                            </span>
                          </div>
                          <p className="text-xs text-slate-600 dark:text-slate-400">
                            {pub.journal} {pub.doi && `• doi:${pub.doi}`}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* PI Extended Section: Grants & Academic Appointments */}
              {isPI && member.curriculumVitae && (
                <div className="space-y-8">
                  {/* Funded Research Grants */}
                  {member.curriculumVitae.grants && member.curriculumVitae.grants.length > 0 && (
                    <div className="rounded-3xl bg-white dark:bg-[#0F172A] border border-slate-200/90 dark:border-slate-800 p-6 sm:p-8 space-y-4 shadow-sm">
                      <div className="flex items-center gap-2 text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
                        <Award className="w-4 h-4 text-emerald-500" />
                        <span>Funded Research Grants &amp; Sponsored Projects</span>
                      </div>

                      <div className="space-y-3">
                        {member.curriculumVitae.grants.map((grant, idx) => (
                          <div
                            key={idx}
                            className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0B1120] border border-slate-200 dark:border-slate-800 space-y-1.5"
                          >
                            <div className="flex items-start justify-between gap-4">
                              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                                {grant.title}
                              </h4>
                              <span className="px-2.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold shrink-0">
                                {grant.amount}
                              </span>
                            </div>
                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
                              <span>Agency: <strong>{grant.fundingAgency}</strong></span>
                              <span>•</span>
                              <span>Role: <strong>{grant.role}</strong></span>
                              <span>•</span>
                              <span>Period: <strong>{grant.period}</strong></span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Academic Appointments */}
                  {member.curriculumVitae.appointments && member.curriculumVitae.appointments.length > 0 && (
                    <div className="rounded-3xl bg-white dark:bg-[#0F172A] border border-slate-200/90 dark:border-slate-800 p-6 sm:p-8 space-y-4 shadow-sm">
                      <div className="flex items-center gap-2 text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
                        <Building2 className="w-4 h-4 text-emerald-500" />
                        <span>Academic Appointments &amp; Affiliations</span>
                      </div>

                      <div className="space-y-3">
                        {member.curriculumVitae.appointments.map((app, idx) => (
                          <div
                            key={idx}
                            className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0B1120] border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4"
                          >
                            <div>
                              <div className="text-sm font-bold text-slate-900 dark:text-white">
                                {app.role}
                              </div>
                              <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                {app.institution} {app.department && `• ${app.department}`}
                              </div>
                            </div>
                            <span className="text-xs font-semibold text-slate-400 shrink-0">
                              {app.period}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

            </div>

            {/* Right Column (4 cols): Education, Credentials, Skills & Quick Stats */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* Education & Academic History */}
              {member.education && member.education.length > 0 && (
                <div className="rounded-3xl bg-white dark:bg-[#0F172A] border border-slate-200/90 dark:border-slate-800 p-6 space-y-4 shadow-sm">
                  <div className="flex items-center gap-2 text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
                    <GraduationCap className="w-4 h-4 text-emerald-500" />
                    <span>Education &amp; Academic Degrees</span>
                  </div>

                  <div className="space-y-3">
                    {member.education.map((edu, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#0B1120] border border-slate-100 dark:border-slate-800/80 text-xs font-medium text-slate-700 dark:text-slate-300 leading-relaxed"
                      >
                        {edu}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Awards, Grants & Honors */}
              {member.awards && member.awards.length > 0 && (
                <div className="rounded-3xl bg-white dark:bg-[#0F172A] border border-slate-200/90 dark:border-slate-800 p-6 space-y-4 shadow-sm">
                  <div className="flex items-center gap-2 text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
                    <Award className="w-4 h-4 text-amber-500" />
                    <span>Honors, Grants &amp; Fellowships</span>
                  </div>

                  <div className="space-y-2.5">
                    {member.awards.map((award, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300"
                      >
                        <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                        <span>{award}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Technical Skills & Methodologies */}
              {member.skills && member.skills.length > 0 && (
                <div className="rounded-3xl bg-white dark:bg-[#0F172A] border border-slate-200/90 dark:border-slate-800 p-6 space-y-4 shadow-sm">
                  <div className="flex items-center gap-2 text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
                    <Sparkles className="w-4 h-4 text-emerald-500" />
                    <span>Technical &amp; Analytical Methodologies</span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {member.skills.map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Editorial / Memberships for PI */}
              {isPI && member.curriculumVitae && (
                <div className="rounded-3xl bg-white dark:bg-[#0F172A] border border-slate-200/90 dark:border-slate-800 p-6 space-y-4 shadow-sm">
                  <div className="flex items-center gap-2 text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
                    <Globe className="w-4 h-4 text-cyan-500" />
                    <span>Professional Memberships</span>
                  </div>

                  <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                    {member.curriculumVitae.memberships?.map((m, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 mt-1.5 shrink-0" />
                        <span>{m}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

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
