"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, UserCheck, ChevronLeft, ChevronRight } from "lucide-react";
import type { PersonItem } from "@/data/mock-homepage";
import { useLandingData } from "@/lib/landing-store";

interface FeaturedPeopleProps {
  people: PersonItem[];
}

export function FeaturedPeople({ people }: FeaturedPeopleProps) {
  const landingData = useLandingData();
  const scrollRef = React.useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = direction === "left" ? -380 : 380;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <section className="py-20 lg:py-28 bg-[#F4F8F5] dark:bg-[#0B1120] border-t border-slate-200/90 dark:border-slate-800 transition-colors duration-300">
      <div className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12 space-y-10 sm:space-y-14">
        
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-2 border-b border-slate-200/70 dark:border-slate-800">
          <div className="space-y-3 max-w-3xl text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200/80 dark:border-emerald-800/40 text-xs font-semibold uppercase tracking-wider text-emerald-800 dark:text-[#34D399] shadow-xs w-fit">
              <UserCheck className="w-3.5 h-3.5 text-[#10B981]" />
              <span>{landingData.peopleSection?.badge || "The People Behind The Science"}</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white font-[family-name:var(--font-manrope)]">
              {landingData.peopleSection?.title || "Meet the researchers."}
            </h2>

            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed font-normal font-[family-name:var(--font-inter)]">
              {landingData.peopleSection?.subtitle ||
                "Interdisciplinary toxicologists, analytical chemists, and data scientists collaborating to unravel environmental contamination pathways and protect ecosystem health."}
            </p>
          </div>

          <div className="flex items-center gap-4 flex-shrink-0 self-start lg:self-end">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => scroll("left")}
                className="w-10 h-10 rounded-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0F172A] text-slate-700 dark:text-slate-200 hover:bg-[#14532D] hover:text-white dark:hover:bg-[#10B981] dark:hover:text-slate-900 transition-all flex items-center justify-center shadow-xs active:scale-95 cursor-pointer"
                aria-label="Previous researchers"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={() => scroll("right")}
                className="w-10 h-10 rounded-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0F172A] text-slate-700 dark:text-slate-200 hover:bg-[#14532D] hover:text-white dark:hover:bg-[#10B981] dark:hover:text-slate-900 transition-all flex items-center justify-center shadow-xs active:scale-95 cursor-pointer"
                aria-label="Next researchers"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            <Link
              href="/team"
              className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-[#14532D] hover:bg-[#166534] dark:bg-[#10B981] dark:hover:bg-[#34D399] text-white dark:text-slate-900 text-xs sm:text-[13px] font-bold uppercase tracking-wider transition-all shadow-md active:scale-95"
            >
              <span>View Full Team</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </Link>
          </div>
        </div>

        {/* Horizontal People Cards Track */}
        <div className="relative">
          <div
            ref={scrollRef}
            className="flex items-stretch gap-6 sm:gap-8 overflow-x-auto scrollbar-none py-2 snap-x snap-mandatory scroll-smooth"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {people.map((person) => (
              <Link
                key={person.id}
                href={`/team/${person.slug}`}
                className="flex-shrink-0 w-[280px] sm:w-[320px] md:w-[360px] group/card rounded-3xl bg-white dark:bg-[#0F172A] border border-slate-200/90 dark:border-slate-800 shadow-sm hover:shadow-2xl hover:shadow-black/20 hover:border-[#10B981] dark:hover:border-[#10B981] transition-all duration-300 flex flex-col justify-between overflow-hidden hover:-translate-y-2 snap-start"
              >
                <div>
                  <div className="relative aspect-[4/3.8] overflow-hidden bg-slate-900">
                    <img
                      src={person.imageSrc}
                      alt={person.name}
                      className="w-full h-full object-cover object-top group-hover/card:scale-105 transition-transform duration-700 filter brightness-[0.96] contrast-[1.03]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 pointer-events-none" />

                    <div className="absolute top-3 right-3 z-10">
                      <span className="px-3 py-1 rounded-full bg-black/75 backdrop-blur-md text-white text-[11px] font-semibold border border-white/20 shadow">
                        {person.category}
                      </span>
                    </div>
                  </div>

                  <div className="relative -mt-4 z-10 w-full overflow-hidden leading-none pointer-events-none">
                    <svg
                      className="w-full h-5 text-white dark:text-[#0F172A] transition-colors"
                      viewBox="0 0 100 25"
                      preserveAspectRatio="none"
                    >
                      <path
                        d="M0,8 C25,22 65,-4 100,12 L100,25 L0,25 Z"
                        fill="currentColor"
                      />
                    </svg>
                  </div>

                  <div className="p-5 sm:p-6 pt-1 space-y-3.5 text-left">
                    <div className="space-y-1">
                      <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight font-[family-name:var(--font-manrope)] group-hover/card:text-[#059669] dark:group-hover/card:text-[#34D399] transition-colors leading-snug">
                        {person.name}
                      </h3>
                      <p className="text-xs sm:text-[13px] text-[#047857] dark:text-[#34D399] font-semibold leading-snug">
                        {person.role}
                      </p>
                    </div>

                    <div className="pt-1 flex flex-wrap gap-1.5">
                      {person.researchInterests.map((interest) => (
                        <span
                          key={interest}
                          className="text-xs font-medium text-emerald-950 dark:text-emerald-200 px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200/80 dark:border-emerald-800/40"
                        >
                          {interest}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-5 sm:p-6 pt-0">
                  <div className="pt-3.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-[#14532D] dark:text-[#34D399]">
                    <span className="group-hover/card:translate-x-0.5 transition-transform">
                      View Academic Profile
                    </span>
                    <div className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 group-hover/card:bg-[#14532D] group-hover/card:text-white dark:group-hover/card:bg-[#10B981] dark:group-hover/card:text-black flex items-center justify-center transition-colors">
                      <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
