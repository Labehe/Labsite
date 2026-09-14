"use client";

import React, { useState, useEffect } from "react";
import { Search, X } from "lucide-react";

interface ProjectSearchProps {
  value: string;
  onChange: (val: string) => void;
  debounceMs?: number;
}

export function ProjectSearch({ value, onChange, debounceMs = 300 }: ProjectSearchProps) {
  const [inputValue, setInputValue] = useState(value);

  // Sync internal state with external value prop
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  // Debounced notification to parent
  useEffect(() => {
    const handler = setTimeout(() => {
      if (inputValue !== value) {
        onChange(inputValue);
      }
    }, debounceMs);

    return () => clearTimeout(handler);
  }, [inputValue, onChange, debounceMs, value]);

  const handleClear = () => {
    setInputValue("");
    onChange("");
  };

  return (
    <div className="relative w-full">
      <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] pointer-events-none" />
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Search projects by title, contaminants, methods, area..."
        className="w-full pl-10 pr-9 py-2.5 text-xs sm:text-sm rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-main)] placeholder-[var(--text-muted)] outline-none focus:border-[#2F7D4A] transition-all shadow-sm"
      />
      {inputValue && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors"
          title="Clear search"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}
