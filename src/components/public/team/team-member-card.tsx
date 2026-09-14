"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { TeamMember } from "@/lib/team/types";
import {
  Mail,
  GraduationCap,
  Sparkles,
  ArrowUpRight,
  BookOpen,
  MapPin,
  Compass,
  ChevronRight,
  FlaskConical,
} from "lucide-react";

interface TeamMemberCardProps {
  member: TeamMember;
  onSelect?: (member: TeamMember) => void;
}

export function TeamMemberCard({ member, onSelect }: TeamMemberCardProps) {
  const router = useRouter();
  const isAlumni = member.category === "alumni";

  const handleCardClick = () => {
    if (onSelect) onSelect(member);
    router.push(`/team/${member.slug}`);
  };

  // If Alumni, keep existing specialized alumni card structure
  if (isAlumni) {
    return (
      <div
        onClick={handleCardClick}
        className="group/card rounded-2xl bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 hover:border-emerald-500/60 dark:hover:border-emerald-400/50 shadow-sm hover:shadow-xl hover:shadow-emerald-950/5 dark:hover:shadow-black/40 transition-all duration-300 flex flex-col justify-between overflow-hidden hover:-translate-y-1 relative cursor-pointer h-full"
      >
        <div>
          <div className="relative aspect-[4/3.4] overflow-hidden bg-slate-900">
            <img
              src={member.imageSrc}
              alt={member.name}
              className="w-full h-full object-cover object-top group-hover/card:scale-105 transition-transform duration-500 filter brightness-[0.97]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent pointer-events-none" />

            <div className="absolute top-2.5 right-2.5 z-10">
              <span className="px-2.5 py-0.5 rounded-full bg-black/75 backdrop-blur-md text-white text-[10px] font-bold border border-white/20 shadow flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5 text-slate-300" />
                <span>{member.alumniYear || "Alumni"}</span>
              </span>
            </div>

            <div className="absolute bottom-2.5 left-3.5 right-3.5 text-white z-10 space-y-0.5">
              <h4 className="text-base font-bold tracking-tight font-[family-name:var(--font-manrope)] text-white group-hover/card:text-emerald-300 transition-colors line-clamp-1">
                {member.name}
              </h4>
              <p className="text-[11px] text-slate-300 font-normal line-clamp-1">
                {member.role}
              </p>
            </div>
          </div>

          <div className="p-4 space-y-2.5 text-xs">
            {(member.currentPosition || member.currentInstitution) && (
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#0B1120] border border-slate-200 dark:border-slate-800 space-y-0.5">
                <div className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  <Compass className="w-2.5 h-2.5 text-slate-400 dark:text-slate-500" />
                  <span>Current Destination</span>
                </div>
                {/* Designation - Yellow Only */}
                <div className="text-[11px] font-bold text-amber-500 dark:text-amber-400 line-clamp-1">
                  {member.currentPosition}
                </div>
                {member.currentInstitution && (
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-1">
                    {member.currentInstitution}
                  </div>
                )}
              </div>
            )}

            {member.researchInterests && member.researchInterests.length > 0 && (
              <div className="space-y-1 pt-0.5">
                <div className="text-[9px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Focus Areas
                </div>
                <div className="flex flex-wrap gap-1">
                  {member.researchInterests.slice(0, 3).map((item, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 text-[10px] font-medium border border-emerald-500/20 truncate max-w-[150px]"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="p-3 pt-2.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs bg-slate-50/50 dark:bg-[#0B1120]/40">
          <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
            {member.email && (
              <a
                href={`mailto:${member.email}`}
                title={`Email ${member.name}`}
                className="p-1.5 rounded-lg bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-emerald-500 hover:border-emerald-500 transition-colors"
              >
                <Mail className="w-3.5 h-3.5" />
              </a>
            )}
            {member.googleScholarUrl && (
              <a
                href={member.googleScholarUrl}
                target="_blank"
                rel="noreferrer"
                title="Google Scholar Profile"
                className="px-2 py-1 rounded-lg bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:text-emerald-500 hover:border-emerald-500 transition-colors text-[9px] font-bold flex items-center gap-0.5"
              >
                <span>GS</span>
                <ArrowUpRight className="w-2.5 h-2.5 text-emerald-500" />
              </a>
            )}
            {member.orcid && (
              <a
                href={`https://orcid.org/${member.orcid}`}
                target="_blank"
                rel="noreferrer"
                title={`ORCID: ${member.orcid}`}
                className="px-2 py-1 rounded-lg bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 text-[#A6CE39] hover:border-emerald-500 transition-colors text-[9px] font-bold"
              >
                ORCID
              </a>
            )}
            {member.linkedinUrl && (
              <a
                href={member.linkedinUrl}
                target="_blank"
                rel="noreferrer"
                title="LinkedIn Profile"
                className="p-1.5 rounded-lg bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-[#0A66C2] hover:border-[#0A66C2] transition-colors flex items-center justify-center"
              >
                <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.45a1.64 1.64 0 1 0 0 3.28 1.64 1.64 0 0 0 0-3.28" />
                </svg>
              </a>
            )}
          </div>

          <Link
            href={`/team/${member.slug}`}
            onClick={(e) => {
              e.stopPropagation();
              if (onSelect) onSelect(member);
            }}
            className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 transition-colors px-2 py-1 rounded-lg hover:bg-emerald-500/10"
          >
            <span>Details</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    );
  }

  // Exact Wave/Curved Card Structure for Undergraduate, Graduate, Postdoc/PhD
  const roleBadge =
    member.category === "phd"
      ? "Postdoc & PhD"
      : member.category === "graduate"
      ? "M.Sc Researcher"
      : "Undergrad Fellow";

  const topicsString =
    member.researchInterests && member.researchInterests.length > 0
      ? member.researchInterests.slice(0, 3).join(", ")
      : member.thesisTopic || "Microplastics, Ecotoxicology, Water Quality";

  return (
    <div
      onClick={handleCardClick}
      className="group/card rounded-3xl bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 hover:border-emerald-500/60 dark:hover:border-emerald-400/50 shadow-sm hover:shadow-xl hover:shadow-emerald-950/5 dark:hover:shadow-black/40 transition-all duration-300 flex flex-col justify-between overflow-hidden hover:-translate-y-1 relative cursor-pointer h-full"
    >
      {/* Upper Area: Image + Wave Divider */}
      <div className="relative">
        
        {/* Member Photo */}
        <div className="relative aspect-[4/3.9] sm:aspect-[4/4] overflow-hidden bg-slate-900">
          <img
            src={member.imageSrc}
            alt={member.name}
            className="w-full h-full object-cover object-top group-hover/card:scale-105 transition-transform duration-500 filter brightness-[0.98]"
          />

          {/* Top Right Role / Category Text Label */}
          <div className="absolute top-3 right-3 z-10">
            <span className="px-3 py-1 rounded-full bg-black/75 backdrop-blur-md text-white text-[11px] font-semibold border border-white/20 shadow-md">
              {roleBadge}
            </span>
          </div>
        </div>

        {/* Elegant Organic Wave / Curve Separator Overlapping Image */}
        <div className="absolute -bottom-1 left-0 right-0 w-full overflow-hidden leading-none z-10 pointer-events-none">
          <svg
            viewBox="0 0 500 80"
            preserveAspectRatio="none"
            className="relative block w-full h-10 sm:h-12 fill-white dark:fill-[#0F172A] transition-colors duration-300"
          >
            {/* Wave curve that starts higher on left and swoops down to right */}
            <path d="M0,25 C150,55 320,5 500,45 L500,80 L0,80 Z" />
          </svg>
        </div>

      </div>

      {/* Lower Area: Name, Role, Topics, and Handles */}
      <div className="px-5 pt-1 pb-5 flex-1 flex flex-col justify-between space-y-4">
        
        {/* Name, Role & Topics */}
        <div className="space-y-1.5 text-left">
          
          {/* Member Name */}
          <h3 className="text-lg sm:text-xl font-extrabold tracking-tight font-[family-name:var(--font-manrope)] text-slate-900 dark:text-white group-hover/card:text-emerald-500 dark:group-hover/card:text-emerald-400 transition-colors line-clamp-1">
            {member.name}
          </h3>

          {/* Graduate / Undergrad / Postdoc Role Subtitle */}
          <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 line-clamp-1">
            {member.role}
          </p>

          {/* Topics of Interest (Comma-separated concise line) */}
          <p className="text-xs text-slate-600 dark:text-slate-400 font-medium line-clamp-2 leading-relaxed pt-1">
            {topicsString}
          </p>
        </div>

        {/* Bottom Handles & Details Action Row */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2">
          
          {/* Left: Rounded Handle Icon Boxes [Email] [GS] [ORCID] [RG] [LinkedIn] */}
          <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
            {member.email && (
              <a
                href={`mailto:${member.email}`}
                title={`Email ${member.name}`}
                className="w-8 h-8 rounded-xl bg-slate-50 dark:bg-[#0B1120] border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:text-emerald-500 hover:border-emerald-500 transition-colors flex items-center justify-center shadow-2xs"
              >
                <Mail className="w-3.5 h-3.5" />
              </a>
            )}

            {member.googleScholarUrl && (
              <a
                href={member.googleScholarUrl}
                target="_blank"
                rel="noreferrer"
                title="Google Scholar Profile"
                className="w-8 h-8 rounded-xl bg-slate-50 dark:bg-[#0B1120] border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-emerald-500 hover:border-emerald-500 transition-colors text-[10px] font-bold flex items-center justify-center shadow-2xs"
              >
                GS
              </a>
            )}

            {member.orcid && (
              <a
                href={`https://orcid.org/${member.orcid}`}
                target="_blank"
                rel="noreferrer"
                title={`ORCID: ${member.orcid}`}
                className="w-8 h-8 rounded-xl bg-slate-50 dark:bg-[#0B1120] border border-slate-200 dark:border-slate-800 text-[#A6CE39] hover:border-emerald-500 transition-colors text-[10px] font-bold flex items-center justify-center shadow-2xs"
              >
                ID
              </a>
            )}

            {member.researchGateUrl && (
              <a
                href={member.researchGateUrl}
                target="_blank"
                rel="noreferrer"
                title="ResearchGate Profile"
                className="w-8 h-8 rounded-xl bg-slate-50 dark:bg-[#0B1120] border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-emerald-500 hover:border-emerald-500 transition-colors text-[10px] font-bold flex items-center justify-center shadow-2xs"
              >
                RG
              </a>
            )}

            {member.linkedinUrl && (
              <a
                href={member.linkedinUrl}
                target="_blank"
                rel="noreferrer"
                title="LinkedIn Profile"
                className="w-8 h-8 rounded-xl bg-slate-50 dark:bg-[#0B1120] border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:text-[#0A66C2] hover:border-[#0A66C2] transition-colors flex items-center justify-center shadow-2xs"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.45a1.64 1.64 0 1 0 0 3.28 1.64 1.64 0 0 0 0-3.28" />
                </svg>
              </a>
            )}
          </div>

          {/* Right: Details Link */}
          <Link
            href={`/team/${member.slug}`}
            onClick={(e) => {
              e.stopPropagation();
              if (onSelect) onSelect(member);
            }}
            className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 transition-colors px-2 py-1 rounded-lg hover:bg-emerald-500/10"
          >
            <span>Details</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

      </div>

    </div>
  );
}
