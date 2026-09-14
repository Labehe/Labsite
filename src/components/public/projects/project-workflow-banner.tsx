import React from "react";
import {
  HelpCircle,
  Compass,
  FlaskConical,
  Binary,
  FileCheck2,
  ShieldCheck,
  Sparkles
} from "lucide-react";

export function ProjectWorkflowBanner() {
  const steps = [
    {
      number: "01",
      title: "Question",
      sub: "Define environmental health & contaminant questions",
      icon: HelpCircle,
      tag: "Hypothesis",
    },
    {
      number: "02",
      title: "Field",
      sub: "Multi-matrix sampling across aquatic & terrestrial transects",
      icon: Compass,
      tag: "Exploration",
    },
    {
      number: "03",
      title: "Lab",
      sub: "High-precision spectroscopy & toxicological assays",
      icon: FlaskConical,
      tag: "Analysis",
    },
    {
      number: "04",
      title: "Data",
      sub: "Bayesian spatial analytics & hazard modeling",
      icon: Binary,
      tag: "Computation",
    },
    {
      number: "05",
      title: "Evidence",
      sub: "Peer-reviewed scientific journals & open datasets",
      icon: FileCheck2,
      tag: "Publications",
    },
    {
      number: "06",
      title: "Impact",
      sub: "Regulatory thresholds & bioremediation interventions",
      icon: ShieldCheck,
      tag: "Policy Action",
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-[#EDF5F0] via-[#F4F9F6] to-[#E5F0E9] dark:from-[#090D16] dark:via-[#0B1120] dark:to-[#090D16] border-t border-slate-200 dark:border-slate-800 relative overflow-hidden">
      {/* Subtle Background Glow Elements */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 relative z-10">
        {/* Banner Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-200/80 dark:border-slate-800">
          <div className="space-y-3 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold tracking-wider uppercase bg-emerald-100/80 dark:bg-emerald-500/15 text-emerald-900 dark:text-emerald-300 border border-emerald-300/60 dark:border-emerald-700/40 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Research Methodology Pipeline</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white font-[family-name:var(--font-manrope)] tracking-tight leading-tight">
              From question to impact.
            </h2>

            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 font-[family-name:var(--font-inter)] leading-relaxed font-normal max-w-2xl">
              Our projects follow a rigorous, interdisciplinary pipeline bridging standardized field sampling, ultra-trace laboratory analysis, and translational environmental policy.
            </p>
          </div>

          <div className="hidden lg:flex items-center gap-2 text-xs font-semibold text-emerald-900 dark:text-emerald-300 bg-white/90 dark:bg-[#0F172A] px-4 py-2.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
            <span>6-Phase Pipeline</span>
            <span className="text-slate-300 dark:text-slate-600">•</span>
            <span>Standardized Protocols</span>
          </div>
        </div>

        {/* 6 Steps Grid with Flow Connectors */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 sm:gap-5 relative">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={step.number}
                className="relative rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/95 dark:bg-[#0F172A]/90 backdrop-blur-md p-5 sm:p-6 flex flex-col justify-between space-y-5 hover:border-emerald-600 dark:hover:border-emerald-500 hover:shadow-xl hover:shadow-emerald-950/10 dark:hover:shadow-black/50 hover:-translate-y-1 transition-all duration-300 group"
              >
                {/* Step Top: Icon & Number */}
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 flex items-center justify-center font-bold text-sm shadow-xs group-hover:scale-110 group-hover:bg-[#14532D] group-hover:text-white transition-all duration-300 border border-emerald-200/60 dark:border-emerald-800/40">
                    <Icon className="w-5 h-5 stroke-[2]" />
                  </div>
                  <span className="text-xs font-bold text-emerald-800 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-lg border border-emerald-900/10 dark:border-emerald-800/60">
                    {step.number}
                  </span>
                </div>

                {/* Step Bottom: Title & Sub */}
                <div className="space-y-1.5">
                  <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 block">
                    {step.tag}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white font-[family-name:var(--font-manrope)] tracking-tight">
                    {step.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-3 font-[family-name:var(--font-inter)]">
                    {step.sub}
                  </p>
                </div>

                {/* Desktop Arrow Connector */}
                {idx < steps.length - 1 && (
                  <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-20 text-emerald-600 dark:text-emerald-400 text-xs font-bold opacity-60">
                    →
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
