"use client";

import * as React from "react";
import { TeamMember, TeamCategory } from "@/lib/team/types";
import { TEAM_CATEGORIES_META } from "@/lib/team/seed-data";
import { TeamMemberCard } from "./team-member-card";
import { ChevronLeft, ChevronRight, GraduationCap, BookOpen, Layers, Sparkles, Award } from "lucide-react";

interface TeamCarouselRowProps {
  id: string;
  category: TeamCategory;
  members: TeamMember[];
  onSelectMember: (member: TeamMember) => void;
}

export function TeamCarouselRow({
  id,
  category,
  members,
  onSelectMember,
}: TeamCarouselRowProps) {
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = React.useState(false);
  const [canScrollRight, setCanScrollRight] = React.useState(false);

  const meta = TEAM_CATEGORIES_META[category] || {
    label: category,
    description: "",
  };

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10);
    }
  };

  React.useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, [members]);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = direction === "left" ? -340 : 340;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
      setTimeout(checkScroll, 350);
    }
  };

  const getCategoryIcon = () => {
    switch (category) {
      case "undergraduate":
        return <GraduationCap className="w-5 h-5 text-indigo-500" />;
      case "graduate":
        return <BookOpen className="w-5 h-5 text-cyan-500" />;
      case "phd":
        return <Layers className="w-5 h-5 text-teal-500" />;
      case "alumni":
        return <Sparkles className="w-5 h-5 text-amber-500" />;
      default:
        return <Award className="w-5 h-5 text-emerald-500" />;
    }
  };

  if (members.length === 0) return null;

  return (
    <div id={id} className="scroll-mt-24 space-y-5">
      {/* Category Subheader with Navigation Chevrons */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-3 border-b border-slate-200 dark:border-slate-800">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-slate-100 dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800">
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

        {/* Counter & Scroll Buttons */}
        <div className="flex items-center gap-3 self-start sm:self-end">
          <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-[#0F172A] text-slate-700 dark:text-slate-300 text-xs font-bold border border-slate-200 dark:border-slate-800">
            {members.length} {members.length === 1 ? "Member" : "Members"}
          </span>

          {/* Left/Right Buttons */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => scroll("left")}
              disabled={!canScrollLeft}
              className={`p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0F172A] text-slate-700 dark:text-slate-200 transition shadow-xs cursor-pointer ${!canScrollLeft
                  ? "opacity-35 cursor-not-allowed"
                  : "hover:bg-emerald-500 hover:text-slate-950 hover:border-emerald-500 active:scale-95"
                }`}
              title="Previous researchers"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => scroll("right")}
              disabled={!canScrollRight}
              className={`p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0F172A] text-slate-700 dark:text-slate-200 transition shadow-xs cursor-pointer ${!canScrollRight
                  ? "opacity-35 cursor-not-allowed"
                  : "hover:bg-emerald-500 hover:text-slate-950 hover:border-emerald-500 active:scale-95"
                }`}
              title="Next researchers"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 4 Cards Per Row / Horizontal Scroll Track */}
      <div className="relative">
        <div
          ref={scrollRef}
          onScroll={checkScroll}
          className="flex items-stretch gap-5 overflow-x-auto scrollbar-none py-2 snap-x snap-mandatory scroll-smooth"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {members.map((member) => (
            <div
              key={member.id}
              className="shrink-0 w-[280px] sm:w-[320px] md:w-[340px] lg:w-[calc(25%-15px)] snap-start"
            >
              <TeamMemberCard
                member={member}
                onSelect={onSelectMember}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
