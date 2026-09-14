import { PublicationFormData } from "./types";

/**
 * Extract distinct, cleaned DOIs from arbitrary user text input (multiline, comma-separated, URLs, mixed)
 */
export function extractDoisFromText(rawText: string): string[] {
  if (!rawText || !rawText.trim()) return [];

  // Match DOI regex pattern: 10.\d{4,9}/[-._;()/:A-Za-z0-9]+
  const doiRegex = /\b10\.\d{4,9}\/[-._;()/:A-Za-z0-9]+/gi;
  const matches = rawText.match(doiRegex) || [];

  // If regex found matches, clean trailing punctuation often captured (like . or , or ) at end of sentence)
  const cleaned = matches.map((d) => {
    let s = d.trim();
    s = s.replace(/[.,;:)\]'">]+$/, "");
    return s;
  });

  // Also support line-by-line fallback if user pasted bare DOIs
  const lineSplits = rawText
    .split(/[\r\n,;\s]+/)
    .map((s) => s.trim())
    .filter((s) => s.startsWith("10.") || s.includes("doi.org/10."));

  const lineCleaned = lineSplits.map((s) => {
    let clean = s.replace(/^https?:\/\/(?:dx\.)?doi\.org\//i, "");
    clean = clean.replace(/^doi:\s*/i, "");
    clean = clean.replace(/[.,;:)\]'">]+$/, "");
    return clean;
  });

  const combined = Array.from(new Set([...cleaned, ...lineCleaned])).filter(
    (doi) => doi.startsWith("10.") && doi.length > 7
  );

  return combined;
}

/**
 * Resolve a single DOI to PublicationFormData via our API route
 */
export async function resolveDoi(doi: string): Promise<PublicationFormData> {
  const res = await fetch("/api/publications/resolve-doi", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ doi }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `HTTP ${res.status}: Failed to resolve DOI`);
  }

  const json = await res.json();
  const firstResult = json.results?.[0];
  if (!firstResult || firstResult.error || !firstResult.data) {
    throw new Error(firstResult?.error || "Unable to extract publication metadata for this DOI");
  }

  return firstResult.data;
}

/**
 * Batch resolve a list of DOIs in chunks of 10 with progress callback
 */
export async function batchResolveDois(
  dois: string[],
  onProgress?: (completed: number, total: number) => void
): Promise<{
  successful: { originalDoi: string; data: PublicationFormData }[];
  failed: { originalDoi: string; error: string }[];
}> {
  const total = dois.length;
  let completed = 0;
  const successful: { originalDoi: string; data: PublicationFormData }[] = [];
  const failed: { originalDoi: string; error: string }[] = [];

  // Process in batches of 10 to avoid request timeouts and rate limits
  const CHUNK_SIZE = 10;
  for (let i = 0; i < dois.length; i += CHUNK_SIZE) {
    const chunk = dois.slice(i, i + CHUNK_SIZE);
    try {
      const res = await fetch("/api/publications/resolve-doi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dois: chunk }),
      });

      if (res.ok) {
        const json = await res.json();
        for (const item of json.results || []) {
          if (item.data) {
            successful.push({ originalDoi: item.originalDoi, data: item.data });
          } else {
            failed.push({ originalDoi: item.originalDoi, error: item.error || "Unknown error" });
          }
        }
      } else {
        const err = await res.json().catch(() => ({}));
        for (const d of chunk) {
          failed.push({ originalDoi: d, error: err.error || `Server responded with ${res.status}` });
        }
      }
    } catch (e: any) {
      for (const d of chunk) {
        failed.push({ originalDoi: d, error: e.message || "Network error" });
      }
    }

    completed += chunk.length;
    if (onProgress) {
      onProgress(Math.min(completed, total), total);
    }
  }

  return { successful, failed };
}
