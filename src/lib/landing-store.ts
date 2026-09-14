"use client";

import { useState, useEffect } from "react";

export interface LandingContentData {
  hero: {
    eyebrow: string;
    headline: string;
    supportingText: string;
    primaryCtaLabel: string;
    primaryCtaHref: string;
    secondaryCtaLabel: string;
    secondaryCtaHref: string;
    stages: Array<{
      id: string;
      step: string;
      name: string;
      flow: string;
      eyebrow: string;
      headline: string;
      highlightPrefix: string;
      highlightWord: string;
      subheadline: string;
      imageSrc: string;
      imageAlt?: string;
      associatedNodeId?: string;
    }>;
    arcNodes?: Array<{
      id: string;
      label: string;
      desc: string;
      stageNumber?: string;
    }>;
    slideDurationSeconds?: number;
  };
  metrics: Array<{
    value: string;
    label: string;
    sublabel?: string;
    description: string;
  }>;
  researchFocus: {
    badge: string;
    title: string;
    subtitle: string;
  };
  projectsSection: {
    badge: string;
    title: string;
    subtitle: string;
  };
  partnersSection: {
    badge: string;
    title: string;
  };
  publicationsSection: {
    badge: string;
    title: string;
    subtitle: string;
  };
  piSection: {
    name: string;
    designation: string;
    department: string;
    institution: string;
    bioQuote: string;
    publicationsCount: string;
    grantsCount: string;
    imageSrc: string;
    scholarUrl: string;
    researchgateUrl: string;
  };
  peopleSection: {
    badge: string;
    title: string;
    subtitle: string;
  };
  newsSection: {
    badge: string;
    title: string;
    subtitle: string;
    autoSlideSeconds: number;
  };
  opportunitiesSection: {
    badge: string;
    title: string;
    highlightText: string;
    description: string;
    ctaLabel: string;
    ctaHref: string;
  };
  gallerySection: {
    badge: string;
    title: string;
    subtitle: string;
    marqueeSpeedSeconds: number;
  };
  contactSection: {
    badge: string;
    title: string;
    subtitle: string;
    facilityName: string;
    address: string;
    gpsCoordinates: string;
    email: string;
    phone: string;
    hours: string;
    mapEmbedUrl: string;
    aerialImageSrc: string;
  };
  footer: {
    labName: string;
    description: string;
    copyrightText: string;
  };
}

export const DEFAULT_LANDING_DATA: LandingContentData = {
  hero: {
    eyebrow: "ENVIRONMENTAL SCIENCE • HEALTH • ECOSYSTEMS",
    headline: "Understanding Environmental Risks. Protecting Health.",
    supportingText:
      "We investigate environmental contaminants, ecological responses, and exposure pathways to generate evidence for healthier ecosystems and communities at Jahangirnagar University.",
    primaryCtaLabel: "Explore Our Research",
    primaryCtaHref: "/research",
    secondaryCtaLabel: "Meet Our Lab",
    secondaryCtaHref: "/people",
    stages: [
      {
        id: "stage-1",
        step: "01",
        name: "FIELD",
        flow: "ENVIRONMENT → EXPOSURE",
        eyebrow: "ENVIRONMENT • HEALTH • ECOTOXICOLOGY",
        headline: "Understanding",
        highlightPrefix: "what ",
        highlightWord: "surrounds us.",
        subheadline: "From environmental exposure to biological response.",
        imageSrc: "/images/slide-1-field.jpg",
      },
      {
        id: "stage-2",
        step: "02",
        name: "LAB",
        flow: "CONTAMINANT → BIOLOGICAL RESPONSE",
        eyebrow: "MOLECULAR TOXICOLOGY • MASS SPECTROMETRY • BIOASSAYS",
        headline: "Quantifying",
        highlightPrefix: "molecular ",
        highlightWord: "cellular risk.",
        subheadline: "High-resolution micro-FTIR, chemical fate, and sub-lethal bioassays.",
        imageSrc: "/images/slide-2-lab.jpg",
      },
      {
        id: "stage-3",
        step: "03",
        name: "ANALYSIS",
        flow: "DATA → EVIDENCE",
        eyebrow: "DATA SCIENCE • BIOINFORMATICS • PATHWAY MODELING",
        headline: "Transforming",
        highlightPrefix: "signals into ",
        highlightWord: "clear evidence.",
        subheadline: "Predictive toxicogenomic modeling and multi-scale ecological datasets.",
        imageSrc: "/images/slide-3-analysis.jpg",
      },
      {
        id: "stage-4",
        step: "04",
        name: "IMPACT",
        flow: "EVIDENCE → HEALTH",
        eyebrow: "BIOREMEDIATION • HEALTH STANDARDS • RESTORATION",
        headline: "Protecting",
        highlightPrefix: "future ",
        highlightWord: "resilient ecosystems.",
        subheadline: "Translating empirical discoveries into actionable standards and remediation.",
        imageSrc: "/images/slide-4-impact.jpg",
      },
    ],
    arcNodes: [
      {
        id: "environment",
        label: "ENVIRONMENT",
        desc: "Natural watersheds, alpine ecosystems & ambient exposure vectors",
        stageNumber: "STAGE 01 OF 05",
      },
      {
        id: "contaminant",
        label: "CONTAMINANT",
        desc: "Microplastics, PFAS, pesticides & industrial chemical persistence",
        stageNumber: "STAGE 02 OF 05",
      },
      {
        id: "exposure",
        label: "EXPOSURE",
        desc: "Aqueous uptake, atmospheric deposition & trophic bioaccumulation",
        stageNumber: "STAGE 03 OF 05",
      },
      {
        id: "response",
        label: "BIOLOGICAL RESPONSE",
        desc: "Sub-lethal physiological stress, toxicogenomics & DNA damage",
        stageNumber: "STAGE 04 OF 05",
      },
      {
        id: "health",
        label: "HEALTH",
        desc: "Organism survival, biodiversity indices & human community well-being",
        stageNumber: "STAGE 05 OF 05",
      },
    ],
    slideDurationSeconds: 3.8,
  },
  metrics: [
    {
      value: "25+",
      label: "Research Projects",
      sublabel: "Active & Completed",
      description: "Active grants across aquatic and terrestrial biomes",
    },
    {
      value: "50+",
      label: "Peer-Reviewed Publications",
      sublabel: "Q1 & High-Impact",
      description: "High-impact environmental and toxicology journals",
    },
    {
      value: "10+",
      label: "Collaborating Institutions",
      sublabel: "Global & National",
      description: "Academic institutions, EPA partners, and environmental agencies",
    },
    {
      value: "15+",
      label: "Graduate & Postgrad Researchers",
      sublabel: "PhDs, Masters & Fellows",
      description: "Dedicated scientists training in ecotoxicological methodologies",
    },
  ],
  researchFocus: {
    badge: "SCIENTIFIC PILLARS",
    title: "What We Study",
    subtitle:
      "Our research spans four interconnected domains addressing chemical persistence, biological uptake, organismal impact, and human community risk.",
  },
  projectsSection: {
    badge: "FLAGSHIP RESEARCH",
    title: "Completed Projects & Scientific Breakthroughs",
    subtitle: "High-impact investigative projects funded by national and international scientific bodies.",
  },
  partnersSection: {
    badge: "INSTITUTIONAL NETWORK",
    title: "Collaborating Institutions & Research Sponsors",
  },
  publicationsSection: {
    badge: "PEER-REVIEWED EVIDENCE",
    title: "Featured Publications",
    subtitle:
      "Recent scientific breakthroughs published in high-impact environmental toxicology and public health journals.",
  },
  piSection: {
    name: "Dr. Mohammad S. Kabir",
    designation: "Professor & Principal Investigator",
    department: "Department of Environmental Sciences",
    institution: "Jahangirnagar University",
    bioQuote:
      "Our mission is to unravel the intricate mechanisms of environmental contaminants and translate rigorous experimental toxicology into actionable ecological conservation and community health protection.",
    publicationsCount: "68+ Papers",
    grantsCount: "14 Funded Grants",
    imageSrc: "/images/hero-scientist.jpg",
    scholarUrl: "https://scholar.google.com",
    researchgateUrl: "https://researchgate.net",
  },
  peopleSection: {
    badge: "LAB ROSTER",
    title: "Meet the Researchers",
    subtitle: "The multidisciplinary faculty, doctoral scholars, and students advancing environmental health science.",
  },
  newsSection: {
    badge: "LAB DISPATCHES",
    title: "Latest News & Insights",
    subtitle: "Stay updated on recent grant awards, breakthrough publications, symposium keynotes, and field expeditions.",
    autoSlideSeconds: 5,
  },
  opportunitiesSection: {
    badge: "JOIN OUR RESEARCH",
    title: "Shape the Future of Environmental Health",
    highlightText: "Now recruiting funded Master of Science (MS) and Doctoral (Ph.D.) research fellows.",
    description: "Work directly on national water security, microplastic ecotoxicity, and industrial contamination projects with full laboratory mentorship and high-resolution instrumentation access.",
    ctaLabel: "Apply for Research Position",
    ctaHref: "#contact",
  },
  gallerySection: {
    badge: "VISUAL ARCHIVE",
    title: "Event Showcase & Field Gallery",
    subtitle: "A continuous glimpse into our river delta expeditions, spectroscopic instrument rooms, and international symposia.",
    marqueeSpeedSeconds: 35,
  },
  contactSection: {
    badge: "CAMPUS LOCATION & INQUIRIES",
    title: "Reach our research team.",
    subtitle: "Located at Jahangirnagar University campus in Savar, Dhaka. Whether inquiring about collaborative grant proposals, sample submission protocols, postdoctoral opportunities, or graduate admissions, our scientific team is ready to connect.",
    facilityName: "Environmental Health & Ecotoxicology Lab",
    address: "Department of Environmental Sciences, Jahangirnagar University, Savar, Dhaka-1342, Bangladesh",
    gpsCoordinates: "23.8824° N, 90.2671° E",
    email: "ecotox@juniv.edu",
    phone: "+880 2-7791045 Ext. 1420",
    hours: "Sunday – Thursday: 9:00 AM – 5:00 PM (GMT+6)",
    mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3648.5146059902644!2d90.26458537604313!3d23.882434583995834!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755e9999407e997%3A0x868b4f17849e7799!2sJahangirnagar%20University!5e0!3m2!1sen!2sbd!4v1710000000000!5m2!1sen!2sbd",
    aerialImageSrc: "/images/jahangirnagar-campus-map.jpg",
  },
  footer: {
    labName: "Environmental Health & Ecotoxicology Laboratory",
    description: "Department of Environmental Sciences, Jahangirnagar University. Dedicated to understanding chemical fate, ecological vulnerabilities, and safeguarding human health through evidence-based science.",
    copyrightText: "© 2026 Environmental Health & Ecotoxicology Laboratory. Jahangirnagar University. All rights reserved.",
  },
};

function deepMerge<T extends Record<string, any>>(target: T, source: any): T {
  if (!source || typeof source !== "object") return target;
  const result: any = Array.isArray(target) ? [...target] : { ...target };

  for (const key of Object.keys(source)) {
    const sVal = source[key];
    const tVal = (target as any)?.[key];

    if (sVal === undefined || sVal === null) continue;

    if (Array.isArray(tVal) && Array.isArray(sVal)) {
      result[key] = sVal;
    } else if (
      typeof tVal === "object" &&
      tVal !== null &&
      typeof sVal === "object" &&
      sVal !== null &&
      !Array.isArray(tVal)
    ) {
      result[key] = deepMerge(tVal, sVal);
    } else {
      result[key] = sVal;
    }
  }
  return result;
}

const STORAGE_KEY = "ecotox_landing_content_v2";

export function getStoredLandingData(): LandingContentData {
  if (typeof window === "undefined") return DEFAULT_LANDING_DATA;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return deepMerge(DEFAULT_LANDING_DATA, parsed);
    }
  } catch (e) {
    console.warn("Could not read landing content:", e);
  }
  return DEFAULT_LANDING_DATA;
}

export function saveLandingData(data: LandingContentData): boolean {
  if (typeof window === "undefined") return false;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    window.dispatchEvent(new Event("landing-content-updated"));
    return true;
  } catch (e) {
    console.error("Failed to save landing content:", e);
    return false;
  }
}

export function resetLandingData(): LandingContentData {
  if (typeof window !== "undefined") {
    localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new Event("landing-content-updated"));
  }
  return DEFAULT_LANDING_DATA;
}

export function useLandingData() {
  const [data, setData] = useState<LandingContentData>(DEFAULT_LANDING_DATA);

  useEffect(() => {
    setData(getStoredLandingData());

    const handleUpdate = () => {
      setData(getStoredLandingData());
    };

    window.addEventListener("landing-content-updated", handleUpdate);
    window.addEventListener("storage", handleUpdate);

    return () => {
      window.removeEventListener("landing-content-updated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  return data;
}

