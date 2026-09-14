"use client";

import React, { useState, useEffect, useTransition } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAdminTheme } from "@/lib/admin-theme";
import {
  FolderGit2,
  Plus,
  Trash2,
  Edit3,
  Search,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Eye,
  Star,
  Globe,
  Lock,
  Archive,
  ArrowUpRight,
  Upload,
  X,
  PlusCircle,
  Sparkles,
  Calendar,
  Building2,
  Users,
  FlaskConical,
  Filter,
  Check,
  RefreshCw
} from "lucide-react";
import { ProjectWithRelations, ProjectStatus, ProjectFormData } from "@/lib/projects/types";
import { getPublishedProjects, getResearchAreas } from "@/lib/projects/queries";
import {
  createProject,
  updateProject,
  deleteProject,
  toggleProjectPublish,
  toggleProjectFeatured,
  uploadProjectMedia,
} from "@/lib/projects/mutations";
import { SEED_RESEARCH_AREAS, SEED_RESEARCHERS } from "@/lib/projects/seed-data";

export default function AdminProjectsPage() {
  const { theme } = useAdminTheme();
  const isLight = theme === "light";

  const [projects, setProjects] = useState<ProjectWithRelations[]>([]);
  const [researchAreas, setResearchAreas] = useState(SEED_RESEARCH_AREAS);
  const [isLoading, setIsLoading] = useState(true);
  const [isPending, startTransition] = useTransition();

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [publishedFilter, setPublishedFilter] = useState("all");
  const [featuredFilter, setFeaturedFilter] = useState("all");

  // Modal / Editor state
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState<"basic" | "status" | "science" | "people" | "areas" | "media" | "visibility">("basic");
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [statusNotification, setStatusNotification] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Delete modal state
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form State
  const initialFormState: ProjectFormData = {
    id: "",
    title: "",
    slug: "",
    short_description: "",
    full_description: "",
    status: "ongoing",
    start_date: "",
    end_date: "",
    year: "",
    funding_org: "",
    grant_amount: "",
    funding_info: "",
    research_question: "",
    objectives: [""],
    methodology: "",
    study_area: "",
    study_area_description: "",
    hero_image: "",
    image_alt: "",
    gallery: [],
    outputs: "",
    findings: "",
    is_featured: false,
    is_published: true,
    display_order: 0,
    research_area_ids: [],
    researcher_assignments: [],
    collaborators: [],
    publication_ids: [],
  };

  const [formData, setFormData] = useState<ProjectFormData>(initialFormState);

  // Load Projects from DB / Access layer
  const loadData = async () => {
    setIsLoading(true);
    try {
      const [allProjects, areas] = await Promise.all([
        getPublishedProjects({}, true), // includeDrafts = true
        getResearchAreas(),
      ]);
      setProjects(allProjects);
      setResearchAreas(areas);
    } catch (err) {
      console.error("Error loading admin projects:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();

    // Listen to local project updates across browser tabs
    const handleUpdate = () => loadData();
    window.addEventListener("lab_projects_updated", handleUpdate);
    return () => window.removeEventListener("lab_projects_updated", handleUpdate);
  }, []);

  // Filtered projects
  const filteredProjects = projects.filter((proj) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = proj.title.toLowerCase().includes(q);
      const matchSlug = proj.slug.toLowerCase().includes(q);
      const matchDesc = (proj.short_description || "").toLowerCase().includes(q);
      const matchArea = proj.research_areas?.some((a) => a.title.toLowerCase().includes(q));
      if (!matchTitle && !matchSlug && !matchDesc && !matchArea) return false;
    }
    if (statusFilter !== "all" && proj.status !== statusFilter) return false;
    if (publishedFilter === "published" && !proj.is_published) return false;
    if (publishedFilter === "draft" && proj.is_published) return false;
    if (featuredFilter === "featured" && !proj.is_featured) return false;
    return true;
  });

  // Open Add Modal
  const handleOpenAdd = () => {
    setFormData({
      ...initialFormState,
      research_area_ids: researchAreas.length > 0 ? [researchAreas[0].id] : [],
      researcher_assignments: [
        { person_id: SEED_RESEARCHERS[0].id, role_in_project: "Principal Investigator" },
      ],
      collaborators: [
        { name: "Jahangirnagar University", institution: "Dept. of Environmental Sciences", role: "Academic Host" },
      ],
    });
    setActiveTab("basic");
    setShowModal(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (proj: ProjectWithRelations) => {
    setFormData({
      id: proj.id,
      title: proj.title,
      slug: proj.slug,
      short_description: proj.short_description,
      full_description: proj.full_description || "",
      status: proj.status,
      start_date: proj.start_date || "",
      end_date: proj.end_date || "",
      year: proj.year || "",
      funding_org: proj.funding_org || "",
      grant_amount: proj.grant_amount || "",
      funding_info: proj.funding_info || "",
      research_question: proj.research_question || "",
      objectives: proj.objectives && proj.objectives.length > 0 ? proj.objectives : [""],
      methodology: proj.methodology || "",
      study_area: proj.study_area || "",
      study_area_description: proj.study_area_description || "",
      hero_image: proj.hero_image || "",
      image_alt: proj.image_alt || proj.title,
      gallery: proj.gallery || [],
      outputs: proj.outputs || "",
      findings: proj.findings || "",
      is_featured: proj.is_featured,
      is_published: proj.is_published,
      display_order: proj.display_order || 0,
      research_area_ids: proj.research_areas?.map((a) => a.id) || [],
      researcher_assignments: proj.researchers?.map((r) => ({
        person_id: r.id,
        role_in_project: r.role_in_project || "Researcher",
      })) || [],
      collaborators: proj.collaborators || [],
      publication_ids: proj.publications?.map((p) => p.id) || [],
    });
    setActiveTab("basic");
    setShowModal(true);
  };

  // Auto-generate slug from title
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    const generatedSlug = val.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    setFormData((prev) => ({
      ...prev,
      title: val,
      slug: prev.id ? prev.slug : generatedSlug,
    }));
  };

  // Image Upload handler
  const handleImageFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImage(true);
    try {
      const publicUrl = await uploadProjectMedia(file);
      setFormData((prev) => ({
        ...prev,
        hero_image: publicUrl,
        image_alt: prev.image_alt || prev.title,
      }));
      setStatusNotification({ type: "success", message: "Image uploaded to project-media storage!" });
    } catch {
      setStatusNotification({ type: "error", message: "Failed to upload image." });
    } finally {
      setUploadingImage(false);
    }
  };

  // Save Project Handler
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      alert("Please enter a project title.");
      return;
    }

    setSaving(true);
    setStatusNotification(null);

    try {
      const cleanObjectives = formData.objectives.filter((o) => o.trim().length > 0);
      const payload: ProjectFormData = {
        ...formData,
        objectives: cleanObjectives,
        slug: formData.slug || formData.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
      };

      if (formData.id) {
        await updateProject(formData.id, payload);
        setStatusNotification({ type: "success", message: "Project updated successfully." });
      } else {
        await createProject(payload);
        setStatusNotification({ type: "success", message: "New research project created." });
      }

      setShowModal(false);
      await loadData();
    } catch (err: any) {
      setStatusNotification({ type: "error", message: err?.message || "Failed to save project." });
    } finally {
      setSaving(false);
    }
  };

  // Quick Toggle Publish
  const handleTogglePublish = async (id: string, currentState: boolean) => {
    startTransition(async () => {
      await toggleProjectPublish(id, !currentState);
      await loadData();
    });
  };

  // Quick Toggle Featured
  const handleToggleFeatured = async (id: string, currentState: boolean) => {
    startTransition(async () => {
      await toggleProjectFeatured(id, !currentState);
      await loadData();
    });
  };

  // Delete Project
  const handleDeleteConfirm = async () => {
    if (!deleteConfirmId) return;
    try {
      await deleteProject(deleteConfirmId);
      setStatusNotification({ type: "success", message: "Project deleted." });
      setDeleteConfirmId(null);
      await loadData();
    } catch {
      setStatusNotification({ type: "error", message: "Failed to delete project." });
    }
  };

  // Helper styles
  const cardBg = isLight ? "bg-white border-slate-200/90 shadow-xs" : "bg-[#0F172A] border-slate-800 shadow-md";
  const subText = isLight ? "text-slate-500" : "text-slate-400";
  const headingText = isLight ? "text-slate-900" : "text-white";
  const inputBg = isLight ? "bg-slate-50 border-slate-300 text-slate-900 focus:bg-white focus:border-emerald-500" : "bg-[#090D16] border-slate-700 text-white focus:border-emerald-400";

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <FolderGit2 className="w-5 h-5" />
            </span>
            <h1 className={`text-2xl font-bold tracking-tight ${headingText}`}>
              Research Projects &amp; Grants CMS
            </h1>
          </div>
          <p className={`text-xs md:text-sm ${subText} mt-1.5`}>
            Manage the laboratory&apos;s active and completed research projects. All changes dynamically reflect on the public research portal.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadData}
            title="Refresh database"
            className={`p-2.5 rounded-lg border transition-colors ${
              isLight ? "border-slate-200 hover:bg-slate-100 text-slate-600" : "border-slate-700 hover:bg-slate-800 text-slate-300"
            }`}
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
          </button>

          <Link
            href="/projects"
            target="_blank"
            className={`inline-flex items-center gap-2 px-3.5 py-2.5 text-xs font-semibold rounded-lg border transition-colors ${
              isLight ? "border-slate-300 bg-white hover:bg-slate-50 text-slate-700" : "border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200"
            }`}
          >
            <Globe className="w-3.5 h-3.5 text-emerald-500" />
            <span>View Public Portal</span>
            <ArrowUpRight className="w-3.5 h-3.5 opacity-60" />
          </Link>

          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-xs md:text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl shadow-md shadow-emerald-600/20 transition-all active:scale-[0.98] cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New Research Project</span>
          </button>
        </div>
      </div>

      {/* Status Notification */}
      {statusNotification && (
        <div
          className={`p-4 rounded-xl border flex items-center justify-between gap-3 text-sm animate-in fade-in duration-200 ${
            statusNotification.type === "success"
              ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200"
              : "bg-red-50 dark:bg-red-950/40 border-red-300 dark:border-red-800 text-red-800 dark:text-red-200"
          }`}
        >
          <div className="flex items-center gap-2.5">
            {statusNotification.type === "success" ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
            )}
            <span>{statusNotification.message}</span>
          </div>
          <button
            onClick={() => setStatusNotification(null)}
            className="p-1 hover:bg-black/5 dark:hover:bg-white/5 rounded-md"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className={`p-4 rounded-xl border ${cardBg}`}>
          <span className={`text-xs font-mono uppercase tracking-wider ${subText}`}>Total Projects</span>
          <div className="text-2xl font-bold mt-1 text-emerald-600 dark:text-emerald-400 font-mono">
            {projects.length}
          </div>
        </div>
        <div className={`p-4 rounded-xl border ${cardBg}`}>
          <span className={`text-xs font-mono uppercase tracking-wider ${subText}`}>Ongoing</span>
          <div className="text-2xl font-bold mt-1 text-blue-600 dark:text-blue-400 font-mono">
            {projects.filter((p) => p.status === "ongoing").length}
          </div>
        </div>
        <div className={`p-4 rounded-xl border ${cardBg}`}>
          <span className={`text-xs font-mono uppercase tracking-wider ${subText}`}>Completed</span>
          <div className="text-2xl font-bold mt-1 text-amber-600 dark:text-amber-400 font-mono">
            {projects.filter((p) => p.status === "completed").length}
          </div>
        </div>
        <div className={`p-4 rounded-xl border ${cardBg}`}>
          <span className={`text-xs font-mono uppercase tracking-wider ${subText}`}>Featured</span>
          <div className="text-2xl font-bold mt-1 text-purple-600 dark:text-purple-400 font-mono">
            {projects.filter((p) => p.is_featured).length}
          </div>
        </div>
      </div>

      {/* Search & Filter Strip */}
      <div className={`p-4 rounded-xl border ${cardBg} space-y-3`}>
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:w-80">
            <Search className={`w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 ${subText}`} />
            <input
              type="text"
              placeholder="Search title, slug, area..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-9 pr-3 py-2 text-xs rounded-lg border outline-none transition ${inputBg}`}
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className={`px-3 py-2 text-xs rounded-lg border outline-none transition ${inputBg}`}
            >
              <option value="all">Status: All</option>
              <option value="ongoing">Ongoing</option>
              <option value="completed">Completed</option>
              <option value="archived">Archived</option>
            </select>

            {/* Published Filter */}
            <select
              value={publishedFilter}
              onChange={(e) => setPublishedFilter(e.target.value)}
              className={`px-3 py-2 text-xs rounded-lg border outline-none transition ${inputBg}`}
            >
              <option value="all">Visibility: All</option>
              <option value="published">Published Only</option>
              <option value="draft">Draft Only</option>
            </select>

            {/* Featured Filter */}
            <select
              value={featuredFilter}
              onChange={(e) => setFeaturedFilter(e.target.value)}
              className={`px-3 py-2 text-xs rounded-lg border outline-none transition ${inputBg}`}
            >
              <option value="all">Highlight: All</option>
              <option value="featured">Featured Only</option>
            </select>
          </div>
        </div>
      </div>

      {/* Projects Table */}
      <div className={`rounded-xl border overflow-hidden ${cardBg}`}>
        {isLoading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
            <span className={`text-xs font-mono ${subText}`}>Loading research projects from database...</span>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="py-16 text-center space-y-3">
            <FolderGit2 className={`w-10 h-10 mx-auto ${subText} opacity-40`} />
            <div className={`text-sm font-semibold ${headingText}`}>No research projects found</div>
            <p className={`text-xs ${subText}`}>
              Try resetting your search query or filter settings.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className={`border-b ${isLight ? "bg-slate-50 border-slate-200 text-slate-600" : "bg-slate-900/60 border-slate-800 text-slate-300"}`}>
                  <th className="py-3 px-4 font-mono font-semibold uppercase tracking-wider w-16">Preview</th>
                  <th className="py-3 px-4 font-mono font-semibold uppercase tracking-wider">Project Details</th>
                  <th className="py-3 px-4 font-mono font-semibold uppercase tracking-wider">Research Areas</th>
                  <th className="py-3 px-4 font-mono font-semibold uppercase tracking-wider">Timeline / Funding</th>
                  <th className="py-3 px-4 font-mono font-semibold uppercase tracking-wider text-center">Status</th>
                  <th className="py-3 px-4 font-mono font-semibold uppercase tracking-wider text-center">Published</th>
                  <th className="py-3 px-4 font-mono font-semibold uppercase tracking-wider text-center">Featured</th>
                  <th className="py-3 px-4 font-mono font-semibold uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {filteredProjects.map((proj) => (
                  <tr
                    key={proj.id}
                    className={`transition-colors ${
                      isLight ? "hover:bg-slate-50/70" : "hover:bg-slate-800/40"
                    }`}
                  >
                    {/* Thumbnail */}
                    <td className="py-3.5 px-4">
                      <div className="w-14 h-12 rounded-lg overflow-hidden bg-slate-200 dark:bg-slate-800 relative border border-slate-300 dark:border-slate-700 shrink-0">
                        {proj.hero_image ? (
                          <Image
                            src={proj.hero_image}
                            alt={proj.title}
                            fill
                            className="object-cover"
                            sizes="56px"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-400">
                            <FlaskConical className="w-5 h-5" />
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Title & Slug */}
                    <td className="py-3.5 px-4 max-w-sm">
                      <div className="font-semibold text-sm line-clamp-1 text-slate-900 dark:text-white">
                        {proj.title}
                      </div>
                      <div className="text-[11px] font-mono text-emerald-700 dark:text-emerald-400 truncate mt-0.5">
                        /projects/{proj.slug}
                      </div>
                      <div className={`text-[11px] ${subText} line-clamp-1 mt-1`}>
                        {proj.short_description}
                      </div>
                    </td>

                    {/* Research Areas */}
                    <td className="py-3.5 px-4">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {proj.research_areas && proj.research_areas.length > 0 ? (
                          proj.research_areas.map((a) => (
                            <span
                              key={a.id}
                              className="px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20"
                            >
                              {a.title}
                            </span>
                          ))
                        ) : (
                          <span className={`text-[11px] ${subText} italic`}>Unassigned</span>
                        )}
                      </div>
                    </td>

                    {/* Timeline & Funding */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5 font-mono text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>{proj.year || "2025 — 2027"}</span>
                      </div>
                      {proj.funding_org && (
                        <div className={`text-[11px] ${subText} flex items-center gap-1 mt-1 truncate max-w-[180px]`}>
                          <Building2 className="w-3 h-3 shrink-0" />
                          <span className="truncate">{proj.funding_org}</span>
                        </div>
                      )}
                    </td>

                    {/* Status Badge */}
                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-mono font-semibold uppercase tracking-wider ${
                          proj.status === "ongoing"
                            ? "bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200 dark:border-blue-800"
                            : proj.status === "completed"
                            ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                            : "bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-300 dark:border-slate-700"
                        }`}
                      >
                        ● {proj.status}
                      </span>
                    </td>

                    {/* Published Toggle */}
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => handleTogglePublish(proj.id, proj.is_published)}
                        disabled={isPending}
                        title={proj.is_published ? "Click to set as Draft" : "Click to Publish"}
                        className={`p-1.5 rounded-lg transition-all ${
                          proj.is_published
                            ? "text-emerald-600 hover:bg-emerald-500/10"
                            : "text-amber-500 hover:bg-amber-500/10"
                        }`}
                      >
                        {proj.is_published ? (
                          <CheckCircle2 className="w-5 h-5" />
                        ) : (
                          <Lock className="w-5 h-5 opacity-70" />
                        )}
                      </button>
                    </td>

                    {/* Featured Toggle */}
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => handleToggleFeatured(proj.id, proj.is_featured)}
                        disabled={isPending}
                        title={proj.is_featured ? "Remove featured badge" : "Mark as featured"}
                        className={`p-1.5 rounded-lg transition-all ${
                          proj.is_featured
                            ? "text-amber-500 hover:bg-amber-500/10"
                            : "text-slate-400 hover:text-amber-500 hover:bg-slate-500/10"
                        }`}
                      >
                        <Star className={`w-5 h-5 ${proj.is_featured ? "fill-amber-400" : ""}`} />
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          href={`/projects/${proj.slug}`}
                          target="_blank"
                          title="Preview public project page"
                          className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-600 hover:bg-emerald-500/10 transition"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>

                        <button
                          onClick={() => handleOpenEdit(proj)}
                          title="Edit project"
                          className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-500/10 transition"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => setDeleteConfirmId(proj.id)}
                          title="Delete project"
                          className="p-1.5 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-500/10 transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* CREATE / EDIT PROJECT MODAL EDITOR                                         */}
      {/* ========================================================================= */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div
            className={`relative w-full max-w-4xl rounded-2xl border shadow-2xl overflow-hidden flex flex-col my-auto max-h-[92vh] ${
              isLight ? "bg-white border-slate-200" : "bg-[#0D1526] border-slate-700"
            }`}
          >
            {/* Modal Header */}
            <div className={`px-6 py-4 border-b flex items-center justify-between shrink-0 ${isLight ? "bg-slate-50 border-slate-200" : "bg-[#111C38] border-slate-800"}`}>
              <div>
                <h2 className={`text-lg font-bold ${headingText}`}>
                  {formData.id ? "Edit Research Project" : "Create New Research Project"}
                </h2>
                <p className={`text-xs ${subText} mt-0.5`}>
                  All fields sync with the public research explorer and detail view.
                </p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 text-slate-400 hover:text-slate-600 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Navigation Tabs */}
            <div className={`flex overflow-x-auto border-b shrink-0 px-6 gap-2 text-xs font-mono font-medium ${isLight ? "bg-white border-slate-200" : "bg-slate-900/90 border-slate-800"}`}>
              {[
                { id: "basic", label: "01 Basic Info" },
                { id: "status", label: "02 Status & Grant" },
                { id: "science", label: "03 Scientific Content" },
                { id: "people", label: "04 Researchers & Partners" },
                { id: "areas", label: "05 Research Areas" },
                { id: "media", label: "06 Media & Images" },
                { id: "visibility", label: "07 Publishing" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-3 px-3 border-b-2 transition whitespace-nowrap ${
                    activeTab === tab.id
                      ? "border-emerald-600 text-emerald-600 dark:text-emerald-400 font-bold"
                      : "border-transparent text-slate-400 hover:text-slate-600"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Form Content Area */}
            <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* TAB 1: BASIC INFO */}
              {activeTab === "basic" && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <div>
                    <label className={`block text-xs font-semibold mb-1.5 ${headingText}`}>
                      Project Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={handleTitleChange}
                      placeholder="e.g. Microplastic Exposure in Freshwater Ecosystems"
                      className={`w-full px-3.5 py-2.5 text-sm rounded-lg border outline-none transition ${inputBg}`}
                    />
                  </div>

                  <div>
                    <label className={`block text-xs font-semibold mb-1.5 ${headingText}`}>
                      Slug (URL Identifier) <span className="text-red-500">*</span>
                    </label>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-slate-400">/projects/</span>
                      <input
                        type="text"
                        required
                        value={formData.slug}
                        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                        placeholder="microplastic-exposure-freshwater"
                        className={`w-full px-3 py-2 text-xs font-mono rounded-lg border outline-none transition ${inputBg}`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className={`block text-xs font-semibold mb-1.5 ${headingText}`}>
                      Short Description (Summary Card) <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      required
                      rows={2}
                      value={formData.short_description}
                      onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
                      placeholder="Brief 1-2 sentence synopsis shown in the public research archive..."
                      className={`w-full px-3.5 py-2.5 text-sm rounded-lg border outline-none transition ${inputBg}`}
                    />
                  </div>

                  <div>
                    <label className={`block text-xs font-semibold mb-1.5 ${headingText}`}>
                      Full Project Overview &amp; Context
                    </label>
                    <textarea
                      rows={6}
                      value={formData.full_description}
                      onChange={(e) => setFormData({ ...formData, full_description: e.target.value })}
                      placeholder="Detailed background, scientific rationale, and expanded research narrative..."
                      className={`w-full px-3.5 py-2.5 text-sm rounded-lg border outline-none transition ${inputBg}`}
                    />
                  </div>
                </div>
              )}

              {/* TAB 2: STATUS & TIMELINE */}
              {activeTab === "status" && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className={`block text-xs font-semibold mb-1.5 ${headingText}`}>
                        Project Status
                      </label>
                      <select
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value as ProjectStatus })}
                        className={`w-full px-3.5 py-2.5 text-sm rounded-lg border outline-none transition ${inputBg}`}
                      >
                        <option value="ongoing">● Ongoing Research</option>
                        <option value="completed">● Completed &amp; Published</option>
                        <option value="archived">● Archived Past Grant</option>
                      </select>
                    </div>

                    <div>
                      <label className={`block text-xs font-semibold mb-1.5 ${headingText}`}>
                        Timeline Display String
                      </label>
                      <input
                        type="text"
                        value={formData.year}
                        onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                        placeholder="e.g. 2025 — 2027"
                        className={`w-full px-3.5 py-2.5 text-sm font-mono rounded-lg border outline-none transition ${inputBg}`}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className={`block text-xs font-semibold mb-1.5 ${headingText}`}>
                        Start Date
                      </label>
                      <input
                        type="date"
                        value={formData.start_date}
                        onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                        className={`w-full px-3.5 py-2 text-sm rounded-lg border outline-none transition ${inputBg}`}
                      />
                    </div>

                    <div>
                      <label className={`block text-xs font-semibold mb-1.5 ${headingText}`}>
                        End Date
                      </label>
                      <input
                        type="date"
                        value={formData.end_date}
                        onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                        className={`w-full px-3.5 py-2 text-sm rounded-lg border outline-none transition ${inputBg}`}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className={`block text-xs font-semibold mb-1.5 ${headingText}`}>
                        Funding Agency / Sponsor
                      </label>
                      <input
                        type="text"
                        value={formData.funding_org}
                        onChange={(e) => setFormData({ ...formData, funding_org: e.target.value })}
                        placeholder="e.g. Ministry of Science & Technology (MoST)"
                        className={`w-full px-3.5 py-2.5 text-sm rounded-lg border outline-none transition ${inputBg}`}
                      />
                    </div>

                    <div>
                      <label className={`block text-xs font-semibold mb-1.5 ${headingText}`}>
                        Grant Amount
                      </label>
                      <input
                        type="text"
                        value={formData.grant_amount}
                        onChange={(e) => setFormData({ ...formData, grant_amount: e.target.value })}
                        placeholder="e.g. BDT 3.6M ($32,000 USD)"
                        className={`w-full px-3.5 py-2.5 text-sm font-mono rounded-lg border outline-none transition ${inputBg}`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className={`block text-xs font-semibold mb-1.5 ${headingText}`}>
                      Grant Info / Reference Number
                    </label>
                    <input
                      type="text"
                      value={formData.funding_info}
                      onChange={(e) => setFormData({ ...formData, funding_info: e.target.value })}
                      placeholder="e.g. Competitive National Science & Technology Research Grant #MoST-ENV-2024"
                      className={`w-full px-3.5 py-2.5 text-sm rounded-lg border outline-none transition ${inputBg}`}
                    />
                  </div>
                </div>
              )}

              {/* TAB 3: SCIENTIFIC DETAILS */}
              {activeTab === "science" && (
                <div className="space-y-5 animate-in fade-in duration-150">
                  <div>
                    <label className={`block text-xs font-semibold mb-1.5 ${headingText}`}>
                      Core Research Question
                    </label>
                    <textarea
                      rows={2}
                      value={formData.research_question}
                      onChange={(e) => setFormData({ ...formData, research_question: e.target.value })}
                      placeholder="What primary scientific hypothesis or inquiry does this investigation resolve?"
                      className={`w-full px-3.5 py-2.5 text-sm rounded-lg border outline-none transition ${inputBg}`}
                    />
                  </div>

                  {/* Dynamic Objectives List */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <label className={`text-xs font-semibold ${headingText}`}>
                          Project Objectives (Numbered Milestones)
                        </label>
                        <p className={`text-[11px] ${subText}`}>
                          Displayed as numbered milestone cards on the project detail page.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, objectives: [...(formData.objectives || []), ""] })}
                        className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-[#34D399] border border-emerald-200 dark:border-emerald-800/60 hover:bg-emerald-100 flex items-center gap-1.5 transition"
                      >
                        <PlusCircle className="w-3.5 h-3.5" /> Add Objective
                      </button>
                    </div>

                    {(!formData.objectives || formData.objectives.length === 0) ? (
                      <div className={`p-4 rounded-xl border border-dashed text-center ${subText} text-xs space-y-2`}>
                        <p>No objectives added yet for this project.</p>
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, objectives: [""] })}
                          className="text-xs font-semibold text-emerald-600 dark:text-[#34D399] underline"
                        >
                          + Add first objective
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {formData.objectives.map((obj, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <span className="text-xs font-mono font-bold text-slate-400 w-6 shrink-0 text-center">
                              {String(idx + 1).padStart(2, "0")}
                            </span>
                            <input
                              type="text"
                              value={obj}
                              onChange={(e) => {
                                const updated = [...formData.objectives];
                                updated[idx] = e.target.value;
                                setFormData({ ...formData, objectives: updated });
                              }}
                              placeholder={`Objective ${idx + 1}...`}
                              className={`flex-1 px-3 py-2 text-xs rounded-lg border outline-none transition ${inputBg}`}
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const updated = formData.objectives.filter((_, i) => i !== idx);
                                setFormData({ ...formData, objectives: updated });
                              }}
                              className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition"
                              title="Delete this objective"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Methodology */}
                  <div>
                    <label className={`block text-xs font-semibold mb-1.5 ${headingText}`}>
                      Methodology Sequence
                    </label>
                    <p className={`text-[11px] ${subText} mb-2`}>
                      Describe the analytical sequence. Use &quot;→&quot; to separate workflow phases.
                    </p>
                    <textarea
                      rows={3}
                      value={formData.methodology}
                      onChange={(e) => setFormData({ ...formData, methodology: e.target.value })}
                      placeholder="e.g. NOAA manta trawl sampling → Alkaline KOH tissue digestion → μ-FTIR spectral mapping → Toxicogenomic biomarker profiling"
                      className={`w-full px-3.5 py-2.5 text-sm rounded-lg border outline-none transition ${inputBg}`}
                    />
                  </div>

                  {/* Study Area */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className={`block text-xs font-semibold mb-1.5 ${headingText}`}>
                        Study Area / Location Name
                      </label>
                      <input
                        type="text"
                        value={formData.study_area}
                        onChange={(e) => setFormData({ ...formData, study_area: e.target.value })}
                        placeholder="e.g. Meghna River Estuary & Coastal Transects"
                        className={`w-full px-3.5 py-2.5 text-sm rounded-lg border outline-none transition ${inputBg}`}
                      />
                    </div>
                    <div>
                      <label className={`block text-xs font-semibold mb-1.5 ${headingText}`}>
                        Outputs &amp; Deliverables
                      </label>
                      <input
                        type="text"
                        value={formData.outputs}
                        onChange={(e) => setFormData({ ...formData, outputs: e.target.value })}
                        placeholder="e.g. 3 Peer Papers, 1 Open Spectral Library, Policy Brief"
                        className={`w-full px-3.5 py-2.5 text-sm rounded-lg border outline-none transition ${inputBg}`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className={`block text-xs font-semibold mb-1.5 ${headingText}`}>
                      Study Area Detailed Description
                    </label>
                    <textarea
                      rows={2}
                      value={formData.study_area_description}
                      onChange={(e) => setFormData({ ...formData, study_area_description: e.target.value })}
                      placeholder="Geographic coordinates, environmental conditions, and sampling station network details..."
                      className={`w-full px-3.5 py-2.5 text-sm rounded-lg border outline-none transition ${inputBg}`}
                    />
                  </div>
                </div>
              )}

              {/* TAB 4: PEOPLE & COLLABORATORS */}
              {activeTab === "people" && (
                <div className="space-y-6 animate-in fade-in duration-150">
                  {/* Researcher Assignment */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <label className={`text-xs font-semibold ${headingText}`}>
                        Assigned Researchers &amp; Roles
                      </label>
                      <button
                        type="button"
                        onClick={() =>
                          setFormData({
                            ...formData,
                            researcher_assignments: [
                              ...formData.researcher_assignments,
                              { person_id: SEED_RESEARCHERS[0].id, role_in_project: "Researcher" },
                            ],
                          })
                        }
                        className="text-xs font-mono text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
                      >
                        <PlusCircle className="w-3.5 h-3.5" /> Assign Person
                      </button>
                    </div>

                    <div className="space-y-2">
                      {formData.researcher_assignments.map((assignment, idx) => (
                        <div key={idx} className="flex flex-col sm:flex-row items-center gap-2 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40">
                          <select
                            value={assignment.person_id}
                            onChange={(e) => {
                              const updated = [...formData.researcher_assignments];
                              updated[idx].person_id = e.target.value;
                              setFormData({ ...formData, researcher_assignments: updated });
                            }}
                            className={`w-full sm:w-1/2 px-3 py-2 text-xs rounded-lg border outline-none transition ${inputBg}`}
                          >
                            {SEED_RESEARCHERS.map((person) => (
                              <option key={person.id} value={person.id}>
                                {person.name} ({person.position})
                              </option>
                            ))}
                          </select>

                          <input
                            type="text"
                            value={assignment.role_in_project}
                            onChange={(e) => {
                              const updated = [...formData.researcher_assignments];
                              updated[idx].role_in_project = e.target.value;
                              setFormData({ ...formData, researcher_assignments: updated });
                            }}
                            placeholder="Role in this project (e.g. Lead Analyst)"
                            className={`w-full sm:flex-1 px-3 py-2 text-xs rounded-lg border outline-none transition ${inputBg}`}
                          />

                          <button
                            type="button"
                            onClick={() => {
                              const updated = formData.researcher_assignments.filter((_, i) => i !== idx);
                              setFormData({ ...formData, researcher_assignments: updated });
                            }}
                            className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Collaborating Institutions */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <label className={`text-xs font-semibold ${headingText}`}>
                        Collaborating Institutions &amp; Partners
                      </label>
                      <button
                        type="button"
                        onClick={() =>
                          setFormData({
                            ...formData,
                            collaborators: [
                              ...formData.collaborators,
                              { name: "", institution: "", role: "Collaborator" },
                            ],
                          })
                        }
                        className="text-xs font-mono text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
                      >
                        <PlusCircle className="w-3.5 h-3.5" /> Add Partner
                      </button>
                    </div>

                    <div className="space-y-2">
                      {formData.collaborators.map((collab, idx) => (
                        <div key={idx} className="flex flex-col sm:flex-row items-center gap-2 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40">
                          <input
                            type="text"
                            value={collab.name}
                            onChange={(e) => {
                              const updated = [...formData.collaborators];
                              updated[idx].name = e.target.value;
                              setFormData({ ...formData, collaborators: updated });
                            }}
                            placeholder="Organization / Institution Name"
                            className={`w-full sm:w-1/3 px-3 py-2 text-xs rounded-lg border outline-none transition ${inputBg}`}
                          />
                          <input
                            type="text"
                            value={collab.institution}
                            onChange={(e) => {
                              const updated = [...formData.collaborators];
                              updated[idx].institution = e.target.value;
                              setFormData({ ...formData, collaborators: updated });
                            }}
                            placeholder="Department / Division"
                            className={`w-full sm:w-1/3 px-3 py-2 text-xs rounded-lg border outline-none transition ${inputBg}`}
                          />
                          <input
                            type="text"
                            value={collab.role}
                            onChange={(e) => {
                              const updated = [...formData.collaborators];
                              updated[idx].role = e.target.value;
                              setFormData({ ...formData, collaborators: updated });
                            }}
                            placeholder="Partnership Role"
                            className={`w-full sm:flex-1 px-3 py-2 text-xs rounded-lg border outline-none transition ${inputBg}`}
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const updated = formData.collaborators.filter((_, i) => i !== idx);
                              setFormData({ ...formData, collaborators: updated });
                            }}
                            className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 5: RESEARCH AREAS */}
              {activeTab === "areas" && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <p className={`text-xs ${subText}`}>
                    Select the thematic scientific disciplines and research pillars associated with this project:
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {researchAreas.map((area) => {
                      const isSelected = formData.research_area_ids.includes(area.id);
                      return (
                        <div
                          key={area.id}
                          onClick={() => {
                            if (isSelected) {
                              setFormData({
                                ...formData,
                                research_area_ids: formData.research_area_ids.filter((id) => id !== area.id),
                              });
                            } else {
                              setFormData({
                                ...formData,
                                research_area_ids: [...formData.research_area_ids, area.id],
                              });
                            }
                          }}
                          className={`p-3.5 rounded-xl border cursor-pointer transition flex items-start gap-3 select-none ${
                            isSelected
                              ? "border-emerald-600 bg-emerald-50/60 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-100 shadow-sm"
                              : isLight
                              ? "border-slate-200 hover:border-slate-300 bg-white"
                              : "border-slate-800 hover:border-slate-700 bg-slate-900/50"
                          }`}
                        >
                          <div
                            className={`w-5 h-5 rounded flex items-center justify-center shrink-0 mt-0.5 border ${
                              isSelected
                                ? "bg-emerald-600 border-emerald-600 text-white"
                                : "border-slate-400 dark:border-slate-600"
                            }`}
                          >
                            {isSelected && <Check className="w-3.5 h-3.5" />}
                          </div>
                          <div>
                            <div className="font-semibold text-xs">{area.title}</div>
                            {area.description && (
                              <div className={`text-[11px] ${subText} line-clamp-2 mt-0.5`}>
                                {area.description}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* TAB 6: MEDIA & IMAGES */}
              {activeTab === "media" && (
                <div className="space-y-5 animate-in fade-in duration-150">
                  <div>
                    <label className={`block text-xs font-semibold mb-1.5 ${headingText}`}>
                      Project Hero Image
                    </label>
                    <div className="flex flex-col sm:flex-row gap-4 items-start">
                      {/* Image Preview */}
                      <div className="w-full sm:w-48 h-32 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 relative border border-slate-300 dark:border-slate-700 shrink-0">
                        {formData.hero_image ? (
                          <Image
                            src={formData.hero_image}
                            alt="Hero Preview"
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 gap-1">
                            <Upload className="w-6 h-6" />
                            <span className="text-[10px] font-mono">No image</span>
                          </div>
                        )}
                      </div>

                      {/* Upload and URL controls */}
                      <div className="flex-1 space-y-3 w-full">
                        <div>
                          <label className={`block text-[11px] font-mono ${subText} mb-1`}>
                            Upload file to Supabase Storage (bucket: project-media)
                          </label>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageFile}
                            disabled={uploadingImage}
                            className={`w-full text-xs file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-emerald-600 file:text-white hover:file:bg-emerald-700 ${subText}`}
                          />
                          {uploadingImage && (
                            <div className="flex items-center gap-2 text-xs text-emerald-600 mt-1">
                              <Loader2 className="w-3.5 h-3.5 animate-spin" /> Uploading to storage...
                            </div>
                          )}
                        </div>

                        <div>
                          <label className={`block text-[11px] font-mono ${subText} mb-1`}>
                            Or Direct Image URL
                          </label>
                          <input
                            type="url"
                            value={formData.hero_image}
                            onChange={(e) => setFormData({ ...formData, hero_image: e.target.value })}
                            placeholder="https://..."
                            className={`w-full px-3 py-2 text-xs rounded-lg border outline-none transition ${inputBg}`}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className={`block text-xs font-semibold mb-1.5 ${headingText}`}>
                      Image Alt Text
                    </label>
                    <input
                      type="text"
                      value={formData.image_alt}
                      onChange={(e) => setFormData({ ...formData, image_alt: e.target.value })}
                      placeholder="Descriptive text for accessibility & SEO..."
                      className={`w-full px-3.5 py-2.5 text-sm rounded-lg border outline-none transition ${inputBg}`}
                    />
                  </div>
                </div>
              )}

              {/* TAB 7: VISIBILITY & ACTIONS */}
              {activeTab === "visibility" && (
                <div className="space-y-5 animate-in fade-in duration-150">
                  <div className={`p-4 rounded-xl border ${isLight ? "bg-slate-50 border-slate-200" : "bg-slate-900/60 border-slate-800"}`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-xs sm:text-sm text-slate-900 dark:text-white">
                          Public Publication Status
                        </div>
                        <p className={`text-xs ${subText} mt-0.5`}>
                          Draft projects are only visible to logged-in administrators and will never appear on the public portal.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, is_published: !formData.is_published })}
                        className={`px-4 py-2 rounded-lg text-xs font-mono font-bold transition flex items-center gap-2 ${
                          formData.is_published
                            ? "bg-emerald-600 text-white shadow-sm"
                            : "bg-amber-600 text-white"
                        }`}
                      >
                        {formData.is_published ? (
                          <>
                            <CheckCircle2 className="w-4 h-4" /> PUBLISHED
                          </>
                        ) : (
                          <>
                            <Lock className="w-4 h-4" /> DRAFT
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  <div className={`p-4 rounded-xl border ${isLight ? "bg-slate-50 border-slate-200" : "bg-slate-900/60 border-slate-800"}`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-xs sm:text-sm text-slate-900 dark:text-white">
                          Featured Research Spotlight
                        </div>
                        <p className={`text-xs ${subText} mt-0.5`}>
                          Featured projects receive prominent editorial showcase on the homepage and top priority in explorer filters.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, is_featured: !formData.is_featured })}
                        className={`px-4 py-2 rounded-lg text-xs font-mono font-bold transition flex items-center gap-2 ${
                          formData.is_featured
                            ? "bg-amber-500 text-slate-950 shadow-sm"
                            : "bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                        }`}
                      >
                        <Star className={`w-4 h-4 ${formData.is_featured ? "fill-slate-950" : ""}`} />
                        {formData.is_featured ? "FEATURED" : "STANDARD"}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className={`block text-xs font-semibold mb-1.5 ${headingText}`}>
                      Display Order Priority (Lower numbers appear first)
                    </label>
                    <input
                      type="number"
                      value={formData.display_order}
                      onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
                      className={`w-32 px-3.5 py-2 text-sm font-mono rounded-lg border outline-none transition ${inputBg}`}
                    />
                  </div>
                </div>
              )}

              {/* Form Footer Action Buttons */}
              <div className={`pt-4 border-t flex items-center justify-between shrink-0 ${isLight ? "border-slate-200" : "border-slate-800"}`}>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className={`px-4 py-2 text-xs font-semibold rounded-lg border transition ${
                    isLight ? "border-slate-300 hover:bg-slate-100 text-slate-700" : "border-slate-700 hover:bg-slate-800 text-slate-300"
                  }`}
                >
                  Cancel
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-6 py-2 text-xs md:text-sm font-semibold text-white bg-[#14532D] hover:bg-[#0F766E] rounded-lg shadow-sm transition active:scale-[0.98] flex items-center gap-2"
                  >
                    {saving ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" /> Saving...
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4" /> Save Project
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* DELETE CONFIRMATION MODAL                                                  */}
      {/* ========================================================================= */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={`w-full max-w-md rounded-2xl border p-6 shadow-2xl space-y-4 ${isLight ? "bg-white border-slate-200" : "bg-[#0D1526] border-slate-700"}`}>
            <div className="flex items-center gap-3 text-red-600">
              <AlertCircle className="w-6 h-6 shrink-0" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Confirm Deletion
              </h3>
            </div>
            <p className={`text-xs md:text-sm ${subText}`}>
              Are you sure you want to remove this research project? This action will permanently remove the record and all associated relation links.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className={`px-4 py-2 text-xs font-semibold rounded-lg border transition ${
                  isLight ? "border-slate-300 hover:bg-slate-100 text-slate-700" : "border-slate-700 hover:bg-slate-800 text-slate-300"
                }`}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-sm transition"
              >
                Delete Project
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
