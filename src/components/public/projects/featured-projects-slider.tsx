"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ProjectWithRelations } from "@/lib/projects/types";
import {
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  MapPin,
  Users,
  Calendar,
  Sparkles,
  FlaskConical,
  Award
} from "lucide-react";

interface FeaturedProjectsSliderProps {
  projects: ProjectWithRelations[];
}

export function FeaturedProjectsSlider({ projects }: FeaturedProjectsSliderProps) {
  // Get featured projects (or top 3 if none flagged)
  const featuredList = projects.filter((p) => p.is_featured);
  const displayProjects = featuredList.length > 0 ? featuredList : projects.slice(0, 4);

  const [currentIndex, setCurrentIndex] = useState(0);

  if (displayProjects.length === 0) return null;

  const currentProject = displayProjects[currentIndex];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? displayProjects.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === displayProjects.length - 1 ? 0 : prev + 1));
  };

  const fallbackImage = "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80";
  const imageSrc = currentProject.hero_image || currentProject.featured_image || fallbackImage;

  return (
    <section className="py-14 md:py-20 bg-[var(--bg-page)] relative overflow-hidden">
      {/* Subtle ambient lighting */}
      <div className="absolute top-1/2 -left-48 -translate-y-1/2 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -right-48 -translate-y-1/2 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12 space-y-8 relative z-10">
        {/* Section Header with Refined Luxury Typography */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-2 border-b border-slate-200/60 dark:border-slate-800">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold tracking-wider uppercase text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/80 dark:border-emerald-800/60">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Flagship Research Spotlight</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight font-[family-name:var(--font-manrope)]">
              Featured Projects
            </h2>
          </div>

          {/* Quick Counter & Nav Controls */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Project <strong className="text-slate-900 dark:text-white">{currentIndex + 1}</strong> of {displayProjects.length}
            </span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={handlePrev}
                aria-label="Previous Featured Project"
                className="w-9 h-9 rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A] text-slate-700 dark:text-white hover:bg-emerald-50 dark:hover:bg-slate-800 hover:text-emerald-700 transition flex items-center justify-center shadow-xs active:scale-95 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleNext}
                aria-label="Next Featured Project"
                className="w-9 h-9 rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A] text-slate-700 dark:text-white hover:bg-emerald-50 dark:hover:bg-slate-800 hover:text-emerald-700 transition flex items-center justify-center shadow-xs active:scale-95 cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Carousel Showcase Card */}
        <div className="relative">
          <div className="rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#0F172A] p-6 sm:p-8 md:p-10 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.06)] dark:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.5)] transition-all duration-500">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
              
              {/* Left Column: Image + Focus Areas */}
              <div className="lg:col-span-6 space-y-5">
                <Link href={`/projects/${currentProject.slug}`} className="block group/img">
                  <div className="relative aspect-[16/10] rounded-2xl overflow-hidden border border-slate-200/80 dark:border-slate-800 bg-slate-900 shadow-md">
                    <Image
                      src={imageSrc}
                      alt={currentProject.image_alt || currentProject.title}
                      fill
                      className="object-cover group-hover/img:scale-105 transition-transform duration-700 ease-out"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-40 group-hover/img:opacity-20 transition-opacity" />

                    {/* Floating Status Badge over Image */}
                    <div className="absolute top-3.5 left-3.5">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase shadow-md backdrop-blur-md ${
                          currentProject.status === "ongoing"
                            ? "bg-blue-900/80 text-blue-200 border border-blue-400/30"
                            : "bg-emerald-900/80 text-emerald-200 border border-emerald-400/30"
                        }`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                        <span>{currentProject.status}</span>
                      </span>
                    </div>
                  </div>
                </Link>

                {/* Focus Area Tags below Image */}
                <div className="space-y-2">
                  <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                    <FlaskConical className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span>Research Focus Areas:</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {currentProject.research_areas && currentProject.research_areas.length > 0 ? (
                      currentProject.research_areas.map((ra) => (
                        <span
                          key={ra.id}
                          className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-200 border border-emerald-200/80 dark:border-emerald-800/60"
                        >
                          {ra.title}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-slate-400 italic">
                        Ecotoxicology &amp; Environmental Health
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column: Editorial Title, Narrative, Metadata & Luxury CTA */}
              <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
                
                {/* Meta Header Bar */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800/80">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-[#090D16] px-3.5 py-1.5 rounded-full border border-slate-200/60 dark:border-slate-800">
                    <Calendar className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span>{currentProject.year || "2025 — 2027"}</span>
                  </div>

                  {currentProject.funding_org && (
                    <div className="flex items-center gap-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-[#090D16] px-3.5 py-1.5 rounded-full border border-slate-200/60 dark:border-slate-800 truncate max-w-[240px]">
                      <Award className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      <span className="truncate">{currentProject.funding_org}</span>
                    </div>
                  )}
                </div>

                {/* Project Headline Title */}
                <div className="space-y-3">
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white font-[family-name:var(--font-manrope)] leading-tight tracking-tight hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors">
                    <Link href={`/projects/${currentProject.slug}`}>
                      {currentProject.title}
                    </Link>
                  </h3>

                  {/* Summary Text */}
                  <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed font-[family-name:var(--font-inter)] line-clamp-3">
                    {currentProject.short_description}
                  </p>
                </div>

                {/* Investigators & Geographic Matrix */}
                <div className="space-y-2.5 pt-3 border-t border-slate-100 dark:border-slate-800/80 text-xs">
                  <div className="flex items-start gap-2.5 text-slate-600 dark:text-slate-300">
                    <Users className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-slate-900 dark:text-white mr-1.5">
                        Lead Investigators:
                      </span>
                      <span>
                        {currentProject.researchers && currentProject.researchers.length > 0
                          ? currentProject.researchers.map((r) => r.name).join(", ")
                          : "Dr. Elena Vance, Sojib Chowdhury & Fellows"}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 text-slate-600 dark:text-slate-300">
                    <MapPin className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-slate-900 dark:text-white mr-1.5">
                        Study Area:
                      </span>
                      <span>
                        {currentProject.study_area || "Meghna Estuary & Industrial Catchment Transects"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action CTA Button */}
                <div className="pt-2 flex justify-end">
                  <Link
                    href={`/projects/${currentProject.slug}`}
                    className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-[#0F5132] via-[#14532D] to-[#047857] hover:from-[#14532D] hover:to-[#065F46] text-white shadow-lg shadow-emerald-950/15 hover:shadow-emerald-950/25 hover:scale-[1.02] active:scale-[0.98] transition-all group/btn"
                  >
                    <span>View Project Details</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Left Navigation Arrow */}
          <button
            onClick={handlePrev}
            aria-label="Previous Featured Project"
            className="absolute -left-3 sm:-left-5 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full border border-slate-200/90 dark:border-slate-700 bg-white/95 dark:bg-[#0F172A]/95 backdrop-blur-md text-slate-800 dark:text-white hover:bg-[#14532D] hover:text-white hover:border-[#14532D] transition-all shadow-xl flex items-center justify-center active:scale-95 cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Right Navigation Arrow */}
          <button
            onClick={handleNext}
            aria-label="Next Featured Project"
            className="absolute -right-3 sm:-right-5 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full border border-slate-200/90 dark:border-slate-700 bg-white/95 dark:bg-[#0F172A]/95 backdrop-blur-md text-slate-800 dark:text-white hover:bg-[#14532D] hover:text-white hover:border-[#14532D] transition-all shadow-xl flex items-center justify-center active:scale-95 cursor-pointer"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Carousel Dot Indicators */}
        <div className="flex items-center justify-center gap-2 pt-2">
          {displayProjects.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                currentIndex === idx
                  ? "w-8 bg-[#14532D] dark:bg-emerald-400"
                  : "w-2 bg-slate-300 dark:bg-slate-700 hover:bg-slate-400"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
