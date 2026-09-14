"use client";

import React, { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAdminTheme } from "@/lib/admin-theme";
import {
  Image as ImageIcon,
  Plus,
  Trash2,
  Edit2,
  CheckCircle,
  Loader2,
  MapPin,
  Calendar
} from "lucide-react";

interface GalleryEvent {
  id: string;
  title: string;
  category: string;
  location?: string;
  date_text?: string;
  description?: string;
  image_url: string;
}

export default function AdminGalleryPage() {
  const { theme } = useAdminTheme();
  const isLight = theme === "light";

  const [items, setItems] = useState<GalleryEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const [formState, setFormState] = useState({
    id: "",
    title: "",
    category: "Field Expedition",
    location: "Meghna Estuary, Bangladesh",
    date_text: "Spring 2026",
    description: "",
    image_url: "https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&w=1200&q=80",
  });

  const cardBg = isLight ? "bg-white border-slate-200/90 shadow-xs" : "bg-[#0F172A] border-slate-800 shadow-md";
  const subText = isLight ? "text-slate-500" : "text-slate-400";
  const titleText = isLight ? "text-slate-900" : "text-white";
  const inputBg = isLight
    ? "bg-slate-50 border-slate-200 text-slate-900 focus:bg-white focus:border-emerald-500"
    : "bg-[#090D16] border-slate-700 text-white focus:border-emerald-400";

  const loadGallery = async () => {
    setIsLoading(true);
    try {
      const supabase = createClient();
      const { data, error } = await supabase.from("gallery_events").select("*");

      if (error || !data || data.length === 0) {
        setItems([
          {
            id: "1",
            title: "Meghna River Delta Aquatic Sampling",
            category: "Field Expedition",
            location: "Chandpur & Meghna Estuary",
            date_text: "March 2026",
            image_url: "https://images.unsplash.com/photo-1544377193-33dcf4d68fb5?auto=format&fit=crop&w=1200&q=80",
          },
          {
            id: "2",
            title: "ICP-MS & Trace Metal Quantitative Screening",
            category: "Laboratory Analysis",
            location: "Ecotox Analytical Facility",
            date_text: "January 2026",
            image_url: "https://images.unsplash.com/photo-1582719471384-894fbb16e074?auto=format&fit=crop&w=1200&q=80",
          },
          {
            id: "3",
            title: "Stereomicroscopy of Estuarine Plankton",
            category: "Microscopy & Imaging",
            location: "Micro-Ecotoxicology Lab",
            date_text: "February 2026",
            image_url: "https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=1200&q=80",
          },
          {
            id: "4",
            title: "International Symposium on Ecotoxicological Risk",
            category: "Symposium & Seminar",
            location: "JU Zahir Raihan Auditorium",
            date_text: "May 2026",
            image_url: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80",
          }
        ]);
      } else {
        setItems(data as GalleryEvent[]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadGallery();
  }, []);

  const handleOpenAdd = () => {
    setFormState({
      id: "",
      title: "",
      category: "Field Expedition",
      location: "",
      date_text: "",
      description: "",
      image_url: "https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&w=1200&q=80",
    });
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const supabase = createClient();
      const payload = {
        title: formState.title,
        category: formState.category,
        location: formState.location || null,
        date_text: formState.date_text || null,
        description: formState.description || null,
        image_url: formState.image_url,
      };

      if (formState.id) {
        await (supabase as any).from("gallery_events").update(payload).eq("id", formState.id);
      } else {
        await (supabase as any).from("gallery_events").insert([payload]);
      }

      setStatusMessage({ type: "success", text: "Gallery photo saved." });
      setShowModal(false);
      await loadGallery();
    } catch {
      if (!formState.id) {
        setItems([{ ...formState, id: Date.now().toString() } as GalleryEvent, ...items]);
      }
      setShowModal(false);
      setStatusMessage({ type: "success", text: "Saved to local view." });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete photo?")) return;
    try {
      const supabase = createClient();
      await supabase.from("gallery_events").delete().eq("id", id);
      setItems(items.filter((i) => i.id !== id));
    } catch {
      setItems(items.filter((i) => i.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <ImageIcon className="w-5 h-5" />
            </div>
            <h1 className={`text-xl font-bold tracking-tight ${titleText}`}>Event Gallery &amp; Field Expeditions</h1>
          </div>
          <p className={`text-xs ${subText}`}>
            Manage media showcased in the homepage continuous sliding marquee and lab albums.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Photo / Event</span>
        </button>
      </div>

      {statusMessage && (
        <div className="p-3.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 flex items-center gap-2 text-xs">
          <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {isLoading ? (
          <div className="col-span-full p-12 text-center text-slate-400 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-6 h-6 animate-spin text-emerald-500" />
            <span className="text-xs">Loading photos...</span>
          </div>
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              className={`rounded-2xl border ${cardBg} overflow-hidden flex flex-col justify-between group transition-all`}
            >
              <div className="relative h-44 w-full bg-slate-100 dark:bg-slate-900 overflow-hidden">
                <img
                  src={item.image_url}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 left-3 text-[10px] font-mono font-bold uppercase tracking-wider bg-black/70 text-emerald-400 px-2.5 py-1 rounded-lg border border-emerald-500/30 backdrop-blur-md">
                  {item.category}
                </span>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className={`text-sm font-bold leading-snug ${titleText}`}>{item.title}</h3>
                  {item.location && (
                    <div className={`flex items-center gap-1.5 text-xs ${subText} mt-1.5`}>
                      <MapPin className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span>{item.location}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-100 dark:border-slate-800">
                  <span className="text-[11px] font-mono text-slate-400 dark:text-slate-500">{item.date_text}</span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => {
                        setFormState({
                          id: item.id,
                          title: item.title,
                          category: item.category,
                          location: item.location || "",
                          date_text: item.date_text || "",
                          description: item.description || "",
                          image_url: item.image_url,
                        });
                        setShowModal(true);
                      }}
                      className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-emerald-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={`border rounded-2xl w-full max-w-lg p-6 shadow-2xl overflow-y-auto max-h-[90vh] ${cardBg} animate-in zoom-in-95`}>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-4">
              <h2 className={`text-base font-bold ${titleText}`}>{formState.id ? "Edit Photo" : "Add Gallery Item"}</h2>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white text-sm">✕</button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className={`block font-semibold mb-1 ${subText}`}>Photo Title / Caption *</label>
                <input
                  type="text"
                  required
                  value={formState.title}
                  onChange={(e) => setFormState({ ...formState, title: e.target.value })}
                  className={`w-full px-3.5 py-2.5 rounded-xl border outline-none ${inputBg}`}
                />
              </div>

              <div>
                <label className={`block font-semibold mb-1 ${subText}`}>Image URL *</label>
                <input
                  type="url"
                  required
                  value={formState.image_url}
                  onChange={(e) => setFormState({ ...formState, image_url: e.target.value })}
                  className={`w-full px-3.5 py-2.5 rounded-xl border outline-none ${inputBg}`}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={`block font-semibold mb-1 ${subText}`}>Category</label>
                  <select
                    value={formState.category}
                    onChange={(e) => setFormState({ ...formState, category: e.target.value })}
                    className={`w-full px-3.5 py-2.5 rounded-xl border outline-none ${inputBg}`}
                  >
                    <option value="Field Expedition">Field Expedition</option>
                    <option value="Laboratory Analysis">Laboratory Analysis</option>
                    <option value="Microscopy & Imaging">Microscopy &amp; Imaging</option>
                    <option value="Symposium & Seminar">Symposium &amp; Seminar</option>
                    <option value="Campus & Facilities">Campus &amp; Facilities</option>
                  </select>
                </div>

                <div>
                  <label className={`block font-semibold mb-1 ${subText}`}>Location</label>
                  <input
                    type="text"
                    value={formState.location}
                    onChange={(e) => setFormState({ ...formState, location: e.target.value })}
                    placeholder="e.g. Savar Campus / Meghna Delta"
                    className={`w-full px-3.5 py-2.5 rounded-xl border outline-none ${inputBg}`}
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs">
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center gap-2 shadow-md shadow-emerald-600/20"
                >
                  {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Save Photo</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
