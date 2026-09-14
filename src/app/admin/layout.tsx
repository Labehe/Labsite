"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { AdminThemeProvider, useAdminTheme } from "@/lib/admin-theme";
import {
  LayoutDashboard,
  FlaskConical,
  FolderGit2,
  BookOpen,
  Newspaper,
  Users,
  Briefcase,
  Inbox,
  Image as ImageIcon,
  Settings,
  LogOut,
  ExternalLink,
  Search,
  Sun,
  Moon,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Bell,
  Layers,
  Clock,
  Sparkles,
  ChevronDown
} from "lucide-react";

interface AdminLayoutProps {
  children: React.ReactNode;
}

function AdminLayoutContent({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, toggleTheme } = useAdminTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userEmail, setUserEmail] = useState<string>("admin@juniv.edu");
  const [userName, setUserName] = useState<string>("Md. Shahed");
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    async function checkAuth() {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (user?.email) {
          setUserEmail(user.email);
          if (user.user_metadata?.full_name) {
            setUserName(user.user_metadata.full_name);
          }
        }
      } catch (e) {
        console.error("Auth check error:", e);
      }
    }
    checkAuth();
  }, []);

  const handleSignOut = async () => {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      router.push("/auth/login");
      router.refresh();
    } catch (e) {
      console.error("Sign out error:", e);
    }
  };

  interface NavItem {
    name: string;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: string;
  }

  interface NavSection {
    title: string | null;
    items: NavItem[];
  }

  const navSections: NavSection[] = [
    {
      title: null,
      items: [
        { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
      ]
    },
    {
      title: "CONTENT",
      items: [
        { name: "About Page", href: "/admin/about", icon: ShieldCheck },
        { name: "Research", href: "/admin/research", icon: FlaskConical },
        { name: "Projects", href: "/admin/projects", icon: FolderGit2 },
        { name: "Publications", href: "/admin/publications", icon: BookOpen },
        { name: "People", href: "/admin/people", icon: Users },
        { name: "News & Insights", href: "/admin/news", icon: Newspaper },
      ]
    },
    {
      title: "INBOX",
      items: [
        { name: "Inquiries & Inbox", href: "/admin/inbox", icon: Inbox },
      ]
    },
    {
      title: "ASSETS",
      items: [
        { name: "Media Library", href: "/admin/media", icon: ImageIcon },
      ]
    },
    {
      title: "SYSTEM",
      items: [
        { name: "Website", href: "/admin/landing", icon: Layers },
        { name: "Activity Log", href: "/admin/activity", icon: Clock },
        { name: "Settings", href: "/admin/settings", icon: Settings },
      ]
    }
  ];

  const isLight = theme === "light";

  return (
    <div className={`min-h-screen flex ${isLight ? "bg-[#F4F6F8] text-slate-800" : "bg-[#090D16] text-slate-100"} font-sans antialiased`}>
      {/* Desktop Sidebar (Obsidian Slate - No Green BG) */}
      <aside className={`hidden lg:flex flex-col ${isCollapsed ? "w-20" : "w-64"} ${
        isLight ? "bg-white border-r border-slate-200/90 shadow-xs" : "bg-[#0B1120] border-r border-slate-800/80 shadow-xl"
      } transition-all duration-300 z-30 shrink-0 select-none`}>
        
        {/* Brand Header */}
        <div className={`h-20 px-5 flex items-center justify-between border-b ${
          isLight ? "border-slate-100" : "border-slate-800/80"
        }`}>
          <Link href="/admin" className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#14532D] to-[#10B981] text-white flex items-center justify-center shadow-md shadow-emerald-500/20 shrink-0">
              <FlaskConical className="w-5 h-5 text-white stroke-[2.2]" />
            </div>
            {!isCollapsed && (
              <div className="flex flex-col min-w-0">
                <span className={`font-bold text-xs leading-tight line-clamp-2 ${isLight ? "text-slate-900" : "text-white"}`}>
                  Laboratory of Environmental Health and Ecotoxicology
                </span>
                <span className={`text-[10px] ${isLight ? "text-slate-400" : "text-slate-400"} font-medium tracking-wide mt-0.5`}>
                  LabEHE • Jahangirnagar University
                </span>
              </div>
            )}
          </Link>

          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={`p-1.5 rounded-lg shrink-0 ${isLight ? "hover:bg-slate-100 text-slate-400" : "hover:bg-slate-800 text-slate-400"} transition-colors`}
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation Sections */}
        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-5 scrollbar-thin">
          {navSections.map((section, sIdx) => (
            <div key={sIdx} className="space-y-1">
              {!isCollapsed && section.title && (
                <div className={`px-3 py-1 text-[10px] font-bold tracking-wider uppercase ${isLight ? "text-slate-400" : "text-slate-500"}`}>
                  {section.title}
                </div>
              )}
              {section.items.map((item) => {
                const isActive = item.href === "/admin" 
                  ? pathname === "/admin" 
                  : pathname.startsWith(item.href);
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center ${isCollapsed ? "justify-center px-0" : "justify-between px-3.5"} py-2 rounded-xl text-xs font-medium transition-all ${
                      isActive
                        ? isLight
                          ? "bg-emerald-50 text-emerald-700 font-bold shadow-xs border border-emerald-200/60"
                          : "bg-emerald-500/15 text-emerald-300 font-semibold border border-emerald-500/30"
                        : isLight
                        ? "text-slate-600 hover:text-slate-900 hover:bg-slate-100/90"
                        : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                    }`}
                    title={isCollapsed ? item.name : undefined}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <Icon className={`w-4 h-4 shrink-0 ${isActive ? (isLight ? "text-emerald-600" : "text-emerald-400") : isLight ? "text-slate-500" : "text-slate-400"}`} />
                      {!isCollapsed && <span className="truncate">{item.name}</span>}
                    </div>
                    {!isCollapsed && item.badge && (
                      <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                        isActive 
                          ? isLight ? "bg-emerald-600 text-white" : "bg-emerald-400 text-slate-950" 
                          : isLight ? "bg-slate-200 text-slate-700" : "bg-slate-800 text-slate-300 border border-slate-700"
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          ))}
        </div>

        {/* User Profile Footer */}
        <div className={`p-4 border-t ${isLight ? "border-slate-100 bg-slate-50/50" : "border-slate-800/80 bg-[#090D16]/50"}`}>
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="relative shrink-0">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                  {userName.charAt(0)}
                </div>
                <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-white dark:ring-slate-900" />
              </div>
              {!isCollapsed && (
                <div className="flex flex-col min-w-0">
                  <span className={`text-xs font-bold leading-tight truncate ${isLight ? "text-slate-800" : "text-white"}`}>
                    {userName}
                  </span>
                  <span className={`text-[10px] ${isLight ? "text-slate-400" : "text-slate-400"}`}>
                    Administrator • <span className="text-emerald-500 font-medium">Online</span>
                  </span>
                </div>
              )}
            </div>

            {!isCollapsed && (
              <button
                onClick={handleSignOut}
                title="Sign out"
                className={`p-1.5 rounded-lg border text-slate-400 hover:text-rose-500 ${isLight ? "border-slate-200 hover:bg-rose-50" : "border-slate-800 hover:bg-rose-950/30"} transition-colors`}
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className={`h-16 px-4 sm:px-8 flex items-center justify-between border-b ${
          isLight ? "bg-white border-slate-200/90 shadow-xs" : "bg-[#0B1120]/95 border-slate-800/80 backdrop-blur-md"
        } transition-colors z-20 shrink-0`}>
          <div className="flex items-center gap-4 flex-1 max-w-xl">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className={`lg:hidden p-2 rounded-xl border ${
                isLight ? "border-slate-200 text-slate-600" : "border-slate-700 text-slate-300"
              }`}
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Top Search Bar */}
            <div className={`hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-xl border w-full max-w-md ${
              isLight ? "bg-slate-50 border-slate-200 text-slate-400" : "bg-[#090D16] border-slate-800 text-slate-400"
            } text-xs`}>
              <Search className="w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search projects, publications, people..."
                className={`bg-transparent outline-none w-full ${isLight ? "text-slate-800 placeholder-slate-400" : "text-white placeholder-slate-500"}`}
              />
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            {/* Daylight / Dark Mode Switcher */}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-xl border transition-all cursor-pointer ${
                isLight
                  ? "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                  : "bg-slate-800/80 border-slate-700 text-amber-400 hover:bg-slate-700"
              }`}
              title={isLight ? "Switch to Dark Mode" : "Switch to Daylight Mode"}
            >
              {isLight ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-emerald-400" />}
            </button>

            {/* Notification Bell */}
            <button
              className={`relative p-2 rounded-xl border ${
                isLight ? "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100" : "bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-700"
              }`}
            >
              <Bell className="w-4 h-4" />
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center">
                3
              </span>
            </button>

            {/* Profile Avatar Pill */}
            <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200 dark:border-slate-800">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                {userName.charAt(0)}
              </div>
              <div className="hidden sm:flex flex-col text-left">
                <span className={`text-xs font-bold leading-tight ${isLight ? "text-slate-800" : "text-white"}`}>
                  {userName}
                </span>
                <span className={`text-[10px] ${isLight ? "text-slate-400" : "text-slate-400"}`}>
                  Administrator
                </span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
            </div>
          </div>
        </header>

        {/* Mobile Sidebar Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex">
            <div className={`w-72 h-full flex flex-col justify-between p-5 ${
              isLight ? "bg-white" : "bg-[#0B1120]"
            } shadow-2xl animate-in slide-in-from-left`}>
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 mb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#14532D] to-[#10B981] text-white flex items-center justify-center font-bold text-[10px] shadow-sm">
                      <FlaskConical className="w-4 h-4 text-white stroke-[2.2]" />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold text-xs">LabEHE Admin</span>
                      <span className="text-[10px] text-slate-400">Jahangirnagar Univ</span>
                    </div>
                  </div>
                  <button onClick={() => setMobileMenuOpen(false)} className="p-1 text-slate-400">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <nav className="space-y-4">
                  {navSections.map((sec, sIdx) => (
                    <div key={sIdx} className="space-y-1">
                      {sec.title && (
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2">
                          {sec.title}
                        </div>
                      )}
                      {sec.items.map((item) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium ${
                            pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href))
                              ? "bg-emerald-600 text-white font-semibold"
                              : isLight ? "text-slate-600 hover:bg-slate-100" : "text-slate-400 hover:bg-slate-800"
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <item.icon className="w-4 h-4" />
                            <span>{item.name}</span>
                          </div>
                          {item.badge && (
                            <span className="text-[10px] font-bold px-1.5 rounded-full bg-white/20 text-white">
                              {item.badge}
                            </span>
                          )}
                        </Link>
                      ))}
                    </div>
                  ))}
                </nav>
              </div>

              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <span className="text-xs font-bold">{userName}</span>
                <button onClick={handleSignOut} className="text-xs text-rose-500 font-semibold flex items-center gap-1">
                  <LogOut className="w-3.5 h-3.5" /> Sign out
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Page Content View */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <AdminThemeProvider>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </AdminThemeProvider>
  );
}
