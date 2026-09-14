"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, ExternalLink, ChevronLeft, ChevronRight } from "lucide-react";
import type { PublicationItem } from "@/data/mock-homepage";
import { useLandingData } from "@/lib/landing-store";

interface FeaturedPublicationsProps {
  publications: PublicationItem[];
}

export function FeaturedPublications({ publications }: FeaturedPublicationsProps) {
  const landingData = useLandingData();
  const scrollRef = React.useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = direction === "left" ? -460 : 460;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <section className="py-20 lg:py-28 bg-[#F4F8F5] dark:bg-[#0B1120] border-y border-slate-200/80 dark:border-slate-800 transition-colors duration-300 relative overflow-hidden">
      <div className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12 relative z-10 space-y-10 sm:space-y-12">
        
        {/* Section Header with Left/Right Controls & View All Link */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div className="flex flex-col space-y-3 max-w-2xl text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200/80 dark:border-emerald-800/40 text-xs font-semibold uppercase tracking-wider text-emerald-800 dark:text-[#34D399] w-fit">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
              <span>{landingData.publicationsSection?.badge || "Selected Research"}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white font-[family-name:var(--font-manrope)] leading-tight">
              {landingData.publicationsSection?.title || "Our research, published."}
            </h2>
            {landingData.publicationsSection?.subtitle && (
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-xl font-[family-name:var(--font-inter)]">
                {landingData.publicationsSection.subtitle}
              </p>
            )}
          </div>

          <div className="flex items-center gap-4 flex-shrink-0">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => scroll("left")}
                className="w-10 h-10 rounded-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0F172A] text-slate-700 dark:text-slate-200 hover:bg-[#14532D] hover:text-white dark:hover:bg-[#10B981] dark:hover:text-slate-900 transition-all flex items-center justify-center shadow-xs active:scale-95 cursor-pointer"
                aria-label="Previous publications"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={() => scroll("right")}
                className="w-10 h-10 rounded-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0F172A] text-slate-700 dark:text-slate-200 hover:bg-[#14532D] hover:text-white dark:hover:bg-[#10B981] dark:hover:text-slate-900 transition-all flex items-center justify-center shadow-xs active:scale-95 cursor-pointer"
                aria-label="Next publications"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            <Link
              href="/publications"
              className="inline-flex items-center gap-2 text-xs font-semibold text-[#14532D] dark:text-[#34D399] uppercase tracking-wider hover:underline ml-2"
            >
              <span>View All</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </Link>
          </div>
        </div>

        {/* Publication Cards Carousel */}
        <div className="relative">
          <div
            ref={scrollRef}
            className="flex items-stretch gap-6 overflow-x-auto scrollbar-none py-2 snap-x snap-mandatory scroll-smooth"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {publications.map((pub) => (
              <div
                key={pub.id}
                className="flex-shrink-0 w-[300px] sm:w-[380px] md:w-[440px] lg:w-[480px] p-7 sm:p-8 rounded-3xl bg-white dark:bg-[#0F172A] border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-6 hover:border-[#14532D] dark:hover:border-[#10B981] hover:shadow-md transition-all group/card snap-start text-left"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#059669] dark:text-[#34D399] font-semibold">
                      {pub.year} · {pub.type}
                    </span>
                    <span className="px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/80 text-xs font-semibold text-emerald-800 dark:text-[#34D399] border border-emerald-200/80 dark:border-emerald-800/40">
                      {pub.researchArea}
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg md:text-xl font-bold text-slate-900 dark:text-white leading-snug tracking-tight font-[family-name:var(--font-manrope)] group-hover/card:text-[#14532D] dark:group-hover/card:text-[#34D399] transition-colors">
                    {pub.title}
                  </h3>

                  <p className="text-xs sm:text-[13px] text-slate-600 dark:text-slate-300 font-medium leading-relaxed font-[family-name:var(--font-inter)]">
                    {pub.authors.join(" · ")}
                  </p>

                  <p className="text-xs sm:text-[13px] italic text-[#14532D] dark:text-[#34D399] font-semibold">
                    {pub.journal}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                  <span className="truncate max-w-[200px]">DOI: {pub.doi}</span>
                  <a
                    href={`https://doi.org/${pub.doi}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 font-semibold text-[#14532D] dark:text-[#34D399] hover:underline flex-shrink-0"
                  >
                    <span>Read Article</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
