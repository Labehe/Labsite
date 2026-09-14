import React from "react";

export function ProjectSkeleton() {
  return (
    <div className="space-y-6">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#0F172A] p-6 sm:p-8 animate-pulse shadow-sm"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center justify-between pb-3.5 border-b border-slate-100 dark:border-slate-800/80">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-6 bg-slate-200 dark:bg-slate-800 rounded-lg" />
                  <div className="w-24 h-6 bg-slate-200 dark:bg-slate-800 rounded-full" />
                  <div className="w-20 h-6 bg-slate-200 dark:bg-slate-800 rounded-lg" />
                </div>
                <div className="w-20 h-6 bg-slate-200 dark:bg-slate-800 rounded-full" />
              </div>

              <div className="space-y-2">
                <div className="w-4/5 h-7 bg-slate-200 dark:bg-slate-800 rounded-xl" />
                <div className="w-3/5 h-7 bg-slate-200 dark:bg-slate-800 rounded-xl" />
              </div>

              <div className="space-y-2 pt-1">
                <div className="w-full h-4 bg-slate-200 dark:bg-slate-800 rounded-lg" />
                <div className="w-5/6 h-4 bg-slate-200 dark:bg-slate-800 rounded-lg" />
              </div>

              <div className="flex gap-2 pt-2">
                <div className="w-32 h-6 bg-slate-200 dark:bg-slate-800 rounded-lg" />
                <div className="w-28 h-6 bg-slate-200 dark:bg-slate-800 rounded-lg" />
              </div>

              <div className="pt-3.5 border-t border-slate-100 dark:border-slate-800/80 flex justify-between items-center">
                <div className="w-48 h-4 bg-slate-200 dark:bg-slate-800 rounded-lg" />
                <div className="w-28 h-4 bg-slate-200 dark:bg-slate-800 rounded-lg" />
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="aspect-[16/11] bg-slate-200 dark:bg-slate-800 rounded-2xl" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
