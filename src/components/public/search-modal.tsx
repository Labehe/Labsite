"use client";

import * as React from "react";
import { Search, X, ArrowRight, BookOpen, FolderGit2, Users, FileText } from "lucide-react";
import Link from "next/link";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = React.useState("");
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") onClose();
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const quickLinks = [
    { label: "Microplastics Research", href: "/research", icon: BookOpen },
    { label: "Ongoing Field Projects", href: "/projects", icon: FolderGit2 },
    { label: "Research Team & Faculty", href: "/team", icon: Users },
    { label: "Recent Publications", href: "/publications", icon: FileText },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="fixed inset-0" onClick={onClose} />
      <div className="relative w-full max-w-2xl rounded-2xl theme-card border shadow-2xl p-6 overflow-hidden z-10">
        <div className="flex items-center gap-3 border-b border-current/10 pb-4">
          <Search className="w-5 h-5 text-[#047857]" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search research areas, publications, projects, people..."
            className="w-full bg-transparent text-base sm:text-lg focus:outline-none theme-text-main placeholder:text-[#52635A]"
          />
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-black/5 text-[#52635A] hover:theme-text-main transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="py-6 space-y-4">
          <p className="text-xs font-mono-scientific uppercase tracking-widest text-[#52635A]">
            Quick Explorations
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {quickLinks.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={onClose}
                className="flex items-center justify-between p-3 rounded-xl theme-card-inner border hover:border-[#047857] transition-all group"
              >
                <div className="flex items-center gap-3">
                  <item.icon className="w-4 h-4 text-[#047857]" />
                  <span className="text-sm font-medium theme-text-main">{item.label}</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-[#52635A] group-hover:text-[#047857] group-hover:translate-x-0.5 transition-all" />
              </Link>
            ))}
          </div>
        </div>

        <div className="pt-3 border-t border-current/10 flex items-center justify-between text-xs text-[#52635A] font-mono-scientific">
          <span>Press ESC to close</span>
          <span>Ecotoxicology Research Database</span>
        </div>
      </div>
    </div>
  );
}
