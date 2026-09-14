"use client";

import React, { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAdminTheme } from "@/lib/admin-theme";
import {
  Image as ImageIcon,
  Plus,
  Trash2,
  Edit2,
  Search,
  CheckCircle,
  Loader2,
  MapPin,
  Sparkles
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

export default function AdminMediaPage() {
  const { theme } = useAdminTheme();
  const isLight = theme === "light";

  const [items, setItems] = useState<GalleryEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formState, setFormState] = useState({
    id: "",
    title: "",
    category: "Field Expedition",
    location: "Meghna Estuary, Bangladesh",
    date_text: "Spring 2026",
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
      const { data, error } = await (supabase as any).from("gallery_events").select("*");

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

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formState.id) {
      setItems(items.map((i) => (i.id === formState.id ? { ...formState } : i)));
    } else {
      setItems([{ ...formState, id: Date.now().toString() }, ...items]);
    }
    setShowModal(false);
  };

  const handleDelete = (id: string) => {
    if (confirm("Delete this media item?")) {
      setItems(items.filter((i) => i.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <ImageIcon className="w-5 h-5" />
            </div>
            <h1 className={`text-xl font-bold tracking-tight ${titleText}`}>Media &amp; Event Gallery</h1>
          </div>
          <p className={`text-xs ${subText} mt-1`}>
            Manage field expedition photography, instrumentation showcases, and international symposium gallery highlights.
          </p>
        </div>

        <button
          onClick={() => {
            setFormState({
              id: "",
              title: "",
              category: "Field Expedition",
              location: "Savar Campus",
              date_text: "2026",
              image_url: "https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&w=1200&q=80",
            });
            setShowModal(true);
          }}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Upload Media Asset</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {items.map((item) => (
          <div key={item.id} className={`rounded-2xl border ${cardBg} overflow-hidden flex flex-col justify-between group`}>
            <div className="relative h-44 w-full bg-slate-100 dark:bg-slate-900 overflow-hidden">
              <img
                src={item.image_url}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <span className="absolute top-2.5 left-2.5 text-[10px] font-bold uppercase tracking-wider bg-white/90 dark:bg-slate-900/90 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-md shadow-sm border border-emerald-500/20">
                {item.category}
              </span>
            </div>

            <div className="p-4 flex-1 flex flex-col justify-between">
              <div>
                <h3 className={`text-xs font-bold leading-snug ${titleText}`}>{item.title}</h3>
                {item.location && (
                  <div className={`flex items-center gap-1.5 text-[11px] ${subText} mt-1`}>
                    <MapPin className="w-3 h-3 text-emerald-500 shrink-0" />
                    <span>{item.location}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-100 dark:border-slate-800">
                <span className={`text-[10px] font-mono ${subText}`}>{item.date_text}</span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => {
                      setFormState({
                        id: item.id,
                        title: item.title,
                        category: item.category,
                        location: item.location || "",
                        date_text: item.date_text || "",
                        image_url: item.image_url,
                      });
                      setShowModal(true);
                    }}
                    className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-emerald-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    <Edit2 className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={`w-full max-w-lg p-6 rounded-2xl border ${cardBg} shadow-2xl animate-in zoom-in-95`}>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-4">
              <h3 className={`text-base font-bold ${titleText}`}>
                {formState.id ? "Edit Media" : "Add Media Asset"}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white">✕</button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className={`block font-semibold mb-1 ${subText}`}>Title / Caption *</label>
                <input
                  type="text"
                  required
                  value={formState.title}
                  onChange={(e) => setFormState({ ...formState, title: e.target.value })}
                  className={`w-full px-3.5 py-2 rounded-xl border outline-none ${inputBg}`}
                />
              </div>

              <div>
                <label className={`block font-semibold mb-1 ${subText}`}>Image URL *</label>
                <input
                  type="url"
                  required
                  value={formState.image_url}
                  onChange={(e) => setFormState({ ...formState, image_url: e.target.value })}
                  className={`w-full px-3.5 py-2 rounded-xl border outline-none ${inputBg}`}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={`block font-semibold mb-1 ${subText}`}>Category</label>
                  <select
                    value={formState.category}
                    onChange={(e) => setFormState({ ...formState, category: e.target.value })}
                    className={`w-full px-3.5 py-2 rounded-xl border outline-none ${inputBg}`}
                  >
                    <option value="Field Expedition">Field Expedition</option>
                    <option value="Laboratory Analysis">Laboratory Analysis</option>
                    <option value="Microscopy & Imaging">Microscopy &amp; Imaging</option>
                    <option value="Symposium & Seminar">Symposium &amp; Seminar</option>
                  </select>
                </div>

                <div>
                  <label className={`block font-semibold mb-1 ${subText}`}>Location</label>
                  <input
                    type="text"
                    value={formState.location}
                    onChange={(e) => setFormState({ ...formState, location: e.target.value })}
                    className={`w-full px-3.5 py-2 rounded-xl border outline-none ${inputBg}`}
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold shadow-md shadow-emerald-600/20"
                >
                  Save Photo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
