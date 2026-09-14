"use client";

import React, { useState, useEffect, useTransition } from "react";
import Link from "next/link";
import { useAdminTheme } from "@/lib/admin-theme";
import {
  BookOpen,
  Plus,
  Trash2,
  Edit3,
  Search,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ExternalLink,
  Star,
  Quote,
  TrendingUp,
  Award,
  Sparkles,
  Calendar,
  Layers,
  FlaskConical,
  Filter,
  Check,
  RefreshCw,
  X,
  FileText,
  Copy
} from "lucide-react";
import {
  PublicationWithRelations,
  PublicationType,
  PublicationFormData
} from "@/lib/publications/types";
import {
  getPublishedPublications,
  getPublicationStats
} from "@/lib/publications/queries";
import {
  createPublication,
  updatePublication,
  deletePublication,
  togglePublicationFeatured,
  togglePublicationPublish,
  formatDoi
} from "@/lib/publications/mutations";
import { SEED_RESEARCH_AREAS, SEED_RESEARCHERS } from "@/lib/projects/seed-data";

export default function AdminPublicationsPage() {
  const { theme } = useAdminTheme();
  const isLight = theme === "light";

  const [publications, setPublications] = useState<PublicationWithRelations[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPending, startTransition] = useTransition();

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [yearFilter, setYearFilter] = useState("all");
  const [publishedFilter, setPublishedFilter] = useState("all");
  const [featuredFilter, setFeaturedFilter] = useState("all");

  // Modal / Editor State
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState<"basic" | "metrics" | "links" | "authors" | "areas" | "visibility">("basic");
  const [saving, setSaving] = useState(false);
  const [statusNotification, setStatusNotification] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Delete modal state
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form State
  const initialFormState: PublicationFormData = {
    id: "",
    title: "",
    slug: "",
    abstract: "",
    publication_type: "journal_article",
    journal: "",
    volume: "",
    issue: "",
    pages: "",
    publication_year: new Date().getFullYear(),
    publication_date: "",
    doi: "",
    doi_url: "",
    pdf_url: "",
    external_url: "",
    impact_factor: "",
    citation_count: "0",
    quartile: "Q1",
    is_featured: false,
    is_published: true,
    display_order: 0,
    authors_text: "",
    research_area_ids: [],
    bibtex: "",
  };

  const [formData, setFormData] = useState<PublicationFormData>(initialFormState);

  // Load Publications from DB / Storage
  const loadData = async () => {
    setIsLoading(true);
    try {
      const allPubs = await getPublishedPublications({}, true); // include drafts
      setPublications(allPubs);
    } catch (err) {
      console.error("Error loading admin publications:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();

    // Listen to local publication updates across tabs
    const handleUpdate = () => loadData();
    window.addEventListener("lab_publications_updated", handleUpdate);
    return () => window.removeEventListener("lab_publications_updated", handleUpdate);
  }, []);

  // Filtered publications for table
  const filteredPubs = publications.filter((pub) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = pub.title.toLowerCase().includes(q);
      const matchJournal = pub.journal.toLowerCase().includes(q);
      const matchAuthors = (pub.authors_text || "").toLowerCase().includes(q);
      const matchDoi = (pub.doi || "").toLowerCase().includes(q);
      if (!matchTitle && !matchJournal && !matchAuthors && !matchDoi) return false;
    }
    if (typeFilter !== "all" && pub.publication_type !== typeFilter) return false;
    if (yearFilter !== "all" && pub.publication_year !== parseInt(yearFilter, 10)) return false;
    if (publishedFilter === "published" && !pub.is_published) return false;
    if (publishedFilter === "draft" && pub.is_published) return false;
    if (featuredFilter === "featured" && !pub.is_featured) return false;
    return true;
  });

  // Open Add Modal
  const handleOpenAdd = () => {
    setFormData(initialFormState);
    setActiveTab("basic");
    setShowModal(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (pub: PublicationWithRelations) => {
    setFormData({
      id: pub.id,
      title: pub.title,
      slug: pub.slug,
      abstract: pub.abstract || "",
      publication_type: pub.publication_type || "journal_article",
      journal: pub.journal || "",
      volume: pub.volume || "",
      issue: pub.issue || "",
      pages: pub.pages || "",
      publication_year: pub.publication_year,
      publication_date: pub.publication_date || "",
      doi: pub.doi || "",
      doi_url: pub.doi_url || "",
      pdf_url: pub.pdf_url || "",
      external_url: pub.external_url || "",
      impact_factor: pub.impact_factor ? pub.impact_factor.toString() : "",
      citation_count: pub.citation_count ? pub.citation_count.toString() : "0",
      quartile: pub.quartile || "Q1",
      is_featured: !!pub.is_featured,
      is_published: pub.is_published !== false,
      display_order: pub.display_order || 0,
      authors_text: pub.authors_text || "",
      research_area_ids: pub.research_areas?.map((a) => a.id) || [],
      bibtex: pub.bibtex || "",
    });
    setActiveTab("basic");
    setShowModal(true);
  };

  // Handle Form Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setStatusNotification(null);

    try {
      if (formData.id) {
        const res = await updatePublication(formData.id, formData);
        if (res.success) {
          setStatusNotification({ type: "success", message: "Publication updated successfully!" });
        } else {
          setStatusNotification({ type: "error", message: res.error || "Failed to update publication" });
        }
      } else {
        const res = await createPublication(formData);
        if (res.success) {
          setStatusNotification({ type: "success", message: "New publication created successfully!" });
        } else {
          setStatusNotification({ type: "error", message: res.error || "Failed to create publication" });
        }
      }
      setShowModal(false);
      await loadData();
    } catch (err: any) {
      setStatusNotification({ type: "error", message: err.message || "An unexpected error occurred" });
    } finally {
      setSaving(false);
    }
  };

  // Handle Delete Confirmation
  const handleDelete = async () => {
    if (!deleteConfirmId) return;
    try {
      await deletePublication(deleteConfirmId);
      setStatusNotification({ type: "success", message: "Publication removed successfully" });
      setDeleteConfirmId(null);
      await loadData();
    } catch (err: any) {
      setStatusNotification({ type: "error", message: "Failed to delete publication" });
    }
  };

  // Handle Fast Toggle Featured
  const handleToggleFeatured = async (pub: PublicationWithRelations) => {
    startTransition(async () => {
      const nextVal = !pub.is_featured;
      await togglePublicationFeatured(pub.id, nextVal);
      setPublications((prev) =>
        prev.map((p) => (p.id === pub.id ? { ...p, is_featured: nextVal } : p))
      );
    });
  };

  // Handle Fast Toggle Published
  const handleTogglePublish = async (pub: PublicationWithRelations) => {
    startTransition(async () => {
      const nextVal = !pub.is_published;
      await togglePublicationPublish(pub.id, nextVal);
      setPublications((prev) =>
        prev.map((p) => (p.id === pub.id ? { ...p, is_published: nextVal } : p))
      );
    });
  };

  // Auto DOI generator helper
  const handleDoiChange = (val: string) => {
    const { doi, doi_url } = formatDoi(val);
    setFormData((prev) => ({
      ...prev,
      doi: val,
      doi_url: doi_url || "",
    }));
  };

  // Unique Years from current list
  const distinctYears = Array.from(new Set(publications.map((p) => p.publication_year))).sort((a, b) => b - a);

  // Theme Helpers
  const cardBg = isLight ? "bg-white border-slate-200/90 shadow-xs" : "bg-[#0F172A] border-slate-800 shadow-md";
  const headerBg = isLight ? "bg-slate-50 border-slate-200" : "bg-[#0B1120] border-slate-800";
  const tableRowHover = isLight ? "hover:bg-slate-50" : "hover:bg-slate-800/50";
  const modalBg = isLight ? "bg-white border-slate-300 shadow-2xl" : "bg-[#0F172A] border-slate-700 shadow-2xl";
  const inputBg = isLight
    ? "bg-slate-50 border-slate-300 text-slate-900 focus:bg-white focus:border-emerald-600 font-medium"
    : "bg-[#090D16] border-slate-700 text-white focus:border-emerald-400 font-medium";
  const headingText = isLight ? "text-slate-900 font-bold" : "text-white font-bold";
  const subText = isLight ? "text-slate-700 font-medium" : "text-slate-300 font-medium";

  return (
    <div className="space-y-6">
      {/* Top Header & Quick Action Bar */}
      <div className={`p-6 rounded-2xl border flex flex-col md:flex-row md:items-center justify-between gap-4 ${cardBg}`}>
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h1 className={`text-xl font-bold tracking-tight ${headingText}`}>
                Publications &amp; Scientific Outputs Manager
              </h1>
              <p className={`text-xs ${subText}`}>
                Curate peer-reviewed articles, journal metadata, citation indices, DOI direct links, and research area associations.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/publications"
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <span>View Public Page</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-950/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Publication</span>
          </button>
        </div>
      </div>

      {/* Notification Toast */}
      {statusNotification && (
        <div
          className={`p-4 rounded-xl border flex items-center justify-between gap-3 text-xs animate-in fade-in duration-150 ${
            statusNotification.type === "success"
              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-300"
              : "bg-rose-500/10 border-rose-500/30 text-rose-700 dark:text-rose-300"
          }`}
        >
          <div className="flex items-center gap-2.5">
            {statusNotification.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
            )}
            <span>{statusNotification.message}</span>
          </div>
          <button onClick={() => setStatusNotification(null)} className="p-1 hover:opacity-75">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Metric Quick Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className={`p-4 rounded-xl border ${cardBg}`}>
          <div className={`text-xs font-semibold ${subText}`}>Total Publications</div>
          <div className={`text-2xl font-extrabold mt-1 ${headingText}`}>{publications.length}</div>
        </div>
        <div className={`p-4 rounded-xl border ${cardBg}`}>
          <div className={`text-xs font-semibold ${subText}`}>Q1 Journals</div>
          <div className="text-2xl font-extrabold mt-1 text-emerald-600 dark:text-[#34D399]">
            {publications.filter((p) => p.quartile === "Q1" || (p.impact_factor && p.impact_factor >= 5)).length}
          </div>
        </div>
        <div className={`p-4 rounded-xl border ${cardBg}`}>
          <div className={`text-xs font-semibold ${subText}`}>Total Citations</div>
          <div className="text-2xl font-extrabold mt-1 text-teal-600 dark:text-teal-300">
            {publications.reduce((acc, p) => acc + (p.citation_count || 0), 0)}
          </div>
        </div>
        <div className={`p-4 rounded-xl border ${cardBg}`}>
          <div className={`text-xs font-semibold ${subText}`}>Featured On Homepage</div>
          <div className="text-2xl font-extrabold mt-1 text-amber-500">
            {publications.filter((p) => p.is_featured).length}
          </div>
        </div>
      </div>

      {/* Search & Multi-Filter Control Strip */}
      <div className={`p-4 rounded-2xl border space-y-3 ${cardBg}`}>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {/* Search Input */}
          <div className="md:col-span-2 relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, journal, author, or DOI..."
              className={`w-full pl-9 pr-3 py-2 text-xs rounded-xl border outline-none transition ${inputBg}`}
            />
          </div>

          {/* Type Filter */}
          <div>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className={`w-full px-3 py-2 text-xs rounded-xl border outline-none transition ${inputBg}`}
            >
              <option value="all">All Publication Types</option>
              <option value="journal_article">Journal Article</option>
              <option value="review">Review Article</option>
              <option value="conference_paper">Conference Paper</option>
              <option value="book_chapter">Book Chapter</option>
              <option value="technical_report">Technical Report</option>
              <option value="preprint">Preprint</option>
            </select>
          </div>

          {/* Year Filter */}
          <div>
            <select
              value={yearFilter}
              onChange={(e) => setYearFilter(e.target.value)}
              className={`w-full px-3 py-2 text-xs rounded-xl border outline-none transition ${inputBg}`}
            >
              <option value="all">All Years</option>
              {distinctYears.map((yr) => (
                <option key={yr} value={yr}>
                  Year {yr}
                </option>
              ))}
            </select>
          </div>

          {/* Published / Status Filter */}
          <div>
            <select
              value={publishedFilter}
              onChange={(e) => setPublishedFilter(e.target.value)}
              className={`w-full px-3 py-2 text-xs rounded-xl border outline-none transition ${inputBg}`}
            >
              <option value="all">All Status</option>
              <option value="published">Published Online</option>
              <option value="draft">Drafts Only</option>
            </select>
          </div>
        </div>
      </div>

      {/* Publications Table */}
      <div className={`rounded-2xl border overflow-hidden shadow-xs ${cardBg}`}>
        {isLoading ? (
          <div className="p-16 text-center space-y-3">
            <Loader2 className="w-6 h-6 animate-spin mx-auto text-emerald-500" />
            <p className={`text-xs ${subText}`}>Loading publications from database...</p>
          </div>
        ) : filteredPubs.length === 0 ? (
          <div className="p-16 text-center space-y-3">
            <BookOpen className="w-10 h-10 mx-auto text-slate-400" />
            <h3 className={`text-sm font-bold ${headingText}`}>No publications found</h3>
            <p className={`text-xs ${subText} max-w-sm mx-auto`}>
              Try adjusting your search criteria or click &ldquo;Add New Publication&rdquo; to add a new manuscript.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className={`border-b ${headerBg}`}>
                  <th className="py-3.5 px-4 font-extrabold text-slate-800 dark:text-slate-200 uppercase tracking-wider text-[11px]">Year / Tier</th>
                  <th className="py-3.5 px-4 font-extrabold text-slate-800 dark:text-slate-200 uppercase tracking-wider text-[11px]">Title &amp; Authors</th>
                  <th className="py-3.5 px-4 font-extrabold text-slate-800 dark:text-slate-200 uppercase tracking-wider text-[11px]">Journal &amp; Metrics</th>
                  <th className="py-3.5 px-4 font-extrabold text-slate-800 dark:text-slate-200 uppercase tracking-wider text-[11px]">DOI Link</th>
                  <th className="py-3.5 px-4 font-extrabold text-slate-800 dark:text-slate-200 uppercase tracking-wider text-[11px] text-center">Featured</th>
                  <th className="py-3.5 px-4 font-extrabold text-slate-800 dark:text-slate-200 uppercase tracking-wider text-[11px] text-center">Published</th>
                  <th className="py-3.5 px-4 font-extrabold text-slate-800 dark:text-slate-200 uppercase tracking-wider text-[11px] text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/80 dark:divide-slate-800">
                {filteredPubs.map((pub) => (
                  <tr key={pub.id} className={`transition ${tableRowHover}`}>
                    {/* Year / Tier */}
                    <td className="py-3.5 px-4 align-top whitespace-nowrap">
                      <div className="space-y-1">
                        <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/60 text-[11px] inline-block">
                          {pub.publication_year}
                        </span>
                        {pub.quartile && (
                          <div className="text-[10px] font-mono font-bold text-amber-600 dark:text-amber-400">
                            {pub.quartile}
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Title & Authors */}
                    <td className="py-3.5 px-4 align-top max-w-md">
                      <div className="space-y-1">
                        <div className={`font-semibold leading-snug ${headingText}`}>
                          {pub.title}
                        </div>
                        <div className={`text-[11px] ${subText} line-clamp-1`}>
                          {pub.authors_text}
                        </div>
                        {pub.research_areas && pub.research_areas.length > 0 && (
                          <div className="flex flex-wrap gap-1 pt-1">
                            {pub.research_areas.map((area) => (
                              <span
                                key={area.id}
                                className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                              >
                                {area.title}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Journal & Metrics */}
                    <td className="py-3.5 px-4 align-top whitespace-nowrap">
                      <div className="space-y-1">
                        <div className="font-semibold italic text-slate-800 dark:text-slate-200 max-w-[200px] truncate">
                          {pub.journal}
                        </div>
                        <div className={`text-[11px] font-mono ${subText}`}>
                          {pub.impact_factor ? `IF: ${pub.impact_factor}` : "No IF"} · {pub.citation_count || 0} Cites
                        </div>
                      </div>
                    </td>

                    {/* DOI */}
                    <td className="py-3.5 px-4 align-top whitespace-nowrap">
                      {pub.doi ? (
                        <a
                          href={pub.doi_url || `https://doi.org/${pub.doi}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 font-mono text-[11px] text-emerald-600 dark:text-[#34D399] hover:underline"
                        >
                          <span className="truncate max-w-[140px]">{pub.doi}</span>
                          <ExternalLink className="w-3 h-3 shrink-0" />
                        </a>
                      ) : (
                        <span className={`text-[11px] ${subText}`}>—</span>
                      )}
                    </td>

                    {/* Featured Toggle */}
                    <td className="py-3.5 px-4 align-top text-center whitespace-nowrap">
                      <button
                        onClick={() => handleToggleFeatured(pub)}
                        className={`p-1.5 rounded-lg transition ${
                          pub.is_featured
                            ? "text-amber-500 bg-amber-50 dark:bg-amber-950/40"
                            : "text-slate-300 dark:text-slate-600 hover:text-slate-400"
                        }`}
                        title="Toggle Featured"
                      >
                        <Star className={`w-4 h-4 ${pub.is_featured ? "fill-amber-500" : ""}`} />
                      </button>
                    </td>

                    {/* Published Toggle */}
                    <td className="py-3.5 px-4 align-top text-center whitespace-nowrap">
                      <button
                        onClick={() => handleTogglePublish(pub)}
                        className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border transition ${
                          pub.is_published
                            ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800"
                            : "bg-slate-100 dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700"
                        }`}
                      >
                        {pub.is_published ? "Live" : "Draft"}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 align-top text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(pub)}
                          className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition"
                          title="Edit Publication"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(pub.id)}
                          className="p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-500 transition"
                          title="Delete Publication"
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
      {/* PUBLICATION ADD / EDIT MULTI-TAB MODAL                                    */}
      {/* ========================================================================= */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={`rounded-3xl border w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden ${modalBg}`}>
            {/* Modal Top Header */}
            <div className={`p-6 border-b flex items-center justify-between ${headerBg}`}>
              <div className="flex items-center gap-2.5">
                <BookOpen className="w-5 h-5 text-emerald-500" />
                <h2 className={`text-base font-bold ${headingText}`}>
                  {formData.id ? "Edit Publication Record" : "Add New Scientific Publication"}
                </h2>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Tabs Bar */}
            <div className={`flex items-center gap-2 px-6 border-b overflow-x-auto ${headerBg}`}>
              {[
                { id: "basic", label: "Basic Info", icon: FileText },
                { id: "metrics", label: "Journal & Metrics", icon: TrendingUp },
                { id: "links", label: "DOI & Direct Links", icon: ExternalLink },
                { id: "authors", label: "Authors & Citation", icon: Quote },
                { id: "areas", label: "Research Areas", icon: Layers },
                { id: "visibility", label: "Visibility", icon: Star },
              ].map((t) => {
                const Icon = t.icon;
                const active = activeTab === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setActiveTab(t.id as any)}
                    className={`py-3 px-3.5 text-xs font-semibold border-b-2 flex items-center gap-1.5 whitespace-nowrap transition ${
                      active
                        ? "border-emerald-500 text-emerald-600 dark:text-[#34D399]"
                        : "border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{t.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Modal Form Body */}
            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1 space-y-5 text-xs">
              {/* TAB 1: BASIC INFO */}
              {activeTab === "basic" && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <div>
                    <label className={`block font-semibold mb-1.5 ${headingText}`}>
                      Publication Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="e.g. Microplastic ingestion and trophic transfer in commercially important fish..."
                      className={`w-full px-3.5 py-2.5 text-xs rounded-xl border outline-none transition ${inputBg}`}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className={`block font-semibold mb-1.5 ${headingText}`}>
                        Publication Type
                      </label>
                      <select
                        value={formData.publication_type}
                        onChange={(e) => setFormData({ ...formData, publication_type: e.target.value as PublicationType })}
                        className={`w-full px-3.5 py-2.5 text-xs rounded-xl border outline-none transition ${inputBg}`}
                      >
                        <option value="journal_article">Journal Article</option>
                        <option value="review">Review Article</option>
                        <option value="conference_paper">Conference Paper</option>
                        <option value="book_chapter">Book Chapter</option>
                        <option value="technical_report">Technical Report</option>
                        <option value="preprint">Preprint</option>
                      </select>
                    </div>

                    <div>
                      <label className={`block font-semibold mb-1.5 ${headingText}`}>
                        Publication Year *
                      </label>
                      <input
                        type="number"
                        required
                        value={formData.publication_year}
                        onChange={(e) => setFormData({ ...formData, publication_year: Number(e.target.value) })}
                        className={`w-full px-3.5 py-2.5 text-xs font-mono rounded-xl border outline-none transition ${inputBg}`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className={`block font-semibold mb-1.5 ${headingText}`}>
                      Abstract / Executive Scientific Synopsis
                    </label>
                    <textarea
                      rows={5}
                      value={formData.abstract}
                      onChange={(e) => setFormData({ ...formData, abstract: e.target.value })}
                      placeholder="Empirical background, core methodology, key analytical findings, and ecological conclusions..."
                      className={`w-full px-3.5 py-2.5 text-xs leading-relaxed rounded-xl border outline-none transition ${inputBg}`}
                    />
                  </div>
                </div>
              )}

              {/* TAB 2: JOURNAL & METRICS */}
              {activeTab === "metrics" && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <div>
                    <label className={`block font-semibold mb-1.5 ${headingText}`}>
                      Journal / Publisher / Conference Venue *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.journal}
                      onChange={(e) => setFormData({ ...formData, journal: e.target.value })}
                      placeholder="e.g. Environmental Science & Technology (ACS)"
                      className={`w-full px-3.5 py-2.5 text-xs rounded-xl border outline-none transition ${inputBg}`}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className={`block font-semibold mb-1.5 ${headingText}`}>Volume</label>
                      <input
                        type="text"
                        value={formData.volume}
                        onChange={(e) => setFormData({ ...formData, volume: e.target.value })}
                        placeholder="e.g. 58"
                        className={`w-full px-3 py-2 text-xs rounded-xl border outline-none transition ${inputBg}`}
                      />
                    </div>
                    <div>
                      <label className={`block font-semibold mb-1.5 ${headingText}`}>Issue</label>
                      <input
                        type="text"
                        value={formData.issue}
                        onChange={(e) => setFormData({ ...formData, issue: e.target.value })}
                        placeholder="e.g. 4"
                        className={`w-full px-3 py-2 text-xs rounded-xl border outline-none transition ${inputBg}`}
                      />
                    </div>
                    <div>
                      <label className={`block font-semibold mb-1.5 ${headingText}`}>Page Range</label>
                      <input
                        type="text"
                        value={formData.pages}
                        onChange={(e) => setFormData({ ...formData, pages: e.target.value })}
                        placeholder="e.g. 1892–1904"
                        className={`w-full px-3 py-2 text-xs rounded-xl border outline-none transition ${inputBg}`}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className={`block font-semibold mb-1.5 ${headingText}`}>Impact Factor (IF)</label>
                      <input
                        type="number"
                        step="0.01"
                        value={formData.impact_factor}
                        onChange={(e) => setFormData({ ...formData, impact_factor: e.target.value })}
                        placeholder="e.g. 11.4"
                        className={`w-full px-3 py-2 text-xs font-mono rounded-xl border outline-none transition ${inputBg}`}
                      />
                    </div>
                    <div>
                      <label className={`block font-semibold mb-1.5 ${headingText}`}>Citations Count</label>
                      <input
                        type="number"
                        value={formData.citation_count}
                        onChange={(e) => setFormData({ ...formData, citation_count: e.target.value })}
                        placeholder="e.g. 42"
                        className={`w-full px-3 py-2 text-xs font-mono rounded-xl border outline-none transition ${inputBg}`}
                      />
                    </div>
                    <div>
                      <label className={`block font-semibold mb-1.5 ${headingText}`}>Journal Quartile</label>
                      <select
                        value={formData.quartile}
                        onChange={(e) => setFormData({ ...formData, quartile: e.target.value })}
                        className={`w-full px-3 py-2 text-xs rounded-xl border outline-none transition ${inputBg}`}
                      >
                        <option value="Q1">Q1 (Top 25%)</option>
                        <option value="Q2">Q2</option>
                        <option value="Q3">Q3</option>
                        <option value="Q4">Q4</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: DOI & DIRECT LINKS */}
              {activeTab === "links" && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 dark:text-emerald-300 space-y-1">
                    <div className="font-bold flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4" />
                      <span>Automatic DOI Link Generator</span>
                    </div>
                    <p className="text-[11px] leading-relaxed">
                      Simply input the DOI (e.g. <code>10.1021/acs.est.2026.04891</code>). The system automatically formats the direct publisher redirection URL.
                    </p>
                  </div>

                  <div>
                    <label className={`block font-semibold mb-1.5 ${headingText}`}>
                      Digital Object Identifier (DOI)
                    </label>
                    <input
                      type="text"
                      value={formData.doi}
                      onChange={(e) => handleDoiChange(e.target.value)}
                      placeholder="e.g. 10.1016/j.envpol.2026.121458"
                      className={`w-full px-3.5 py-2.5 text-xs font-mono rounded-xl border outline-none transition ${inputBg}`}
                    />
                    {formData.doi_url && (
                      <p className="mt-1.5 text-[11px] font-mono text-emerald-600 dark:text-[#34D399]">
                        Target URL: {formData.doi_url}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className={`block font-semibold mb-1.5 ${headingText}`}>
                      Open Access PDF / Repository URL (Optional)
                    </label>
                    <input
                      type="url"
                      value={formData.pdf_url}
                      onChange={(e) => setFormData({ ...formData, pdf_url: e.target.value })}
                      placeholder="https://..."
                      className={`w-full px-3.5 py-2 text-xs rounded-xl border outline-none transition ${inputBg}`}
                    />
                  </div>
                </div>
              )}

              {/* TAB 4: AUTHORS & BIBTEX */}
              {activeTab === "authors" && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <div>
                    <label className={`block font-semibold mb-1.5 ${headingText}`}>
                      Authors Citation String (APA Format) *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.authors_text}
                      onChange={(e) => setFormData({ ...formData, authors_text: e.target.value })}
                      placeholder="e.g. Kabir, M. S., Rahman, M. A., Ahmed, F., & Hossain, M. B."
                      className={`w-full px-3.5 py-2.5 text-xs rounded-xl border outline-none transition ${inputBg}`}
                    />

                    {/* Quick Lab Researcher Tag Chips */}
                    <div className="mt-2 space-y-1.5">
                      <span className={`text-[11px] font-semibold ${subText}`}>
                        Quick insert lab researcher:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {SEED_RESEARCHERS.map((res) => {
                          const isIncluded = formData.authors_text?.toLowerCase().includes(res.name.toLowerCase());
                          return (
                            <button
                              key={res.id}
                              type="button"
                              onClick={() => {
                                const current = formData.authors_text || "";
                                if (!current.toLowerCase().includes(res.name.toLowerCase())) {
                                  const updated = current ? `${current}, ${res.name}` : res.name;
                                  setFormData({ ...formData, authors_text: updated });
                                }
                              }}
                              className={`px-2 py-1 rounded-lg text-[10.5px] font-semibold transition border flex items-center gap-1 ${
                                isIncluded
                                  ? "bg-emerald-500/10 border-emerald-500 text-emerald-800 dark:text-[#34D399]"
                                  : "bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-emerald-500 cursor-pointer"
                              }`}
                            >
                              <span>{res.name}</span>
                              {isIncluded && <Check className="w-3 h-3 stroke-[2.5]" />}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className={`block font-semibold mb-1.5 ${headingText}`}>
                      Custom BibTeX Record (Optional)
                    </label>
                    <textarea
                      rows={6}
                      value={formData.bibtex}
                      onChange={(e) => setFormData({ ...formData, bibtex: e.target.value })}
                      placeholder={`@article{kabir2026,\n  title={...},\n  author={...}\n}`}
                      className={`w-full px-3.5 py-2 font-mono text-[11px] rounded-xl border outline-none transition ${inputBg}`}
                    />
                  </div>
                </div>
              )}

              {/* TAB 5: RESEARCH AREAS */}
              {activeTab === "areas" && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <label className={`block font-semibold mb-2 ${headingText}`}>
                    Select Associated Research Disciplines
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {SEED_RESEARCH_AREAS.map((area) => {
                      const isChecked = formData.research_area_ids?.includes(area.id);
                      return (
                        <button
                          type="button"
                          key={area.id}
                          onClick={() => {
                            const prev = formData.research_area_ids || [];
                            const updated = isChecked ? prev.filter((id) => id !== area.id) : [...prev, area.id];
                            setFormData({ ...formData, research_area_ids: updated });
                          }}
                          className={`p-3 rounded-xl border text-left flex items-center justify-between transition ${
                            isChecked
                              ? "bg-emerald-500/10 border-emerald-500 text-emerald-800 dark:text-[#34D399]"
                              : "bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400"
                          }`}
                        >
                          <span className="font-semibold text-xs">{area.title}</span>
                          {isChecked && <Check className="w-4 h-4 stroke-[3]" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* TAB 6: VISIBILITY & STATUS */}
              {activeTab === "visibility" && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <div className="p-4 rounded-xl border flex items-center justify-between">
                    <div>
                      <div className={`font-semibold ${headingText}`}>Featured Publication</div>
                      <div className={`text-[11px] ${subText}`}>
                        Highlight this paper on the homepage carousel and top landmark cards.
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={formData.is_featured}
                      onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                      className="w-4 h-4 rounded text-emerald-600 cursor-pointer"
                    />
                  </div>

                  <div className="p-4 rounded-xl border flex items-center justify-between">
                    <div>
                      <div className={`font-semibold ${headingText}`}>Published (Public Status)</div>
                      <div className={`text-[11px] ${subText}`}>
                        When enabled, this paper is immediately visible to visitors on /publications.
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={formData.is_published}
                      onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                      className="w-4 h-4 rounded text-emerald-600 cursor-pointer"
                    />
                  </div>
                </div>
              )}

              {/* Modal Bottom Actions */}
              <div className={`pt-4 border-t flex items-center justify-end gap-3 ${headerBg}`}>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-[#020F07] font-bold shadow-lg shadow-emerald-500/20 transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>Save Publication</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* DELETE CONFIRMATION MODAL                                                 */}
      {/* ========================================================================= */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={`rounded-2xl border p-6 max-w-md w-full space-y-4 shadow-2xl ${modalBg}`}>
            <div className="flex items-center gap-3 text-rose-500">
              <AlertCircle className="w-6 h-6 shrink-0" />
              <h3 className={`text-sm font-bold ${headingText}`}>Confirm Deletion</h3>
            </div>
            <p className={`text-xs ${subText} leading-relaxed`}>
              Are you sure you want to delete this publication from the database? This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                className="px-3.5 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="px-4 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
