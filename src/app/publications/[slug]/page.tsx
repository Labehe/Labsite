"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  BookOpen,
  ArrowLeft,
  ExternalLink,
  Copy,
  Check,
  Quote,
  Calendar,
  Layers,
  Award,
  FlaskConical,
  Share2,
  TrendingUp,
  Download,
  Building2,
  Users
} from "lucide-react";
import { Navbar } from "@/components/public/navbar";
import { Footer } from "@/components/public/footer";
import { PublicationWithRelations } from "@/lib/publications/types";
import { getPublicationBySlug } from "@/lib/publications/queries";

export default function PublicationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;

  const [publication, setPublication] = useState<PublicationWithRelations | null>(null);
  const [loading, setLoading] = useState(true);
  const [copiedBibtex, setCopiedBibtex] = useState(false);
  const [copiedDoi, setCopiedDoi] = useState(false);

  useEffect(() => {
    if (!slug) return;
    const fetchPub = async () => {
      setLoading(true);
      try {
        const found = await getPublicationBySlug(slug);
        setPublication(found);
      } catch (err) {
        console.error("Error loading publication:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPub();
  }, [slug]);

  const handleCopyBibtex = () => {
    if (!publication) return;
    const bib =
      publication.bibtex ||
      `@article{${publication.slug.slice(0, 15)},\n  title={${publication.title}},\n  author={${publication.authors_text}},\n  journal={${publication.journal}},\n  year={${publication.publication_year}},\n  doi={${publication.doi || ""}}\n}`;
    navigator.clipboard.writeText(bib);
    setCopiedBibtex(true);
    setTimeout(() => setCopiedBibtex(false), 2000);
  };

  const handleCopyDoi = () => {
    if (!publication?.doi) return;
    navigator.clipboard.writeText(`https://doi.org/${publication.doi}`);
    setCopiedDoi(true);
    setTimeout(() => setCopiedDoi(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#070B12] text-slate-900 dark:text-slate-100 flex flex-col justify-between">
        <Navbar />
        <div className="pt-40 pb-20 max-w-4xl mx-auto px-4 text-center space-y-4">
          <div className="w-10 h-10 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-slate-500">Retrieving scientific publication record...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!publication) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#070B12] text-slate-900 dark:text-slate-100 flex flex-col justify-between">
        <Navbar />
        <div className="pt-40 pb-20 max-w-xl mx-auto px-4 text-center space-y-6">
          <BookOpen className="w-12 h-12 text-slate-400 mx-auto" />
          <h1 className="text-2xl font-bold font-[family-name:var(--font-manrope)]">Publication Not Found</h1>
          <p className="text-xs text-slate-500">
            The requested paper may have been moved, archived, or is currently unpublished.
          </p>
          <Link
            href="/publications"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-800 dark:bg-[#34D399] text-white dark:text-slate-950 text-xs font-bold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Publications Repository</span>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#070B12] text-slate-900 dark:text-slate-100 flex flex-col justify-between transition-colors duration-300">
      <Navbar />

      <main className="pt-32 sm:pt-40 pb-20">
        <div className="max-w-[1300px] mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          {/* Back Navigation Bar */}
          <div className="flex items-center justify-between">
            <Link
              href="/publications"
              className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-emerald-700 dark:hover:text-[#34D399] transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to All Publications</span>
            </Link>

            {publication.doi && (
              <a
                href={publication.doi_url || `https://doi.org/${publication.doi}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 dark:bg-[#34D399] dark:hover:bg-emerald-400 text-white dark:text-slate-950 text-xs font-bold transition shadow-xs"
              >
                <span>Publisher Page</span>
                <ExternalLink className="w-3.5 h-3.5 stroke-[2.5]" />
              </a>
            )}
          </div>

          {/* Top Article Executive Card */}
          <div className="p-8 sm:p-10 rounded-3xl bg-white dark:bg-[#0B1120] border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-6 text-left">
            {/* Badges & Metrics Row */}
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-lg bg-emerald-100/80 dark:bg-emerald-950/80 text-emerald-950 dark:text-[#34D399] border border-emerald-300 dark:border-emerald-800 font-mono font-bold">
                  {publication.publication_year}
                </span>

                <span className="px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-200 font-bold uppercase tracking-wider text-[11px] border border-slate-200 dark:border-slate-700">
                  {publication.publication_type.replace(/_/g, " ")}
                </span>

                {publication.quartile && (
                  <span className="px-2.5 py-0.5 rounded-md bg-amber-100/80 dark:bg-amber-950/60 text-amber-950 dark:text-amber-300 border border-amber-300 dark:border-amber-800 font-mono font-bold">
                    {publication.quartile}
                  </span>
                )}

                {publication.impact_factor && (
                  <span className="text-xs font-mono text-slate-700 dark:text-slate-300 font-medium">
                    Impact Factor: <strong className="text-slate-950 dark:text-white font-bold">{publication.impact_factor}</strong>
                  </span>
                )}

                {publication.citation_count && publication.citation_count > 0 ? (
                  <span className="text-xs font-mono text-slate-700 dark:text-slate-300 font-medium">
                    Citations: <strong className="text-slate-950 dark:text-white font-bold">{publication.citation_count}</strong>
                  </span>
                ) : null}
              </div>

              {publication.research_areas && publication.research_areas.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {publication.research_areas.map((area) => (
                    <span
                      key={area.id}
                      className="text-[11px] font-semibold px-2.5 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900/40"
                    >
                      {area.title}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white leading-tight tracking-tight font-[family-name:var(--font-manrope)]">
              {publication.title}
            </h1>

            {/* Authors */}
            <div className="space-y-1">
              <div className="text-xs font-extrabold uppercase tracking-wider text-slate-600 dark:text-slate-400">Authors &amp; Contributors</div>
              <p className="text-sm sm:text-base text-slate-900 dark:text-slate-100 font-semibold leading-relaxed font-[family-name:var(--font-inter)]">
                {publication.authors_text}
              </p>
            </div>

            {/* Journal Information */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800/80 flex flex-wrap items-center justify-between gap-4 text-xs">
              <div className="space-y-0.5">
                <div className="text-slate-600 dark:text-slate-400 font-semibold">Published in</div>
                <div className="text-sm font-extrabold text-emerald-900 dark:text-[#34D399]">
                  {publication.journal} {publication.volume && `· Vol. ${publication.volume}`} {publication.issue && `(${publication.issue})`} {publication.pages && `· pp. ${publication.pages}`}
                </div>
              </div>

              {publication.doi && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopyDoi}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#070B12] text-slate-900 dark:text-slate-200 text-xs font-bold hover:border-emerald-600 shadow-xs"
                  >
                    {copiedDoi ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>DOI: {publication.doi}</span>
                  </button>
                </div>
              )}
            </div>

            {/* Abstract Section */}
            <div className="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-800">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white font-[family-name:var(--font-manrope)]">
                Abstract &amp; Empirical Scope
              </h2>
              <p className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-[family-name:var(--font-inter)] whitespace-pre-line font-normal">
                {publication.abstract}
              </p>
            </div>

            {/* Linked Projects if any */}
            {publication.projects && publication.projects.length > 0 && (
              <div className="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                  Associated Research Projects
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {publication.projects.map((p) => (
                    <Link
                      key={p.id}
                      href={`/projects/${p.slug}`}
                      className="p-4 rounded-2xl bg-teal-50/70 dark:bg-teal-950/20 border border-teal-300 dark:border-teal-800/40 hover:border-teal-600 transition flex items-center justify-between group shadow-xs"
                    >
                      <div className="flex items-center gap-2.5">
                        <FlaskConical className="w-4 h-4 text-teal-700 dark:text-teal-400" />
                        <span className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-teal-800 dark:group-hover:text-teal-300">
                          {p.title}
                        </span>
                      </div>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-teal-600" />
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* BibTeX Reference Box */}
            <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  BibTeX Citation Reference
                </h3>
                <button
                  onClick={handleCopyBibtex}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-[#34D399] hover:underline"
                >
                  {copiedBibtex ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedBibtex ? "Copied to Clipboard" : "Copy BibTeX"}</span>
                </button>
              </div>

              <pre className="p-4 rounded-2xl bg-slate-900 text-emerald-400 font-mono text-xs leading-relaxed overflow-x-auto">
                {publication.bibtex ||
                  `@article{${publication.slug.slice(0, 15)},\n  title={${publication.title}},\n  author={${publication.authors_text}},\n  journal={${publication.journal}},\n  year={${publication.publication_year}},\n  doi={${publication.doi || ""}}\n}`}
              </pre>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
