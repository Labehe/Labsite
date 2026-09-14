"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Clock,
  ShieldCheck,
  Search,
  Filter,
  RefreshCw,
  Download,
  CheckCircle2,
  FileText,
  FolderGit2,
  BookOpen,
  FlaskConical,
  Users,
  Image as ImageIcon,
  Layers,
  Settings,
  Key,
  Database,
  ArrowRight,
  ExternalLink,
  Activity,
  AlertCircle
} from "lucide-react";

interface ActivityEvent {
  id: string;
  type: "publications" | "projects" | "research" | "media" | "website" | "auth" | "system";
  action: "create" | "update" | "delete" | "sync" | "auth";
  title: string;
  description: string;
  user: string;
  timestamp: string;
  badge: string;
  badgeColor: string;
  resourceHref?: string;
}

const SAMPLE_ACTIVITIES: ActivityEvent[] = [
  {
    id: "act-1",
    type: "website",
    action: "update",
    title: "About Page Content Updated",
    description: "Modified full-canvas hero background cover and synchronized milestone timeline.",
    user: "admin@juniv.edu",
    timestamp: "Just now",
    badge: "About Manager",
    badgeColor: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    resourceHref: "/admin/about",
  },
  {
    id: "act-2",
    type: "publications",
    action: "create",
    title: "New Flagship Publication Synced",
    description: "Added 'Micro-FTIR spectral mapping of microplastics in Meghna river basin' (DOI: 10.1016/j.envpol.2026.114201).",
    user: "admin@juniv.edu",
    timestamp: "14 minutes ago",
    badge: "Publications",
    badgeColor: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    resourceHref: "/admin/publications",
  },
  {
    id: "act-3",
    type: "media",
    action: "create",
    title: "Laboratory Cleanroom Imagery Uploaded",
    description: "Uploaded high-resolution Orbitrap mass spectrometer cleanroom photo (4.2 MB).",
    user: "admin@juniv.edu",
    timestamp: "42 minutes ago",
    badge: "Media Library",
    badgeColor: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
    resourceHref: "/admin/media",
  },
  {
    id: "act-4",
    type: "projects",
    action: "update",
    title: "Flagship Delta Project Updated",
    description: "Updated funding status for 'Ganges-Brahmaputra Heavy Metal Hydrodynamic Transport Model'.",
    user: "admin@juniv.edu",
    timestamp: "2 hours ago",
    badge: "Projects",
    badgeColor: "bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20",
    resourceHref: "/admin/projects",
  },
  {
    id: "act-5",
    type: "research",
    action: "update",
    title: "Research Focus Domain 02 Re-calibrated",
    description: "Updated analytical methodology benchmark to Sub-1 µm Spatial Resolution Micro-FTIR.",
    user: "admin@juniv.edu",
    timestamp: "4 hours ago",
    badge: "Research Focus",
    badgeColor: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    resourceHref: "/admin/research",
  },
  {
    id: "act-6",
    type: "auth",
    action: "auth",
    title: "Administrator Authentication Session",
    description: "Secure session initiated via Supabase Auth (IP: 103.145.231.42 • Savar, Dhaka).",
    user: "admin@juniv.edu",
    timestamp: "Today at 08:30 AM",
    badge: "Auth & Security",
    badgeColor: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  },
  {
    id: "act-7",
    type: "system",
    action: "sync",
    title: "Supabase Cache & Realtime Sync Verified",
    description: "Automated health check completed across database tables and media buckets. 0 errors detected.",
    user: "System Daemon",
    timestamp: "Yesterday at 11:59 PM",
    badge: "System Sync",
    badgeColor: "bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20",
  },
  {
    id: "act-8",
    type: "website",
    action: "update",
    title: "Homepage Hero Banner Metrics Synchronized",
    description: "Updated citations benchmark to 5,000+ and active peer-reviewed publications count to 140+.",
    user: "admin@juniv.edu",
    timestamp: "Yesterday at 04:15 PM",
    badge: "Homepage Manager",
    badgeColor: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    resourceHref: "/admin/landing",
  },
];

export default function AdminActivityPage() {
  const [activities, setActivities] = useState<ActivityEvent[]>(SAMPLE_ACTIVITIES);
  const [filterType, setFilterType] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 600);
  };

  const handleExport = () => {
    const jsonStr = JSON.stringify(activities, null, 2);
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ecotox_activity_log_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filteredActivities = activities.filter((act) => {
    const matchesFilter = filterType === "all" || act.type === filterType;
    const matchesSearch =
      act.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      act.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      act.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      act.badge.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="w-full max-w-[1720px] mx-auto p-4 sm:p-6 lg:p-10 space-y-8 font-sans">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <Clock className="w-3.5 h-3.5" />
            <span>Audit Trail &amp; System Stream</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Activity &amp; Audit Log
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Real-time audit record of content changes, publication syncs, media uploads, and authentication events.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={handleRefresh}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold transition cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin text-emerald-500" : ""}`} />
            <span>Refresh Stream</span>
          </button>

          <button
            type="button"
            onClick={handleExport}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Log</span>
          </button>
        </div>
      </div>

      {/* System Status Metrics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Total Logged Events</span>
            <Activity className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            {activities.length}
          </div>
          <div className="text-[11px] text-emerald-600 font-semibold">Active telemetry stream</div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Database Status</span>
            <Database className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400">
            Online
          </div>
          <div className="text-[11px] text-slate-400">Supabase connected</div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Today&apos;s Updates</span>
            <CheckCircle2 className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            6
          </div>
          <div className="text-[11px] text-slate-400">Content publications</div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Active Admin</span>
            <ShieldCheck className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            1 Session
          </div>
          <div className="text-[11px] text-slate-400">admin@juniv.edu</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Type Filter Buttons */}
        <div className="flex flex-wrap gap-1.5 p-1 rounded-2xl bg-slate-100 dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800">
          {[
            { id: "all", label: "All Events" },
            { id: "website", label: "Website & About" },
            { id: "publications", label: "Publications" },
            { id: "projects", label: "Projects" },
            { id: "research", label: "Research" },
            { id: "media", label: "Media" },
            { id: "auth", label: "Auth & System" },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilterType(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                filterType === tab.id
                  ? "bg-white dark:bg-emerald-600 text-slate-900 dark:text-white shadow-xs font-black"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative min-w-[280px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search activity log..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 text-xs sm:text-sm font-medium focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      {/* Chronological Activity Stream */}
      <div className="rounded-3xl bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 shadow-sm divide-y divide-slate-100 dark:divide-slate-800/80 overflow-hidden">
        {filteredActivities.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <Clock className="w-10 h-10 text-slate-400 mx-auto" />
            <div className="text-base font-bold text-slate-700 dark:text-slate-300">No matching events found</div>
            <p className="text-xs text-slate-500">Try adjusting your filter or search keywords.</p>
          </div>
        ) : (
          filteredActivities.map((act) => (
            <div
              key={act.id}
              className="p-5 sm:p-6 hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors flex flex-col sm:flex-row sm:items-start justify-between gap-4"
            >
              <div className="flex items-start gap-3.5">
                {/* Icon Node */}
                <div className="w-10 h-10 rounded-2xl bg-slate-100 dark:bg-[#0B1120] border border-slate-200 dark:border-slate-800 flex items-center justify-center flex-shrink-0 mt-0.5">
                  {act.type === "publications" && <BookOpen className="w-4 h-4 text-blue-500" />}
                  {act.type === "projects" && <FolderGit2 className="w-4 h-4 text-teal-500" />}
                  {act.type === "research" && <FlaskConical className="w-4 h-4 text-emerald-500" />}
                  {act.type === "media" && <ImageIcon className="w-4 h-4 text-purple-500" />}
                  {act.type === "website" && <Layers className="w-4 h-4 text-emerald-600" />}
                  {act.type === "auth" && <Key className="w-4 h-4 text-amber-500" />}
                  {act.type === "system" && <Database className="w-4 h-4 text-slate-500" />}
                </div>

                <div className="space-y-1 text-left">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10.5px] font-bold border ${act.badgeColor}`}>
                      {act.badge}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      {act.title}
                    </h3>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl">
                    {act.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400 pt-1">
                    <span>Initiated by <strong className="text-slate-600 dark:text-slate-300">{act.user}</strong></span>
                    <span>•</span>
                    <span>{act.timestamp}</span>
                  </div>
                </div>
              </div>

              {act.resourceHref && (
                <Link
                  href={act.resourceHref}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/60 text-slate-700 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-emerald-400 text-xs font-bold transition flex-shrink-0 self-start sm:self-center"
                >
                  <span>View Module</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
