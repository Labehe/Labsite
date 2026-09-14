import React from "react";
import { ProjectWithRelations } from "@/lib/projects/types";
import { ProjectCard } from "./project-card";
import { RefreshCw, Sparkles } from "lucide-react";

interface ProjectListProps {
  projects: ProjectWithRelations[];
  hasRealtimeUpdate?: boolean;
  onRefresh?: () => void;
}

export function ProjectList({ projects, hasRealtimeUpdate, onRefresh }: ProjectListProps) {
  return (
    <div className="space-y-6">
      {/* Realtime Notification Banner if Remote Changes arrive */}
      {hasRealtimeUpdate && (
        <div className="p-3.5 rounded-xl border border-emerald-300 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-between gap-3 text-xs animate-in fade-in duration-300 shadow-sm">
          <div className="flex items-center gap-2 text-emerald-900 dark:text-emerald-200">
            <Sparkles className="w-4 h-4 text-emerald-600 animate-spin" />
            <span className="font-semibold">
              Research project updates available from the laboratory database.
            </span>
          </div>
          {onRefresh && (
            <button
              onClick={onRefresh}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold bg-emerald-600 text-white hover:bg-emerald-700 transition active:scale-95 shrink-0"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Update View</span>
            </button>
          )}
        </div>
      )}

      {/* Results Count Header */}
      <div className="flex items-center justify-between text-xs font-mono text-[var(--text-muted)] pb-2 border-b border-[var(--border-subtle)]">
        <div>
          Showing <strong className="text-[var(--text-main)]">{projects.length}</strong> research{" "}
          {projects.length === 1 ? "project" : "projects"}
        </div>
        <div>Indexed &amp; Verified Research Archive</div>
      </div>

      {/* Project Cards Stack */}
      <div className="space-y-6">
        {projects.map((proj, idx) => (
          <ProjectCard key={proj.id} project={proj} index={idx} />
        ))}
      </div>
    </div>
  );
}
