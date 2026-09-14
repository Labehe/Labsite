"use client";

import React from "react";
import { ProjectResearchArea, ProjectFilterParams } from "@/lib/projects/types";
import { RotateCcw, Filter, Check, Layers, Calendar, CheckSquare } from "lucide-react";

interface ProjectFiltersProps {
  researchAreas: ProjectResearchArea[];
  filters: ProjectFilterParams;
  onFilterChange: (newFilters: Partial<ProjectFilterParams>) => void;
  onReset: () => void;
  availableYears: string[];
}

export function ProjectFilters({
  researchAreas,
  filters,
  onFilterChange,
  onReset,
  availableYears,
}: ProjectFiltersProps) {
  // Parse multi-select comma-separated arrays
  const selectedAreas =
    filters.area && filters.area !== "all"
      ? filters.area.split(",").map((s) => s.trim()).filter(Boolean)
      : [];

  const selectedStatuses =
    filters.status && filters.status !== "all"
      ? filters.status.split(",").map((s) => s.trim().toLowerCase()).filter(Boolean)
      : [];

  const selectedYears =
    filters.year && filters.year !== "all"
      ? filters.year.split(",").map((s) => s.trim()).filter(Boolean)
      : [];

  const isAllAreas = selectedAreas.length === 0;
  const isAllStatuses = selectedStatuses.length === 0;
  const isAllYears = selectedYears.length === 0;

  const statusOptions = [
    { value: "ongoing", label: "Ongoing Grants", dot: "bg-blue-500" },
    { value: "completed", label: "Completed Studies", dot: "bg-emerald-500" },
    { value: "archived", label: "Archived Grants", dot: "bg-slate-400" },
  ];

  // Toggle handlers for multi-selection
  const toggleArea = (slugOrId: string) => {
    let next: string[];
    if (selectedAreas.includes(slugOrId)) {
      next = selectedAreas.filter((s) => s !== slugOrId);
    } else {
      next = [...selectedAreas, slugOrId];
    }
    onFilterChange({ area: next.length === 0 ? "all" : next.join(",") });
  };

  const toggleStatus = (val: string) => {
    let next: string[];
    if (selectedStatuses.includes(val)) {
      next = selectedStatuses.filter((s) => s !== val);
    } else {
      next = [...selectedStatuses, val];
    }
    onFilterChange({ status: next.length === 0 ? "all" : next.join(",") });
  };

  const toggleYear = (yr: string) => {
    let next: string[];
    if (selectedYears.includes(yr)) {
      next = selectedYears.filter((y) => y !== yr);
    } else {
      next = [...selectedYears, yr];
    }
    onFilterChange({ year: next.length === 0 ? "all" : next.join(",") });
  };

  const hasActiveFilters =
    !isAllAreas ||
    !isAllStatuses ||
    !isAllYears ||
    Boolean(filters.search && filters.search.trim() !== "");

  return (
    <div className="space-y-6">
      {/* Sidebar Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200/80 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
          <h2 className="text-xs uppercase tracking-wider font-bold text-slate-900 dark:text-white">
            Filter Archive
          </h2>
        </div>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-1.5 text-xs text-emerald-700 dark:text-emerald-400 hover:text-emerald-900 dark:hover:text-emerald-300 font-semibold transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* 1. Research Disciplines Checkbox Filter */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" />
            <span>Research Discipline</span>
          </div>
          {selectedAreas.length > 0 && (
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 font-bold border border-emerald-300/60 dark:border-emerald-800/60">
              {selectedAreas.length} selected
            </span>
          )}
        </div>

        <div className="space-y-1">
          {/* All Disciplines Checkbox */}
          <button
            type="button"
            onClick={() => onFilterChange({ area: "all" })}
            className={`w-full px-3 py-2 rounded-xl text-xs text-left flex items-center justify-between transition-all duration-200 cursor-pointer select-none ${
              isAllAreas
                ? "bg-emerald-50/90 dark:bg-emerald-950/60 text-[#14532D] dark:text-emerald-300 font-semibold border border-emerald-200/80 dark:border-emerald-800/60"
                : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/50 border border-transparent"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <div
                className={`w-4 h-4 rounded-md border flex items-center justify-center shrink-0 transition-all ${
                  isAllAreas
                    ? "bg-[#14532D] dark:bg-emerald-600 border-[#14532D] text-white shadow-xs"
                    : "border-slate-300 dark:border-slate-700 bg-white dark:bg-[#090D16]"
                }`}
              >
                {isAllAreas && <Check className="w-3 h-3 stroke-[3]" />}
              </div>
              <span>All Disciplines</span>
            </div>
          </button>

          {/* Dynamic Area Checkboxes */}
          {researchAreas.map((area) => {
            const isChecked = selectedAreas.includes(area.slug) || selectedAreas.includes(area.id);
            return (
              <button
                key={area.id}
                type="button"
                onClick={() => toggleArea(area.slug)}
                className={`w-full px-3 py-2 rounded-xl text-xs text-left flex items-center justify-between transition-all duration-200 cursor-pointer select-none ${
                  isChecked
                    ? "bg-emerald-50/90 dark:bg-emerald-950/60 text-[#14532D] dark:text-emerald-300 font-semibold border border-emerald-200/80 dark:border-emerald-800/60"
                    : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/50 border border-transparent"
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0 pr-1">
                  <div
                    className={`w-4 h-4 rounded-md border flex items-center justify-center shrink-0 transition-all ${
                      isChecked
                        ? "bg-[#14532D] dark:bg-emerald-600 border-[#14532D] text-white shadow-xs"
                        : "border-slate-300 dark:border-slate-700 bg-white dark:bg-[#090D16]"
                    }`}
                  >
                    {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                  <span className="truncate">{area.title}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Project Status Checkbox Filter */}
      <div className="space-y-3 pt-5 border-t border-slate-200/80 dark:border-slate-800">
        <div className="flex items-center justify-between">
          <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <CheckSquare className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" />
            <span>Project Status</span>
          </div>
          {selectedStatuses.length > 0 && (
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 font-bold border border-emerald-300/60 dark:border-emerald-800/60">
              {selectedStatuses.length} selected
            </span>
          )}
        </div>

        <div className="space-y-1">
          {/* All Statuses Checkbox */}
          <button
            type="button"
            onClick={() => onFilterChange({ status: "all" })}
            className={`w-full px-3 py-2 rounded-xl text-xs text-left flex items-center justify-between transition-all duration-200 cursor-pointer select-none ${
              isAllStatuses
                ? "bg-emerald-50/90 dark:bg-emerald-950/60 text-[#14532D] dark:text-emerald-300 font-semibold border border-emerald-200/80 dark:border-emerald-800/60"
                : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/50 border border-transparent"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <div
                className={`w-4 h-4 rounded-md border flex items-center justify-center shrink-0 transition-all ${
                  isAllStatuses
                    ? "bg-[#14532D] dark:bg-emerald-600 border-[#14532D] text-white shadow-xs"
                    : "border-slate-300 dark:border-slate-700 bg-white dark:bg-[#090D16]"
                }`}
              >
                {isAllStatuses && <Check className="w-3 h-3 stroke-[3]" />}
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-slate-400" />
                <span>All Statuses</span>
              </div>
            </div>
          </button>

          {/* Status Checkboxes */}
          {statusOptions.map((opt) => {
            const isChecked = selectedStatuses.includes(opt.value);
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => toggleStatus(opt.value)}
                className={`w-full px-3 py-2 rounded-xl text-xs text-left flex items-center justify-between transition-all duration-200 cursor-pointer select-none ${
                  isChecked
                    ? "bg-emerald-50/90 dark:bg-emerald-950/60 text-[#14532D] dark:text-emerald-300 font-semibold border border-emerald-200/80 dark:border-emerald-800/60"
                    : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/50 border border-transparent"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-4 h-4 rounded-md border flex items-center justify-center shrink-0 transition-all ${
                      isChecked
                        ? "bg-[#14532D] dark:bg-emerald-600 border-[#14532D] text-white shadow-xs"
                        : "border-slate-300 dark:border-slate-700 bg-white dark:bg-[#090D16]"
                    }`}
                  >
                    {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${opt.dot}`} />
                    <span>{opt.label}</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Project Year (Multi-Select Box Grid with Single Years) */}
      {availableYears.length > 0 && (
        <div className="space-y-3 pt-5 border-t border-slate-200/80 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" />
              <span>Project Year</span>
            </div>
            {selectedYears.length > 0 && (
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 font-bold border border-emerald-300/60 dark:border-emerald-800/60">
                {selectedYears.length} selected
              </span>
            )}
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 gap-1.5">
            {/* All Years Box */}
            <button
              type="button"
              onClick={() => onFilterChange({ year: "all" })}
              className={`py-2 px-2.5 rounded-xl text-xs font-semibold text-center transition-all duration-200 cursor-pointer border select-none ${
                isAllYears
                  ? "bg-[#14532D] dark:bg-emerald-600 text-white border-[#14532D] shadow-xs"
                  : "bg-slate-50 dark:bg-[#090D16] border-slate-200/80 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-emerald-500 hover:bg-emerald-50/50 dark:hover:bg-slate-800/60"
              }`}
            >
              All
            </button>

            {/* Individual Single Year Boxes */}
            {availableYears.map((yr) => {
              const isChecked = selectedYears.includes(yr);
              return (
                <button
                  key={yr}
                  type="button"
                  onClick={() => toggleYear(yr)}
                  className={`py-2 px-2.5 rounded-xl text-xs font-semibold text-center transition-all duration-200 cursor-pointer border select-none ${
                    isChecked
                      ? "bg-[#14532D] dark:bg-emerald-600 text-white border-[#14532D] shadow-xs scale-[1.02]"
                      : "bg-slate-50 dark:bg-[#090D16] border-slate-200/80 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-emerald-500 hover:bg-emerald-50/50 dark:hover:bg-slate-800/60"
                  }`}
                >
                  {yr}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
