"use client";

import * as React from "react";
import { TeamMember, TeamCategory } from "@/lib/team/types";
import { TEAM_CATEGORIES_META } from "@/lib/team/seed-data";
import { TeamMemberCard } from "./team-member-card";
import { Award, BookOpen, GraduationCap, Sparkles } from "lucide-react";

interface TeamSectionBlockProps {
  id: string;
  category: TeamCategory;
  members: TeamMember[];
}

export function TeamSectionBlock({ id, category, members }: TeamSectionBlockProps) {
  if (members.length === 0) return null;

  const meta = TEAM_CATEGORIES_META[category] || {
    label: category,
    description: "",
  };

  const getCategoryIcon = () => {
    switch (category) {
      case "phd":
        return <Award className="w-5 h-5 text-teal-500" />;
      case "graduate":
        return <BookOpen className="w-5 h-5 text-cyan-500" />;
      case "undergraduate":
        return <GraduationCap className="w-5 h-5 text-indigo-500" />;
      case "alumni":
        return <Sparkles className="w-5 h-5 text-amber-500" />;
      default:
        return <Award className="w-5 h-5 text-emerald-500" />;
    }
  };

  return (
    <div id={id} className="scroll-mt-24 space-y-6">
      
      {/* Category Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-slate-200/80 dark:border-emerald-500/20">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-slate-100 dark:bg-[#04160B] border border-slate-200 dark:border-emerald-500/20">
              {getCategoryIcon()}
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white font-[family-name:var(--font-manrope)]">
                {meta.label}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                {meta.description}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-end">
          <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-emerald-500/10 text-slate-700 dark:text-emerald-400 text-xs font-bold border border-slate-200 dark:border-emerald-500/20">
            {members.length} {members.length === 1 ? "Member" : "Members"}
          </span>
        </div>
      </div>

      {/* Grid of Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
        {members.map((member) => (
          <TeamMemberCard key={member.id} member={member} />
        ))}
      </div>

    </div>
  );
}
