"use client";

import { useState } from "react";
import { 
  Plus, 
  X, 
  Loader2, 
  FileUp, 
  FileText, 
  ShieldCheck,
  CloudUpload,
  ChevronRight,
  Sparkles
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Portal from "@/components/ui/Portal";

interface UploadDocumentModalProps {
  classId: string;
}

export default function UploadDocumentModal({ classId }: UploadDocumentModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || isSubmitting) return;

    setIsSubmitting(true);
    // Simulating upload (would be a real server action)
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsOpen(false);
    setName("");
    setIsSubmitting(false);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="w-full flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-accent/10 to-indigo-500/5 hover:from-accent/20 hover:to-indigo-500/10 border border-accent/10 hover:border-accent/30 transition-all group shadow-sm hover:shadow-md"
      >
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-accent text-white shadow-lg shadow-accent/20 group-hover:scale-110 transition-transform">
            <FileUp size={18} />
          </div>
          <div className="text-left">
            <p className="text-xs font-black uppercase tracking-widest text-primary">Upload Docs</p>
            <p className="text-[10px] text-muted-foreground font-bold">Share materials</p>
          </div>
        </div>
        <ChevronRight size={14} className="text-muted-foreground group-hover:translate-x-1 transition-transform" />
      </button>

      <Portal>
        <AnimatePresence>
          {isOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsOpen(false)}
                className="absolute inset-0 bg-background/60 backdrop-blur-md"
              />
              
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative w-full max-w-xl overflow-hidden rounded-[32px] border border-border bg-card shadow-2xl"
              >
                {/* Header Decoration */}
                <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-accent/10 to-transparent" />
                
                <div className="relative p-8 md:p-10 space-y-8">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent text-[10px] font-black uppercase tracking-widest">
                        <Sparkles size={10} />
                        Resource Library
                      </div>
                      <h3 className="text-3xl font-black text-foreground tracking-tight">Share <span className="text-accent italic">Materials.</span></h3>
                      <p className="text-sm text-muted-foreground font-medium max-w-sm">
                        Distribute PDFs, documents, or research links to your classroom.
                      </p>
                    </div>
                    <button
                      onClick={() => setIsOpen(false)}
                      className="p-3 rounded-2xl bg-muted/50 hover:bg-muted text-muted-foreground transition-all active:scale-95"
                    >
                      <X size={20} />
                    </button>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid gap-6">
                      {/* Drag & Drop Placeholder */}
                      <div className="relative group cursor-pointer">
                        <div className="w-full h-40 rounded-3xl border-2 border-dashed border-accent/20 bg-accent/5 flex flex-col items-center justify-center gap-4 group-hover:bg-accent/10 group-hover:border-accent/40 transition-all">
                          <div className="p-4 rounded-full bg-accent/20 text-accent group-hover:scale-110 transition-transform">
                            <CloudUpload size={32} />
                          </div>
                          <p className="text-xs font-black uppercase tracking-widest text-accent/60">Drag & Drop Files here</p>
                        </div>
                        <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" />
                      </div>

                      {/* Name Input */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
                          <FileText size={12} className="text-accent" />
                          Resource Name
                        </div>
                        <input
                          type="text"
                          placeholder="e.g. Week 4 Lecture Notes"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          required
                          className="w-full bg-muted/30 border-2 border-transparent focus:bg-background focus:border-accent/30 rounded-2xl px-5 py-4 text-sm font-bold transition-all outline-none"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-4 pt-4">
                      <button
                        type="button"
                        onClick={() => setIsOpen(false)}
                        className="flex-1 h-14 rounded-2xl bg-muted/50 text-xs font-black uppercase tracking-widest text-muted-foreground hover:bg-muted transition-all"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting || !name.trim()}
                        className="flex-[2] h-14 rounded-2xl bg-accent text-white text-xs font-black uppercase tracking-widest shadow-xl shadow-accent/20 hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:scale-100 transition-all flex items-center justify-center gap-2"
                      >
                        {isSubmitting ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          <>
                            <Plus size={18} />
                            Upload & Share
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </Portal>
    </>
  );
}
