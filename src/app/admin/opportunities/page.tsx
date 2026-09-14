"use client";

import React, { useState } from "react";
import { useAdminTheme } from "@/lib/admin-theme";
import {
  Briefcase,
  Plus,
  Edit2,
  Trash2,
  Clock,
  CheckCircle2,
  Sparkles
} from "lucide-react";

interface Opportunity {
  id: string;
  title: string;
  type: "Graduate Research (MS/PhD)" | "Research Assistantship" | "Undergraduate Internship" | "Postdoctoral Fellowship";
  deadline: string;
  stipend: string;
  status: "Open" | "Reviewing" | "Closed";
  description: string;
}

export default function AdminOpportunitiesPage() {
  const { theme } = useAdminTheme();
  const isLight = theme === "light";

  const [opportunities, setOpportunities] = useState<Opportunity[]>([
    {
      id: "1",
      title: "Doctoral Fellowship in Microplastic Trophic Kinetics",
      type: "Graduate Research (MS/PhD)",
      deadline: "October 15, 2026",
      stipend: "Full Tuition + BDT 35,000/mo",
      status: "Open",
      description: "Two-year funded research on Meghna River delta estuarine food web contamination with advanced FTIR and stereomicroscopy analysis.",
    },
    {
      id: "2",
      title: "Graduate Research Assistant in Heavy Metal Speciation",
      type: "Research Assistantship",
      deadline: "November 01, 2026",
      stipend: "BDT 25,000/mo",
      status: "Open",
      description: "Assisting in AAS / ICP-MS digestion and quantitative trace element determinations in agricultural soils.",
    },
    {
      id: "3",
      title: "Summer Undergraduate Lab Internship 2026",
      type: "Undergraduate Internship",
      deadline: "Completed",
      stipend: "Certificate + Research Credit",
      status: "Closed",
      description: "Hands-on water quality sampling, physicochemical param determinations, and laboratory sample preparation.",
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [formState, setFormState] = useState({
    id: "",
    title: "",
    type: "Graduate Research (MS/PhD)" as Opportunity["type"],
    deadline: "",
    stipend: "",
    status: "Open" as Opportunity["status"],
    description: "",
  });

  const cardBg = isLight ? "bg-white border-slate-200/90 shadow-xs" : "bg-[#0F172A] border-slate-800 shadow-md";
  const subText = isLight ? "text-slate-500" : "text-slate-400";
  const titleText = isLight ? "text-slate-900" : "text-white";
  const inputBg = isLight
    ? "bg-slate-50 border-slate-200 text-slate-900 focus:bg-white focus:border-emerald-500"
    : "bg-[#090D16] border-slate-700 text-white focus:border-emerald-400";

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (formState.id) {
      setOpportunities(opportunities.map((o) => (o.id === formState.id ? { ...formState } : o)));
    } else {
      setOpportunities([{ ...formState, id: Date.now().toString() }, ...opportunities]);
    }
    setShowModal(false);
  };

  const handleDelete = (id: string) => {
    if (confirm("Remove this opportunity?")) {
      setOpportunities(opportunities.filter((o) => o.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <Briefcase className="w-5 h-5" />
            </div>
            <h1 className={`text-xl font-bold tracking-tight ${titleText}`}>Opportunities &amp; Fellowships</h1>
          </div>
          <p className={`text-xs ${subText} mt-1`}>
            Post and manage funded MS/PhD research assistantships, undergraduate internships, and post-doc openings.
          </p>
        </div>

        <button
          onClick={() => {
            setFormState({
              id: "",
              title: "",
              type: "Graduate Research (MS/PhD)",
              deadline: "November 30, 2026",
              stipend: "Funded",
              status: "Open",
              description: "",
            });
            setShowModal(true);
          }}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Post New Opening</span>
        </button>
      </div>

      <div className="space-y-4">
        {opportunities.map((opp) => (
          <div
            key={opp.id}
            className={`p-5 rounded-2xl border ${cardBg} flex flex-col sm:flex-row sm:items-center justify-between gap-4`}
          >
            <div className="flex-1 space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className={`text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-full ${
                  opp.status === "Open"
                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-700"
                }`}>
                  {opp.status}
                </span>
                <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-md">
                  {opp.type}
                </span>
                <span className={`text-xs ${subText} flex items-center gap-1`}>
                  <Clock className="w-3.5 h-3.5 text-emerald-500" />
                  Deadline: {opp.deadline}
                </span>
                {opp.stipend && (
                  <span className={`text-xs ${subText} font-mono`}>
                    • {opp.stipend}
                  </span>
                )}
              </div>

              <h3 className={`text-sm font-bold ${titleText}`}>{opp.title}</h3>
              <p className={`text-xs ${subText}`}>{opp.description}</p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => {
                  setFormState({
                    id: opp.id,
                    title: opp.title,
                    type: opp.type,
                    deadline: opp.deadline,
                    stipend: opp.stipend,
                    status: opp.status,
                    description: opp.description,
                  });
                  setShowModal(true);
                }}
                className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-emerald-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(opp.id)}
                className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={`w-full max-w-lg p-6 rounded-2xl border ${cardBg} shadow-2xl animate-in zoom-in-95`}>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-4">
              <h3 className={`text-base font-bold ${titleText}`}>
                {formState.id ? "Edit Opportunity" : "Post Opportunity"}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white">✕</button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className={`block font-semibold mb-1 ${subText}`}>Position Title *</label>
                <input
                  type="text"
                  required
                  value={formState.title}
                  onChange={(e) => setFormState({ ...formState, title: e.target.value })}
                  className={`w-full px-3.5 py-2.5 rounded-xl border outline-none ${inputBg}`}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={`block font-semibold mb-1 ${subText}`}>Opportunity Type</label>
                  <select
                    value={formState.type}
                    onChange={(e) => setFormState({ ...formState, type: e.target.value as any })}
                    className={`w-full px-3.5 py-2.5 rounded-xl border outline-none ${inputBg}`}
                  >
                    <option value="Graduate Research (MS/PhD)">Graduate Research (MS/PhD)</option>
                    <option value="Research Assistantship">Research Assistantship</option>
                    <option value="Undergraduate Internship">Undergraduate Internship</option>
                    <option value="Postdoctoral Fellowship">Postdoctoral Fellowship</option>
                  </select>
                </div>

                <div>
                  <label className={`block font-semibold mb-1 ${subText}`}>Status</label>
                  <select
                    value={formState.status}
                    onChange={(e) => setFormState({ ...formState, status: e.target.value as any })}
                    className={`w-full px-3.5 py-2.5 rounded-xl border outline-none ${inputBg}`}
                  >
                    <option value="Open">Open (Active)</option>
                    <option value="Reviewing">Reviewing</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={`block font-semibold mb-1 ${subText}`}>Application Deadline</label>
                  <input
                    type="text"
                    value={formState.deadline}
                    onChange={(e) => setFormState({ ...formState, deadline: e.target.value })}
                    placeholder="e.g. October 30, 2026"
                    className={`w-full px-3.5 py-2.5 rounded-xl border outline-none ${inputBg}`}
                  />
                </div>

                <div>
                  <label className={`block font-semibold mb-1 ${subText}`}>Stipend / Funding Support</label>
                  <input
                    type="text"
                    value={formState.stipend}
                    onChange={(e) => setFormState({ ...formState, stipend: e.target.value })}
                    placeholder="e.g. BDT 30,000 / month + tuition"
                    className={`w-full px-3.5 py-2.5 rounded-xl border outline-none ${inputBg}`}
                  />
                </div>
              </div>

              <div>
                <label className={`block font-semibold mb-1 ${subText}`}>Description &amp; Qualifications</label>
                <textarea
                  rows={3}
                  value={formState.description}
                  onChange={(e) => setFormState({ ...formState, description: e.target.value })}
                  className={`w-full px-3.5 py-2.5 rounded-xl border outline-none ${inputBg}`}
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold shadow-md shadow-emerald-600/20"
                >
                  Save Opportunity
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
