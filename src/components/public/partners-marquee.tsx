"use client";

import * as React from "react";
import { Building2, Globe2, Sparkles, ShieldCheck, Microscope, Award } from "lucide-react";

interface Partner {
  id: string;
  name: string;
  shortName: string;
  type: string;
  badge: string;
  icon: React.ComponentType<{ className?: string }>;
}

const PARTNERS: Partner[] = [
  {
    id: "p-ju",
    name: "Jahangirnagar University",
    shortName: "JU Environmental Sciences",
    type: "Host Academic Institution",
    badge: "HOST",
    icon: Building2,
  },
  {
    id: "p-doe",
    name: "Department of Environment (DoE)",
    shortName: "Ministry of Env & Climate",
    type: "Government Regulatory Partner",
    badge: "GOVERNMENT",
    icon: ShieldCheck,
  },
  {
    id: "p-bcsir",
    name: "BCSIR Research Laboratories",
    shortName: "National Science Council",
    type: "Analytical Research Alliance",
    badge: "ALLIANCE",
    icon: Microscope,
  },
  {
    id: "p-unep",
    name: "United Nations Environment (UNEP)",
    shortName: "UNEP Global Chemicals",
    type: "International Agency",
    badge: "GLOBAL",
    icon: Globe2,
  },
  {
    id: "p-who",
    name: "World Health Organization",
    shortName: "WHO Environmental Health",
    type: "Health Risk Working Group",
    badge: "GLOBAL",
    icon: Award,
  },
  {
    id: "p-jica",
    name: "JICA Environmental Science",
    shortName: "Japan International Agency",
    type: "Bilateral Grant Sponsor",
    badge: "GRANT SPONSOR",
    icon: Sparkles,
  },
  {
    id: "p-icimod",
    name: "ICIMOD Watershed Network",
    shortName: "Regional Mountain & River Alliance",
    type: "Regional Ecological Partner",
    badge: "REGIONAL",
    icon: Globe2,
  },
  {
    id: "p-nsf",
    name: "Global Toxicology Research Network",
    shortName: "International Science Consortium",
    type: "Joint Grant Consortium",
    badge: "CONSORTIUM",
    icon: Building2,
  },
];

import { useLandingData } from "@/lib/landing-store";

export function PartnersMarquee() {
  const landingData = useLandingData();
  const [isPaused, setIsPaused] = React.useState(false);

  // Triple duplicate for seamless infinite ribbon
  const marqueePartners = React.useMemo(() => {
    return [...PARTNERS, ...PARTNERS, ...PARTNERS];
  }, []);

  return (
    <section className="py-14 sm:py-16 bg-[#F4F8F5] dark:bg-[#0B1120] border-y border-slate-200/80 dark:border-slate-800 relative overflow-hidden transition-colors duration-300 w-full">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-32 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />

      {/* Header text */}
      <div className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12 text-center space-y-2 mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8F5EE] dark:bg-emerald-950/80 border border-emerald-900/10 dark:border-emerald-800/40 text-[11px] font-bold uppercase tracking-wider text-[#047857] dark:text-[#34D399]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
          <span>{landingData.partnersSection?.badge || "COLLABORATING INSTITUTIONS & RESEARCH SPONSORS"}</span>
        </div>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
          {landingData.partnersSection?.title ||
            "Partnering with leading ministries, academic councils, and international environmental organizations"}
        </p>
      </div>


      {/* Edge-to-Edge Moving Marquee */}
      <div
        className="relative w-full overflow-hidden py-2 group"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Left & Right Subtle Fade Gradients */}
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-r from-[#F4F8F5] dark:from-[#0B1120] to-transparent z-20" />
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-l from-[#F4F8F5] dark:from-[#0B1120] to-transparent z-20" />

        {/* Continuous Marquee Track */}
        <div
          className="animate-marquee-scroll flex items-center gap-4 sm:gap-6 group-hover:[animation-play-state:paused]"
          style={{ animationPlayState: isPaused ? "paused" : "running" }}
        >
          {marqueePartners.map((partner, index) => {
            const Icon = partner.icon;
            return (
              <div
                key={`${partner.id}-${index}`}
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
                className="flex-shrink-0 flex items-center gap-3.5 px-5 sm:px-6 py-3.5 rounded-2xl bg-white dark:bg-[#0F172A] border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-md hover:border-[#10B981] dark:hover:border-[#10B981] transition-all duration-300 group/partner cursor-default"
              >
                <div className="w-10 h-10 rounded-xl bg-[#E8F5EE] dark:bg-emerald-950/80 text-[#047857] dark:text-[#34D399] flex items-center justify-center font-bold flex-shrink-0 group-hover/partner:scale-105 transition-transform">
                  <Icon className="w-5 h-5 stroke-[2.2]" />
                </div>
                <div className="flex flex-col text-left">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs sm:text-sm text-[#082817] dark:text-white leading-tight group-hover/partner:text-[#047857] dark:group-hover/partner:text-[#34D399] transition-colors">
                      {partner.name}
                    </span>
                    <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-slate-100 dark:bg-black/50 text-slate-600 dark:text-emerald-300 border border-slate-200/60 dark:border-emerald-800/40">
                      {partner.badge}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                    {partner.type}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
