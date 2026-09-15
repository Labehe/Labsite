"use client";

import React, { useState } from "react";
import { useAdminTheme } from "@/lib/admin-theme";
import {
  useGalleryItems,
  saveGalleryItem,
  deleteGalleryItem,
  GalleryItem,
  getCategoryBadgeColor
} from "@/lib/gallery-store";
import { safeCompressImage } from "@/lib/image-compression";
import {
  Image as ImageIcon,
  Plus,
  Trash2,
  Edit2,
  CheckCircle,
  Loader2,
  MapPin,
  Calendar,
  Upload
} from "lucide-react";

export default function AdminGalleryPage() {
  const { theme } = useAdminTheme();
  const isLight = theme === "light";

  const { items, loading: isLoading } = useGalleryItems();
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const [formState, setFormState] = useState<GalleryItem>({
    id: "",
    title: "",
    category: "Field Expedition",
    location: "Meghna Estuary, Bangladesh",
    date_text: "Spring 2026",
    description: "",
    image_url: "/images/gallery/field-sampling.jpg",
  });

  const cardBg = isLight ? "bg-white border-slate-200/90 shadow-xs" : "bg-[#0F172A] border-slate-800 shadow-md";
  const subText = isLight ? "text-slate-500" : "text-slate-400";
  const titleText = isLight ? "text-slate-900" : "text-white";
  const inputBg = isLight
    ? "bg-slate-50 border-slate-200 text-slate-900 focus:bg-white focus:border-emerald-500"
    : "bg-[#090D16] border-slate-700 text-white focus:border-emerald-400";

  const handleOpenAdd = () => {
    setFormState({
      id: "",
      title: "",
      category: "Field Expedition",
      location: "",
      date_text: "2026",
      description: "",
      image_url: "/images/gallery/field-sampling.jpg",
    });
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.title || !formState.image_url) return;
    setSaving(true);

    try {
      await saveGalleryItem({
        id: formState.id || undefined,
        title: formState.title,
        category: formState.category,
        location: formState.location,
        date_text: formState.date_text,
        description: formState.description,
        image_url: formState.image_url,
      });

      setStatusMessage({ type: "success", text: "Gallery photo saved & synced to homepage!" });
      setShowModal(false);
      setTimeout(() => setStatusMessage(null), 3000);
    } catch {
      setStatusMessage({ type: "error", text: "Failed to save photo." });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete photo from gallery?")) return;
    try {
      await deleteGalleryItem(id);
      setStatusMessage({ type: "success", text: "Photo removed from gallery." });
      setTimeout(() => setStatusMessage(null), 3000);
    } catch {
      // Local delete
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
                <label className={`block font-semibold mb-1 ${subText}`}>Image File / URL *</label>
                <div className="flex items-center gap-2 mb-2">
                  <label className="px-3 py-1.5 rounded-xl border border-dashed border-emerald-500/40 bg-emerald-500/5 hover:bg-emerald-500/10 text-emerald-400 font-semibold cursor-pointer text-xs flex items-center gap-1.5">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Image from Device</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          try {
                            const compressed = await safeCompressImage(file, {
                              maxWidth: 1200,
                              maxHeight: 1200,
                              quality: 0.84,
                            });
                            setFormState((prev) => ({ ...prev, image_url: compressed }));
                          } catch (err) {
                            console.error("Image upload failed:", err);
                          }
                        }
                      }}
                    />
                  </label>
                </div>
                <input
                  type="text"
                  required
                  placeholder="https://... or uploaded image"
                  value={formState.image_url}
                  onChange={(e) => setFormState({ ...formState, image_url: e.target.value })}
                  className={`w-full px-3.5 py-2.5 rounded-xl border outline-none font-mono text-xs ${inputBg}`}
                />
                {formState.image_url && (
                  <div className="mt-2 relative h-32 w-full rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800">
                    <img
                      src={formState.image_url}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
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
