"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAdminTheme } from "@/lib/admin-theme";
import {
  Users,
  Plus,
  Trash2,
  Edit3,
  Search,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ExternalLink,
  GraduationCap,
  Award,
  BookOpen,
  Sparkles,
  Mail,
  Compass,
  X,
  Layers,
  FlaskConical,
  Filter,
  Check,
  RefreshCw,
  FileText,
  Clock,
  Eye,
  ArrowUpRight,
  ChevronRight,
  ShieldCheck,
  Tag,
  Building2,
  MapPin,
  Globe,
  Quote,
  MoveUp,
  MoveDown,
} from "lucide-react";
import { getTeamMembers, saveTeamMember, deleteTeamMember } from "@/lib/team/store";
import { TeamMember, TeamCategory, MemberPublication } from "@/lib/team/types";
import { TEAM_CATEGORIES_META } from "@/lib/team/seed-data";

export default function AdminTeamPage() {
  const { theme } = useAdminTheme();
  const isLight = theme === "light";

  const [members, setMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Modal / Drawer state
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "basic" | "media" | "bio" | "theses" | "publications" | "alumni" | "social"
  >("basic");
  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Delete modal state
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form State
  const initialFormState: Partial<TeamMember> = {
    id: "",
    name: "",
    slug: "",
    role: "",
    category: "undergraduate",
    department: "Department of Environmental Sciences",
    affiliation: "Jahangirnagar University",
    bio: "",
    quote: "",
    researchInterests: [],
    skills: [],
    awards: [],
    education: [],
    publications: [],
    undergradThesis: "",
    undergradDescription: "",
    mscThesis: "",
    mscDescription: "",
    phdThesis: "",
    phdDescription: "",
    thesisTopic: "",
    advisor: "",
    expectedGraduation: "",
    currentPosition: "",
    currentInstitution: "",
    alumniYear: "",
    pastRole: "",
    email: "",
    phone: "",
    officeLocation: "",
    googleScholarUrl: "",
    orcid: "",
    researchGateUrl: "",
    linkedinUrl: "",
    websiteUrl: "",
    imageSrc:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80",
    orderIndex: 0,
    isActive: true,
  };

  const [formData, setFormData] = useState<Partial<TeamMember>>(initialFormState);
  const [interestsInput, setInterestsInput] = useState("");
  const [skillsInput, setSkillsInput] = useState("");
  const [awardsInput, setAwardsInput] = useState("");
  const [educationInput, setEducationInput] = useState("");

  // Publication sub-form in editor
  const [pubForm, setPubForm] = useState<MemberPublication>({
    title: "",
    journal: "",
    year: new Date().getFullYear(),
    doi: "",
    role: "First Author",
  });

  const loadData = async () => {
    setIsLoading(true);
    try {
      const data = await getTeamMembers();
      setMembers(data);
    } catch (e) {
      console.error("Failed to load team members", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filtered members list
  const filteredMembers = members.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.currentPosition?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.currentInstitution?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.undergradThesis?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.mscThesis?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.phdThesis?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      categoryFilter === "all" || m.category === categoryFilter;

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && m.isActive !== false) ||
      (statusFilter === "inactive" && m.isActive === false);

    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Metric counts
  const totalCount = members.length;
  const piCount = members.filter((m) => m.category === "pi").length;
  const phdCount = members.filter((m) => m.category === "phd").length;
  const gradCount = members.filter((m) => m.category === "graduate").length;
  const ugCount = members.filter((m) => m.category === "undergraduate").length;
  const alumniCount = members.filter((m) => m.category === "alumni").length;
  const activeCount = members.filter((m) => m.isActive !== false).length;

  const handleOpenAdd = () => {
    setFormData({
      ...initialFormState,
      orderIndex: members.length + 1,
    });
    setInterestsInput("");
    setSkillsInput("");
    setAwardsInput("");
    setEducationInput("");
    setActiveTab("basic");
    setShowModal(true);
  };

  const handleOpenEdit = (member: TeamMember) => {
    setFormData({ ...member });
    setInterestsInput((member.researchInterests || []).join(", "));
    setSkillsInput((member.skills || []).join(", "));
    setAwardsInput((member.awards || []).join("\n"));
    setEducationInput((member.education || []).join("\n"));
    setActiveTab("basic");
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name?.trim()) {
      setStatusMessage({ type: "error", text: "Please enter the researcher's name." });
      return;
    }

    setSaving(true);
    setStatusMessage(null);

    try {
      const interestsArray = interestsInput
        .split(",")
        .map((i) => i.trim())
        .filter(Boolean);

      const skillsArray = skillsInput
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      const awardsArray = awardsInput
        .split("\n")
        .map((a) => a.trim())
        .filter(Boolean);

      const educationArray = educationInput
        .split("\n")
        .map((e) => e.trim())
        .filter(Boolean);

      const slug =
        formData.slug ||
        formData.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

      const payload: Partial<TeamMember> = {
        ...formData,
        slug,
        researchInterests: interestsArray,
        skills: skillsArray,
        awards: awardsArray,
        education: educationArray,
      };

      await saveTeamMember(payload);
      await loadData();

      setStatusMessage({
        type: "success",
        text: `Researcher "${formData.name}" saved successfully!`,
      });
      setTimeout(() => {
        setShowModal(false);
        setStatusMessage(null);
      }, 900);
    } catch (err) {
      console.error(err);
      setStatusMessage({ type: "error", text: "Failed to save team member." });
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (member: TeamMember) => {
    try {
      const updated = { ...member, isActive: !member.isActive };
      await saveTeamMember(updated);
      await loadData();
    } catch (e) {
      console.error("Failed to toggle status", e);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteTeamMember(id);
      await loadData();
      setDeleteConfirmId(null);
      setStatusMessage({ type: "success", text: "Researcher deleted successfully." });
      setTimeout(() => setStatusMessage(null), 3000);
    } catch (e) {
      console.error("Failed to delete", e);
      setStatusMessage({ type: "error", text: "Failed to delete researcher." });
    }
  };

  const handleAddPublication = () => {
    if (!pubForm.title.trim()) return;
    const currentPubs = formData.publications || [];
    setFormData({
      ...formData,
      publications: [pubForm, ...currentPubs],
    });
    setPubForm({
      title: "",
      journal: "",
      year: new Date().getFullYear(),
      doi: "",
      role: "First Author",
    });
  };

  const handleRemovePublication = (index: number) => {
    const currentPubs = formData.publications || [];
    setFormData({
      ...formData,
      publications: currentPubs.filter((_, idx) => idx !== index),
    });
  };

  return (
    <div className="space-y-8 pb-20">
      {/* Toast Notification */}
      {statusMessage && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl border text-sm font-bold backdrop-blur-md animate-in slide-in-from-bottom-5 duration-300 ${
            statusMessage.type === "success"
              ? "bg-emerald-950/90 border-emerald-500/50 text-emerald-300"
              : "bg-rose-950/90 border-rose-500/50 text-rose-300"
          }`}
        >
          {statusMessage.type === "success" ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
          )}
          <span>{statusMessage.text}</span>
          <button
            onClick={() => setStatusMessage(null)}
            className="ml-2 hover:opacity-75"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ============================================================ */}
      {/* 1. HEADER & ACTION BAR */}
      {/* ============================================================ */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-[family-name:var(--font-manrope)] tracking-tight">
                Team &amp; Personnel Manager
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                Create, edit, organize research hierarchy, and manage full academic profiles.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/team"
            target="_blank"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold transition border border-slate-200 dark:border-slate-700"
          >
            <span>View Public Team Page</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold transition shadow-md shadow-emerald-950/20 active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Researcher</span>
          </button>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 2. STATS OVERVIEW CARDS */}
      {/* ============================================================ */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
            Total Team
          </span>
          <div className="text-2xl font-black text-slate-900 dark:text-white font-[family-name:var(--font-manrope)]">
            {totalCount}
          </div>
          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
            {activeCount} Active Members
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-1">
            <ShieldCheck className="w-3 h-3" />
            <span>Principal Inv.</span>
          </span>
          <div className="text-2xl font-black text-slate-900 dark:text-white font-[family-name:var(--font-manrope)]">
            {piCount}
          </div>
          <span className="text-[10px] text-slate-500 dark:text-slate-400">
            Lab Directorship
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wider flex items-center gap-1">
            <Layers className="w-3 h-3" />
            <span>Postdoc &amp; PhD</span>
          </span>
          <div className="text-2xl font-black text-slate-900 dark:text-white font-[family-name:var(--font-manrope)]">
            {phdCount}
          </div>
          <span className="text-[10px] text-slate-500 dark:text-slate-400">
            Independent Researchers
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-wider flex items-center gap-1">
            <BookOpen className="w-3 h-3" />
            <span>M.Sc. Graduate</span>
          </span>
          <div className="text-2xl font-black text-slate-900 dark:text-white font-[family-name:var(--font-manrope)]">
            {gradCount}
          </div>
          <span className="text-[10px] text-slate-500 dark:text-slate-400">
            Thesis Candidates
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider flex items-center gap-1">
            <GraduationCap className="w-3 h-3" />
            <span>Undergraduate</span>
          </span>
          <div className="text-2xl font-black text-slate-900 dark:text-white font-[family-name:var(--font-manrope)]">
            {ugCount}
          </div>
          <span className="text-[10px] text-slate-500 dark:text-slate-400">
            Honors &amp; Interns
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            <span>Alumni Network</span>
          </span>
          <div className="text-2xl font-black text-slate-900 dark:text-white font-[family-name:var(--font-manrope)]">
            {alumniCount}
          </div>
          <span className="text-[10px] text-slate-500 dark:text-slate-400">
            Global Placements
          </span>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 3. FILTERS, SEARCH & TABS */}
      {/* ============================================================ */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 p-4 rounded-3xl bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 shadow-sm">
        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
          {[
            { id: "all", label: "All Members", count: totalCount },
            { id: "pi", label: "PI & Director", count: piCount },
            { id: "phd", label: "Postdoc & PhD", count: phdCount },
            { id: "graduate", label: "M.Sc. Graduate", count: gradCount },
            { id: "undergraduate", label: "Undergraduate", count: ugCount },
            { id: "alumni", label: "Alumni Network", count: alumniCount },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setCategoryFilter(tab.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
                categoryFilter === tab.id
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "bg-slate-50 dark:bg-[#0B1120] text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800"
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`px-1.5 py-0.2 rounded-md text-[10px] font-black ${
                  categoryFilter === tab.id
                    ? "bg-black/20 text-white"
                    : "bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search & Status Filter */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search researchers, topics, email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-[#0B1120] border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#0B1120] border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="all">All Status</option>
            <option value="active">Active Only</option>
            <option value="inactive">Inactive Only</option>
          </select>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 4. RESEARCHERS TABLE */}
      {/* ============================================================ */}
      <div className="rounded-3xl bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3 text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
            <span className="text-xs font-semibold">Loading personnel records...</span>
          </div>
        ) : filteredMembers.length === 0 ? (
          <div className="py-20 text-center space-y-3">
            <Users className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto" />
            <div className="text-base font-bold text-slate-900 dark:text-white">
              No researchers found
            </div>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              No members matched your search or category filter. Try clearing filters or add a new researcher.
            </p>
            <button
              onClick={handleOpenAdd}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Member</span>
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-[#0B1120]/60 text-[11px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  <th className="py-3.5 px-5">Researcher &amp; Category</th>
                  <th className="py-3.5 px-4">Role &amp; Affiliation</th>
                  <th className="py-3.5 px-4">Research / Destination</th>
                  <th className="py-3.5 px-4 text-center">Publications</th>
                  <th className="py-3.5 px-4 text-center">Status</th>
                  <th className="py-3.5 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 text-xs">
                {filteredMembers.map((member) => {
                  const meta = TEAM_CATEGORIES_META[member.category] || {
                    label: member.category,
                    badgeColor: "bg-slate-100 text-slate-700",
                  };
                  const isAlumni = member.category === "alumni";

                  return (
                    <tr
                      key={member.id}
                      className="hover:bg-slate-50/80 dark:hover:bg-[#0B1120]/40 transition-colors group"
                    >
                      {/* Researcher Info */}
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-3.5">
                          <img
                            src={member.imageSrc}
                            alt={member.name}
                            className="w-12 h-12 rounded-2xl object-cover object-top border border-slate-200 dark:border-slate-800 shrink-0 shadow-2xs"
                          />
                          <div className="min-w-0 space-y-1">
                            <div className="font-bold text-slate-900 dark:text-white text-sm group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition truncate">
                              {member.name}
                            </div>
                            <div className="flex items-center gap-1.5">
                              <span
                                className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${meta.badgeColor}`}
                              >
                                {meta.label}
                              </span>
                              {member.alumniYear && (
                                <span className="px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[9px] font-bold text-slate-600 dark:text-slate-400">
                                  {member.alumniYear}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Role & Affiliation */}
                      <td className="py-4 px-4 max-w-[220px]">
                        <div className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                          {member.role}
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                          {member.department || member.affiliation || "Department of Environmental Sciences"}
                        </div>
                        {member.email && (
                          <div className="text-[10px] text-slate-400 flex items-center gap-1 pt-0.5 truncate">
                            <Mail className="w-3 h-3 text-emerald-500 shrink-0" />
                            <span>{member.email}</span>
                          </div>
                        )}
                      </td>

                      {/* Research Topics / Placement */}
                      <td className="py-4 px-4 max-w-[260px]">
                        {isAlumni ? (
                          <div className="space-y-0.5">
                            <div className="text-[11px] font-bold text-amber-600 dark:text-amber-400 truncate">
                              {member.currentPosition || "Career Placement"}
                            </div>
                            <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                              {member.currentInstitution || "Active Alumnus"}
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-1">
                            <div className="text-[11px] text-slate-700 dark:text-slate-300 font-medium line-clamp-1">
                              {member.undergradThesis ||
                                member.mscThesis ||
                                member.phdThesis ||
                                (member.researchInterests && member.researchInterests[0]) ||
                                "Ecotoxicological Research"}
                            </div>
                            {member.researchInterests && member.researchInterests.length > 0 && (
                              <div className="flex flex-wrap gap-1">
                                {member.researchInterests.slice(0, 2).map((r, i) => (
                                  <span
                                    key={i}
                                    className="px-1.5 py-0.2 rounded bg-slate-100 dark:bg-[#0B1120] text-[9px] text-slate-600 dark:text-slate-400 font-medium truncate max-w-[120px]"
                                  >
                                    {r}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </td>

                      {/* Publications Count */}
                      <td className="py-4 px-4 text-center">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-[#0B1120] border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold">
                          <FileText className="w-3 h-3 text-emerald-500" />
                          <span>
                            {member.publications?.length ||
                              (member.category === "pi" ? member.publicationsCount || 74 : 0)}
                          </span>
                        </span>
                      </td>

                      {/* Active Status Toggle */}
                      <td className="py-4 px-4 text-center">
                        <button
                          onClick={() => handleToggleActive(member)}
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold transition cursor-pointer border ${
                            member.isActive !== false
                              ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20"
                              : "bg-slate-100 dark:bg-slate-800 text-slate-500 border-slate-300 dark:border-slate-700 hover:bg-slate-200"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              member.isActive !== false ? "bg-emerald-500" : "bg-slate-400"
                            }`}
                          />
                          <span>{member.isActive !== false ? "Active" : "Inactive"}</span>
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* View Profile */}
                          <Link
                            href={`/team/${member.slug}`}
                            target="_blank"
                            title="View Public Profile"
                            className="p-2 rounded-xl bg-slate-50 dark:bg-[#0B1120] hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-emerald-500 transition border border-slate-200 dark:border-slate-800"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </Link>

                          {/* Edit */}
                          <button
                            onClick={() => handleOpenEdit(member)}
                            title="Edit Researcher"
                            className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 text-emerald-700 dark:text-emerald-400 transition border border-emerald-200 dark:border-emerald-800/60 cursor-pointer"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>

                          {/* Delete */}
                          <button
                            onClick={() => setDeleteConfirmId(member.id)}
                            title="Delete Researcher"
                            className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/30 hover:bg-rose-100 dark:hover:bg-rose-900/50 text-rose-600 dark:text-rose-400 transition border border-rose-200 dark:border-rose-800/60 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ============================================================ */}
      {/* 5. RESEARCHER CREATE / EDIT MODAL DRAWER */}
      {/* ============================================================ */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/75 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-4xl rounded-3xl bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-[#0B1120]/50 shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white font-[family-name:var(--font-manrope)]">
                    {formData.id ? "Edit Researcher Profile" : "Create New Team Member"}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Fill in academic credentials, theses, publications, and career data.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowModal(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Tab Navigation */}
            <div className="flex items-center gap-2 px-6 py-2.5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/30 dark:bg-[#0B1120]/30 overflow-x-auto scrollbar-none shrink-0">
              {[
                { id: "basic", label: "Basic Info", icon: Users },
                { id: "media", label: "Photo & Media", icon: Sparkles },
                { id: "bio", label: "Bio & Focus", icon: FlaskConical },
                { id: "theses", label: "Theses & Projects", icon: BookOpen },
                { id: "publications", label: "Publications", icon: FileText },
                { id: "alumni", label: "Alumni Placement", icon: Compass },
                { id: "social", label: "Social & Contact", icon: Globe },
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                      activeTab === tab.id
                        ? "bg-emerald-600 text-white shadow-xs"
                        : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Modal Body / Tab Content */}
            <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6">
              
              {/* ----------------- TAB 1: BASIC INFO ----------------- */}
              {activeTab === "basic" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        Full Name &amp; Academic Title <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Dr. Mohammad S. Kabir or Farhan Sadik"
                        value={formData.name || ""}
                        onChange={(e) => {
                          const name = e.target.value;
                          setFormData({
                            ...formData,
                            name,
                            slug: formData.slug || name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
                          });
                        }}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#0B1120] border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        URL Slug (Unique profile link identifier)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. farhan-sadik"
                        value={formData.slug || ""}
                        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#0B1120] border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        Academic Hierarchy Category <span className="text-rose-500">*</span>
                      </label>
                      <select
                        value={formData.category || "undergraduate"}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            category: e.target.value as TeamCategory,
                          })
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#0B1120] border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                      >
                        <option value="pi">Principal Investigator &amp; Lab Director</option>
                        <option value="phd">Postdoctoral &amp; PhD Researcher (Postdoc, Ph.D.)</option>
                        <option value="graduate">Graduate Researcher (M.Sc. &amp; M.S.)</option>
                        <option value="undergraduate">Undergraduate Fellow &amp; Assistant</option>
                        <option value="alumni">Lab Alumni Network</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        Lab Role / Academic Designation <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Senior Graduate Researcher & Lab Manager"
                        value={formData.role || ""}
                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#0B1120] border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        Department
                      </label>
                      <input
                        type="text"
                        value={formData.department || ""}
                        onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#0B1120] border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        Affiliation / University
                      </label>
                      <input
                        type="text"
                        value={formData.affiliation || ""}
                        onChange={(e) => setFormData({ ...formData, affiliation: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#0B1120] border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        Display Order Index (Lower numbers appear first)
                      </label>
                      <input
                        type="number"
                        value={formData.orderIndex || 0}
                        onChange={(e) =>
                          setFormData({ ...formData, orderIndex: parseInt(e.target.value) || 0 })
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#0B1120] border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>

                    <div className="flex items-center gap-3 pt-6">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.isActive !== false}
                          onChange={(e) =>
                            setFormData({ ...formData, isActive: e.target.checked })
                          }
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                      </label>
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                        Active Profile (Visible on Public Website)
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* ----------------- TAB 2: PHOTO & MEDIA ----------------- */}
              {activeTab === "media" && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row items-center gap-6 p-6 rounded-3xl bg-slate-50 dark:bg-[#0B1120] border border-slate-200 dark:border-slate-800">
                    <div className="relative w-36 h-36 rounded-3xl overflow-hidden border-4 border-white dark:border-slate-800 shadow-lg shrink-0 bg-slate-900">
                      <img
                        src={
                          formData.imageSrc ||
                          "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80"
                        }
                        alt="Preview"
                        className="w-full h-full object-cover object-top"
                      />
                    </div>

                    <div className="space-y-3 flex-1">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                          Portrait Image URL <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="url"
                          required
                          placeholder="https://images.unsplash.com/..."
                          value={formData.imageSrc || ""}
                          onChange={(e) =>
                            setFormData({ ...formData, imageSrc: e.target.value })
                          }
                          className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>

                      <div className="flex flex-wrap gap-2 text-[11px]">
                        <button
                          type="button"
                          onClick={() =>
                            setFormData({
                              ...formData,
                              imageSrc:
                                "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80",
                            })
                          }
                          className="px-2.5 py-1 rounded-lg bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 hover:border-emerald-500 text-slate-600 dark:text-slate-300 transition"
                        >
                          Default Portrait 1
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setFormData({
                              ...formData,
                              imageSrc:
                                "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80",
                            })
                          }
                          className="px-2.5 py-1 rounded-lg bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 hover:border-emerald-500 text-slate-600 dark:text-slate-300 transition"
                        >
                          Default Portrait 2
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setFormData({
                              ...formData,
                              imageSrc:
                                "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=600&q=80",
                            })
                          }
                          className="px-2.5 py-1 rounded-lg bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 hover:border-emerald-500 text-slate-600 dark:text-slate-300 transition"
                        >
                          Default Portrait 3
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ----------------- TAB 3: BIO & RESEARCH FOCUS ----------------- */}
              {activeTab === "bio" && (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Professional Academic Biography
                    </label>
                    <textarea
                      rows={4}
                      placeholder="Comprehensive overview of research activities, expertise, analytical methodologies..."
                      value={formData.bio || ""}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#0B1120] border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 leading-relaxed"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Personal Research Quote / Vision Statement
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Translating high-resolution chemical data into evidence-based ecological protection."
                      value={formData.quote || ""}
                      onChange={(e) => setFormData({ ...formData, quote: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#0B1120] border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Core Research Focus Areas (Comma separated)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Microplastics, Heavy Metal Speciation, Water Quality Sensors, Ecotoxicology"
                      value={interestsInput}
                      onChange={(e) => setInterestsInput(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#0B1120] border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        Technical &amp; Lab Skills (Comma separated)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Micro-FTIR, ICP-MS, AAS, qRT-PCR, R, QGIS"
                        value={skillsInput}
                        onChange={(e) => setSkillsInput(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#0B1120] border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        Academic Degrees / Education (One per line)
                      </label>
                      <textarea
                        rows={3}
                        placeholder="e.g. M.Sc. in Environmental Sciences, Jahangirnagar University (2024)"
                        value={educationInput}
                        onChange={(e) => setEducationInput(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#0B1120] border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Awards &amp; Fellowships (One per line)
                    </label>
                    <textarea
                      rows={2}
                      placeholder="e.g. National Science and Technology (NST) Fellowship (2024)"
                      value={awardsInput}
                      onChange={(e) => setAwardsInput(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#0B1120] border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>
              )}

              {/* ----------------- TAB 4: THESES & PROJECTS ----------------- */}
              {activeTab === "theses" && (
                <div className="space-y-6">
                  {/* Undergrad Capstone */}
                  <div className="p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-900/50 space-y-3">
                    <div className="flex items-center gap-2 text-xs font-bold text-indigo-700 dark:text-indigo-300 uppercase tracking-wider">
                      <GraduationCap className="w-4 h-4" />
                      <span>Undergraduate 4th-Year Capstone Thesis</span>
                    </div>

                    <div className="space-y-2">
                      <input
                        type="text"
                        placeholder="Undergraduate Thesis Title"
                        value={formData.undergradThesis || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, undergradThesis: e.target.value })
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#0B1120] border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-900 dark:text-white"
                      />
                      <textarea
                        rows={2}
                        placeholder="Methodology, findings, extraction recovery, sampling transects..."
                        value={formData.undergradDescription || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, undergradDescription: e.target.value })
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#0B1120] border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>

                  {/* M.Sc. Thesis */}
                  <div className="p-4 rounded-2xl bg-cyan-50/50 dark:bg-cyan-950/20 border border-cyan-200 dark:border-cyan-900/50 space-y-3">
                    <div className="flex items-center gap-2 text-xs font-bold text-cyan-700 dark:text-cyan-300 uppercase tracking-wider">
                      <BookOpen className="w-4 h-4" />
                      <span>Master of Science (M.Sc.) Thesis</span>
                    </div>

                    <div className="space-y-2">
                      <input
                        type="text"
                        placeholder="Master of Science Thesis Title"
                        value={formData.mscThesis || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, mscThesis: e.target.value })
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#0B1120] border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-900 dark:text-white"
                      />
                      <textarea
                        rows={2}
                        placeholder="Analytical parameters, bioaccumulation kinetics, model formulations..."
                        value={formData.mscDescription || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, mscDescription: e.target.value })
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#0B1120] border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>

                  {/* Ph.D. Dissertation */}
                  <div className="p-4 rounded-2xl bg-teal-50/50 dark:bg-teal-950/20 border border-teal-200 dark:border-teal-900/50 space-y-3">
                    <div className="flex items-center gap-2 text-xs font-bold text-teal-700 dark:text-teal-300 uppercase tracking-wider">
                      <Layers className="w-4 h-4" />
                      <span>Ph.D. Doctoral Dissertation</span>
                    </div>

                    <div className="space-y-2">
                      <input
                        type="text"
                        placeholder="Doctoral Dissertation Title"
                        value={formData.phdThesis || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, phdThesis: e.target.value })
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#0B1120] border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-900 dark:text-white"
                      />
                      <textarea
                        rows={2}
                        placeholder="Hypotheses, toxicogenomic assays, non-target screening discoveries..."
                        value={formData.phdDescription || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, phdDescription: e.target.value })
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#0B1120] border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>

                  {/* Advisor & Graduation */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        Primary Academic Advisor
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Dr. Mohammad S. Kabir"
                        value={formData.advisor || ""}
                        onChange={(e) => setFormData({ ...formData, advisor: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#0B1120] border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        Expected Completion / Graduation Year
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 2026 or Fall 2027"
                        value={formData.expectedGraduation || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, expectedGraduation: e.target.value })
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#0B1120] border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* ----------------- TAB 5: PUBLICATIONS ----------------- */}
              {activeTab === "publications" && (
                <div className="space-y-6">
                  {/* Add Publication Box */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-[#0B1120] border border-slate-200 dark:border-slate-800 space-y-3">
                    <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5 uppercase tracking-wider">
                      <Plus className="w-3.5 h-3.5 text-emerald-500" />
                      <span>Add Authored Paper / Publication</span>
                    </div>

                    <div className="space-y-2">
                      <input
                        type="text"
                        placeholder="Paper Title (e.g. Microplastic ingestion and trophic accumulation...)"
                        value={pubForm.title}
                        onChange={(e) => setPubForm({ ...pubForm, title: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-900 dark:text-white"
                      />

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <input
                          type="text"
                          placeholder="Journal, Volume, Pages"
                          value={pubForm.journal}
                          onChange={(e) => setPubForm({ ...pubForm, journal: e.target.value })}
                          className="sm:col-span-2 px-3.5 py-2 rounded-xl bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white"
                        />
                        <input
                          type="number"
                          placeholder="Year"
                          value={pubForm.year}
                          onChange={(e) =>
                            setPubForm({ ...pubForm, year: parseInt(e.target.value) || 2025 })
                          }
                          className="px-3.5 py-2 rounded-xl bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white font-bold"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <input
                          type="text"
                          placeholder="DOI (e.g. 10.1016/j.envpol.2025.122340)"
                          value={pubForm.doi || ""}
                          onChange={(e) => setPubForm({ ...pubForm, doi: e.target.value })}
                          className="px-3.5 py-2 rounded-xl bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white"
                        />
                        <select
                          value={pubForm.role || "First Author"}
                          onChange={(e) => setPubForm({ ...pubForm, role: e.target.value })}
                          className="px-3.5 py-2 rounded-xl bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-900 dark:text-white"
                        >
                          <option value="First Author">First Author</option>
                          <option value="Lead Author">Lead Author</option>
                          <option value="Co-Author">Co-Author</option>
                          <option value="Corresponding Author">Corresponding Author</option>
                        </select>
                      </div>

                      <button
                        type="button"
                        onClick={handleAddPublication}
                        className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition flex items-center gap-1.5"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Publication to Profile</span>
                      </button>
                    </div>
                  </div>

                  {/* Publications List */}
                  <div className="space-y-2">
                    <div className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Attached Publications ({formData.publications?.length || 0})
                    </div>

                    {(!formData.publications || formData.publications.length === 0) ? (
                      <p className="text-xs text-slate-400 italic">No individual papers listed yet.</p>
                    ) : (
                      <div className="space-y-2">
                        {formData.publications.map((pub, idx) => (
                          <div
                            key={idx}
                            className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#0B1120] border border-slate-200 dark:border-slate-800 flex items-start justify-between gap-3 text-xs"
                          >
                            <div className="space-y-1 min-w-0">
                              <div className="font-bold text-slate-900 dark:text-white leading-snug">
                                {pub.title}
                              </div>
                              <div className="text-slate-500 dark:text-slate-400 italic">
                                {pub.journal} ({pub.year}) • <span className="text-emerald-500 font-semibold">{pub.role}</span>
                              </div>
                              {pub.doi && (
                                <div className="text-[10px] text-slate-400">
                                  DOI: {pub.doi}
                                </div>
                              )}
                            </div>

                            <button
                              type="button"
                              onClick={() => handleRemovePublication(idx)}
                              className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-500/10 transition shrink-0"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ----------------- TAB 6: ALUMNI CAREER ----------------- */}
              {activeTab === "alumni" && (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-800 dark:text-amber-300 text-xs flex gap-2">
                    <Sparkles className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    <span>
                      These career destination and alumni metrics display prominently on the Alumni Network cards and profile pages.
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        Current Designation / Position (Yellow Highlight)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Assistant Professor or Senior Chemist"
                        value={formData.currentPosition || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, currentPosition: e.target.value })
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#0B1120] border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-900 dark:text-white"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        Current Destination Institution / Organization
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. ETH Zürich or U.S. EPA"
                        value={formData.currentInstitution || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, currentInstitution: e.target.value })
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#0B1120] border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        Alumni Class / Graduating Year
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Ph.D. Class of 2024 or M.Sc. 2023"
                        value={formData.alumniYear || ""}
                        onChange={(e) => setFormData({ ...formData, alumniYear: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#0B1120] border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        Past Lab Role / Tenure
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Former Doctoral Researcher (2020 – 2024)"
                        value={formData.pastRole || ""}
                        onChange={(e) => setFormData({ ...formData, pastRole: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#0B1120] border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* ----------------- TAB 7: SOCIAL & HANDLES ----------------- */}
              {activeTab === "social" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        Email Address
                      </label>
                      <input
                        type="email"
                        placeholder="e.g. researcher@juniv.edu"
                        value={formData.email || ""}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#0B1120] border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        Phone Number
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. +880 2-7791045"
                        value={formData.phone || ""}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#0B1120] border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Office / Lab Room Location
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. W.B. Academic Building, Room 304"
                      value={formData.officeLocation || ""}
                      onChange={(e) => setFormData({ ...formData, officeLocation: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#0B1120] border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        Google Scholar Profile URL
                      </label>
                      <input
                        type="url"
                        placeholder="https://scholar.google.com/citations?user=..."
                        value={formData.googleScholarUrl || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, googleScholarUrl: e.target.value })
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#0B1120] border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        ORCID ID (e.g. 0000-0002-8419-7201)
                      </label>
                      <input
                        type="text"
                        placeholder="0000-0002-8419-7201"
                        value={formData.orcid || ""}
                        onChange={(e) => setFormData({ ...formData, orcid: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#0B1120] border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        ResearchGate Profile URL
                      </label>
                      <input
                        type="url"
                        placeholder="https://www.researchgate.net/profile/..."
                        value={formData.researchGateUrl || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, researchGateUrl: e.target.value })
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#0B1120] border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        LinkedIn Profile URL
                      </label>
                      <input
                        type="url"
                        placeholder="https://linkedin.com/in/..."
                        value={formData.linkedinUrl || ""}
                        onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#0B1120] border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Personal Website / Portfolio URL
                    </label>
                    <input
                      type="url"
                      placeholder="https://mywebsite.org"
                      value={formData.websiteUrl || ""}
                      onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#0B1120] border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white"
                    />
                  </div>
                </div>
              )}

              {/* Modal Footer / Save */}
              <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-extrabold transition shadow-md shadow-emerald-950/20 active:scale-95 cursor-pointer"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Saving Profile...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>{formData.id ? "Update Researcher" : "Create Researcher"}</span>
                    </>
                  )}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 6. DELETE CONFIRMATION MODAL */}
      {/* ============================================================ */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3 text-rose-500">
              <div className="p-2.5 rounded-2xl bg-rose-500/10 border border-rose-500/20">
                <AlertCircle className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Delete Researcher Profile?
              </h3>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Are you sure you want to permanently delete this team member? This action will remove their public profile and cannot be undone.
            </p>

            <div className="pt-2 flex items-center justify-end gap-2.5">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition shadow-xs"
              >
                Yes, Delete Researcher
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
