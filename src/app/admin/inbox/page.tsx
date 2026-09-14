"use client";

import React, { useState, useEffect } from "react";
import { useAdminTheme } from "@/lib/admin-theme";
import { getInquiries, updateInquiryStatus, deleteInquiry } from "@/lib/inbox/store";
import { Inquiry, InquiryStatus } from "@/lib/inbox/types";
import {
  Inbox,
  Search,
  CheckCircle2,
  Mail,
  Phone,
  Trash2,
  Loader2,
  Clock,
  Filter,
  Building2,
  GraduationCap,
  MessageSquare,
  Sparkles,
  ExternalLink,
  Reply,
  Check,
  X,
  Tag
} from "lucide-react";

export default function AdminInboxPage() {
  const { theme } = useAdminTheme();
  const isLight = theme === "light";

  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | "contact_form" | "student_application">("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);

  const cardBg = isLight ? "bg-white border-slate-200/90 shadow-xs" : "bg-[#0F172A] border-slate-800 shadow-md";
  const subText = isLight ? "text-slate-500" : "text-slate-400";
  const titleText = isLight ? "text-slate-900" : "text-white";
  const inputBg = isLight ? "bg-slate-50 border-slate-300 text-slate-900 focus:bg-white" : "bg-[#090D16] border-slate-700 text-white";

  const loadData = async () => {
    setIsLoading(true);
    try {
      const data = await getInquiries();
      setInquiries(data);
      if (data.length > 0 && !selectedInquiry) {
        setSelectedInquiry(data[0]);
      }
    } catch (err) {
      console.error("Error loading inbox inquiries:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();

    // Live update when a new contact message or application is submitted
    const handleUpdate = () => {
      loadData();
    };

    window.addEventListener("lab_inbox_updated", handleUpdate);
    return () => window.removeEventListener("lab_inbox_updated", handleUpdate);
  }, []);

  const handleStatusChange = async (id: string, newStatus: InquiryStatus) => {
    await updateInquiryStatus(id, newStatus);
    setInquiries((prev) => prev.map((inq) => (inq.id === id ? { ...inq, status: newStatus } : inq)));
    if (selectedInquiry?.id === id) {
      setSelectedInquiry((prev) => (prev ? { ...prev, status: newStatus } : null));
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this inquiry message?")) return;
    await deleteInquiry(id);
    const updated = inquiries.filter((inq) => inq.id !== id);
    setInquiries(updated);
    if (selectedInquiry?.id === id) {
      setSelectedInquiry(updated.length > 0 ? updated[0] : null);
    }
  };

  // Filtered inquiries list
  const filteredInquiries = inquiries.filter((inq) => {
    if (typeFilter !== "all" && inq.type !== typeFilter) return false;
    if (statusFilter !== "all" && inq.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = inq.name.toLowerCase().includes(q);
      const matchEmail = inq.email.toLowerCase().includes(q);
      const matchOrg = (inq.organization || "").toLowerCase().includes(q);
      const matchSubject = (inq.subject || "").toLowerCase().includes(q);
      const matchMsg = inq.message.toLowerCase().includes(q);
      const matchCategory = inq.category.toLowerCase().includes(q);
      if (!matchName && !matchEmail && !matchOrg && !matchSubject && !matchMsg && !matchCategory) {
        return false;
      }
    }
    return true;
  });

  const counts = {
    all: inquiries.length,
    contact_form: inquiries.filter((i) => i.type === "contact_form").length,
    student_application: inquiries.filter((i) => i.type === "student_application").length,
    new: inquiries.filter((i) => i.status === "new").length,
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Inbox className="w-4 h-4" />
            </div>
            <h1 className="text-xl font-bold tracking-tight font-[family-name:var(--font-manrope)]">
              Unified Communications Inbox &amp; Inquiries
            </h1>
          </div>
          <p className={`text-xs ${subText} mt-1`}>
            Real-time messages from public Contact Us submissions, collaboration inquiries, and student applications.
          </p>
        </div>

        {counts.new > 0 && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>{counts.new} Unreviewed Inquiries</span>
          </div>
        )}
      </div>

      {/* Type Tabs & Search Controls */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Type Navigation Tabs */}
        <div className={`p-1.5 rounded-2xl border flex items-center gap-1.5 overflow-x-auto ${cardBg}`}>
          {[
            { id: "all", label: "All Inquiries", count: counts.all, icon: Inbox },
            { id: "contact_form", label: "Contact Us Messages", count: counts.contact_form, icon: MessageSquare },
            { id: "student_application", label: "Student Applications", count: counts.student_application, icon: GraduationCap },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = typeFilter === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setTypeFilter(tab.id as any)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                  isActive
                    ? "bg-emerald-600 text-white font-bold shadow-sm"
                    : isLight
                    ? "text-slate-600 hover:bg-slate-100"
                    : "text-slate-400 hover:bg-slate-800"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  isActive ? "bg-white/20 text-white font-bold" : "bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                }`}>
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search & Status Filter */}
        <div className="flex items-center gap-2.5">
          <div className={`relative flex-1 sm:w-64 p-1.5 rounded-xl border ${cardBg}`}>
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search sender, email, topic..."
              className="w-full pl-8 pr-3 py-1 bg-transparent text-xs outline-none"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className={`px-3 py-2 text-xs rounded-xl border outline-none ${inputBg}`}
          >
            <option value="all">All Status</option>
            <option value="new">New</option>
            <option value="reviewing">Under Review</option>
            <option value="responded">Responded</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>

      {/* Main Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: LIST OF INQUIRIES (5 Cols) */}
        <div className="lg:col-span-5 space-y-3">
          {isLoading ? (
            <div className="p-12 text-center text-slate-400 flex flex-col items-center justify-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin text-emerald-500" />
              <span className="text-xs">Loading inquiries...</span>
            </div>
          ) : filteredInquiries.length === 0 ? (
            <div className={`p-8 text-center rounded-2xl border ${cardBg} text-xs text-slate-400 space-y-1`}>
              <Inbox className="w-8 h-8 text-slate-300 dark:text-slate-700 mx-auto mb-2" />
              <p className="font-semibold">No messages found.</p>
              <p className="text-[11px]">Messages submitted from the Contact Us page or Opportunities portal will appear here.</p>
            </div>
          ) : (
            filteredInquiries.map((inq) => {
              const isSelected = selectedInquiry?.id === inq.id;
              const isNew = inq.status === "new";

              return (
                <div
                  key={inq.id}
                  onClick={() => setSelectedInquiry(inq)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    isSelected
                      ? isLight
                        ? "bg-emerald-50/90 border-emerald-500 shadow-sm"
                        : "bg-emerald-950/40 border-emerald-500/60 shadow-md"
                      : `${cardBg} hover:border-emerald-500/40`
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1.5">
                      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                        inq.status === "new"
                          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-400 border border-emerald-500/30"
                          : inq.status === "reviewing"
                          ? "bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-400 border border-amber-500/30"
                          : inq.status === "responded"
                          ? "bg-cyan-100 text-cyan-800 dark:bg-cyan-950/80 dark:text-cyan-400 border border-cyan-500/30"
                          : "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-400"
                      }`}>
                        {inq.status}
                      </span>

                      <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 truncate max-w-[140px]">
                        {inq.category}
                      </span>
                    </div>

                    <span className={`text-[10px] font-mono ${subText}`}>
                      {new Date(inq.created_at).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className={`text-xs font-bold ${titleText} flex items-center gap-1.5`}>
                        {isNew && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />}
                        <span>{inq.name}</span>
                      </h3>
                      {inq.organization && (
                        <p className={`text-[11px] ${subText} truncate mt-0.5`}>{inq.organization}</p>
                      )}
                    </div>
                  </div>

                  {inq.subject && (
                    <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400 line-clamp-1 mt-1.5">
                      {inq.subject}
                    </p>
                  )}

                  <p className={`text-[11px] ${subText} line-clamp-2 mt-1 leading-relaxed`}>
                    {inq.message}
                  </p>
                </div>
              );
            })
          )}
        </div>

        {/* RIGHT COLUMN: DETAILED INQUIRY VIEW (7 Cols) */}
        <div className={`lg:col-span-7 rounded-3xl border ${cardBg} p-6 sm:p-8`}>
          {selectedInquiry ? (
            <div className="space-y-6">
              {/* Header Details */}
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 pb-5 border-b border-slate-200 dark:border-slate-800">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-full ${
                      selectedInquiry.type === "student_application"
                        ? "bg-purple-100 text-purple-800 dark:bg-purple-950/80 dark:text-purple-300 border border-purple-500/30"
                        : "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-500/30"
                    }`}>
                      {selectedInquiry.type === "student_application" ? "Student Application" : "Contact Us Message"}
                    </span>
                    <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                      • {selectedInquiry.category}
                    </span>
                  </div>

                  <h2 className={`text-xl font-bold font-[family-name:var(--font-manrope)] ${titleText}`}>
                    {selectedInquiry.name}
                  </h2>
                  {selectedInquiry.organization && (
                    <p className={`text-xs ${subText} mt-0.5 flex items-center gap-1.5`}>
                      <Building2 className="w-3.5 h-3.5 text-slate-400" />
                      <span>{selectedInquiry.organization}</span>
                    </p>
                  )}
                </div>

                {/* Actions: Status Dropdown & Delete */}
                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <select
                    value={selectedInquiry.status}
                    onChange={(e) => handleStatusChange(selectedInquiry.id, e.target.value as InquiryStatus)}
                    className={`px-3 py-1.5 rounded-xl border text-xs font-semibold outline-none ${inputBg}`}
                  >
                    <option value="new">Status: New</option>
                    <option value="reviewing">Status: Under Review</option>
                    <option value="responded">Status: Responded</option>
                    <option value="archived">Status: Archived</option>
                    <option value="rejected">Status: Rejected</option>
                  </select>

                  <button
                    type="button"
                    onClick={() => handleDelete(selectedInquiry.id)}
                    className="p-2 rounded-xl border border-rose-200 dark:border-rose-900/60 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition cursor-pointer"
                    title="Delete inquiry"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Sender Metadata Box */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#090D16] border border-slate-200/80 dark:border-slate-800 space-y-1">
                  <span className={`text-[10px] ${subText} uppercase font-mono`}>Email Address</span>
                  <p className="font-semibold flex items-center gap-1.5 text-slate-900 dark:text-white">
                    <Mail className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <a href={`mailto:${selectedInquiry.email}?subject=Re: ${encodeURIComponent(selectedInquiry.subject || "Lab Inquiry")}`} className="hover:underline truncate">
                      {selectedInquiry.email}
                    </a>
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#090D16] border border-slate-200/80 dark:border-slate-800 space-y-1">
                  <span className={`text-[10px] ${subText} uppercase font-mono`}>Phone / WhatsApp</span>
                  <p className="font-semibold flex items-center gap-1.5 text-slate-900 dark:text-white">
                    <Phone className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>{selectedInquiry.phone || "Not provided"}</span>
                  </p>
                </div>
              </div>

              {/* Subject Line */}
              {selectedInquiry.subject && (
                <div>
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-1">
                    Subject Line
                  </h4>
                  <p className={`text-sm font-bold ${titleText}`}>
                    {selectedInquiry.subject}
                  </p>
                </div>
              )}

              {/* Message Narrative Body */}
              <div>
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-2">
                  Message Content &amp; Transmission Narrative
                </h4>
                <div className="p-5 rounded-2xl bg-slate-50 dark:bg-[#090D16] border border-slate-200/80 dark:border-slate-800 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap text-slate-800 dark:text-slate-200">
                  {selectedInquiry.message}
                </div>
              </div>

              {/* Student Candidate Specific Information (if applicable) */}
              {selectedInquiry.degree_level && (
                <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/30 text-xs space-y-2">
                  <div className="font-bold text-purple-700 dark:text-purple-300 uppercase tracking-wider text-[11px]">
                    Candidate Degree &amp; Academic Background
                  </div>
                  <p><strong>Target Program:</strong> {selectedInquiry.degree_level}</p>
                  {selectedInquiry.university && <p><strong>Previous University:</strong> {selectedInquiry.university}</p>}
                  {selectedInquiry.research_interest && <p><strong>Research Focus:</strong> {selectedInquiry.research_interest}</p>}
                </div>
              )}

              {/* Action Buttons: Reply via Email */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="text-[11px] text-slate-400 font-mono">
                  Transmitted: {new Date(selectedInquiry.created_at).toLocaleString()}
                </div>

                <a
                  href={`mailto:${selectedInquiry.email}?subject=Re: ${encodeURIComponent(selectedInquiry.subject || "Environmental Health Lab Inquiry")}`}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/25 transition cursor-pointer"
                >
                  <Reply className="w-3.5 h-3.5" />
                  <span>Reply via Email Client</span>
                </a>
              </div>
            </div>
          ) : (
            <div className="h-96 flex flex-col items-center justify-center text-center text-slate-400 space-y-2">
              <Inbox className="w-10 h-10 text-emerald-500/30" />
              <p className="text-sm font-semibold">Select an Inquiry</p>
              <p className="text-xs text-slate-500 max-w-xs">
                Click on any inquiry from the left list to read the message and respond.
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
