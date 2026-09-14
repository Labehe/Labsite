import * as React from "react";
import Link from "next/link";
import { ArrowRight, Building2, ShieldCheck, Microscope, TreePine, Users2 } from "lucide-react";

export function CollaborationSection() {
  const partners = [
    { label: "Academic Researchers", icon: Microscope, desc: "Joint NSF/NIH grant proposals, multi-center sampling & co-authored publications." },
    { label: "Universities & Institutes", icon: Building2, desc: "Inter-institutional research exchanges, visiting fellows & equipment sharing." },
    { label: "Environmental NGOs", icon: TreePine, desc: "Community-based sampling, watershed risk assessments & biodiversity monitoring." },
    { label: "Regulatory & Health Agencies", icon: ShieldCheck, desc: "Evidence-based threshold consultations & ecological toxicology reporting." },
  ];

  return (
    <section className="py-20 lg:py-28 bg-[#F4F8F5] dark:bg-[#0B1120] border-y border-slate-200/80 dark:border-slate-800 transition-colors duration-300">
      <div className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left: Editorial Header & CTA */}
          <div className="lg:col-span-5 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E8F5EE] dark:bg-emerald-950/80 border border-emerald-900/10 dark:border-emerald-800/40 text-xs font-bold uppercase tracking-wider text-[#047857] dark:text-[#34D399]">
              <Users2 className="w-3.5 h-3.5 text-[#10B981]" />
              <span>STRATEGIC COLLABORATION</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#082817] dark:text-white font-heading leading-tight">
              Let&apos;s collaborate.
            </h2>

            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
              We welcome scientific collaborations, interdisciplinary grant partnerships, and knowledge
              exchange initiatives that advance empirical understanding of environmental contaminants and ecosystem resilience.
            </p>

            <div className="pt-2">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full bg-[#14532D] dark:bg-[#10B981] text-white dark:text-slate-900 hover:bg-[#166534] dark:hover:bg-[#34D399] text-xs sm:text-sm font-bold uppercase tracking-wider shadow-md transition-all active:scale-95"
              >
                <span>Initiate Research Partnership</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </Link>
            </div>
          </div>

          {/* Right: Partner Domain Cards Grid */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {partners.map((item) => (
              <div
                key={item.label}
                className="p-6 sm:p-7 rounded-2xl bg-white dark:bg-[#0F172A] border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3 hover:border-[#10B981] dark:hover:border-[#10B981] transition-all group"
              >
                <div className="w-11 h-11 rounded-xl bg-[#E8F5EE] dark:bg-emerald-950/80 text-[#047857] dark:text-[#34D399] flex items-center justify-center group-hover:scale-105 transition-transform">
                  <item.icon className="w-5 h-5 stroke-[2.2]" />
                </div>
                <h3 className="text-base font-bold text-[#082817] dark:text-white">
                  {item.label}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

