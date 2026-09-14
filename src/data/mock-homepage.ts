export interface HeroData {
  eyebrow: string;
  headline: string;
  supportingText: string;
  primaryCtaLabel: string;
  primaryCtaHref: string;
  secondaryCtaLabel: string;
  secondaryCtaHref: string;
  imageSrc: string;
  imageAlt: string;
}

export interface MetricItem {
  value: string;
  label: string;
  sublabel?: string;
  description: string;
}

export interface ResearchAreaItem {
  id: string;
  index: string;
  title: string;
  slug: string;
  description: string;
  icon: string;
  tags: string[];
}

export interface WorkflowStep {
  step: string;
  phase: string;
  title: string;
  description: string;
  technologies: string[];
}

export interface FeaturedProjectItem {
  id: string;
  projectCode: string;
  title: string;
  slug: string;
  status: "COMPLETED" | "ONGOING" | "PUBLISHED";
  statusLabel: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  researchArea: string;
  timeline: string;
  leadResearcher: string;
  funding: string;
  grantNumber: string;
  tags: string[];
  keyOutcome: string;
  publicationsCount: number;
}

export interface PublicationItem {
  id: string;
  title: string;
  slug: string;
  authors: string[];
  journal: string;
  year: number;
  type: string;
  doi: string;
  researchArea: string;
  citations?: number;
}

export interface PersonItem {
  id: string;
  name: string;
  slug: string;
  role: string;
  category: "Principal Investigator" | "Researchers" | "Graduate Researchers" | "Students";
  researchInterests: string[];
  imageSrc: string;
  orcid?: string;
  email?: string;
}

export interface NewsItem {
  id: string;
  title: string;
  slug: string;
  category:
    | "Research Update"
    | "Lab News"
    | "Event"
    | "Achievement"
    | "Publication"
    | "Insight"
    | "Policy Impact"
    | "Recognition"
    | "Open Science";
  date: string;
  excerpt: string;
  imageSrc: string;
  readTime: string;
}

export const MOCK_HERO_DATA: HeroData = {
  eyebrow: "ENVIRONMENTAL SCIENCE • HEALTH • ECOSYSTEMS",
  headline: "Understanding Environmental Risks. Protecting Health.",
  supportingText:
    "We investigate environmental contaminants, ecological responses, and exposure pathways to generate evidence for healthier ecosystems and communities.",
  primaryCtaLabel: "Explore Our Research",
  primaryCtaHref: "/research",
  secondaryCtaLabel: "Meet Our Lab",
  secondaryCtaHref: "/people",
  imageSrc: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80",
  imageAlt: "Environmental scientist conducting water quality and ecotoxicology field sampling",
};

export const MOCK_METRICS: MetricItem[] = [
  {
    value: "25+",
    label: "Research Projects",
    description: "Active grants across aquatic and terrestrial biomes",
  },
  {
    value: "50+",
    label: "Peer-Reviewed Publications",
    description: "High-impact environmental and toxicology journals",
  },
  {
    value: "10+",
    label: "Collaborating Institutions",
    description: "Universities, government agencies & research consortia",
  },
  {
    value: "30+",
    label: "Students & Researchers",
    description: "Postdocs, graduate researchers & undergraduate fellows",
  },
];

export const MOCK_RESEARCH_AREAS: ResearchAreaItem[] = [
  {
    id: "1",
    index: "01",
    title: "Environmental Contaminants",
    slug: "environmental-contaminants",
    description:
      "Detection, high-resolution chemical characterization, and environmental fate of emerging pollutants in aquatic and soil matrices.",
    icon: "FlaskConical",
    tags: ["PFAS", "Trace Metals", "Mass Spec"],
  },
  {
    id: "2",
    index: "02",
    title: "Ecotoxicology",
    slug: "ecotoxicology",
    description:
      "Understanding cellular, organismal, and population-level biological responses to chronic environmental stressors and toxicants.",
    icon: "Activity",
    tags: ["Bioassays", "Toxicity", "Model Organisms"],
  },
  {
    id: "3",
    index: "03",
    title: "Environmental Health",
    slug: "environmental-health",
    description:
      "Investigating environmental exposure pathways, bioaccumulation kinetics, and potential implications for community and human health.",
    icon: "HeartPulse",
    tags: ["Epidemiology", "Exposure Science", "Risk Modeling"],
  },
  {
    id: "4",
    index: "04",
    title: "Microplastics",
    slug: "microplastics",
    description:
      "Quantifying occurrence, particulate transport, trophic transfer, and sub-lethal toxicological impacts of micro- and nano-plastics.",
    icon: "Sparkles",
    tags: ["Micro-FTIR", "Polymer Fate", "Aquatic Biota"],
  },
  {
    id: "5",
    index: "05",
    title: "Water & Soil Quality",
    slug: "water-soil-quality",
    description:
      "Comprehensive ecosystem monitoring to assess watershed degradation, nutrient loading, and terrestrial contamination dynamics.",
    icon: "Droplets",
    tags: ["Watersheds", "Sediment", "Nutrient Cycles"],
  },
  {
    id: "6",
    index: "06",
    title: "Sustainable Environmental Solutions",
    slug: "sustainable-solutions",
    description:
      "Developing evidence-based bioremediation strategies, pollution mitigation technologies, and science-informed policy frameworks.",
    icon: "Leaf",
    tags: ["Bioremediation", "Policy", "Restoration"],
  },
];

export const MOCK_WORKFLOW_STEPS: WorkflowStep[] = [
  {
    step: "01",
    phase: "FIELD",
    title: "Environmental Sampling",
    description:
      "Standardized multi-matrix sampling across river basins, coastal estuaries, agricultural transects, and urban waterways.",
    technologies: ["Hydrological Sonde", "Core Samplers", "GPS Transects"],
  },
  {
    step: "02",
    phase: "LAB",
    title: "Sample Analysis",
    description:
      "High-precision molecular profiling, ultra-trace chemical extraction, and polymer identification under clean-room conditions.",
    technologies: ["LC-MS/MS", "Micro-FTIR", "ICP-MS"],
  },
  {
    step: "03",
    phase: "DATA",
    title: "Statistical & Geospatial Modeling",
    description:
      "Multivariate statistical modeling, contaminant dispersion mapping, and machine-learning exposure kinetics analysis.",
    technologies: ["R / Bioconductor", "GIS Spatial Analytics", "Bayesian Models"],
  },
  {
    step: "04",
    phase: "BIOLOGY",
    title: "Biological Response",
    description:
      "Quantifying toxicogenomic expression, oxidative stress biomarkers, and multi-generational reproductive health metrics.",
    technologies: ["RNA-Seq", "Enzyme Assays", "Histopathology"],
  },
  {
    step: "05",
    phase: "IMPACT",
    title: "Evidence for Healthier Environments",
    description:
      "Translating laboratory discoveries into actionable peer-reviewed publications, regulatory thresholds, and ecological restoration policies.",
    technologies: ["Policy Briefs", "Regulatory Frameworks", "Open Datasets"],
  },
];

export const MOCK_PROJECTS: FeaturedProjectItem[] = [
  {
    id: "proj-1",
    projectCode: "NSF-EAR-2401",
    title: "Microplastics & Ecotoxicology in Riverine Food Webs",
    slug: "microplastics-freshwater-ecosystems",
    status: "COMPLETED",
    statusLabel: "Completed • Published",
    description:
      "A 3-year longitudinal study mapping particulate microplastic transport, polymer degradation rates, and multi-trophic bioaccumulation in freshwater organisms.",
    imageSrc: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=800&q=80",
    imageAlt: "Laboratory researcher analyzing fluorescent microplastics under microscope",
    researchArea: "Microplastics & Ecotoxicology",
    timeline: "2023 – 2026",
    leadResearcher: "Dr. Elena Vance & Sojib Chowdhury",
    funding: "National Science Foundation (NSF)",
    grantNumber: "NSF-CBET-214890",
    tags: ["Micro-FTIR", "Trophic Transfer", "Aquatic Fate"],
    keyOutcome: "4 Peer Papers • Open Spectral Library",
    publicationsCount: 4,
  },
  {
    id: "proj-2",
    projectCode: "EPA-STAR-2388",
    title: "Longitudinal Fate & Remediation of Legacy PFAS in Agricultural Soils",
    slug: "pfas-fate-agricultural-soils",
    status: "COMPLETED",
    statusLabel: "Completed • Policy Brief",
    description:
      "Quantified depth-stratified leaching kinetics of 28 per- and polyfluoroalkyl substances across agricultural watersheds, establishing state biochar remediation guidelines.",
    imageSrc: "/images/areas/area-1.jpg",
    imageAlt: "PFAS contaminant soil extraction and chromatography testing",
    researchArea: "Environmental Contamination",
    timeline: "2022 – 2025",
    leadResearcher: "Dr. Marcus Thorne & Team",
    funding: "U.S. EPA STAR Grant",
    grantNumber: "EPA-RD-835620",
    tags: ["PFAS Leaching", "Biochar Filter", "LC-HRMS"],
    keyOutcome: "State Regulatory Standard Adopted",
    publicationsCount: 5,
  },
  {
    id: "proj-3",
    projectCode: "NIH-NIEHS-1904",
    title: "Molecular Biomarkers of Oxidative Stress in Vulnerable Watershed Communities",
    slug: "biomarkers-oxidative-stress-watersheds",
    status: "COMPLETED",
    statusLabel: "Completed • Cohort Study",
    description:
      "Investigated cellular toxicogenomics and oxidative DNA adducts in human in-vitro models exposed to heavy metal mixtures and urban runoff contaminants.",
    imageSrc: "/images/areas/area-3.jpg",
    imageAlt: "Cellular bioassays and toxicogenomic scanner in research laboratory",
    researchArea: "Environmental Health & Risk",
    timeline: "2021 – 2024",
    leadResearcher: "Dr. Elena Vance & Clinical Collaborators",
    funding: "NIH NIEHS Superfund Program",
    grantNumber: "NIH-P42ES027704",
    tags: ["Toxicogenomics", "Heavy Metals", "Cellular Assays"],
    keyOutcome: "3 Peer Papers • Biomarker Panel Validated",
    publicationsCount: 3,
  },
  {
    id: "proj-4",
    projectCode: "USDA-NIFA-7721",
    title: "Engineered Algal Bioreactors for Closed-Loop Industrial Wastewater Recovery",
    slug: "algal-bioreactors-wastewater-recovery",
    status: "COMPLETED",
    statusLabel: "Completed • Tech Transfer",
    description:
      "Designed and deployed modular continuous-flow microalgal bioreactors achieving 94% nitrate/phosphate removal and high-value biofertilizer synthesis.",
    imageSrc: "https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=800&q=80",
    imageAlt: "Sustainable algal bioremediation reactor facility",
    researchArea: "Sustainable & Circular Systems",
    timeline: "2022 – 2025",
    leadResearcher: "Aria Lindqvist & Dr. Marcus Thorne",
    funding: "USDA NIFA Research Program",
    grantNumber: "USDA-2022-67019",
    tags: ["Bioremediation", "Closed-Loop", "Circular Bioeconomy"],
    keyOutcome: "Patent Filed • 94% Nutrient Recovery",
    publicationsCount: 3,
  },
  {
    id: "proj-5",
    projectCode: "EU-H2020-9402",
    title: "High-Frequency Autonomous Sensor Grid for Estuarine Contaminant Pulses",
    slug: "autonomous-sensor-grid-estuarine-pulses",
    status: "COMPLETED",
    statusLabel: "Completed • Dataset Live",
    description:
      "Deployed a 15-station real-time sensor telemetry network tracking storm-event contaminant surges and salinity shifts across a 120km tidal estuarine gradient.",
    imageSrc: "https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&w=800&q=80",
    imageAlt: "High-resolution mass spectrometry and analytical monitoring laboratory",
    researchArea: "Monitoring & Analytics",
    timeline: "2023 – 2025",
    leadResearcher: "Sojib Chowdhury & Dr. Elena Vance",
    funding: "Horizon Europe International Consortium",
    grantNumber: "EU-H2020-ENV-8841",
    tags: ["Real-Time Sensors", "Estuarine Hydrology", "Telemetry"],
    keyOutcome: "Open Hydro-Data Portal • 5M Data Points",
    publicationsCount: 2,
  },
  {
    id: "proj-6",
    projectCode: "NASA-ROSES-5120",
    title: "Multi-Spectral Satellite Remote Sensing & Hydro-DEM Watershed Risk Modeling",
    slug: "satellite-gis-watershed-risk-modeling",
    status: "COMPLETED",
    statusLabel: "Completed • GIS Portal",
    description:
      "Integrated Sentinel-2 multi-spectral imagery with 1m LiDAR digital elevation models to predict contaminant accumulation hot spots in coastal drainage basins.",
    imageSrc: "https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=800&q=80",
    imageAlt: "Environmental GIS satellite elevation contours and watershed spatial modeling",
    researchArea: "Spatial Analysis & Environmental GIS",
    timeline: "2022 – 2024",
    leadResearcher: "Dr. Marcus Thorne & GIS Team",
    funding: "NASA Earth Applied Sciences",
    grantNumber: "NASA-NNX16AO22G",
    tags: ["Sentinel-2", "LiDAR DEM", "Spatial Geostatistics"],
    keyOutcome: "Interactive WebGIS Decision Support Tool",
    publicationsCount: 4,
  },
  {
    id: "proj-7",
    projectCode: "NOAA-OAR-3390",
    title: "Micro-FTIR Chemical Imaging of Plasticizers in Marine Pelagic Fauna",
    slug: "micro-ftir-chemical-imaging-pelagic-fauna",
    status: "COMPLETED",
    statusLabel: "Completed • Published",
    description:
      "Mapped spatial distribution and polymer additives inside digestive and gill tissues of pelagic fish species using automated micro-FTIR mapping.",
    imageSrc: "/images/areas/area-2.jpg",
    imageAlt: "Microscopic microplastic fluorescent fibers under polarized laboratory microscope",
    researchArea: "Microplastics & Ecotoxicology",
    timeline: "2023 – 2025",
    leadResearcher: "Sojib Chowdhury & Marine Biology Lab",
    funding: "NOAA Marine Debris Program",
    grantNumber: "NA21OAR4170119",
    tags: ["Micro-FTIR", "Pelagic Biota", "Polymer Additives"],
    keyOutcome: "Sub-Micron Atlas of Marine Particulates",
    publicationsCount: 3,
  },
  {
    id: "proj-8",
    projectCode: "DOE-BER-8841",
    title: "Biochemical Transformation of Chlorinated Solvents in Anaerobic Aquifers",
    slug: "biochemical-transformation-chlorinated-solvents",
    status: "COMPLETED",
    statusLabel: "Completed • Final Report",
    description:
      "Elucidated complete dechlorination pathways of trichloroethylene using specialized organohalide-respiring bacterial consortia.",
    imageSrc: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80",
    imageAlt: "Field hydrologist taking ground water sample in sterile flask",
    researchArea: "Environmental Contamination",
    timeline: "2021 – 2024",
    leadResearcher: "Dr. Elena Vance & Dr. Marcus Thorne",
    funding: "U.S. Department of Energy (DOE)",
    grantNumber: "DOE-SC-0021940",
    tags: ["Organohalides", "Microbial Genomics", "Groundwater"],
    keyOutcome: "Biostimulation Field Protocol Deployed",
    publicationsCount: 4,
  },
];

export const MOCK_FEATURED_PROJECT: FeaturedProjectItem = MOCK_PROJECTS[0];

export const MOCK_PUBLICATIONS: PublicationItem[] = [
  {
    id: "pub-1",
    title: "Trophic Transfer and Hepatic Biomarkers in Freshwater Teleosts Exposed to Nanoplastics Under Environmental Temperatures",
    slug: "trophic-transfer-nanoplastics-teleosts",
    authors: ["E. Vance", "M. Thorne", "S. Chowdhury", "A. Lindqvist"],
    journal: "Environmental Science & Technology",
    year: 2026,
    type: "JOURNAL ARTICLE",
    doi: "10.1021/acs.est.2026.04891",
    researchArea: "Ecotoxicology",
  },
  {
    id: "pub-2",
    title: "Spatial Distribution and Ecological Risk Assessment of Legacy PFAS Compounds Across Watershed Riparian Zones",
    slug: "spatial-risk-assessment-pfas-watersheds",
    authors: ["J. K. Miller", "E. Vance", "R. Tanaka"],
    journal: "Journal of Hazardous Materials",
    year: 2025,
    type: "RESEARCH ARTICLE",
    doi: "10.1016/j.jhazmat.2025.132890",
    researchArea: "Environmental Contaminants",
  },
  {
    id: "pub-3",
    title: "Sub-lethal Neurodevelopmental Alterations in Aquatic Model Organisms Subjected to Combined Pesticide-Microplastic Cocktails",
    slug: "neurodevelopmental-alterations-aquatic-cocktails",
    authors: ["C. Dupont", "K. S. Patel", "E. Vance"],
    journal: "Aquatic Toxicology",
    year: 2025,
    type: "JOURNAL ARTICLE",
    doi: "10.1016/j.aquatox.2025.106720",
    researchArea: "Environmental Health",
  },
  {
    id: "pub-4",
    title: "Comparative Micro-FTIR Spectral Imaging of Synthetic Fibers in Estuarine Biota Along Urban River Basins",
    slug: "comparative-micro-ftir-spectral-imaging",
    authors: ["S. Chowdhury", "E. Vance", "M. Thorne"],
    journal: "Marine Pollution Bulletin",
    year: 2025,
    type: "PEER REVIEWED",
    doi: "10.1016/j.marpolbul.2025.115402",
    researchArea: "Microplastics & Polymers",
  },
  {
    id: "pub-5",
    title: "Bioavailability and Multi-Generational Reproductive Toxicity of Heavy Metal Particulates in Freshwater Gastropods",
    slug: "bioavailability-reproductive-toxicity-gastropods",
    authors: ["A. Lindqvist", "M. Thorne", "E. Vance"],
    journal: "Ecotoxicology and Environmental Safety",
    year: 2024,
    type: "RESEARCH ARTICLE",
    doi: "10.1016/j.ecoenv.2024.116892",
    researchArea: "Ecosystem Health",
  },
  {
    id: "pub-6",
    title: "High-Resolution Non-Target Screening of Industrial Effluent Metabolites in Tropical River Basins",
    slug: "non-target-screening-industrial-effluent",
    authors: ["E. Vance", "S. Chowdhury", "K. Rahman"],
    journal: "Water Research",
    year: 2024,
    type: "JOURNAL ARTICLE",
    doi: "10.1016/j.watres.2024.120481",
    researchArea: "Water & Soil Quality",
  },
];

export const MOCK_PEOPLE: PersonItem[] = [
  {
    id: "person-1",
    name: "Dr. Elena Vance, Ph.D.",
    slug: "elena-vance",
    role: "Principal Investigator & Associate Professor",
    category: "Principal Investigator",
    researchInterests: ["Molecular Ecotoxicology", "Microplastics", "Environmental Risk Assessment"],
    imageSrc: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80",
    orcid: "0000-0002-1825-0097",
    email: "e.vance@ecotox-lab.org",
  },
  {
    id: "person-2",
    name: "Dr. Marcus Thorne, Ph.D.",
    slug: "marcus-thorne",
    role: "Senior Research Scientist",
    category: "Researchers",
    researchInterests: ["Analytical Chemistry", "Mass Spectrometry", "Emerging Contaminants"],
    imageSrc: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80",
    orcid: "0000-0003-4921-8840",
    email: "m.thorne@ecotox-lab.org",
  },
  {
    id: "person-3",
    name: "Sojib Chowdhury, M.Sc.",
    slug: "sojib-chowdhury",
    role: "Doctoral Researcher & Lab Manager",
    category: "Graduate Researchers",
    researchInterests: ["Aquatic Ecotoxicology", "Particulate Transport", "Bioassays"],
    imageSrc: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80",
    orcid: "0000-0001-9230-4102",
    email: "s.chowdhury@ecotox-lab.org",
  },
  {
    id: "person-4",
    name: "Aria Lindqvist, B.S.",
    slug: "aria-lindqvist",
    role: "Graduate Research Assistant",
    category: "Students",
    researchInterests: ["Microbial Degradation", "Soil Chemistry", "Field Hydrology"],
    imageSrc: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=600&q=80",
    email: "a.lindqvist@ecotox-lab.org",
  },
  {
    id: "person-5",
    name: "Dr. Kenji Tanaka, Ph.D.",
    slug: "kenji-tanaka",
    role: "Postdoctoral Research Fellow",
    category: "Researchers",
    researchInterests: ["LC-HRMS Screening", "PFAS Transformation", "Metabolomics"],
    imageSrc: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80",
    orcid: "0000-0002-9912-4018",
    email: "k.tanaka@ecotox-lab.org",
  },
  {
    id: "person-6",
    name: "Fatima Al-Hassan, M.Sc.",
    slug: "fatima-alhassan",
    role: "Computational Toxicology Specialist",
    category: "Graduate Researchers",
    researchInterests: ["Bayesian Risk Models", "GIS Geospatial", "Exposure Kinetics"],
    imageSrc: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=600&q=80",
    orcid: "0000-0003-1284-5509",
    email: "f.alhassan@ecotox-lab.org",
  },
];

export const MOCK_ECOSYSTEM_NODES = [
  {
    id: "researchers",
    label: "Researchers",
    count: "18 Members",
    category: "People",
    description: "Interdisciplinary faculty, postdocs, and doctoral scholars.",
    href: "/people",
  },
  {
    id: "projects",
    label: "Active Projects",
    count: "25 Grants",
    category: "Investigation",
    description: "Field and bench projects backed by international funding bodies.",
    href: "/projects",
  },
  {
    id: "areas",
    label: "Research Areas",
    count: "6 Themes",
    category: "Core Science",
    description: "From contaminant detection to epidemiological health impacts.",
    href: "/research",
  },
  {
    id: "publications",
    label: "Publications",
    count: "50+ Papers",
    category: "Evidence",
    description: "Peer-reviewed science published in top-tier toxicology journals.",
    href: "/publications",
  },
  {
    id: "collaborators",
    label: "Collaborators",
    count: "10+ Partners",
    category: "Global Network",
    description: "Academic institutions, EPA partners, and environmental agencies.",
    href: "/about",
  },
];

export const MOCK_NEWS: NewsItem[] = [
  {
    id: "news-1",
    title: "Lab Awarded NSF Grant to Study Microplastic Ingestion in Estuarine Food Webs",
    slug: "nsf-grant-microplastics-estuarine-food-webs",
    category: "Achievement",
    date: "September 04, 2026",
    excerpt:
      "Our team has been awarded a $1.8M multi-year NSF grant to deploy cutting-edge micro-FTIR and biomarker assays along regional watersheds.",
    imageSrc: "https://images.unsplash.com/photo-1518152006812-edab29b069ac?auto=format&fit=crop&w=600&q=80",
    readTime: "4 min read",
  },
  {
    id: "news-2",
    title: "New Publication in Environmental Science & Technology on Nanoplastic Bioaccumulation",
    slug: "new-publication-est-nanoplastic-bioaccumulation",
    category: "Publication",
    date: "August 18, 2026",
    excerpt:
      "First author Dr. Marcus Thorne and collaborators demonstrate the kinetic transfer of sub-micron polymer fragments into organ tissues.",
    imageSrc: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=600&q=80",
    readTime: "3 min read",
  },
  {
    id: "news-3",
    title: "International Ecotoxicology Symposium 2026: Lab Presenting Four Keynote Sessions",
    slug: "international-ecotoxicology-symposium-2026",
    category: "Event",
    date: "August 02, 2026",
    excerpt:
      "Join our researchers next month as we present our latest findings on endocrine disruptors and aquatic habitat restoration.",
    imageSrc: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=600&q=80",
    readTime: "2 min read",
  },
  {
    id: "news-4",
    title: "State Environmental Agency Adopts Lab PFAS Leaching Model for Agricultural Lands",
    slug: "pfas-leaching-regulatory-model-adopted",
    category: "Policy Impact",
    date: "July 24, 2026",
    excerpt:
      "Research led by our team has been formalized into state groundwater protection guidelines to regulate industrial biosolids on croplands.",
    imageSrc: "/images/gallery/analytical-instrumentation.jpg",
    readTime: "5 min read",
  },
  {
    id: "news-5",
    title: "Doctoral Researcher Sojib Chowdhury Wins Young Environmental Scientist Award",
    slug: "sojib-chowdhury-wins-young-scientist-award",
    category: "Recognition",
    date: "July 10, 2026",
    excerpt:
      "Honored for pioneering work on micro-FTIR particulate tracking in riverine benthic food webs and sediment risk mapping.",
    imageSrc: "/images/gallery/symposium-seminar.jpg",
    readTime: "3 min read",
  },
  {
    id: "news-6",
    title: "Watershed Autonomous Sensor Telemetry Goes Live on Open Science Portal",
    slug: "watershed-autonomous-sensor-telemetry-live",
    category: "Open Science",
    date: "June 28, 2026",
    excerpt:
      "Public access is now open for real-time water quality, dissolved oxygen, and electrochemical sensor streams along the Savar basin.",
    imageSrc: "/images/gallery/field-sampling.jpg",
    readTime: "4 min read",
  },
];
