"use client";

import * as React from "react";
import { TeamMember } from "@/lib/team/types";
import { TEAM_CATEGORIES_META } from "@/lib/team/seed-data";
import {
  X,
  Mail,
  GraduationCap,
  Sparkles,
  BookOpen,
  MapPin,
  Compass,
  ArrowUpRight,
  Award,
  Layers,
  Wrench,
  CheckCircle2,
  Calendar,
  UserCheck,
} from "lucide-react";

interface MemberDetailModalProps {
  member: TeamMember | null;
  onClose: () => void;
}

export function MemberDetailModal({ member, onClose }: MemberDetailModalProps) {
  if (!member) return null;

  const meta = TEAM_CATEGORIES_META[member.category] || {
    label: member.category,
    shortLabel: member.category,
    badgeColor: "bg-slate-100 text-slate-800",
  };

  const isAlumni = member.category === "alumni";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto">
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative w-full max-w-3xl max-h-[92vh] overflow-y-auto rounded-3xl bg-white dark:bg-[#0B1120] border border-slate-300 dark:border-slate-800 shadow-2xl z-10 flex flex-col text-slate-900 dark:text-slate-100">
        
        {/* Sticky Header */}
        <div className="sticky top-0 z-20 flex items-center justify-between px-6 py-4 bg-white/95 dark:bg-[#0B1120]/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <span className={`px-3 py-1 rounded-full text-xs font-bold border ${meta.badgeColor}`}>
              {meta.label}
            </span>
            {member.alumniYear && (
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-400 text-xs font-bold border border-amber-500/20">
                {member.alumniYear}
              </span>
            )}
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-8">
          
          {/* Top Profile Summary Card */}
          <div className="flex flex-col sm:flex-row gap-6 items-start">
            <div className="relative w-28 sm:w-36 aspect-square rounded-2xl overflow-hidden border-2 border-slate-200 dark:border-slate-700 shadow-lg shrink-0">
              <img
                src={member.imageSrc}
                alt={member.name}
                className="w-full h-full object-cover object-top"
              />
            </div>

            <div className="space-y-2 flex-1 min-w-0">
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight font-[family-name:var(--font-manrope)] text-slate-900 dark:text-white">
                {member.name}
              </h2>
              <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                {member.role}
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                {member.department}, {member.affiliation}
              </p>

              {member.advisor && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-100 dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300">
                  <UserCheck className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Advisor: <strong className="text-slate-900 dark:text-white">{member.advisor}</strong></span>
                </div>
              )}

              {member.expectedGraduation && (
                <div className="text-xs text-slate-500 font-mono">
                  Expected Completion: {member.expectedGraduation}
                </div>
              )}
            </div>
          </div>

          {/* Alumni Current Placement Box */}
          {isAlumni && (member.currentPosition || member.currentInstitution) && (
            <div className="p-4 sm:p-5 rounded-2xl bg-amber-500/10 border-2 border-amber-500/30 space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                <Compass className="w-4 h-4" />
                <span>Current Destination &amp; Career Placement</span>
              </div>
              <div className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white">
                {member.currentPosition}
              </div>
              {member.currentInstitution && (
                <div className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                  {member.currentInstitution}
                </div>
              )}
              {member.pastRole && (
                <div className="text-xs text-slate-500 dark:text-slate-400 pt-1">
                  Past Lab Role: {member.pastRole}
                </div>
              )}
            </div>
          )}

          {/* About & Narrative */}
          {member.bio && (
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
                <span>About &amp; Research Background</span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
                {member.bio}
              </p>
            </div>
          )}

          {/* Academic Projects & Theses Sections */}
          <div className="space-y-4">
            
            {/* 1. 4th Year / Undergraduate Project */}
            {member.undergradThesis && (
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                    <GraduationCap className="w-4 h-4" />
                    <span>4th-Year Undergraduate Project / Senior Thesis</span>
                  </div>
                </div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white leading-snug">
                  {member.undergradThesis}
                </h4>
                {member.undergradDescription && (
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed pt-1">
                    {member.undergradDescription}
                  </p>
                )}
              </div>
            )}

            {/* 2. Master's (M.Sc.) Thesis */}
            {member.mscThesis && (
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400">
                  <BookOpen className="w-4 h-4" />
                  <span>Master of Science (M.Sc.) Thesis Project</span>
                </div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white leading-snug">
                  {member.mscThesis}
                </h4>
                {member.mscDescription && (
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed pt-1">
                    {member.mscDescription}
                  </p>
                )}
              </div>
            )}

            {/* 3. Doctoral (Ph.D.) / Postdoc Research Focus */}
            {member.phdThesis && (
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
                  <Layers className="w-4 h-4" />
                  <span>Doctoral (Ph.D.) Dissertation / Postdoctoral Investigation</span>
                </div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white leading-snug">
                  {member.phdThesis}
                </h4>
                {member.phdDescription && (
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed pt-1">
                    {member.phdDescription}
                  </p>
                )}
              </div>
            )}

          </div>

          {/* Research Interests */}
          {member.researchInterests && member.researchInterests.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Primary Research Interests
              </h3>
              <div className="flex flex-wrap gap-2">
                {member.researchInterests.map((interest, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-xl bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 text-xs font-semibold border border-emerald-500/20"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Skills & Methodologies */}
          {member.skills && member.skills.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
                <Wrench className="w-3.5 h-3.5 text-emerald-500" />
                <span>Laboratory Techniques &amp; Analytical Skills</span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {member.skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-xl bg-slate-100 dark:bg-[#0F172A] text-slate-700 dark:text-slate-300 text-xs font-medium border border-slate-200 dark:border-slate-800"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Awards & Honors */}
          {member.awards && member.awards.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-amber-500" />
                <span>Awards &amp; Fellowships</span>
              </h3>
              <div className="space-y-1.5">
                {member.awards.map((award, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>{award}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Academic & Social Handles Bar */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Academic Profiles &amp; Direct Contact
            </h3>
            
            <div className="flex flex-wrap items-center gap-3">
              {member.email && (
                <a
                  href={`mailto:${member.email}`}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white dark:bg-[#0B1120] border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200 hover:text-emerald-500 hover:border-emerald-500 transition shadow-xs"
                >
                  <Mail className="w-3.5 h-3.5 text-emerald-500" />
                  <span>{member.email}</span>
                </a>
              )}

              {member.googleScholarUrl && (
                <a
                  href={member.googleScholarUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white dark:bg-[#0B1120] border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200 hover:text-emerald-500 hover:border-emerald-500 transition shadow-xs"
                >
                  <span>Google Scholar</span>
                  <ArrowUpRight className="w-3 h-3 text-emerald-500" />
                </a>
              )}

              {member.orcid && (
                <a
                  href={`https://orcid.org/${member.orcid}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white dark:bg-[#0B1120] border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200 hover:text-emerald-500 hover:border-emerald-500 transition shadow-xs"
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
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white dark:bg-[#0B1120] border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200 hover:text-emerald-500 hover:border-emerald-500 transition shadow-xs"
                >
                  <span>ResearchGate</span>
                  <ArrowUpRight className="w-3 h-3 text-emerald-500" />
                </a>
              )}

              {member.linkedinUrl && (
                <a
                  href={member.linkedinUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white dark:bg-[#0B1120] border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200 hover:text-[#0A66C2] hover:border-[#0A66C2] transition shadow-xs"
                >
                  <span>LinkedIn</span>
                  <ArrowUpRight className="w-3 h-3 text-[#0A66C2]" />
                </a>
              )}
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-6 bg-slate-50 dark:bg-[#0F172A] border-t border-slate-200 dark:border-slate-800 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs hover:bg-emerald-400 transition cursor-pointer"
          >
            Close Details
          </button>
        </div>

      </div>
    </div>
  );
}
