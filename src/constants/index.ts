import type { NavItem } from "@/types";

export const SITE_CONFIG = {
  name: "Environmental Health & Ecotoxicology Laboratory",
  shortName: "Ecotox Lab",
  tagline: "Understanding Environmental Risks. Protecting Health.",
  description:
    "An international academic research laboratory investigating environmental contaminants, exposure pathways, biological responses, and implications for ecosystem and human health.",
  institution: "Jahangirnagar University",
  location: "Dept. of Environmental Sciences, Jahangirnagar University, Savar, Dhaka-1342",
  email: "contact@ecotox-lab.org",
  phone: "+880 2-7791045",
};

export const PUBLIC_NAV_ITEMS: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Publications", href: "/publications" },
  { label: "Projects", href: "/projects" },
  { label: "Team", href: "/team" },
  { label: "News & Insights", href: "/news" },
  { label: "About", href: "/about" },
];

export const ADMIN_NAV_ITEMS = [
  { label: "Dashboard", href: "/admin", icon: "LayoutDashboard" },
  { label: "Research", href: "/admin/research", icon: "FlaskConical" },
  { label: "Projects", href: "/admin/projects", icon: "FolderGit2" },
  { label: "Team", href: "/admin/people", icon: "Users" },
  { label: "Publications", href: "/admin/publications", icon: "BookOpen" },
  { label: "News & Insights", href: "/admin/news", icon: "Newspaper" },
  { label: "Opportunities", href: "/admin/opportunities", icon: "GraduationCap" },
  { label: "Applications", href: "/admin/applications", icon: "FileSpreadsheet" },
  { label: "Messages", href: "/admin/messages", icon: "Mail" },
  { label: "Media", href: "/admin/media", icon: "Image" },
  { label: "Settings", href: "/admin/settings", icon: "Settings" },
] as const;

export const SCIENTIFIC_WORKFLOW_STEPS = [
  {
    step: "01",
    phase: "Environment",
    title: "Ecosystem Monitoring",
    description: "Sampling aquatic, soil, and atmospheric matrices across urban and wilderness transects.",
  },
  {
    step: "02",
    phase: "Contaminant",
    title: "Chemical & Particle Profiling",
    description: "High-resolution mass spectrometry and micro-FTIR analysis of microplastics, PFAS, and heavy metals.",
  },
  {
    step: "03",
    phase: "Exposure",
    title: "Bioavailability & Uptake Pathways",
    description: "Tracing biological ingestion, trophic transfer, and cellular accumulation kinetics in model organisms.",
  },
  {
    step: "04",
    phase: "Biological Response",
    title: "Toxicogenomics & Phenotypic Stress",
    description: "Quantifying oxidative stress biomarkers, endocrine disruption, and genomic alterations.",
  },
  {
    step: "05",
    phase: "Human & Ecosystem Health",
    title: "Integrated Risk Assessment",
    description: "Bridging molecular toxicology with population-level epidemiological and ecological forecasting models.",
  },
  {
    step: "06",
    phase: "Impact",
    title: "Policy & Sustainable Solutions",
    description: "Translating empirical discoveries into actionable regulatory guidelines and bioremediation strategies.",
  },
] as const;
