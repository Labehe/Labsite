"use client";

import React from "react";
import { ProjectStats } from "@/lib/projects/types";
import { FolderGit2, Activity, CheckCircle2, Building2, Sparkles } from "lucide-react";

interface ProjectsHeroProps {
  stats: ProjectStats;
}

export function ProjectsHero({ stats }: ProjectsHeroProps) {
  return (
    <section className="relative pt-32 sm:pt-40 pb-16 sm:pb-20 overflow-hidden border-b border-slate-200/80 dark:border-slate-800/80 bg-gradient-to-b from-[#EBF5EF] via-[#F4F9F6] to-[#F8FAFC] dark:from-[#06120C] dark:via-[#040A14] dark:to-[#040810] text-slate-900 dark:text-white transition-colors duration-300">
      {/* Background scientific grid & ambient glow */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#052e16_1px,transparent_1px),linear-gradient(to_bottom,#052e16_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-10 dark:opacity-20 pointer-events-none" />
      <div className="absolute top-0 right-1/4 w-[600px] h-[400px] bg-emerald-500/10 dark:bg-emerald-500/15 rounded-full blur-3xl pointer-events-none -translate-y-1/2" />
      <div className="absolute bottom-0 left-10 w-[400px] h-[300px] bg-teal-500/10 dark:bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12 relative z-10 space-y-10 sm:space-y-12">
        {/* Top Header & Left-Aligned Academic Headline */}
        <div className="max-w-4xl space-y-5 text-left">
          {/* Eyebrow Pill Tag */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100/80 dark:bg-emerald-950/80 border border-emerald-300/80 dark:border-emerald-800/50 text-emerald-900 dark:text-[#34D399] text-xs font-semibold uppercase tracking-wider shadow-xs backdrop-blur-md">
            <FolderGit2 className="w-3.5 h-3.5 text-emerald-700 dark:text-[#34D399]" />
            <span>Funded Research &amp; Ecological Initiatives</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white font-[family-name:var(--font-manrope)] leading-[1.12]">
            Scientific Research Grants &amp; <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-emerald-800 via-teal-700 to-emerald-600 dark:from-emerald-300 dark:via-[#34D399] dark:to-teal-200 bg-clip-text text-transparent">
              Field Projects.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-slate-700 dark:text-slate-300 font-normal leading-relaxed max-w-3xl font-[family-name:var(--font-inter)]">
            Science-led ecological investigations driving tangible ecotoxicological data, multi-matrix contaminant risk models, and translational environmental remediation frameworks.
          </p>
        </div>

        {/* Unified 4-Card Metric Grid matching Publications, News & Team */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 pt-2">
          {/* Card 1: Total Projects */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-3.5 sm:gap-4 hover:border-emerald-500/40 transition-all">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-900 dark:text-[#34D399] flex items-center justify-center shrink-0">
              <FolderGit2 className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.2]" />
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-[family-name:var(--font-manrope)]">
                {stats.totalProjects}
              </div>
              <div className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Total Projects
              </div>
            </div>
          </div>

          {/* Card 2: Active / Ongoing Projects */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-3.5 sm:gap-4 hover:border-emerald-500/40 transition-all">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-teal-100 dark:bg-teal-950/80 text-teal-900 dark:text-teal-300 flex items-center justify-center shrink-0">
              <Activity className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.2]" />
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-[family-name:var(--font-manrope)]">
                {stats.ongoingCount}
              </div>
              <div className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Active Initiatives
              </div>
            </div>
          </div>

          {/* Card 3: Completed Projects */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-3.5 sm:gap-4 hover:border-emerald-500/40 transition-all">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-blue-100 dark:bg-blue-950/80 text-blue-900 dark:text-blue-300 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.2]" />
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-[family-name:var(--font-manrope)]">
                {stats.completedCount}
              </div>
              <div className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Completed Studies
              </div>
            </div>
          </div>

          {/* Card 4: Partners & Sponsors */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-3.5 sm:gap-4 hover:border-emerald-500/40 transition-all">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-300 flex items-center justify-center shrink-0">
              <Building2 className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.2]" />
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-[family-name:var(--font-manrope)]">
                {stats.partnersCount}+
              </div>
              <div className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Partners &amp; Sponsors
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
