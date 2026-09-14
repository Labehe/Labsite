import React from "react";
import { ProjectStats as StatsType } from "@/lib/projects/types";

interface ProjectStatsProps {
  stats: StatsType;
}

export function ProjectStats({ stats }: ProjectStatsProps) {
  const statItems = [
    {
      value: `${stats.totalProjects}+`,
      label: "Total Projects",
      sub: "Funded research initiatives",
    },
    {
      value: stats.ongoingCount < 10 ? `0${stats.ongoingCount}` : `${stats.ongoingCount}`,
      label: "Ongoing Grants",
      sub: "Active field & lab studies",
      highlight: true,
    },
    {
      value: stats.completedCount < 10 ? `0${stats.completedCount}` : `${stats.completedCount}`,
      label: "Completed & Published",
      sub: "Peer-reviewed outcomes",
    },
    {
      value: `${stats.partnersCount}+`,
      label: "Research Partners",
      sub: "National & global sponsors",
    },
  ];

  return (
    <section className="border-b border-[var(--border-subtle)] bg-[var(--bg-surface)] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 divide-y md:divide-y-0 md:divide-x divide-[var(--border-subtle)]">
          {statItems.map((item, idx) => (
            <div
              key={item.label}
              className={`pt-4 md:pt-0 ${idx > 0 ? "md:pl-6" : ""} flex flex-col justify-center`}
            >
              <div className="flex items-baseline gap-2">
                <span className="text-3xl sm:text-4xl font-extrabold font-mono text-[var(--text-main)] tracking-tight">
                  {item.value}
                </span>
                {item.highlight && (
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                )}
              </div>
              <div className="text-sm font-semibold text-[var(--text-main)] mt-1 font-[family-name:var(--font-manrope)]">
                {item.label}
              </div>
              <div className="text-xs text-[var(--text-muted)] font-mono mt-0.5">
                {item.sub}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
