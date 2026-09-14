export type TeamCategory = "pi" | "phd" | "graduate" | "undergraduate" | "alumni";

export interface AcademicAppointment {
  role: string;
  institution: string;
  period: string;
  department?: string;
}

export interface AcademicGrant {
  title: string;
  fundingAgency: string;
  amount: string;
  period: string;
  role: string;
}

export interface MemberPublication {
  title: string;
  journal: string;
  year: number;
  doi?: string;
  url?: string;
  role?: string;
  authors?: string;
}

export interface PICurriculumVitae {
  title: string;
  summary: string;
  education: Array<{ degree: string; institution: string; year: string; details?: string }>;
  appointments: AcademicAppointment[];
  grants: AcademicGrant[];
  selectedPublications: Array<{ title: string; journal: string; year: number; doi?: string }>;
  awards: Array<{ title: string; organization: string; year: string }>;
  editorialService: string[];
  memberships: string[];
}

export interface TeamMember {
  id: string;
  name: string;
  slug: string;
  role: string;
  category: TeamCategory;
  department?: string;
  affiliation?: string;
  bio?: string;
  researchInterests: string[];
  education?: string[];
  email?: string;
  phone?: string;
  officeLocation?: string;
  googleScholarUrl?: string;
  orcid?: string;
  researchGateUrl?: string;
  linkedinUrl?: string;
  websiteUrl?: string;
  imageSrc: string;
  imageAlt?: string;
  
  // PI specific
  quote?: string;
  publicationsCount?: number;
  citationsCount?: number;
  hIndex?: number;
  grantsCount?: number;
  advisingCount?: number;
  cvUrl?: string;
  curriculumVitae?: PICurriculumVitae;
  
  // Project & Thesis titles & descriptions
  undergradThesis?: string;
  undergradDescription?: string;
  mscThesis?: string;
  mscDescription?: string;
  phdThesis?: string;
  phdDescription?: string;
  
  // Legacy / fallback topic field
  thesisTopic?: string;
  advisor?: string;
  expectedGraduation?: string;
  
  // Alumni specific
  currentPosition?: string;
  currentInstitution?: string;
  alumniYear?: string;
  pastRole?: string;
  
  skills?: string[];
  awards?: string[];
  publications?: MemberPublication[];
  
  orderIndex?: number;
  isActive: boolean;
}

export interface TeamCategoryMeta {
  id: TeamCategory;
  label: string;
  shortLabel: string;
  description: string;
  badgeColor: string;
}
