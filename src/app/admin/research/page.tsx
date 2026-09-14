"use client";

import React, { useState } from "react";
import { useAdminTheme } from "@/lib/admin-theme";
import {
  FlaskConical,
  Plus,
  Edit2,
  Trash2,
  Tag,
  Sparkles
} from "lucide-react";

interface ResearchArea {
  id: string;
  title: string;
  code: string;
  description: string;
  tags: string[];
}

export default function AdminResearchPage() {
  const { theme } = useAdminTheme();
  const isLight = theme === "light";

  const [areas, setAreas] = useState<ResearchArea[]>([
    {
      id: "1",
      code: "AREA-01",
      title: "Contaminant Transport & Fate",
      description: "Tracing chemical pathways, sorption kinetics, and persistence of organic pollutants and heavy metals across aquatic-terrestrial interfaces.",
      tags: ["Hydrodynamics", "Heavy Metals", "Sediment Kinetics"],
    },
    {
      id: "2",
      code: "AREA-02",
      title: "Ecotoxicology & Bioaccumulation",
      description: "Evaluating toxicological effects, trophic magnification, and biochemical biomarkers in aquatic bioindicators and estuarine organisms.",
      tags: ["Microplastics", "Biomarkers", "Trophic Transfer"],
    },
    {
      id: "3",
      code: "AREA-03",
      title: "Health Risk & Impact Assessment",
      description: "Modeling human dietary exposure, non-carcinogenic hazard quotients, and community health risks from contaminated water and food chains.",
      tags: ["Dietary Exposure", "Hazard Quotients", "Epidemiology"],
    },
    {
      id: "4",
      code: "AREA-04",
      title: "Environmental Remediation Technologies",
      description: "Developing biochar adsorbents, phytoremediation schemes, and engineered filtration matrices for industrial wastewater treatment.",
      tags: ["Biochar", "Phytoremediation", "Wastewater"],
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [formState, setFormState] = useState({
    id: "",
    title: "",
    code: "",
    description: "",
    tags: "",
  });

  const cardBg = isLight ? "bg-white border-slate-200/90 shadow-xs" : "bg-[#0F172A] border-slate-800 shadow-md";
  const subText = isLight ? "text-slate-500" : "text-slate-400";
  const titleText = isLight ? "text-slate-900" : "text-white";
  const inputBg = isLight
    ? "bg-slate-50 border-slate-200 text-slate-900 focus:bg-white focus:border-emerald-500"
    : "bg-[#090D16] border-slate-700 text-white focus:border-emerald-400";

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const tagArray = formState.tags.split(",").map((t) => t.trim()).filter(Boolean);
    if (formState.id) {
      setAreas(areas.map((a) => (a.id === formState.id ? { ...formState, tags: tagArray } : a)));
    } else {
      setAreas([...areas, { ...formState, id: Date.now().toString(), tags: tagArray }]);
    }
    setShowModal(false);
  };

  const handleDelete = (id: string) => {
    if (confirm("Remove this research area?")) {
      setAreas(areas.filter((a) => a.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <FlaskConical className="w-5 h-5" />
            </div>
            <h1 className={`text-xl font-bold tracking-tight ${titleText}`}>Research Areas &amp; Scientific Pillars</h1>
          </div>
          <p className={`text-xs ${subText} mt-1`}>
            Manage the core scientific disciplines, methodologies, and thematic research pillars featured across the portal.
          </p>
        </div>

        <button
          onClick={() => {
            setFormState({ id: "", title: "", code: `AREA-0${areas.length + 1}`, description: "", tags: "" });
            setShowModal(true);
          }}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Research Area</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {areas.map((area) => (
          <div key={area.id} className={`p-6 rounded-2xl border ${cardBg} flex flex-col justify-between`}>
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                  {area.code}
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => {
                      setFormState({
                        id: area.id,
                        title: area.title,
                        code: area.code,
                        description: area.description,
                        tags: area.tags.join(", "),
                      });
                      setShowModal(true);
                    }}
                    className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-emerald-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(area.id)}
                    className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <h3 className={`text-base font-bold ${titleText}`}>{area.title}</h3>
              <p className={`text-xs ${subText} mt-2 leading-relaxed`}>{area.description}</p>
            </div>

            <div className="flex flex-wrap gap-1.5 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
              {area.tags.map((t, idx) => (
                <span
                  key={idx}
                  className={`text-[11px] font-medium px-2.5 py-0.5 rounded-md border ${
                    isLight ? "bg-slate-50 border-slate-200 text-slate-600" : "bg-slate-900 border-slate-700 text-slate-300"
                  }`}
                >
                  #{t}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={`w-full max-w-lg p-6 rounded-2xl border ${cardBg} shadow-2xl animate-in zoom-in-95`}>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-4">
              <h3 className={`text-base font-bold ${titleText}`}>
                {formState.id ? "Edit Research Area" : "Add Research Area"}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white">✕</button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={`block font-semibold mb-1 ${subText}`}>Area Code *</label>
                  <input
                    type="text"
                    required
                    value={formState.code}
                    onChange={(e) => setFormState({ ...formState, code: e.target.value })}
                    className={`w-full px-3.5 py-2.5 rounded-xl border outline-none ${inputBg}`}
                  />
                </div>

                <div>
                  <label className={`block font-semibold mb-1 ${subText}`}>Pillar Title *</label>
                  <input
                    type="text"
                    required
                    value={formState.title}
                    onChange={(e) => setFormState({ ...formState, title: e.target.value })}
                    className={`w-full px-3.5 py-2.5 rounded-xl border outline-none ${inputBg}`}
                  />
                </div>
              </div>

              <div>
                <label className={`block font-semibold mb-1 ${subText}`}>Abstract &amp; Focus Description</label>
                <textarea
                  rows={3}
                  value={formState.description}
                  onChange={(e) => setFormState({ ...formState, description: e.target.value })}
                  className={`w-full px-3.5 py-2.5 rounded-xl border outline-none ${inputBg}`}
                />
              </div>

              <div>
                <label className={`block font-semibold mb-1 ${subText}`}>Keywords &amp; Sub-topics (comma-separated)</label>
                <input
                  type="text"
                  value={formState.tags}
                  onChange={(e) => setFormState({ ...formState, tags: e.target.value })}
                  placeholder="Heavy Metals, Ecotoxicology, Microplastics"
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
                  Save Research Area
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
