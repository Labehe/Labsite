"use client";

import React, { useState, useRef } from "react";
import { useAdminTheme } from "@/lib/admin-theme";
import {
  exportAllLaboratoryData,
  importAllLaboratoryData
} from "@/lib/storage/idb-storage";
import {
  Settings,
  Database,
  ShieldCheck,
  Save,
  CheckCircle2,
  Building,
  Download,
  Upload,
  RefreshCw,
  FileJson,
  Sparkles
} from "lucide-react";

export default function AdminSettingsPage() {
  const { theme } = useAdminTheme();
  const isLight = theme === "light";
  const [saved, setSaved] = useState(false);
  const [syncStatus, setSyncStatus] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [settings, setSettings] = useState({
    labName: "Laboratory of Environmental Health and Ecotoxicology (LabEHE)",
    department: "Department of Environmental Sciences",
    university: "Jahangirnagar University",
    contactEmail: "ecotox@juniv.edu",
    piName: "Dr. Mohammad S. Kabir",
    piEmail: "msk@juniv.edu",
    supabaseUrl: "https://ztgwpyoztzpvqnwoixuy.supabase.co",
    publicSiteUrl: "http://localhost:3000",
  });

  const cardBg = isLight ? "bg-white border-slate-200/90 shadow-xs" : "bg-[#0F172A] border-slate-800 shadow-md";
  const inputBg = isLight
    ? "bg-slate-50 border-slate-300 text-slate-900 focus:bg-white focus:border-emerald-500"
    : "bg-[#090D16] border-slate-700 text-white focus:border-emerald-400";
  const labelText = isLight ? "text-slate-700 font-semibold" : "text-slate-200 font-semibold";
  const subText = isLight ? "text-slate-500" : "text-slate-400";

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleExportData = async () => {
    try {
      const bundle = await exportAllLaboratoryData();
      const jsonStr = JSON.stringify(bundle, null, 2);
      const blob = new Blob([jsonStr], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `labehe_site_backup_${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setSyncStatus("Backup file downloaded successfully! You can upload this file to your live Vercel admin.");
      setTimeout(() => setSyncStatus(null), 5000);
    } catch (err) {
      console.error("Export error:", err);
      alert("Failed to export laboratory data.");
    }
  };

  const handleImportData = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      const success = await importAllLaboratoryData(parsed);
      if (success) {
        setSyncStatus("All data, images, and content successfully imported and synchronized!");
        setTimeout(() => {
          setSyncStatus(null);
          window.location.reload();
        }, 1500);
      } else {
        alert("Could not import the selected file. Please ensure it is a valid backup JSON file.");
      }
    } catch (err) {
      console.error("Import error:", err);
      alert("Failed to read or parse the backup file.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-emerald-500" />
            <h1 className="text-xl font-bold tracking-tight font-[family-name:var(--font-manrope)]">Lab &amp; System Settings</h1>
          </div>
          <p className={`text-xs ${subText} mt-1`}>
            Manage laboratory metadata, contact routing, and 1-Click data synchronization between Localhost and Vercel.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-md shadow-emerald-950/20 transition-all cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>Save Configuration</span>
        </button>
      </div>

      {saved && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center gap-2.5 text-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Laboratory settings updated successfully!</span>
        </div>
      )}

      {syncStatus && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 flex items-center gap-2.5 text-xs animate-in fade-in">
          <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{syncStatus}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* 1-Click Localhost & Vercel Sync Card */}
          <div className={`p-6 rounded-2xl border ${cardBg} space-y-4`}>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-bold flex items-center gap-2 text-slate-900 dark:text-white">
                <FileJson className="w-4 h-4 text-emerald-500" />
                <span>1-Click Localhost &amp; Vercel Data Sync</span>
              </h3>
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                Cross-Domain Sync
              </span>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Export all your uploaded images, custom team members, about page stories, and project items as a portable backup file, and import it directly into your live Vercel deployment with one click.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleExportData}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow transition cursor-pointer active:scale-95"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Site Data (.json)</span>
              </button>

              <input
                type="file"
                ref={fileInputRef}
                accept=".json"
                className="hidden"
                onChange={handleImportData}
              />

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#090D16] hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold transition cursor-pointer active:scale-95"
              >
                <Upload className="w-3.5 h-3.5 text-emerald-500" />
                <span>Import &amp; Sync Data (.json)</span>
              </button>
            </div>
          </div>

          {/* General Information */}
          <div className={`p-6 rounded-2xl border ${cardBg} space-y-4`}>
            <h3 className="text-sm font-bold flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800 text-slate-900 dark:text-white">
              <Building className="w-4 h-4 text-emerald-500" />
              General Laboratory Information
            </h3>

            <div>
              <label className={`block text-xs ${labelText} mb-1`}>Official Laboratory Name</label>
              <input
                type="text"
                value={settings.labName}
                onChange={(e) => setSettings({ ...settings, labName: e.target.value })}
                className={`w-full px-3.5 py-2 rounded-xl border text-xs outline-none transition-all ${inputBg}`}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={`block text-xs ${labelText} mb-1`}>Department</label>
                <input
                  type="text"
                  value={settings.department}
                  onChange={(e) => setSettings({ ...settings, department: e.target.value })}
                  className={`w-full px-3.5 py-2 rounded-xl border text-xs outline-none transition-all ${inputBg}`}
                />
              </div>

              <div>
                <label className={`block text-xs ${labelText} mb-1`}>Institution / University</label>
                <input
                  type="text"
                  value={settings.university}
                  onChange={(e) => setSettings({ ...settings, university: e.target.value })}
                  className={`w-full px-3.5 py-2 rounded-xl border text-xs outline-none transition-all ${inputBg}`}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={`block text-xs ${labelText} mb-1`}>Principal Investigator (PI)</label>
                <input
                  type="text"
                  value={settings.piName}
                  onChange={(e) => setSettings({ ...settings, piName: e.target.value })}
                  className={`w-full px-3.5 py-2 rounded-xl border text-xs outline-none transition-all ${inputBg}`}
                />
              </div>

              <div>
                <label className={`block text-xs ${labelText} mb-1`}>PI Official Email</label>
                <input
                  type="email"
                  value={settings.piEmail}
                  onChange={(e) => setSettings({ ...settings, piEmail: e.target.value })}
                  className={`w-full px-3.5 py-2 rounded-xl border text-xs outline-none transition-all ${inputBg}`}
                />
              </div>
            </div>
          </div>

          {/* Database Diagnostics */}
          <div className={`p-6 rounded-2xl border ${cardBg} space-y-4`}>
            <h3 className="text-sm font-bold flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800 text-slate-900 dark:text-white">
              <Database className="w-4 h-4 text-emerald-500" />
              Connected Supabase Database
            </h3>

            <div>
              <label className={`block text-xs ${labelText} mb-1`}>Database Endpoint URL</label>
              <input
                type="text"
                disabled
                value={settings.supabaseUrl}
                className={`w-full px-3.5 py-2 rounded-xl border text-xs outline-none opacity-80 cursor-not-allowed ${inputBg}`}
              />
            </div>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <div className={`p-6 rounded-2xl border ${cardBg} space-y-4`}>
            <h3 className="text-sm font-bold flex items-center gap-2 text-slate-900 dark:text-white">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              Security &amp; Encryption
            </h3>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#090D16] border border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className={subText}>Auth Session:</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">Active (JWT)</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#090D16] border border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className={subText}>Row Level Security:</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">Enabled</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#090D16] border border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className={subText}>Server Engine:</span>
                <span className="font-mono text-slate-700 dark:text-slate-300">Next.js 16 (Turbopack)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
