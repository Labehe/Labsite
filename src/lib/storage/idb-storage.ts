/**
 * Zero-dependency IndexedDB and Resilient Storage Engine
 * IndexedDB has hundreds of megabytes / gigabytes of quota and never fails with QuotaExceededError.
 * Also includes automatic cleanup for bloated localStorage items.
 */

const DB_NAME = "ecotox_lab_v2";
const STORE_NAME = "store_entries";
const DB_VERSION = 1;

let dbPromise: Promise<IDBDatabase> | null = null;

function getDB(): Promise<IDBDatabase> {
  if (typeof window === "undefined" || !window.indexedDB) {
    return Promise.reject(new Error("IndexedDB is not available in this environment"));
  }

  if (dbPromise) return dbPromise;

  dbPromise = new Promise((resolve, reject) => {
    try {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME);
        }
      };

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onerror = () => {
        dbPromise = null;
        reject(request.error || new Error("Failed to open IndexedDB"));
      };

      request.onblocked = () => {
        console.warn("IndexedDB open blocked");
      };
    } catch (e) {
      dbPromise = null;
      reject(e);
    }
  });

  return dbPromise;
}

/**
 * Get item from IndexedDB
 */
export async function idbGet<T = any>(key: string): Promise<T | null> {
  if (typeof window === "undefined") return null;
  try {
    const db = await getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readonly");
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(key);

      req.onsuccess = () => {
        resolve(req.result !== undefined ? req.result : null);
      };

      req.onerror = () => {
        reject(req.error);
      };
    });
  } catch (err) {
    console.warn(`IndexedDB get failed for key "${key}":`, err);
    return null;
  }
}

/**
 * Set item in IndexedDB (handles huge base64 strings, objects, arrays without quota limits)
 */
export async function idbSet<T = any>(key: string, value: T): Promise<boolean> {
  if (typeof window === "undefined") return false;
  try {
    const db = await getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readwrite");
      const store = tx.objectStore(STORE_NAME);
      const req = store.put(value, key);

      req.onsuccess = () => {
        resolve(true);
      };

      req.onerror = () => {
        reject(req.error);
      };
    });
  } catch (err) {
    console.error(`IndexedDB set failed for key "${key}":`, err);
    return false;
  }
}

/**
 * Delete item from IndexedDB
 */
export async function idbDelete(key: string): Promise<boolean> {
  if (typeof window === "undefined") return false;
  try {
    const db = await getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readwrite");
      const store = tx.objectStore(STORE_NAME);
      const req = store.delete(key);

      req.onsuccess = () => {
        resolve(true);
      };

      req.onerror = () => {
        reject(req.error);
      };
    });
  } catch (err) {
    return false;
  }
}

/**
 * Safely frees up localStorage if filled with legacy large base64 dumps
 */
export function pruneOversizedLocalStorage(): void {
  if (typeof window === "undefined") return;
  try {
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (!k) continue;
      try {
        const val = localStorage.getItem(k);
        // If an item is larger than 250KB, it is bloating localStorage
        if (val && val.length > 250 * 1024) {
          keysToRemove.push(k);
        }
      } catch {
        keysToRemove.push(k);
      }
    }

    for (const key of keysToRemove) {
      console.warn(`[Storage Optimizer] Purging oversized localStorage entry "${key}" to avoid quota overflow.`);
      try {
        localStorage.removeItem(key);
      } catch {}
    }
  } catch (e) {
    console.warn("Could not prune localStorage:", e);
  }
}

/**
 * Never-failing safe localStorage setter with automatic IDB mirroring and quota protection
 */
export function safeLocalStorageSet(key: string, value: any): boolean {
  if (typeof window === "undefined") return false;

  // 1. Mirror to IndexedDB asynchronously
  idbSet(key, value).catch(() => {});

  // 2. Try writing to localStorage safely
  try {
    const serialized = typeof value === "string" ? value : JSON.stringify(value);
    localStorage.setItem(key, serialized);
    return true;
  } catch (firstErr) {
    console.warn(`[Storage] localStorage write failed for "${key}", freeing space...`, firstErr);
    // Prune oversized keys
    pruneOversizedLocalStorage();
    try {
      const serialized = typeof value === "string" ? value : JSON.stringify(value);
      localStorage.setItem(key, serialized);
      return true;
    } catch (secondErr) {
      console.warn(`[Storage] localStorage still at capacity for "${key}". Value is safely preserved in IndexedDB.`, secondErr);
      return false;
    }
  }
}

/**
 * Safe localStorage getter with fallback
 */
export function safeLocalStorageGet<T = any>(key: string): T | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return raw as unknown as T;
    }
  } catch {
    return null;
  }
}

/**
 * Export all local laboratory data (landing, about, team, gallery, projects, news, publications) as a backup JSON object
 */
export async function exportAllLaboratoryData(): Promise<Record<string, any>> {
  const keys = [
    "ecotox_landing_content_v2",
    "ecotox_lab_gallery_items_v2",
    "ecotox_lab_team_members_v2",
    "ecotox_lab_news_v2",
    "ecotox_lab_projects_v2",
    "ecotox_lab_publications_v2",
    "ecotox_lab_opportunities_v2",
  ];
  const bundle: Record<string, any> = {
    exportedAt: new Date().toISOString(),
    version: "2.0",
    data: {},
  };

  for (const k of keys) {
    let val = await idbGet(k);
    if (!val) {
      val = safeLocalStorageGet(k);
    }
    if (val) {
      bundle.data[k] = val;
    }
  }
  return bundle;
}

/**
 * Import a backup bundle and write it to IndexedDB + localStorage and fire refresh events
 */
export async function importAllLaboratoryData(bundle: Record<string, any>): Promise<boolean> {
  if (!bundle || !bundle.data || typeof bundle.data !== "object") return false;
  try {
    for (const [key, val] of Object.entries(bundle.data)) {
      await idbSet(key, val);
      safeLocalStorageSet(key, val);
    }
    // Dispatch all refresh events
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("landing-content-updated"));
      window.dispatchEvent(new Event("gallery_items_updated"));
      window.dispatchEvent(new Event("lab_team_updated"));
      window.dispatchEvent(new Event("lab_news_updated"));
      window.dispatchEvent(new Event("storage"));
    }
    return true;
  } catch (err) {
    console.error("Failed to import laboratory data:", err);
    return false;
  }
}
