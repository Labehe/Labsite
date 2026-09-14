import { NewsArticle } from "./types";
import { SEED_RESEARCH_AREAS, SEED_PROJECTS } from "../projects/seed-data";

export const SEED_NEWS_ARTICLES: NewsArticle[] = [
  {
    id: "news-1",
    title: "Breakthrough Study Maps Microplastic Nanoparticle Translocation in Meghna Delta Fisheries",
    slug: "microplastic-translocation-meghna-delta-fisheries",
    summary: "Our aquatic ecotoxicology team reveals significant trophic magnification factors for micro-FTIR identified polymers across commercial estuarine species.",
    content: `### Executive Summary

In our latest empirical investigation published in *Environmental Science & Technology*, researchers from the Environmental Health & Ecotoxicology Laboratory documented microplastic and nanoplastic bioaccumulation kinetics in 420 commercial teleost specimens collected across the lower Meghna River Estuary.

Using automated micro-FTIR focal plane array imaging coupled with Py-GC/MS, our team quantified mean gastrointestinal and hepatic loads of **5.8 ± 1.2 particles per individual**, with low-density polyethylene (LDPE) and polypropylene (PP) microfibers comprising over 74% of isolated particulate matter.

---

### Key Discoveries & Analytical Metrics

1. **Trophic Magnification Across Guilds**: Predatory teleosts demonstrated trophic magnification factors (TMF) exceeding 2.3, indicating marked biomagnification from benthic planktivores to apex piscivores.
2. **Sub-Micron Tissue Translocation**: Histological fluorescence microscopy confirmed the passage of nanoplastics (<100 nm) across intestinal epithelial barriers into hepatic parenchyma.
3. **Chemical Additive Leaching**: Significant co-elution of phthalate plasticizers (DEHP) and bisphenol analogues was detected in biological matrices.

> *"The detection of plastic additives in hepatic tissue underscores that microplastic ingestion acts as a dual physical-chemical stressor for estuarine aquatic life."*  
> — **Kotoha Nakayama**, Postdoctoral Research Fellow & Lead Author

---

### Laboratory Field Deployment & Protocol

Field sampling occurred across four seasonal monsoon regimes utilizing our custom-fitted pontoon vessel. Surface water manta trawl tows were synchronized with deep-water benthic grabs to reconstruct vertical particle flux profiles.

\`\`\`
Field Sampling Matrix:
- Chandpur Confluence (Station A1–A4)
- Hatiya Estuary Channel (Station B1–B6)
- Lower Coastal Bay Interface (Station C1–C4)
\`\`\`

Our laboratory is currently expanding the monitoring framework to evaluate molecular biomarkers of oxidative stress and transcriptomic heat-shock protein expression in exposed teleosts.`,
    category: "breakthrough",
    cover_image_url: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80",
    image_caption: "Field sampling team conducting manta trawl tows in the lower Meghna Estuarine channel.",
    image_credit: "EcoToxLab Field Expedition Team",
    author_name: "Kotoha Nakayama",
    author_role: "Postdoctoral Research Fellow",
    author_avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80",
    published_at: "2026-08-24",
    read_time_minutes: 5,
    is_featured: true,
    is_published: true,
    display_order: 1,
    tags: ["Microplastics", "Ecotoxicology", "Estuarine Health", "FTIR Spectroscopy"],
    research_areas: [
      { id: "area-1", title: "Microplastics & Emerging Pollutants", slug: "microplastics-emerging-pollutants" },
      { id: "area-3", title: "Aquatic Health & Watersheds", slug: "aquatic-health-watersheds" }
    ],
    projects: [
      { id: "proj-1", title: "Microplastic Trophic Transfer & Nanoparticle Ecotoxicology in Estuarine Food Webs", slug: "microplastic-trophic-transfer-estuarine-food-webs" }
    ],
    created_at: "2026-08-24T10:00:00Z",
    updated_at: "2026-08-24T10:00:00Z"
  },
  {
    id: "news-2",
    title: "New High-Resolution ICP-MS & Thermal Desorption Spectroscopy Suite Commissioned",
    slug: "high-resolution-icp-ms-thermal-desorption-suite-commissioned",
    summary: "State-of-the-art analytical instrumentation expands laboratory capabilities to detect trace heavy metals and PFAS compounds at parts-per-trillion sensitivity.",
    content: `### Advanced Trace Element Infrastructure

The Environmental Health & Ecotoxicology Laboratory has completed installation and ISO/IEC 17025 calibration of our next-generation **Inductively Coupled Plasma Mass Spectrometry (ICP-MS)** and **Thermal Desorption GC-MS/MS** research facility.

This multi-million infrastructure enhancement enables comprehensive isotopic fingerprinting and ultra-trace quantification of critical toxic elements including:

- **Heavy Metals & Metalloids**: Cadmium (Cd), Lead (Pb), Arsenic (As), Mercury (Hg), Chromium (Cr) down to 0.005 ppb detection limits.
- **Persistent Organic Pollutants (POPs)**: Organochlorine pesticides, PCBs, and polybrominated diphenyl ethers (PBDEs).
- **Per- and Polyfluoroalkyl Substances (PFAS)**: Targeted screening for 40+ legacy and short-chain precursor compounds in surface runoffs.

---

### Expanding Regional Analytical Collaborations

The analytical core will serve as a shared scientific research resource for doctoral candidates, graduate fellows, and governmental environmental protection agencies across South Asia.

> *"With sub-ppb calibration matrices and collision-cell technology, we can differentiate natural background geochemical signatures from anthropogenic industrial effluents with unprecedented precision."*  
> — **Sojib Chowdhury**, Senior Research Fellow & Analytical Lead

---

### Facility Access & Specimen Preparation Protocols

Researchers wishing to schedule beam time or submit lyophilized biological samples can consult our updated Standard Operating Procedures (SOPs) or submit a collaborative request via the online portal.`,
    category: "lab_update",
    cover_image_url: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80",
    image_caption: "Analytical chemistry cleanroom with calibrated ICP-MS spectrometer instrumentation.",
    image_credit: "EcoToxLab Instrumentation Facility",
    author_name: "Sojib Chowdhury",
    author_role: "Senior Research Fellow & Analytical Lead",
    author_avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
    published_at: "2026-08-10",
    read_time_minutes: 4,
    is_featured: true,
    is_published: true,
    display_order: 2,
    tags: ["ICP-MS", "Heavy Metals", "Spectroscopy", "Analytical Chemistry"],
    research_areas: [
      { id: "area-2", title: "Heavy Metal Biogeochemistry", slug: "heavy-metal-biogeochemistry" },
      { id: "area-4", title: "Environmental Risk Assessment", slug: "environmental-risk-assessment" }
    ],
    projects: [
      { id: "proj-2", title: "Heavy Metal Partitioning and Speciation in Coastal Aquaculture Systems", slug: "heavy-metal-partitioning-aquaculture" }
    ],
    created_at: "2026-08-10T14:30:00Z",
    updated_at: "2026-08-10T14:30:00Z"
  },
  {
    id: "news-3",
    title: "International Collaborative Grant Awarded: $1.8M UNEP Coastal Ecosystem Resilience Initiative",
    slug: "unep-coastal-ecosystem-resilience-grant-awarded",
    summary: "A tri-nation consortium led by our laboratory will deploy real-time IoT biosensors and community water quality monitoring across vulnerable delta zones.",
    content: `### Major Funding Milestone for Deltaic Science

We are proud to announce that the **United Nations Environment Programme (UNEP)** in partnership with the Global Environmental Facility (GEF) has awarded a $1.8 million scientific grant to the collaborative consortium led by our laboratory.

The four-year grant titled *"Climate-Induced Salinity Intrusion and Chemical Contaminant Flux in Vulnerable Coastal Deltas"* aims to establish an integrated sensor network and predictive ecotoxicological early-warning dashboard.

---

### Core Grant Objectives

1. **Continuous IoT Sensor Array**: Deployment of 50 multi-parameter autonomous water probes measuring salinity, dissolved oxygen, redox potential, and turbidity along the coastal delta.
2. **Community Science & Participatory Monitoring**: Training 300 coastal aquaculture farmers to utilize colorimetric test kits and mobile geo-tagging applications.
3. **Predictive Hydrodynamic Risk Modeling**: Integrating 3D numerical hydrodynamic models with ecotoxicological threshold response curves.

---

### Graduate & Postdoctoral Opportunities

The grant includes funding for **two Postdoctoral Research Fellowships**, **four fully funded PhD studentships**, and annual international training exchanges with our partner institutions in Sweden and the UK.`,
    category: "grant_award",
    cover_image_url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
    image_caption: "Coastal mangrove estuarine study zone earmarked for autonomous sensor deployment.",
    image_credit: "UNEP Coastal Science Alliance",
    author_name: "Dr. Marcus Thorne",
    author_role: "Senior Ecotoxicologist",
    author_avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=300&q=80",
    published_at: "2026-07-18",
    read_time_minutes: 6,
    is_featured: true,
    is_published: true,
    display_order: 3,
    tags: ["Grants", "UNEP", "Sensor Networks", "Climate Resilience"],
    research_areas: [
      { id: "area-3", title: "Aquatic Health & Watersheds", slug: "aquatic-health-watersheds" },
      { id: "area-4", title: "Environmental Risk Assessment", slug: "environmental-risk-assessment" }
    ],
    projects: [
      { id: "proj-3", title: "Climate-Induced Salinity Intrusion and Chemical Contaminant Flux", slug: "climate-salinity-contaminant-flux" }
    ],
    created_at: "2026-07-18T09:00:00Z",
    updated_at: "2026-07-18T09:00:00Z"
  },
  {
    id: "news-4",
    title: "EcoToxLab Delegates Present 6 Original Papers at SETAC Asia-Pacific 2026 Conference",
    slug: "setac-asia-pacific-conference-2026-papers-presented",
    summary: "Faculty and student researchers delivered platform talks on endocrine disruption in shellfish and machine-learning toxicity prediction frameworks.",
    content: `### Global Stage for Laboratory Research

Our laboratory delegation actively participated in the **Society of Environmental Toxicology and Chemistry (SETAC) Asia-Pacific 2026 Conference**, delivering six oral platform presentations and four interactive poster sessions.

Highlights of our team's scientific contributions included:

- **Platform Talk 1**: *Micro-FTIR spatial mapping of microplastic additives in edible bivalves* — Presented by Kotoha Nakayama.
- **Platform Talk 2**: *Bayesian ecotoxicological risk modeling for chromium speciation in tannery effluent receiving wetlands* — Presented by Sojib Chowdhury.
- **Young Scientist Award**: Graduate Fellow Tanvir Hasan was awarded the *Best Student Oral Presentation* for his research on heavy metal bioaccumulation in benthic crabs.

---

### Collaborative Roundtables & Policy Working Groups

Our faculty also participated in the UNEP-SETAC working group on harmonizing global microplastic extraction and reporting methodologies, advocating for accessible standardized protocols for developing nations.`,
    category: "symposium",
    cover_image_url: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80",
    image_caption: "Laboratory delegation at the SETAC Asia-Pacific 2026 International Symposium.",
    image_credit: "SETAC Press Office",
    author_name: "Kotoha Nakayama",
    author_role: "Postdoctoral Research Fellow",
    author_avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80",
    published_at: "2026-06-29",
    read_time_minutes: 4,
    is_featured: false,
    is_published: true,
    display_order: 4,
    tags: ["SETAC", "Conference", "Toxicology", "Scientific Awards"],
    research_areas: [
      { id: "area-1", title: "Microplastics & Emerging Pollutants", slug: "microplastics-emerging-pollutants" },
      { id: "area-4", title: "Environmental Risk Assessment", slug: "environmental-risk-assessment" }
    ],
    projects: [],
    created_at: "2026-06-29T11:20:00Z",
    updated_at: "2026-06-29T11:20:00Z"
  },
  {
    id: "news-5",
    title: "Field Expedition Dispatches: 21-Day Hydrochemical Survey Across Lower Sundarbans Mangroves",
    slug: "field-expedition-dispatches-sundarbans-hydrochemical-survey",
    summary: "Researchers collect over 600 sediment core and water samples to evaluate persistent organochlorine pesticide residues and microplastic deposition.",
    content: `### Expedition Log: Into the Tidal Mangrove Labyrinth

A joint research expedition comprising eight laboratory members completed a comprehensive 21-day hydrochemical survey across the UNESCO World Heritage Sundarbans mangrove network.

Navigating through complex tidal channels, the scientific crew collected over 600 georeferenced sediment cores, water samples, and bioindicator mangrove crab (*Scylla serrata*) specimens.

---

### Immediate Preliminary Observations

1. **Sediment Core Stratigraphy**: Core samples to a depth of 1.5 meters revealed distinct stratigraphic markers correlating with historical industrialization along the upstream river basin.
2. **Porewater Salinity Shifts**: Significant hyper-salinity zones were documented in interior creeks, reflecting diminished dry-season upstream freshwater flushes.
3. **Biological Tissue Sampling**: Gill and hepatopancreas tissues were flash-frozen on liquid nitrogen containers on board for subsequent multi-omics analysis.

---

The team has safely returned to the central laboratory facility, where automated extraction and cleanroom isotopic analyses are actively underway.`,
    category: "expedition",
    cover_image_url: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
    image_caption: "Field research vessel anchored in a tidal creek during Sundarbans core extraction.",
    image_credit: "EcoToxLab Expedition Log",
    author_name: "Tanvir Hasan",
    author_role: "Graduate Fellow & Field Sampling Coordinator",
    author_avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80",
    published_at: "2026-05-14",
    read_time_minutes: 5,
    is_featured: false,
    is_published: true,
    display_order: 5,
    tags: ["Expedition", "Sundarbans", "Sediment Cores", "Field Sampling"],
    research_areas: [
      { id: "area-2", title: "Heavy Metal Biogeochemistry", slug: "heavy-metal-biogeochemistry" },
      { id: "area-3", title: "Aquatic Health & Watersheds", slug: "aquatic-health-watersheds" }
    ],
    projects: [
      { id: "proj-1", title: "Microplastic Trophic Transfer & Nanoparticle Ecotoxicology in Estuarine Food Webs", slug: "microplastic-trophic-transfer-estuarine-food-webs" }
    ],
    created_at: "2026-05-14T08:00:00Z",
    updated_at: "2026-05-14T08:00:00Z"
  },
  {
    id: "news-6",
    title: "Biochar and Nanoscale Zero-Valent Iron (nZVI) Remediation Pilot Yields 96% Cadmium Immobilization",
    slug: "biochar-nzvi-remediation-pilot-cadmium-immobilization",
    summary: "Pilot testing of engineered agricultural biochar amendments demonstrates highly efficient heavy metal immobilization in contaminated paddy soils.",
    content: `### Sustainable Remediation Innovation

In response to widespread heavy metal contamination in peri-urban agricultural soils, our environmental remediation team has successfully concluded pilot trials of engineered **Nanoscale Zero-Valent Iron modified Biochar (nZVI-BC)** amendments.

Field mesocosm trials conducted over two full crop cycles demonstrated:

- **Cadmium Immobilization Efficiency**: 96.4% reduction in bioavailable porewater Cd²⁺ ions.
- **Grain Translocation Reduction**: Accumulation in edible rice grains fell by 82%, safely below WHO/FAO maximum residue limits.
- **Soil Microbial Biomass Recovery**: Enhanced dehydrogenase and urease enzyme activities indicating restored rhizosphere microbial vitality.

---

### Scalable Manufacturing & Farmer Demonstration

Synthesized from agricultural waste rice husks through low-oxygen pyrolysis, the amendment costs less than $0.35 per kilogram to produce. Our team is partnering with local farmer cooperatives to launch five field-scale demonstration plots next quarter.`,
    category: "breakthrough",
    cover_image_url: "https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?auto=format&fit=crop&w=1200&q=80",
    image_caption: "Mesocosm soil testbeds evaluating biochar heavy metal immobilization rates.",
    image_credit: "EcoToxLab Remediation Core",
    author_name: "Sojib Chowdhury",
    author_role: "Senior Research Fellow & Analytical Lead",
    author_avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
    published_at: "2026-04-02",
    read_time_minutes: 5,
    is_featured: false,
    is_published: true,
    display_order: 6,
    tags: ["Biochar", "Remediation", "Heavy Metals", "Agriculture"],
    research_areas: [
      { id: "area-5", title: "Pollution Mitigation & Remediation", slug: "pollution-mitigation-remediation" }
    ],
    projects: [
      { id: "proj-2", title: "Heavy Metal Partitioning and Speciation in Coastal Aquaculture Systems", slug: "heavy-metal-partitioning-aquaculture" }
    ],
    created_at: "2026-04-02T16:00:00Z",
    updated_at: "2026-04-02T16:00:00Z"
  },
  {
    id: "news-7",
    title: "National Media Spotlight: BBC World Service Covers Lab's Plastic Ingestion Discoveries",
    slug: "bbc-world-service-covers-lab-plastic-ingestion-discoveries",
    summary: "Principal investigators discuss the ecological consequences of plastic additives in coastal marine life and policy recommendations for regional bans.",
    content: `### Scientific Evidence Informing Global Media & Public Policy

The Environmental Health & Ecotoxicology Laboratory's recent findings on microplastic ingestion across estuarine food webs were featured in an in-depth investigative segment by **BBC World Service** and regional national broadcasters.

During the broadcast, our researchers highlighted the critical distinction between inert natural silt particles and manufactured polymers containing endocrine-disrupting plasticizers.

---

### Policy Brief Submitted to Ministry of Environment

Following the broadcast, our laboratory submitted an official 24-page scientific policy advisory to the Ministry of Environment, Forest and Climate Change, outlining empirical thresholds for single-use plastic restrictions in estuarine protected zones.`,
    category: "press",
    cover_image_url: "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=1200&q=80",
    image_caption: "Laboratory researchers discussing analytical data during international broadcast interview.",
    image_credit: "BBC News Feature",
    author_name: "Dr. Marcus Thorne",
    author_role: "Senior Ecotoxicologist",
    author_avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=300&q=80",
    published_at: "2026-03-12",
    read_time_minutes: 3,
    is_featured: false,
    is_published: true,
    display_order: 7,
    tags: ["Media", "BBC", "Plastic Policy", "Public Science"],
    research_areas: [
      { id: "area-1", title: "Microplastics & Emerging Pollutants", slug: "microplastics-emerging-pollutants" }
    ],
    projects: [
      { id: "proj-1", title: "Microplastic Trophic Transfer & Nanoparticle Ecotoxicology in Estuarine Food Webs", slug: "microplastic-trophic-transfer-estuarine-food-webs" }
    ],
    created_at: "2026-03-12T13:40:00Z",
    updated_at: "2026-03-12T13:40:00Z"
  },
  {
    id: "news-8",
    title: "Call for Applications: 2026–2028 Doctoral Research Fellowships in Aquatic Ecotoxicology",
    slug: "call-for-applications-doctoral-research-fellowships-2026",
    summary: "Two fully-funded doctoral research studentships are open for applicants interested in microplastic bioaccumulation, nanoparticle imaging, and aquatic ecological risk modeling.",
    content: `### Fully Funded PhD Studentships (2026–2028)

The Environmental Health & Ecotoxicology Laboratory invites ambitious, high-achieving graduate researchers to apply for two fully-funded **Doctoral Research Fellowships** starting in Autumn 2026.

These positions are funded through the UNEP and National Science Foundation collaborative grant, providing a full tuition waiver, comprehensive health coverage, and an annual living stipend of **$32,000 USD** with dedicated research travel allowances.

---

### Research Thrusts & Available Projects

1. **Track A — Polymer Analytical Chemistry**: Micro-FTIR focal plane array imaging, Py-GC/MS thermal desorption, and identification of chemical additives in estuarine bioindicators.
2. **Track B — Ecotoxicological Modeling & Spatial Bioaccumulation**: Multi-trophic food web modeling, Bayesian risk analysis, and hydrochemical modeling in coastal delta basins.

---

### Candidate Eligibility & Requirements

- Master's degree in Environmental Science, Analytical Chemistry, Marine Biology, Ecotoxicology, or related disciplines with a minimum GPA of 3.6/4.0.
- Demonstrated hands-on laboratory experience with spectroscopy (FTIR/Raman/ICP-MS) or statistical modeling (R / Python / MATLAB).
- Strong English scientific communication and manuscript drafting capabilities.

---

### Application Procedure

Interested candidates should submit a single consolidated PDF containing:
1. Cover letter detailing research interests and motivation (max 2 pages).
2. Curriculum Vitae with complete academic transcripts and list of publications.
3. Names and contact details of two academic referees.

Submit applications directly via email to \`admissions@ecotox-lab.org\` with subject line \`[PhD Application 2026 - Track A/B]\`. Initial review begins **November 15, 2026**.`,
    category: "opportunity",
    cover_image_url: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80",
    image_caption: "Laboratory doctoral researchers analyzing spectroscopy data in the graduate computational suite.",
    image_credit: "EcoToxLab Graduate Admissions",
    author_name: "Dr. Marcus Thorne",
    author_role: "Senior Ecotoxicologist & Graduate Director",
    author_avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=300&q=80",
    published_at: "2026-09-01",
    read_time_minutes: 4,
    is_featured: true,
    is_published: true,
    display_order: 8,
    tags: ["PhD Fellowship", "Opportunity", "Funding", "Admissions", "Ecotoxicology"],
    research_areas: [
      { id: "area-1", title: "Microplastics & Emerging Pollutants", slug: "microplastics-emerging-pollutants" },
      { id: "area-3", title: "Aquatic Health & Watersheds", slug: "aquatic-health-watersheds" }
    ],
    projects: [
      { id: "proj-1", title: "Microplastic Trophic Transfer & Nanoparticle Ecotoxicology in Estuarine Food Webs", slug: "microplastic-trophic-transfer-estuarine-food-webs" }
    ],
    created_at: "2026-09-01T09:00:00Z",
    updated_at: "2026-09-01T09:00:00Z"
  },
  {
    id: "news-9",
    title: "Open Position: Postdoctoral Research Scientist in Trace Metal Biogeochemistry & Mass Spectrometry",
    slug: "open-position-postdoctoral-research-scientist-trace-metals",
    summary: "Seeking an experienced analytical geochemist/toxicologist to lead cleanroom ICP-MS instrumentation operations and coastal metal partitioning research.",
    content: `### Postdoctoral Research Fellow in Analytical Biogeochemistry

We are recruiting a **Postdoctoral Research Scientist** to join our cleanroom instrumentation core. The successful candidate will lead high-precision trace element speciation and isotope ratio analyses using our newly commissioned ICP-MS facility.

---

### Core Responsibilities

- Supervise day-to-day operation, routine calibration, and sample digestion pipelines for cleanroom ICP-MS and AAS suites.
- Lead research investigations on arsenic and cadmium speciation in coastal sediment porewater matrices.
- Co-mentor graduate students and co-author high-impact manuscripts in leading Q1 journals.

---

### Compensation & Terms

- Initial 2-year appointment with potential for extension.
- Annual competitive salary ($62,000–$68,000 USD) commensurate with experience, plus comprehensive university health and retirement benefits.
- Annual research and conference travel budget ($4,500 USD).

Applications are reviewed on a rolling basis until the position is filled.`,
    category: "opportunity",
    cover_image_url: "https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=1200&q=80",
    image_caption: "Analytical cleanroom facility where the postdoctoral fellow will conduct isotopic measurements.",
    image_credit: "EcoToxLab Recruitment Core",
    author_name: "Sojib Chowdhury",
    author_role: "Senior Research Fellow & Analytical Lead",
    author_avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
    published_at: "2026-08-18",
    read_time_minutes: 4,
    is_featured: false,
    is_published: true,
    display_order: 9,
    tags: ["Postdoc", "Opportunity", "Job Opening", "ICP-MS", "Biogeochemistry"],
    research_areas: [
      { id: "area-2", title: "Heavy Metal Biogeochemistry", slug: "heavy-metal-biogeochemistry" }
    ],
    projects: [
      { id: "proj-2", title: "Heavy Metal Partitioning and Speciation in Coastal Aquaculture Systems", slug: "heavy-metal-partitioning-aquaculture" }
    ],
    created_at: "2026-08-18T11:00:00Z",
    updated_at: "2026-08-18T11:00:00Z"
  }
];

export const NEWS_CATEGORIES_META: Record<
  string,
  { label: string; color: string; bgLight: string; bgDark: string; borderLight: string; borderDark: string }
> = {
  breakthrough: {
    label: "Research Breakthrough",
    color: "text-emerald-800 dark:text-[#34D399]",
    bgLight: "bg-emerald-100",
    bgDark: "dark:bg-emerald-950/80",
    borderLight: "border-emerald-300",
    borderDark: "dark:border-emerald-800",
  },
  opportunity: {
    label: "Opportunities & Openings",
    color: "text-amber-800 dark:text-amber-300",
    bgLight: "bg-amber-100",
    bgDark: "dark:bg-amber-950/80",
    borderLight: "border-amber-300",
    borderDark: "dark:border-amber-800/80",
  },
  expedition: {
    label: "Field Expedition",
    color: "text-blue-800 dark:text-blue-400",
    bgLight: "bg-blue-100",
    bgDark: "dark:bg-blue-950/80",
    borderLight: "border-blue-300",
    borderDark: "dark:border-blue-800",
  },
  grant_award: {
    label: "Grant Award",
    color: "text-amber-800 dark:text-amber-400",
    bgLight: "bg-amber-100",
    bgDark: "dark:bg-amber-950/80",
    borderLight: "border-amber-300",
    borderDark: "dark:border-amber-800",
  },
  symposium: {
    label: "Symposium & Talks",
    color: "text-purple-800 dark:text-purple-400",
    bgLight: "bg-purple-100",
    bgDark: "dark:bg-purple-950/80",
    borderLight: "border-purple-300",
    borderDark: "dark:border-purple-800",
  },
  lab_update: {
    label: "Facility & Lab Update",
    color: "text-teal-800 dark:text-teal-400",
    bgLight: "bg-teal-100",
    bgDark: "dark:bg-teal-950/80",
    borderLight: "border-teal-300",
    borderDark: "dark:border-teal-800",
  },
  press: {
    label: "Press & Media",
    color: "text-rose-800 dark:text-rose-400",
    bgLight: "bg-rose-100",
    bgDark: "dark:bg-rose-950/80",
    borderLight: "border-rose-300",
    borderDark: "dark:border-rose-800",
  },
};
