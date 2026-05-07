"use client";

import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-border bg-card/10 py-8 px-4 sm:px-8">
      <div className="mx-auto flex flex-col md:flex-row items-center justify-between gap-6 opacity-60">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-muted flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-3 h-3 text-muted-foreground"
            >
              <path d="M12 2v4" />
              <path d="M12 18v4" />
            </svg>
          </div>
          <span className="text-xs font-bold uppercase tracking-[0.2em]">
            FocusForge v1.0
          </span>
        </div>

        <nav className="flex items-center gap-8">
          <Link href="#" className="text-xs font-bold hover:text-primary transition-colors uppercase tracking-widest">Support</Link>
          <Link href="#" className="text-xs font-bold hover:text-primary transition-colors uppercase tracking-widest">Privacy</Link>
          <Link href="#" className="text-xs font-bold hover:text-primary transition-colors uppercase tracking-widest">Terms</Link>
        </nav>

        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
          &copy; {currentYear} Forge Your Future.
        </p>
      </div>
    </footer>
  );
}
