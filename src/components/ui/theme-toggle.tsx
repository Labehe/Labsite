"use client";

import * as React from "react";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle({ className }: { className?: string }) {
  const [theme, setTheme] = React.useState<"dark" | "light">("light");
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    const storedTheme = localStorage.getItem("ecotox-theme") as "dark" | "light" | null;
    const initialTheme = storedTheme || "light";
    setTheme(initialTheme);
    document.documentElement.setAttribute("data-theme", initialTheme);
    document.documentElement.classList.toggle("dark", initialTheme === "dark");
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
    localStorage.setItem("ecotox-theme", nextTheme);
    document.documentElement.setAttribute("data-theme", nextTheme);
    document.documentElement.classList.toggle("dark", nextTheme === "dark");
  };

  if (!mounted) {
    return (
      <div className={`w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 animate-pulse ${className || ""}`} />
    );
  }

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle Day and Dark Mode"
      title={theme === "dark" ? "Switch to Day Mode" : "Switch to Dark Mode"}
      className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 border cursor-pointer select-none active:scale-95 ${
        theme === "dark"
          ? "bg-slate-800/90 border-slate-700 text-amber-400 hover:bg-slate-700 shadow-sm"
          : "bg-slate-100/90 border-slate-200/80 text-slate-700 hover:bg-slate-200/90 shadow-sm"
      } ${className || ""}`}
    >
      {theme === "dark" ? (
        <Sun className="w-4 h-4 text-amber-400 transition-transform duration-300 hover:rotate-45" />
      ) : (
        <Moon className="w-4 h-4 text-slate-700 transition-transform duration-300 hover:-rotate-12" />
      )}
    </button>
  );
}
