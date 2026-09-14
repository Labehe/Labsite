import React from "react";
import { FolderSearch, RotateCcw, Sparkles } from "lucide-react";

interface ProjectEmptyStateProps {
  onReset: () => void;
}

export function ProjectEmptyState({ onReset }: ProjectEmptyStateProps) {
  return (
    <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-[#0F172A]/90 backdrop-blur-md p-12 sm:p-16 text-center space-y-6 shadow-sm">
      <div className="w-16 h-16 rounded-2xl bg-[#14532D]/10 dark:bg-emerald-500/20 text-[#14532D] dark:text-emerald-400 mx-auto flex items-center justify-center shadow-inner">
        <FolderSearch className="w-8 h-8 stroke-[1.8]" />
      </div>

      <div className="space-y-2 max-w-md mx-auto">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white font-[family-name:var(--font-manrope)] tracking-tight">
          No research projects found
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-[family-name:var(--font-inter)] leading-relaxed">
          We couldn&apos;t find any funded research grants or projects matching your active search keywords or filter criteria.
        </p>
      </div>

      <div className="pt-2">
        <button
          onClick={onReset}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl text-xs font-semibold bg-[#14532D] text-white hover:bg-[#064E3B] transition-all shadow-md hover:shadow-lg active:scale-95 cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Reset All Filters &amp; Search</span>
        </button>
      </div>
    </div>
  );
}
