"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FlaskConical, Search, Menu, X, ArrowRight, Leaf } from "lucide-react";
import { PUBLIC_NAV_ITEMS } from "@/constants";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { SearchModal } from "./search-modal";

export function Navbar() {
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [searchOpen, setSearchOpen] = React.useState(false);
  const pathname = usePathname();

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  React.useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 ${
          isScrolled
            ? "bg-white/95 dark:bg-[#090D16]/95 border-b border-slate-200/80 dark:border-slate-800/80 shadow-lg backdrop-blur-xl py-3"
            : "bg-transparent border-b border-white/10 py-4 sm:py-5"
        }`}
      >
        <div className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12">
          <div className="flex items-center justify-between gap-4">
            {/* Left: Lab Brand Logo & Academic Identity */}
            <Link href="/" className="flex items-center gap-3.5 group flex-shrink-0">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#14532D] to-[#10B981] flex items-center justify-center shadow-md shadow-emerald-950/20 group-hover:scale-105 transition-transform duration-200">
                <FlaskConical className="w-5 h-5 text-white stroke-[2.2]" />
              </div>
              <div className="flex flex-col">
                <span
                  className={`font-bold text-[14px] sm:text-[15px] leading-tight tracking-tight transition-colors ${
                    isScrolled
                      ? "text-slate-900 dark:text-white"
                      : "text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.85)]"
                  }`}
                >
                  Environmental Health &amp; <br className="hidden sm:inline" />
                  Ecotoxicology Laboratory
                </span>
                <span
                  className={`text-[10.5px] font-semibold mt-0.5 transition-colors ${
                    isScrolled
                      ? "text-emerald-700 dark:text-[#34D399]"
                      : "text-emerald-300 drop-shadow-[0_1px_2px_rgba(0,0,0,0.85)]"
                  }`}
                >
                  Division of Environmental Sciences
                </span>
              </div>
            </Link>

            {/* Center: Enhanced Navigation Links */}
            <nav className="hidden xl:flex items-center gap-2">
              {PUBLIC_NAV_ITEMS.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`px-3 py-1.5 rounded-lg text-[13px] font-medium tracking-tight transition-all duration-200 ${
                      isActive
                        ? isScrolled
                          ? "bg-[#E8F5EE] dark:bg-emerald-950/60 text-[#14532D] dark:text-[#34D399] font-bold shadow-xs"
                          : "bg-white/20 backdrop-blur-md text-[#34D399] border border-white/25 font-bold shadow-sm"
                        : isScrolled
                        ? "text-slate-600 dark:text-slate-300 hover:text-[#14532D] dark:hover:text-white hover:bg-[#F0FDF4] dark:hover:bg-slate-800/60"
                        : "text-white/85 hover:text-white hover:bg-white/15 drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            {/* Right: Actions (Search, Theme Toggle, Single Primary CTA) */}
            <div className="hidden md:flex items-center gap-3">
              <button
                onClick={() => setSearchOpen(true)}
                aria-label="Search laboratory content"
                title="Search website"
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer active:scale-95 border ${
                  isScrolled
                    ? "border-slate-200 dark:border-slate-700 bg-slate-100/90 dark:bg-slate-800/90 text-slate-600 hover:text-[#14532D] dark:text-slate-300 dark:hover:text-[#34D399] hover:bg-emerald-50"
                    : "border-transparent text-white/90 hover:text-white hover:bg-white/10"
                }`}
              >
                <Search className="w-4 h-4" />
              </button>

              <ThemeToggle
                className={
                  isScrolled
                    ? ""
                    : "border-transparent bg-transparent text-white hover:bg-white/10 shadow-none"
                }
              />

              <Link
                href="/contact"
                className={`inline-flex items-center gap-2 px-5 py-2 rounded-full text-xs font-semibold tracking-wide transition-all active:scale-95 border ${
                  isScrolled
                    ? "bg-[#14532D] hover:bg-[#166534] text-white border-transparent shadow-emerald-900/20"
                    : "bg-white/10 hover:bg-white/20 border-white/35 text-white backdrop-blur-md"
                }`}
              >
                <span>Connect With Us</span>
              </Link>
            </div>

            {/* Mobile Hamburger Toggle */}
            <div className="flex md:hidden items-center gap-2">
              <ThemeToggle
                className={
                  isScrolled
                    ? ""
                    : "border-white/25 bg-black/20 backdrop-blur-md text-white hover:bg-white/20 shadow-sm"
                }
              />
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle Navigation Menu"
                className={`p-2.5 rounded-xl border transition-colors ${
                  isScrolled
                    ? "border-slate-200 dark:border-slate-700 text-slate-700 dark:text-white hover:bg-emerald-50"
                    : "border-white/25 bg-black/20 backdrop-blur-md text-white hover:bg-white/20 shadow-sm"
                }`}
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Slide-in Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="fixed inset-0" onClick={() => setMobileMenuOpen(false)} />
          <div className="relative ml-auto w-full max-w-xs sm:max-w-sm h-full bg-white dark:bg-[#090D16] border-l border-slate-200 dark:border-slate-800 p-6 flex flex-col justify-between overflow-y-auto z-10 shadow-2xl">
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#052E16] via-[#14532D] to-[#10B981] p-0.5 shadow-md">
                    <div className="w-full h-full rounded-[10px] bg-[#090D16] flex items-center justify-center">
                      <svg className="w-4 h-4 text-[#34D399]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="3" fill="#10B981" fillOpacity="0.3" stroke="#34D399" strokeWidth="2" />
                        <path d="M12 8c2.5 0 4.5 1.5 4.5 4s-2 4-4.5 4c-1.8 0-3.3-.8-4-2" stroke="#6EE7B7" strokeWidth="1.8" />
                      </svg>
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-extrabold text-sm text-slate-900 dark:text-white leading-tight">Ecotox Lab</span>
                    <span className="text-[10px] font-mono-scientific text-emerald-600 dark:text-[#34D399] uppercase tracking-wider">Research Division</span>
                  </div>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile Search Button */}
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setSearchOpen(true);
                }}
                className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-500"
              >
                <Search className="w-4 h-4 text-[#047857]" />
                <span>Search website...</span>
              </button>

              {/* Mobile Navigation Links */}
              <nav className="flex flex-col space-y-1">
                {PUBLIC_NAV_ITEMS.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-semibold text-slate-900 dark:text-white hover:bg-[#E8F5EE] dark:hover:bg-slate-800/80 hover:text-[#14532D] transition-colors"
                  >
                    <span>{item.label}</span>
                    <ArrowRight className="w-4 h-4 text-slate-400" />
                  </Link>
                ))}
              </nav>
            </div>

            <div className="pt-6 border-t border-slate-200 dark:border-slate-800 space-y-3">
              <Link
                href="/contact"
                className="block w-full py-3 px-4 rounded-full bg-[#14532D] hover:bg-[#166534] text-white text-center text-xs font-bold uppercase tracking-wider shadow"
              >
                Connect With Us
              </Link>
              <p className="text-center text-[11px] text-slate-500 font-mono-scientific">
                Department of Environmental Science &amp; Health
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Site-wide Search Modal */}
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
