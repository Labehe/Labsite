"use client";

import * as React from "react";
import { Users, Award, GraduationCap, Sparkles, BookOpen, Search, Layers } from "lucide-react";

interface TeamHeroProps {
  totalCount: number;
  piCount: number;
  undergradCount: number;
  gradCount: number;
  phdCount: number;
  alumniCount: number;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  activeFilter: string;
  onFilterChange: (cat: string) => void;
}

export function TeamHero({
  totalCount,
  undergradCount,
  gradCount,
  phdCount,
  alumniCount,
  searchQuery,
  onSearchChange,
  activeFilter,
  onFilterChange,
}: TeamHeroProps) {
  const jumpToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#F0FDF4]/70 via-white to-white dark:from-[#060913] dark:via-[#0B1120] dark:to-[#060913] text-slate-900 dark:text-white pt-28 pb-14 lg:pt-36 lg:pb-20 border-b border-slate-200 dark:border-slate-800">
      {/* Background glow & scientific grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#052e16_1px,transparent_1px),linear-gradient(to_bottom,#052e16_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-10 dark:opacity-20 pointer-events-none" />
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12 relative z-10 space-y-8">
        
        {/* Top Kicker & Headline */}
        <div className="max-w-4xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-xs font-semibold uppercase tracking-wider backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
            <span>Research Group &amp; Leadership • Jahangirnagar University</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white font-[family-name:var(--font-manrope)] leading-[1.1]">
            The Scientific Minds Behind Our Discoveries.
          </h1>

          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal max-w-3xl">
            Meet our interdisciplinary collective of toxicologists, analytical chemists, computational modelers, graduate scholars, undergraduate trainees, and accomplished alumni dedicated to safeguarding ecosystem and human health.
          </p>
        </div>

        {/* Live Metrics Row (Standard Clean Cards) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 pt-2">
          <div className="p-4 rounded-2xl bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-medium mb-1">
              <span>All Members</span>
              <Users className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-[family-name:var(--font-manrope)]">
              {totalCount}
            </div>
            <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-mono mt-0.5">Active &amp; Network</div>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-medium mb-1">
              <span>Undergraduates</span>
              <GraduationCap className="w-4 h-4 text-indigo-500" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-indigo-600 dark:text-indigo-400 font-[family-name:var(--font-manrope)]">
              {undergradCount}
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono mt-0.5">Senior Theses &amp; Interns</div>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-medium mb-1">
              <span>Graduate (M.Sc.)</span>
              <BookOpen className="w-4 h-4 text-cyan-500" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-cyan-600 dark:text-cyan-400 font-[family-name:var(--font-manrope)]">
              {gradCount}
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono mt-0.5">Master's Researchers</div>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-medium mb-1">
              <span>Postdoc &amp; PhD</span>
              <Layers className="w-4 h-4 text-teal-500" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-teal-600 dark:text-teal-400 font-[family-name:var(--font-manrope)]">
              {phdCount}
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono mt-0.5">Doctoral &amp; Postdocs</div>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 shadow-xs col-span-2 sm:col-span-1">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-medium mb-1">
              <span>Alumni Network</span>
              <Sparkles className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-amber-600 dark:text-amber-400 font-[family-name:var(--font-manrope)]">
              {alumniCount}
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono mt-0.5">Global Destinations</div>
          </div>
        </div>

        {/* Quick Filter & Search Bar */}
        <div className="pt-2 flex flex-col md:flex-row md:items-center justify-between gap-4 border-t border-slate-200 dark:border-slate-800">
          
          {/* Filter Pills with user's requested order */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
            <button
              onClick={() => onFilterChange("all")}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                activeFilter === "all"
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                  : "bg-slate-100 dark:bg-[#0F172A] text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-[#1E293B] border border-slate-200 dark:border-slate-800"
              }`}
            >
              All Roles ({totalCount})
            </button>

            <button
              onClick={() => {
                onFilterChange("pi");
                jumpToSection("section-pi");
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                activeFilter === "pi"
                  ? "bg-emerald-600 text-white"
                  : "bg-slate-100 dark:bg-[#0F172A] text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-[#1E293B] border border-slate-200 dark:border-slate-800"
              }`}
            >
              Principal Investigator
            </button>

            <button
              onClick={() => {
                onFilterChange("undergraduate");
                jumpToSection("section-undergraduate");
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                activeFilter === "undergraduate"
                  ? "bg-indigo-600 text-white"
                  : "bg-slate-100 dark:bg-[#0F172A] text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-[#1E293B] border border-slate-200 dark:border-slate-800"
              }`}
            >
              Undergraduates ({undergradCount})
            </button>

            <button
              onClick={() => {
                onFilterChange("graduate");
                jumpToSection("section-graduate");
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                activeFilter === "graduate"
                  ? "bg-cyan-600 text-white"
                  : "bg-slate-100 dark:bg-[#0F172A] text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-[#1E293B] border border-slate-200 dark:border-slate-800"
              }`}
            >
              Graduate Members ({gradCount})
            </button>

            <button
              onClick={() => {
                onFilterChange("phd");
                jumpToSection("section-phd");
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                activeFilter === "phd"
                  ? "bg-teal-600 text-white"
                  : "bg-slate-100 dark:bg-[#0F172A] text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-[#1E293B] border border-slate-200 dark:border-slate-800"
              }`}
            >
              Postdoc &amp; PhD ({phdCount})
            </button>

            <button
              onClick={() => {
                onFilterChange("alumni");
                jumpToSection("section-alumni");
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                activeFilter === "alumni"
                  ? "bg-amber-600 text-white"
                  : "bg-slate-100 dark:bg-[#0F172A] text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-[#1E293B] border border-slate-200 dark:border-slate-800"
              }`}
            >
              Alumni Network ({alumniCount})
            </button>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-80 shrink-0">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search researchers by name, thesis, topic..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-white dark:bg-[#0F172A] border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>
        </div>

      </div>
    </section>
  );
}
