"use client";

import React, { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAdminTheme } from "@/lib/admin-theme";
import {
  Inbox,
  Search,
  CheckCircle,
  Mail,
  Phone,
  Trash2,
  Loader2,
  Clock,
  Filter
} from "lucide-react";

interface Application {
  id: string;
  applicant_name: string;
  applicant_email: string;
  phone?: string;
  degree_level: string;
  university?: string;
  research_interest?: string;
  status: string;
  created_at: string;
  cover_letter?: string;
}

export default function AdminInboxPage() {
  const { theme } = useAdminTheme();
  const isLight = theme === "light";

  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);

  const cardBg = isLight ? "bg-white border-slate-200/90 shadow-xs" : "bg-[#0F172A] border-slate-800 shadow-md";
  const subText = isLight ? "text-slate-500" : "text-slate-400";
  const titleText = isLight ? "text-slate-900" : "text-white";

  const loadApplications = async () => {
    setIsLoading(true);
    try {
      const supabase = createClient();
      const { data, error } = await (supabase as any)
        .from("applications")
        .select("*")
        .order("created_at", { ascending: false });

      if (error || !data || data.length === 0) {
        setApplications([
          {
            id: "1",
            applicant_name: "Farhana Islam",
            applicant_email: "farhana.ju.env@gmail.com",
            phone: "+880 1712-345678",
            degree_level: "Master of Science (MS)",
            university: "Jahangirnagar University",
            research_interest: "Microplastic ingestion dynamics and histopathology in freshwater fish.",
            status: "new",
            created_at: "2026-09-08T10:30:00Z",
            cover_letter: "I am writing to express my strong interest in joining the Environmental Health & Ecotoxicology Lab as an MS thesis researcher. I completed my B.Sc. in Environmental Sciences with a GPA of 3.89 and have basic experience in FTIR spectroscopy.",
          },
          {
            id: "2",
            applicant_name: "Mahmudul Hasan",
            applicant_email: "m.hasan.chem@du.ac.bd",
            phone: "+880 1823-456789",
            degree_level: "Doctor of Philosophy (PhD)",
            university: "University of Dhaka",
            research_interest: "Speciation and biogeochemical mobility of heavy metals in contaminated wetland sediments.",
            status: "reviewing",
            created_at: "2026-09-05T14:15:00Z",
            cover_letter: "Having published 2 Q1 papers on trace metal contamination, I wish to pursue my doctoral studies on speciation kinetics under Dr. Kabir's supervision.",
          },
          {
            id: "3",
            applicant_name: "Tanvir Chowdhury",
            applicant_email: "tanvir.cu@gmail.com",
            phone: "+880 1934-567890",
            degree_level: "Research Assistant",
            university: "Chittagong University",
            research_interest: "Pesticide residues and groundwater vulnerability modeling using GIS/RS.",
            status: "shortlisted",
            created_at: "2026-08-29T09:00:00Z",
            cover_letter: "I have 1.5 years experience managing field water quality sensors and would like to join as a full-time lab technician/RA.",
          },
        ]);
      } else {
        setApplications(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadApplications();
  }, []);

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      const supabase = createClient();
      await (supabase as any).from("applications").update({ status: newStatus }).eq("id", id);
      setApplications(applications.map((a) => (a.id === id ? { ...a, status: newStatus } : a)));
      if (selectedApp?.id === id) {
        setSelectedApp({ ...selectedApp, status: newStatus });
      }
    } catch (err) {
      setApplications(applications.map((a) => (a.id === id ? { ...a, status: newStatus } : a)));
      if (selectedApp?.id === id) {
        setSelectedApp({ ...selectedApp, status: newStatus });
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this inquiry?")) return;
    try {
      const supabase = createClient();
      await (supabase as any).from("applications").delete().eq("id", id);
      setApplications(applications.filter((a) => a.id !== id));
      if (selectedApp?.id === id) setSelectedApp(null);
    } catch (err) {
      setApplications(applications.filter((a) => a.id !== id));
      if (selectedApp?.id === id) setSelectedApp(null);
    }
  };

  const filteredApps = applications.filter((a) =>
    a.applicant_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.applicant_email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (a.research_interest && a.research_interest.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Inbox className="w-5 h-5 text-emerald-500" />
            <h1 className="text-xl font-bold tracking-tight font-[family-name:var(--font-manrope)]">Inbox &amp; Student Inquiries</h1>
          </div>
          <p className={`text-xs ${subText} mt-1`}>
            Review candidate applications, thesis proposals, CVs, and research inquiry messages.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className={`relative flex-1 p-2 rounded-xl border ${cardBg}`}>
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search candidates by name, email, or research topic..."
            className="w-full pl-9 pr-4 py-1 bg-transparent text-xs outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column list */}
        <div className="lg:col-span-1 space-y-3">
          {isLoading ? (
            <div className="p-8 text-center text-slate-400 flex flex-col items-center justify-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin text-emerald-500" />
              <span className="text-xs">Loading inquiries...</span>
            </div>
          ) : filteredApps.length === 0 ? (
            <div className={`p-6 text-center rounded-xl border ${cardBg} text-xs text-slate-400`}>
              No inquiries found.
            </div>
          ) : (
            filteredApps.map((app) => (
              <div
                key={app.id}
                onClick={() => setSelectedApp(app)}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  selectedApp?.id === app.id
                    ? isLight
                      ? "bg-emerald-50/90 border-emerald-400 shadow-sm"
                      : "bg-emerald-950/40 border-emerald-500/50 shadow-md"
                    : `${cardBg} hover:border-emerald-500/30`
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                    app.status === "new"
                      ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-400 dark:border dark:border-emerald-500/30"
                      : app.status === "reviewing"
                      ? "bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-400 dark:border dark:border-amber-500/30"
                      : "bg-teal-100 text-teal-800 dark:bg-teal-950/80 dark:text-teal-400 dark:border dark:border-teal-500/30"
                  }`}>
                    {app.status}
                  </span>
                  <span className={`text-[10px] font-mono ${subText}`}>
                    {new Date(app.created_at).toLocaleDateString()}
                  </span>
                </div>

                <h3 className={`text-xs font-bold ${titleText}`}>{app.applicant_name}</h3>
                <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">{app.degree_level}</p>
                <p className={`text-[11px] ${subText} line-clamp-1 mt-1`}>{app.research_interest}</p>
              </div>
            ))
          )}
        </div>

        {/* Right column details */}
        <div className={`lg:col-span-2 rounded-2xl border ${cardBg} p-6`}>
          {selectedApp ? (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <h2 className={`text-lg font-bold ${titleText}`}>{selectedApp.applicant_name}</h2>
                  <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium mt-0.5">{selectedApp.degree_level} Applicant</p>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={selectedApp.status}
                    onChange={(e) => handleUpdateStatus(selectedApp.id, e.target.value)}
                    className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs outline-none bg-white dark:bg-[#090D16] text-slate-800 dark:text-white"
                  >
                    <option value="new">Status: New</option>
                    <option value="reviewing">Status: Under Review</option>
                    <option value="shortlisted">Status: Shortlisted</option>
                    <option value="accepted">Status: Accepted</option>
                    <option value="rejected">Status: Rejected</option>
                  </select>

                  <button
                    onClick={() => handleDelete(selectedApp.id)}
                    className="p-2 rounded-xl border border-rose-200 dark:border-rose-900/60 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#090D16] border border-slate-100 dark:border-slate-800 space-y-1">
                  <span className={`text-[10px] ${subText} uppercase font-mono`}>Email Address</span>
                  <p className="font-semibold flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-emerald-500" />
                    <a href={`mailto:${selectedApp.applicant_email}`} className="hover:underline">
                      {selectedApp.applicant_email}
                    </a>
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#090D16] border border-slate-100 dark:border-slate-800 space-y-1">
                  <span className={`text-[10px] ${subText} uppercase font-mono`}>Contact Phone</span>
                  <p className="font-semibold flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-emerald-500" />
                    <span>{selectedApp.phone || "Not provided"}</span>
                  </p>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-2">
                  Research Interests
                </h4>
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#090D16] border border-slate-100 dark:border-slate-800 text-xs leading-relaxed">
                  {selectedApp.research_interest}
                </div>
              </div>

              {selectedApp.cover_letter && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-2">
                    Statement / Cover Letter
                  </h4>
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#090D16] border border-slate-100 dark:border-slate-800 text-xs leading-relaxed whitespace-pre-wrap">
                    {selectedApp.cover_letter}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="h-64 flex flex-col items-center justify-center text-center text-slate-400">
              <Inbox className="w-8 h-8 text-emerald-500/40 mb-2" />
              <p className="text-sm font-semibold">Select an Inquiry</p>
              <p className="text-xs text-slate-500 mt-1">Click on any candidate in the list to view their statement.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
