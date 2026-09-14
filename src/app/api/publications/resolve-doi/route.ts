import { NextRequest, NextResponse } from "next/server";
import { PublicationFormData, PublicationType } from "@/lib/publications/types";
import { generatePublicationSlug } from "@/lib/publications/mutations";

/**
 * Clean and normalize a raw DOI string or URL
 */
function cleanDoiString(input: string): string {
  if (!input) return "";
  let clean = input.trim();
  // Remove markdown, brackets, quotes
  clean = clean.replace(/^[<(\["']+|[>)\]"']+$/g, "").trim();
  // Remove URL prefixes
  clean = clean.replace(/^https?:\/\/(?:dx\.)?doi\.org\//i, "");
  clean = clean.replace(/^doi:\s*/i, "");
  return clean.trim();
}

/**
 * Strip JATS XML and HTML tags from abstracts
 */
function cleanAbstract(raw?: string): string {
  if (!raw) return "";
  let text = raw;
  // Replace <jats:p> and </jats:p> or <p> with newlines/spaces
  text = text.replace(/<\/?[a-z0-9_-]+(?::[a-z0-9_-]+)?[^>]*>/gi, " ");
  // Decode common HTML entities
  text = text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
  return text;
}

/**
 * Map Crossref types to our PublicationType union
 */
function mapCrossrefType(crossrefType?: string): PublicationType {
  if (!crossrefType) return "journal_article";
  const t = crossrefType.toLowerCase();
  if (t.includes("review") || t === "review") return "review";
  if (t.includes("proceedings") || t.includes("conference")) return "conference_paper";
  if (t.includes("book") || t.includes("chapter") || t.includes("monograph")) return "book_chapter";
  if (t.includes("report") || t.includes("standard")) return "technical_report";
  if (t.includes("posted-content") || t.includes("preprint")) return "preprint";
  return "journal_article";
}

/**
 * Build APA Author Citation String from Crossref authors
 */
function buildApaAuthors(authors?: any[]): string {
  if (!authors || !Array.isArray(authors) || authors.length === 0) {
    return "Laboratory Research Group";
  }

  const formattedList = authors.map((a) => {
    if (a.name) return a.name;
    const family = a.family || "";
    const given = a.given || "";
    if (family && given) {
      // Create initials: "Md. Sojib" -> "M. S." or "John" -> "J."
      const initials = given
        .split(/[\s.-]+/)
        .filter(Boolean)
        .map((part: string) => `${part[0].toUpperCase()}.`)
        .join(" ");
      return `${family}, ${initials}`;
    }
    return family || given || "Unknown";
  });

  if (formattedList.length === 1) return formattedList[0];
  if (formattedList.length === 2) return `${formattedList[0]} & ${formattedList[1]}`;
  if (formattedList.length > 7) {
    return `${formattedList.slice(0, 6).join(", ")}, ... & ${formattedList[formattedList.length - 1]}`;
  }
  return `${formattedList.slice(0, -1).join(", ")}, & ${formattedList[formattedList.length - 1]}`;
}

/**
 * Synthesize a clean BibTeX entry
 */
function generateBibtex(data: {
  slug: string;
  type: PublicationType;
  title: string;
  authorsText: string;
  journal: string;
  year: number;
  volume?: string;
  issue?: string;
  pages?: string;
  doi?: string;
  url?: string;
}): string {
  const bibType =
    data.type === "conference_paper"
      ? "inproceedings"
      : data.type === "book_chapter"
      ? "incollection"
      : data.type === "technical_report"
      ? "techreport"
      : "article";

  const lines: string[] = [
    `@${bibType}{${data.slug || "publication"},`,
    `  title = {${data.title}},`,
    `  author = {${data.authorsText}},`,
  ];

  if (data.journal) {
    lines.push(`  journal = {${data.journal}},`);
  }
  if (data.year) {
    lines.push(`  year = {${data.year}},`);
  }
  if (data.volume) {
    lines.push(`  volume = {${data.volume}},`);
  }
  if (data.issue) {
    lines.push(`  number = {${data.issue}},`);
  }
  if (data.pages) {
    lines.push(`  pages = {${data.pages}},`);
  }
  if (data.doi) {
    lines.push(`  doi = {${data.doi}},`);
  }
  if (data.url) {
    lines.push(`  url = {${data.url}},`);
  }
  lines.push(`}`);

  return lines.join("\n");
}

/**
 * Fetch and parse a single DOI from Crossref
 */
async function resolveSingleDoi(rawDoi: string): Promise<{ data?: PublicationFormData; error?: string }> {
  const doi = cleanDoiString(rawDoi);
  if (!doi || !doi.startsWith("10.")) {
    return { error: `Invalid DOI format: "${rawDoi}". Must start with "10."` };
  }

  try {
    const crossrefUrl = `https://api.crossref.org/works/${encodeURIComponent(doi)}`;
    const res = await fetch(crossrefUrl, {
      headers: {
        "User-Agent": "LabWebsiteDOIResolver/2.0 (mailto:lab-admin@research.edu)",
        Accept: "application/json",
      },
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      if (res.status === 404) {
        return { error: `DOI not found in Crossref: ${doi}` };
      }
      return { error: `Crossref returned status ${res.status} for ${doi}` };
    }

    const json = await res.json();
    const item = json.message;
    if (!item) {
      return { error: `Empty response from Crossref for ${doi}` };
    }

    // Extract Title
    const title = Array.isArray(item.title) && item.title.length > 0 ? item.title[0].trim() : "Untitled Publication";

    // Extract Year
    let pubYear = new Date().getFullYear();
    let pubDate = "";
    if (item.issued && item.issued["date-parts"] && item.issued["date-parts"][0]) {
      const parts = item.issued["date-parts"][0];
      if (parts[0]) pubYear = parseInt(parts[0], 10);
      if (parts.length >= 3) {
        pubDate = `${parts[0]}-${String(parts[1]).padStart(2, "0")}-${String(parts[2]).padStart(2, "0")}`;
      } else if (parts.length === 2) {
        pubDate = `${parts[0]}-${String(parts[1]).padStart(2, "0")}-01`;
      }
    } else if (item.created && item.created["date-parts"] && item.created["date-parts"][0]) {
      pubYear = parseInt(item.created["date-parts"][0][0], 10) || pubYear;
    }

    // Extract Journal / Venue
    let journal = "";
    if (Array.isArray(item["container-title"]) && item["container-title"].length > 0) {
      journal = item["container-title"][0].trim();
    } else if (Array.isArray(item["short-container-title"]) && item["short-container-title"].length > 0) {
      journal = item["short-container-title"][0].trim();
    } else if (item.publisher) {
      journal = item.publisher.trim();
    }

    // Volume, Issue, Pages
    const volume = item.volume ? String(item.volume).trim() : "";
    const issue = item.issue ? String(item.issue).trim() : "";
    const pages = item.page ? String(item.page).trim() : "";

    // Abstract
    const abstract = cleanAbstract(item.abstract);

    // Citations Count
    const citationCount = typeof item["is-referenced-by-count"] === "number" ? String(item["is-referenced-by-count"]) : "0";

    // Authors
    const authorsText = buildApaAuthors(item.author);

    // Publication Type
    const pubType = mapCrossrefType(item.type);

    // Direct DOI URL & Open Access PDF
    const doiUrl = `https://doi.org/${doi}`;
    let pdfUrl = "";
    if (Array.isArray(item.link)) {
      const pdfLink = item.link.find((l: any) => l["content-type"] === "application/pdf" || l["content-type"]?.includes("pdf"));
      if (pdfLink && pdfLink.URL) {
        pdfUrl = pdfLink.URL;
      }
    }

    // Generate unique slug
    const slug = generatePublicationSlug(title);

    // BibTeX
    const bibtex = generateBibtex({
      slug,
      type: pubType,
      title,
      authorsText,
      journal,
      year: pubYear,
      volume,
      issue,
      pages,
      doi,
      url: doiUrl,
    });

    const parsed: PublicationFormData = {
      title,
      slug,
      abstract,
      publication_type: pubType,
      journal,
      volume,
      issue,
      pages,
      publication_year: pubYear,
      publication_date: pubDate || undefined,
      doi,
      doi_url: doiUrl,
      pdf_url: pdfUrl,
      external_url: doiUrl,
      citation_count: citationCount,
      impact_factor: "",
      quartile: "Q1",
      is_featured: false,
      is_published: true,
      display_order: 0,
      authors_text: authorsText,
      author_ids: [],
      research_area_ids: [],
      project_ids: [],
      bibtex,
    };

    return { data: parsed };
  } catch (err: any) {
    return { error: `Failed to resolve DOI ${doi}: ${err.message || String(err)}` };
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const rawDois: string[] = Array.isArray(body.dois)
      ? body.dois
      : typeof body.doi === "string"
      ? [body.doi]
      : [];

    if (rawDois.length === 0) {
      return NextResponse.json({ error: "No DOIs provided." }, { status: 400 });
    }

    // Limit batch size to 50 at a time for safety
    const sliced = rawDois.slice(0, 50);

    // Execute fetches concurrently with Promise.allSettled
    const results = await Promise.all(
      sliced.map(async (d) => {
        const res = await resolveSingleDoi(d);
        return {
          originalDoi: d,
          ...res,
        };
      })
    );

    return NextResponse.json({
      success: true,
      total: results.length,
      successful: results.filter((r) => r.data).length,
      failed: results.filter((r) => r.error).length,
      results,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Internal server error" }, { status: 500 });
  }
}
