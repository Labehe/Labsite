"use client";

import React, { useState, useEffect, useTransition } from "react";
import Link from "next/link";
import { useAdminTheme } from "@/lib/admin-theme";
import {
  Newspaper,
  Plus,
  Trash2,
  Edit3,
  Search,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ExternalLink,
  Star,
  Sparkles,
  Calendar,
  Layers,
  FlaskConical,
  Filter,
  Check,
  RefreshCw,
  X,
  FileText,
  Clock,
  Compass,
  Award,
  Image as ImageIcon,
  Users
} from "lucide-react";
import { NewsArticle, NewsCategory, NewsFormData } from "@/lib/news/types";
import { getPublishedNews, getNewsStats } from "@/lib/news/queries";
import {
  createNewsArticle,
  updateNewsArticle,
  deleteNewsArticle,
  toggleNewsFeatured,
  toggleNewsPublished
} from "@/lib/news/mutations";
import { NEWS_CATEGORIES_META } from "@/lib/news/seed-data";
import { SEED_RESEARCH_AREAS, SEED_PROJECTS, SEED_RESEARCHERS } from "@/lib/projects/seed-data";

export default function AdminNewsPage() {
  const { theme } = useAdminTheme();
  const isLight = theme === "light";

  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPending, startTransition] = useTransition();

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [yearFilter, setYearFilter] = useState("all");
  const [publishedFilter, setPublishedFilter] = useState("all");
  const [featuredFilter, setFeaturedFilter] = useState("all");

  // Modal / Editor State
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState<"basic" | "content" | "media" | "author" | "areas" | "visibility">("basic");
  const [saving, setSaving] = useState(false);
  const [statusNotification, setStatusNotification] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Delete modal state
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form State
  const initialFormState: NewsFormData = {
    id: "",
    title: "",
    slug: "",
    summary: "",
    content: "",
    category: "breakthrough",
    cover_image_url: "",
    image_caption: "",
    image_credit: "",
    author_name: "Lab Editorial Team",
    author_role: "Environmental Health & Ecotoxicology Laboratory",
    author_avatar: "",
    published_at: new Date().toISOString().split("T")[0],
    read_time_minutes: 4,
    is_featured: false,
    is_published: true,
    display_order: 0,
    tags: "",
    research_area_ids: [],
    project_ids: [],
  };

  const [formData, setFormData] = useState<NewsFormData>(initialFormState);

  // Load Data
  const loadData = async () => {
    setIsLoading(true);
    try {
      const allNews = await getPublishedNews({}, true); // include drafts
      setArticles(allNews);
    } catch (err) {
      console.error("Error loading admin news:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();

    const handleUpdate = () => loadData();
    window.addEventListener("lab_news_updated", handleUpdate);
    return () => window.removeEventListener("lab_news_updated", handleUpdate);
  }, []);

  // Filtered Articles for Table
  const filteredArticles = articles.filter((a) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = a.title.toLowerCase().includes(q);
      const matchSummary = a.summary.toLowerCase().includes(q);
      const matchAuthor = a.author_name.toLowerCase().includes(q);
      if (!matchTitle && !matchSummary && !matchAuthor) return false;
    }
    if (categoryFilter !== "all" && a.category !== categoryFilter) return false;
    if (yearFilter !== "all" && new Date(a.published_at).getFullYear() !== parseInt(yearFilter, 10)) return false;
    if (publishedFilter === "published" && !a.is_published) return false;
    if (publishedFilter === "draft" && a.is_published) return false;
    if (featuredFilter === "featured" && !a.is_featured) return false;
    return true;
  });

  // Open Add Modal
  const handleOpenAdd = () => {
    setFormData(initialFormState);
    setActiveTab("basic");
    setShowModal(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (article: NewsArticle) => {
    setFormData({
      id: article.id,
      title: article.title,
      slug: article.slug,
      summary: article.summary,
      content: article.content,
      category: article.category,
      cover_image_url: article.cover_image_url || "",
      image_caption: article.image_caption || "",
      image_credit: article.image_credit || "",
      author_name: article.author_name,
      author_role: article.author_role || "",
      author_avatar: article.author_avatar || "",
      published_at: article.published_at,
      read_time_minutes: article.read_time_minutes,
      is_featured: !!article.is_featured,
      is_published: article.is_published !== false,
      display_order: article.display_order || 0,
      tags: article.tags?.join(", ") || "",
      research_area_ids: article.research_areas?.map((r) => r.id) || [],
      project_ids: article.projects?.map((p) => p.id) || [],
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
        const res = await updateNewsArticle(formData.id, formData);
        if (res.success) {
          setStatusNotification({ type: "success", message: "News article updated successfully!" });
        } else {
          setStatusNotification({ type: "error", message: res.error || "Failed to update article" });
        }
      } else {
        const res = await createNewsArticle(formData);
        if (res.success) {
          setStatusNotification({ type: "success", message: "New dispatch published successfully!" });
        } else {
          setStatusNotification({ type: "error", message: res.error || "Failed to create article" });
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
      await deleteNewsArticle(deleteConfirmId);
      setStatusNotification({ type: "success", message: "Article removed from archives" });
      setDeleteConfirmId(null);
      await loadData();
    } catch (err: any) {
      setStatusNotification({ type: "error", message: "Failed to delete article" });
    }
  };

  // Fast Toggle Featured
  const handleToggleFeatured = async (article: NewsArticle) => {
    startTransition(async () => {
      const nextVal = !article.is_featured;
      await toggleNewsFeatured(article.id, nextVal);
      setArticles((prev) =>
        prev.map((a) => (a.id === article.id ? { ...a, is_featured: nextVal } : a))
      );
    });
  };

  // Fast Toggle Published
  const handleTogglePublish = async (article: NewsArticle) => {
    startTransition(async () => {
      const nextVal = !article.is_published;
      await toggleNewsPublished(article.id, nextVal);
      setArticles((prev) =>
        prev.map((a) => (a.id === article.id ? { ...a, is_published: nextVal } : a))
      );
    });
  };

  const distinctYears = Array.from(
    new Set(articles.map((a) => new Date(a.published_at).getFullYear()))
  ).filter((y) => !isNaN(y)).sort((a, b) => b - a);

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
      {/* Top Header & Quick Actions */}
      <div className={`p-6 rounded-2xl border flex flex-col md:flex-row md:items-center justify-between gap-4 ${cardBg}`}>
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
              <Newspaper className="w-5 h-5" />
            </div>
            <div>
              <h1 className={`text-xl font-bold tracking-tight ${headingText}`}>
                News &amp; Scientific Insights Manager
              </h1>
              <p className={`text-xs ${subText}`}>
                Publish field dispatches, laboratory breakthroughs, research grants, symposium keynotes, and media features.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/news"
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-300 dark:border-emerald-500/30 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-emerald-950/40 transition"
          >
            <span>View Public Page</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-[#020F07] font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Dispatch</span>
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
          <div className={`text-xs font-semibold ${subText}`}>Total Dispatches</div>
          <div className={`text-2xl font-extrabold mt-1 ${headingText}`}>{articles.length}</div>
        </div>
        <div className={`p-4 rounded-xl border ${cardBg}`}>
          <div className={`text-xs font-semibold ${subText}`}>Research Breakthroughs</div>
          <div className="text-2xl font-extrabold mt-1 text-emerald-600 dark:text-[#34D399]">
            {articles.filter((a) => a.category === "breakthrough").length}
          </div>
        </div>
        <div className={`p-4 rounded-xl border ${cardBg}`}>
          <div className={`text-xs font-semibold ${subText}`}>Published Online</div>
          <div className="text-2xl font-extrabold mt-1 text-teal-600 dark:text-teal-300">
            {articles.filter((a) => a.is_published).length}
          </div>
        </div>
        <div className={`p-4 rounded-xl border ${cardBg}`}>
          <div className={`text-xs font-semibold ${subText}`}>Spotlight / Featured</div>
          <div className="text-2xl font-extrabold mt-1 text-amber-500">
            {articles.filter((a) => a.is_featured).length}
          </div>
        </div>
      </div>

      {/* Multi-Filter Control Strip */}
      <div className={`p-4 rounded-2xl border space-y-3 ${cardBg}`}>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {/* Search Input */}
          <div className="md:col-span-2 relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, author, or keyword..."
              className={`w-full pl-9 pr-3 py-2 text-xs rounded-xl border outline-none transition ${inputBg}`}
            />
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className={`w-full px-3 py-2 text-xs rounded-xl border outline-none transition ${inputBg}`}
            >
              <option value="all">All Categories</option>
              {Object.entries(NEWS_CATEGORIES_META).map(([key, cat]) => (
                <option key={key} value={key}>
                  {cat.label}
                </option>
              ))}
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

          {/* Status Filter */}
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

      {/* Articles Table */}
      <div className={`rounded-2xl border overflow-hidden shadow-xs ${cardBg}`}>
        {isLoading ? (
          <div className="p-16 text-center space-y-3">
            <Loader2 className="w-6 h-6 animate-spin mx-auto text-emerald-500" />
            <p className={`text-xs ${subText}`}>Loading articles from archive...</p>
          </div>
        ) : filteredArticles.length === 0 ? (
          <div className="p-16 text-center space-y-3">
            <Newspaper className="w-10 h-10 mx-auto text-slate-400" />
            <h3 className={`text-sm font-bold ${headingText}`}>No news dispatches found</h3>
            <p className={`text-xs ${subText} max-w-sm mx-auto`}>
              Try adjusting your search criteria or create a new research dispatch.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className={`border-b ${headerBg}`}>
                  <th className="py-3.5 px-4 font-extrabold text-slate-800 dark:text-slate-200 uppercase tracking-wider text-[11px]">Date / Category</th>
                  <th className="py-3.5 px-4 font-extrabold text-slate-800 dark:text-slate-200 uppercase tracking-wider text-[11px]">Title &amp; Summary</th>
                  <th className="py-3.5 px-4 font-extrabold text-slate-800 dark:text-slate-200 uppercase tracking-wider text-[11px]">Author / Tag</th>
                  <th className="py-3.5 px-4 font-extrabold text-slate-800 dark:text-slate-200 uppercase tracking-wider text-[11px] text-center">Spotlight</th>
                  <th className="py-3.5 px-4 font-extrabold text-slate-800 dark:text-slate-200 uppercase tracking-wider text-[11px] text-center">Status</th>
                  <th className="py-3.5 px-4 font-extrabold text-slate-800 dark:text-slate-200 uppercase tracking-wider text-[11px] text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/60 dark:divide-emerald-500/10">
                {filteredArticles.map((article) => {
                  const meta = NEWS_CATEGORIES_META[article.category] || NEWS_CATEGORIES_META.lab_update;

                  return (
                    <tr key={article.id} className={`transition ${tableRowHover}`}>
                      {/* Date / Category */}
                      <td className="py-3.5 px-4 align-top whitespace-nowrap">
                        <div className="space-y-1.5">
                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border ${meta.bgLight} ${meta.bgDark} ${meta.color} ${meta.borderLight} ${meta.borderDark}`}>
                            {meta.label}
                          </span>
                          <div className={`font-mono text-[11px] ${subText}`}>
                            {new Date(article.published_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                          </div>
                        </div>
                      </td>

                      {/* Title & Summary */}
                      <td className="py-3.5 px-4 align-top max-w-md">
                        <div className="space-y-1">
                          <div className={`font-semibold leading-snug ${headingText}`}>
                            {article.title}
                          </div>
                          <div className={`text-[11px] ${subText} line-clamp-1`}>
                            {article.summary}
                          </div>
                        </div>
                      </td>

                      {/* Author / Tags */}
                      <td className="py-3.5 px-4 align-top whitespace-nowrap">
                        <div className="space-y-1">
                          <div className={`font-semibold ${headingText}`}>
                            {article.author_name}
                          </div>
                          <div className="flex items-center gap-1 text-[11px] text-slate-500">
                            <Clock className="w-3 h-3" />
                            <span>{article.read_time_minutes} min read</span>
                          </div>
                        </div>
                      </td>

                      {/* Spotlight Toggle */}
                      <td className="py-3.5 px-4 align-top text-center">
                        <button
                          type="button"
                          onClick={() => handleToggleFeatured(article)}
                          className={`p-1.5 rounded-lg border transition ${
                            article.is_featured
                              ? "bg-amber-500/10 border-amber-500/40 text-amber-500"
                              : "border-transparent text-slate-400 hover:text-slate-600"
                          }`}
                          title="Toggle Spotlight Feature"
                        >
                          <Star className={`w-4 h-4 ${article.is_featured ? "fill-amber-500" : ""}`} />
                        </button>
                      </td>

                      {/* Published Status Toggle */}
                      <td className="py-3.5 px-4 align-top text-center">
                        <button
                          type="button"
                          onClick={() => handleTogglePublish(article)}
                          className={`px-2.5 py-1 rounded-full text-[10.5px] font-bold border transition ${
                            article.is_published
                              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-[#34D399]"
                              : "bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-500"
                          }`}
                        >
                          {article.is_published ? "Published" : "Draft"}
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 align-top text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            href={`/news/${article.slug}`}
                            target="_blank"
                            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition"
                            title="View Public Story"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handleOpenEdit(article)}
                            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition cursor-pointer"
                            title="Edit Article"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteConfirmId(article.id)}
                            className="p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-500 transition cursor-pointer"
                            title="Delete Article"
                          >
                            <Trash2 className="w-4 h-4" />
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

      {/* ========================================================================= */}
      {/* MULTI-TAB ADD / EDIT MODAL                                                */}
      {/* ========================================================================= */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={`rounded-3xl border w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden ${modalBg}`}>
            {/* Modal Header */}
            <div className={`p-6 border-b flex items-center justify-between ${headerBg}`}>
              <div className="flex items-center gap-2.5">
                <Newspaper className="w-5 h-5 text-emerald-500" />
                <h2 className={`text-base font-bold ${headingText}`}>
                  {formData.id ? "Edit Research Dispatch" : "Publish New Scientific Dispatch"}
                </h2>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Tabs */}
            <div className={`flex items-center gap-2 px-6 border-b overflow-x-auto ${headerBg}`}>
              {[
                { id: "basic", label: "Basic Info", icon: FileText },
                { id: "content", label: "Article Content", icon: Edit3 },
                { id: "media", label: "Cover Media", icon: ImageIcon },
                { id: "author", label: "Author & Team", icon: Users },
                { id: "areas", label: "Research Links", icon: Layers },
                { id: "visibility", label: "Visibility", icon: Star },
              ].map((t) => {
                const Icon = t.icon;
                const active = activeTab === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setActiveTab(t.id as any)}
                    className={`py-3 px-3.5 text-xs font-semibold border-b-2 flex items-center gap-1.5 whitespace-nowrap transition cursor-pointer ${
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

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1 space-y-5 text-xs">
              {/* TAB 1: BASIC INFO */}
              {activeTab === "basic" && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <div>
                    <label className={`block font-semibold mb-1.5 ${headingText}`}>Headline / Title *</label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="e.g. Breakthrough Study Maps Microplastic Translocation in Meghna Delta..."
                      className={`w-full px-3.5 py-2.5 text-xs rounded-xl border outline-none transition ${inputBg}`}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className={`block font-semibold mb-1.5 ${headingText}`}>Category / Section *</label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value as NewsCategory })}
                        className={`w-full px-3.5 py-2.5 text-xs rounded-xl border outline-none transition ${inputBg}`}
                      >
                        {Object.entries(NEWS_CATEGORIES_META).map(([key, cat]) => (
                          <option key={key} value={key}>
                            {cat.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className={`block font-semibold mb-1.5 ${headingText}`}>Publish Date *</label>
                      <input
                        type="date"
                        required
                        value={formData.published_at}
                        onChange={(e) => setFormData({ ...formData, published_at: e.target.value })}
                        className={`w-full px-3.5 py-2.5 text-xs font-mono rounded-xl border outline-none transition ${inputBg}`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className={`block font-semibold mb-1.5 ${headingText}`}>Executive Summary / Lead Paragraph *</label>
                    <textarea
                      rows={3}
                      required
                      value={formData.summary}
                      onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                      placeholder="Concise overview of the breakthrough, field expedition, or grant announcement..."
                      className={`w-full px-3.5 py-2.5 text-xs leading-relaxed rounded-xl border outline-none transition ${inputBg}`}
                    />
                  </div>

                  <div>
                    <label className={`block font-semibold mb-1.5 ${headingText}`}>Topic Tags (Comma-separated)</label>
                    <input
                      type="text"
                      value={typeof formData.tags === "string" ? formData.tags : formData.tags?.join(", ")}
                      onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                      placeholder="e.g. Microplastics, Meghna River, Spectroscopy, UNEP"
                      className={`w-full px-3.5 py-2.5 text-xs rounded-xl border outline-none transition ${inputBg}`}
                    />
                  </div>
                </div>
              )}

              {/* TAB 2: ARTICLE CONTENT */}
              {activeTab === "content" && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 dark:text-emerald-300 text-[11px] leading-relaxed">
                    Supports Markdown: <code>### Heading</code>, <code>**bold**</code>, <code>*italic*</code>, <code>&gt; Quote</code>, and lists.
                  </div>

                  <div>
                    <label className={`block font-semibold mb-1.5 ${headingText}`}>Long-Form Article Body *</label>
                    <textarea
                      rows={12}
                      required
                      value={formData.content}
                      onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      placeholder="Write your scientific story in markdown format..."
                      className={`w-full px-3.5 py-2.5 text-xs font-mono leading-relaxed rounded-xl border outline-none transition ${inputBg}`}
                    />
                  </div>
                </div>
              )}

              {/* TAB 3: COVER MEDIA */}
              {activeTab === "media" && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <div>
                    <label className={`block font-semibold mb-1.5 ${headingText}`}>Cover Image URL</label>
                    <input
                      type="url"
                      value={formData.cover_image_url}
                      onChange={(e) => setFormData({ ...formData, cover_image_url: e.target.value })}
                      placeholder="https://images.unsplash.com/..."
                      className={`w-full px-3.5 py-2.5 text-xs rounded-xl border outline-none transition ${inputBg}`}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className={`block font-semibold mb-1.5 ${headingText}`}>Image Caption</label>
                      <input
                        type="text"
                        value={formData.image_caption}
                        onChange={(e) => setFormData({ ...formData, image_caption: e.target.value })}
                        placeholder="e.g. Sampling team conducting trawl tows in estuarine channel"
                        className={`w-full px-3.5 py-2.5 text-xs rounded-xl border outline-none transition ${inputBg}`}
                      />
                    </div>

                    <div>
                      <label className={`block font-semibold mb-1.5 ${headingText}`}>Photo / Media Credit</label>
                      <input
                        type="text"
                        value={formData.image_credit}
                        onChange={(e) => setFormData({ ...formData, image_credit: e.target.value })}
                        placeholder="e.g. EcoToxLab Field Expedition Team"
                        className={`w-full px-3.5 py-2.5 text-xs rounded-xl border outline-none transition ${inputBg}`}
                      />
                    </div>
                  </div>

                  {formData.cover_image_url && (
                    <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 max-h-48">
                      <img
                        src={formData.cover_image_url}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>
              )}

              {/* TAB 4: AUTHORS & TEAM */}
              {activeTab === "author" && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <div>
                    <label className={`block font-semibold mb-1.5 ${headingText}`}>Author / Contributor Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.author_name}
                      onChange={(e) => setFormData({ ...formData, author_name: e.target.value })}
                      placeholder="e.g. Kotoha Nakayama"
                      className={`w-full px-3.5 py-2.5 text-xs rounded-xl border outline-none transition ${inputBg}`}
                    />

                    {/* Quick Researcher Chips */}
                    <div className="mt-2 space-y-1.5">
                      <span className={`text-[11px] font-semibold ${subText}`}>Quick select lab researcher:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {SEED_RESEARCHERS.map((res) => (
                          <button
                            key={res.id}
                            type="button"
                            onClick={() =>
                              setFormData({
                                ...formData,
                                author_name: res.name,
                                author_role: res.position,
                                author_avatar: res.photo_url || "",
                              })
                            }
                            className={`px-2 py-1 rounded-lg text-[10.5px] font-semibold transition border cursor-pointer ${
                              formData.author_name === res.name
                                ? "bg-emerald-500/10 border-emerald-500 text-emerald-800 dark:text-[#34D399]"
                                : "bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-emerald-500"
                            }`}
                          >
                            <span>{res.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className={`block font-semibold mb-1.5 ${headingText}`}>Author Role / Position</label>
                      <input
                        type="text"
                        value={formData.author_role || ""}
                        onChange={(e) => setFormData({ ...formData, author_role: e.target.value })}
                        placeholder="e.g. Postdoctoral Research Fellow"
                        className={`w-full px-3.5 py-2.5 text-xs rounded-xl border outline-none transition ${inputBg}`}
                      />
                    </div>

                    <div>
                      <label className={`block font-semibold mb-1.5 ${headingText}`}>Author Avatar URL (Optional)</label>
                      <input
                        type="url"
                        value={formData.author_avatar || ""}
                        onChange={(e) => setFormData({ ...formData, author_avatar: e.target.value })}
                        placeholder="https://..."
                        className={`w-full px-3.5 py-2.5 text-xs rounded-xl border outline-none transition ${inputBg}`}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 5: RESEARCH & PROJECTS */}
              {activeTab === "areas" && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <div>
                    <label className={`block font-semibold mb-2 ${headingText}`}>Associated Research Disciplines</label>
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
                            className={`p-3 rounded-xl border text-left flex items-center justify-between transition cursor-pointer ${
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

                  <div className="pt-2">
                    <label className={`block font-semibold mb-2 ${headingText}`}>Linked Ongoing Research Projects</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {SEED_PROJECTS.map((proj) => {
                        const isChecked = formData.project_ids?.includes(proj.id);
                        return (
                          <button
                            type="button"
                            key={proj.id}
                            onClick={() => {
                              const prev = formData.project_ids || [];
                              const updated = isChecked ? prev.filter((id) => id !== proj.id) : [...prev, proj.id];
                              setFormData({ ...formData, project_ids: updated });
                            }}
                            className={`p-3 rounded-xl border text-left flex items-center justify-between transition cursor-pointer ${
                              isChecked
                                ? "bg-teal-500/10 border-teal-500 text-teal-800 dark:text-teal-300"
                                : "bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400"
                            }`}
                          >
                            <span className="font-semibold text-xs truncate">{proj.title}</span>
                            {isChecked && <Check className="w-4 h-4 stroke-[3]" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 6: VISIBILITY */}
              {activeTab === "visibility" && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <div className="p-4 rounded-xl border flex items-center justify-between">
                    <div>
                      <div className={`font-semibold ${headingText}`}>Spotlight / Featured Story</div>
                      <div className={`text-[11px] ${subText}`}>
                        Display in top featured headline cards on the public /news and homepage.
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
                      <div className={`font-semibold ${headingText}`}>Published Status</div>
                      <div className={`text-[11px] ${subText}`}>
                        When checked, this article is live and readable by visitors.
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
                  className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-[#020F07] font-bold shadow-lg shadow-emerald-500/20 transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>Save &amp; Publish Dispatch</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={`rounded-2xl border p-6 max-w-md w-full space-y-4 shadow-2xl ${modalBg}`}>
            <div className="flex items-center gap-3 text-rose-500">
              <AlertCircle className="w-6 h-6 shrink-0" />
              <h3 className={`text-sm font-bold ${headingText}`}>Confirm Deletion</h3>
            </div>
            <p className={`text-xs ${subText} leading-relaxed`}>
              Are you sure you want to remove this research dispatch from the system?
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                className="px-3.5 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="px-4 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition cursor-pointer"
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
