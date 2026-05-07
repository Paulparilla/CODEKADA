"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  BookOpen, 
  Timer, 
  Settings, 
  LogOut, 
  Users,
  Trophy,
  Activity,
  Shield
} from "lucide-react";
import { signOut } from "@/lib/actions/auth.actions";

interface SidebarProps {
  role: "STUDENT" | "TEACHER" | "ADMIN";
}

export default function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname();

  const studentLinks = [
    { name: "Dashboard", href: "/student/dashboard", icon: LayoutDashboard },
    { name: "My Classes", href: "/student/classes", icon: BookOpen },
    { name: "Pomodoro", href: "/student/pomodoro", icon: Timer },
    { name: "Achievements", href: "/student/achievements", icon: Trophy },
  ];

  const teacherLinks = [
    { name: "Dashboard", href: "/teacher/dashboard", icon: LayoutDashboard },
    { name: "My Classes", href: "/teacher/classes", icon: Users },
    { name: "Pomodoro", href: "/teacher/pomodoro", icon: Timer },
    { name: "Shield Matrix", href: "/teacher/shield", icon: Shield },
  ];

  const links = role === "STUDENT" ? studentLinks : teacherLinks;

  return (
    <aside className="fixed left-0 top-0 hidden h-screen w-72 flex-col border-r border-border bg-card/30 backdrop-blur-xl lg:flex z-50">
      <div className="flex h-20 items-center px-8">
        <div className="flex items-center gap-3 group cursor-pointer">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-5 h-5 text-primary-foreground"
            >
              <path d="M12 2v4" />
              <path d="M12 18v4" />
              <path d="m4.93 4.93 2.83 2.83" />
              <path d="m16.24 16.24 2.83 2.83" />
              <path d="M2 12h4" />
              <path d="M18 12h4" />
              <path d="m4.93 19.07 2.83-2.83" />
              <path d="m16.24 7.76 2.83-2.83" />
            </svg>
          </div>
          <span className="font-black text-primary text-xl tracking-tighter">
            FocusForge
          </span>
        </div>
      </div>

      <nav className="flex-1 space-y-2 px-4 py-8">
        <div className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50 px-4 mb-4">
          Main Menu
        </div>
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.name}
              href={link.href}
              className={`flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-300 group ${
                isActive 
                ? "bg-secondary/10 text-secondary" 
                : "text-muted-foreground hover:bg-muted hover:text-primary"
              }`}
            >
              <Icon className={`w-5 h-5 transition-transform group-hover:scale-110 ${isActive ? "text-secondary" : ""}`} />
              <span className="font-bold text-sm">{link.name}</span>
              {isActive && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-secondary shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-6 border-t border-border">
        <div className="flex items-center gap-3 px-4 py-2 rounded-2xl bg-muted/30 border border-transparent">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
          <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">System Online</span>
        </div>
      </div>
    </aside>
  );
}
