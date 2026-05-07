"use client";

import { useState, useEffect } from "react";
import { Shield, ChevronRight, LayoutGrid, ListFilter, Users, Search } from "lucide-react";
import ShieldManagement from "@/components/teacher/classroom/ShieldManagement";
import { motion, AnimatePresence } from "framer-motion";

interface ShieldMatrixHubProps {
  initialClasses: any[];
}

export default function ShieldMatrixHub({ initialClasses }: ShieldMatrixHubProps) {
  const [selectedClassId, setSelectedClassId] = useState<string | null>(
    initialClasses.length > 0 ? initialClasses[0].id : null
  );
  const [searchQuery, setSearchQuery] = useState("");

  const filteredClasses = initialClasses.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedClass = initialClasses.find(c => c.id === selectedClassId);

  return (
    <div className="max-w-7xl mx-auto py-8 space-y-10 animate-in fade-in duration-700">
      {/* Header Section */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-2">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 text-secondary text-[10px] font-black uppercase tracking-widest border border-secondary/20">
            <Shield size={12} />
            Institutional Protection
          </div>
          <h1 className="text-4xl lg:text-5xl font-black tracking-tight text-primary">
            Shield <span className="text-secondary italic">Matrix.</span>
          </h1>
          <p className="text-muted-foreground font-medium max-w-xl">
            Centralized focus enforcement. Manage website restrictions across all your classrooms from a single professional interface.
          </p>
        </div>
      </header>

      <div className="grid lg:grid-cols-12 gap-8 items-start">
        {/* Left Sidebar: Class Selector */}
        <aside className="lg:col-span-4 space-y-6">
          <div className="premium-card !p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-primary uppercase tracking-widest">Select Classroom</h3>
              <LayoutGrid size={16} className="text-muted-foreground/40" />
            </div>

            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
              <input 
                type="text" 
                placeholder="Search matrix..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-muted/30 border border-border rounded-xl pl-12 pr-4 py-3 text-sm focus:ring-2 focus:ring-secondary/20 outline-none transition-all"
              />
            </div>

            <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
              {filteredClasses.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedClassId(c.id)}
                  className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 group ${
                    selectedClassId === c.id 
                      ? "bg-secondary text-white shadow-lg shadow-secondary/20 scale-[1.02]" 
                      : "hover:bg-muted border border-transparent hover:border-border"
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                    selectedClassId === c.id ? "bg-white/20" : "bg-secondary/10 text-secondary"
                  }`}>
                    <Users size={18} />
                  </div>
                  <div className="text-left flex-1 min-w-0">
                    <div className="font-bold text-sm truncate">{c.name}</div>
                    <div className={`text-[10px] font-black uppercase tracking-wider opacity-60 ${
                      selectedClassId === c.id ? "text-white" : "text-muted-foreground"
                    }`}>
                      {c.code} • {c._count.members} Students
                    </div>
                  </div>
                  <ChevronRight size={16} className={`transition-transform ${
                    selectedClassId === c.id ? "translate-x-1" : "opacity-0 group-hover:opacity-100"
                  }`} />
                </button>
              ))}
              {filteredClasses.length === 0 && (
                <div className="py-12 text-center">
                  <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest italic">No classes found</p>
                </div>
              )}
            </div>
          </div>

          <div className="p-6 rounded-[2rem] bg-secondary/5 border border-secondary/20 border-dashed">
            <h4 className="text-[10px] font-black text-secondary uppercase tracking-[0.2em] mb-2">Matrix Protocol</h4>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Updates to the Shield Matrix are applied in real-time to all connected student extensions within the selected classroom context.
            </p>
          </div>
        </aside>

        {/* Right Content: Matrix Management */}
        <main className="lg:col-span-8">
          <AnimatePresence mode="wait">
            {selectedClassId ? (
              <motion.div
                key={selectedClassId}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                <div className="premium-card !p-8">
                  <ShieldManagement classId={selectedClassId} />
                </div>
              </motion.div>
            ) : (
              <div className="premium-card py-40 flex flex-col items-center justify-center text-center space-y-6">
                <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center text-muted-foreground/30">
                  <Shield size={40} />
                </div>
                <div>
                  <h3 className="text-xl font-black text-primary uppercase tracking-tight">Select a Matrix</h3>
                  <p className="text-sm text-muted-foreground mt-2 max-w-xs">
                    Choose a classroom from the left sidebar to begin managing its focus enforcement policy.
                  </p>
                </div>
              </div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
