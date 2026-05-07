"use client";

import { useState } from "react";
import { Bell, Search, Menu, Settings, LogOut, ChevronDown, X, LayoutDashboard, BookOpen, Timer, Trophy } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { AuthUser } from "@/types";
import { signOut } from "@/lib/actions/auth.actions";
import Swal from "sweetalert2";
import SettingsModal from "@/components/shared/SettingsModal";
import NotificationDropdown from "@/components/layout/NotificationDropdown";

interface TopbarProps {
  user: AuthUser;
}

export default function Topbar({ user }: TopbarProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const navigation = user.role === "STUDENT" 
    ? [
        { name: "Dashboard", href: "/student/dashboard", icon: LayoutDashboard },
        { name: "My Classes", href: "/student/classes", icon: BookOpen },
        { name: "Pomodoro", href: "/student/pomodoro", icon: Timer },
        { name: "Achievements", href: "/student/achievements", icon: Trophy },
      ]
    : [
        { name: "Dashboard", href: "/teacher/dashboard", icon: LayoutDashboard },
        { name: "My Classes", href: "/teacher/classes", icon: BookOpen },
      ];

  const handleSignOut = () => {
    Swal.fire({
      title: "Sign Out?",
      text: "Are you sure you want to leave the forge?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "var(--color-secondary)",
      cancelButtonColor: "var(--color-destructive)",
      confirmButtonText: "Yes, logout",
      background: "var(--color-card)",
      color: "var(--color-primary)",
      customClass: {
        popup: "rounded-3xl border border-border shadow-2xl",
        confirmButton: "rounded-xl font-bold px-6 py-2",
        cancelButton: "rounded-xl font-bold px-6 py-2"
      }
    }).then((result) => {
      if (result.isConfirmed) {
        signOut();
      }
    });
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-border bg-background/60 backdrop-blur-xl lg:px-8">
        <div className="flex h-16 items-center justify-between px-4 sm:px-6">
          {/* Mobile Menu Trigger */}
          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className="lg:hidden p-2 rounded-xl hover:bg-muted transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md ml-8">
            <div className="relative w-full group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
              <input 
                type="text" 
                placeholder="Search classroom..." 
                className="w-full bg-muted/50 border-transparent focus:bg-background focus:border-border transition-all rounded-2xl pl-12 h-10 text-sm font-medium"
              />
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-4 ml-auto">
            <NotificationDropdown userId={user.id} />

            <div className="h-8 w-px bg-border mx-2"></div>

            {/* Profile Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-3 pl-2 group cursor-pointer"
              >
                <div className="flex flex-col items-end hidden sm:flex">
                  <span className="text-xs font-black text-primary leading-none uppercase tracking-tighter">
                    {user.name}
                  </span>
                  <span className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest mt-1">
                    {user.role}
                  </span>
                </div>
                <div className="h-10 w-10 rounded-2xl bg-secondary/10 flex items-center justify-center border border-secondary/20 group-hover:bg-secondary/20 transition-all overflow-hidden relative">
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name || ""} className="h-full w-full object-cover" />
                  ) : (
                    <span className="text-sm font-black text-secondary">
                      {user.name?.[0].toUpperCase() || "S"}
                    </span>
                  )}
                </div>
                <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform duration-300 ${isDropdownOpen ? "rotate-180" : ""}`} />
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-4 w-56 rounded-3xl bg-card border border-border shadow-2xl p-2 animate-in fade-in zoom-in-95 duration-200">
                  <div className="px-4 py-3 border-b border-border/50 mb-2">
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Profile Status</p>
                    <p className="text-xs font-bold text-green-500 mt-1 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                      Online
                    </p>
                  </div>
                  
                  <button 
                    onClick={() => {
                      setIsSettingsOpen(true);
                      setIsDropdownOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold text-muted-foreground hover:bg-muted hover:text-primary transition-all group"
                  >
                    <Settings className="w-4 h-4 transition-transform group-hover:rotate-45" />
                    Settings
                  </button>

                  <div className="h-px bg-border/50 my-2"></div>

                  <button 
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold text-destructive hover:bg-destructive/10 transition-all group"
                  >
                    <LogOut className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
        user={user} 
      />

      {/* Mobile Sidebar Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm lg:hidden"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 z-[51] w-72 bg-card border-r border-border p-6 shadow-2xl lg:hidden flex flex-col"
            >
              <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                    <Trophy className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-black text-primary text-lg tracking-tighter">FocusForge</span>
                </div>
                <button 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 rounded-xl hover:bg-muted transition-colors"
                >
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>

              <nav className="flex-1 space-y-2">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all ${
                        isActive 
                          ? "bg-secondary/10 text-secondary" 
                          : "text-muted-foreground hover:bg-muted"
                      }`}
                    >
                      <Icon className={`w-5 h-5 ${isActive ? "text-secondary" : ""}`} />
                      <span className="font-bold text-sm">{item.name}</span>
                    </Link>
                  );
                })}
              </nav>

              <div className="pt-6 border-t border-border mt-auto">
                <button 
                  onClick={handleSignOut}
                  className="w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-muted-foreground hover:bg-destructive/5 hover:text-destructive transition-all"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="font-bold text-sm">Sign Out</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
