"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Timer, Coffee, Trophy, RotateCcw, Save } from "lucide-react";

interface PomodoroSettings {
  focus: number;
  short: number;
  long: number;
}

interface PomodoroSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: PomodoroSettings;
  onSave: (newSettings: PomodoroSettings) => void;
}

export default function PomodoroSettingsModal({
  isOpen,
  onClose,
  settings,
  onSave,
}: PomodoroSettingsModalProps) {
  const [localSettings, setLocalSettings] = useState<PomodoroSettings>(settings);

  const handleChange = (key: keyof PomodoroSettings, value: string) => {
    const numValue = parseInt(value) || 0;
    setLocalSettings((prev) => ({ ...prev, [key]: numValue }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(localSettings);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[100] bg-background/80 backdrop-blur-md"
          />

          {/* Modal Container */}
          <div className="fixed inset-0 z-[101] flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-md bg-card border border-border rounded-[2.5rem] shadow-2xl overflow-hidden pointer-events-auto"
            >
              {/* Header */}
              <div className="px-8 pt-8 pb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-black text-foreground tracking-tight">Timer Settings</h2>
                  <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest mt-1">
                    Customize your intervals
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="p-3 rounded-2xl hover:bg-muted transition-colors text-muted-foreground"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSave} className="p-8 space-y-6">
                <div className="space-y-4">
                  {/* Focus Duration */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-primary font-bold">
                      <Timer size={16} />
                      <label className="text-xs uppercase tracking-wider">Focus Duration (min)</label>
                    </div>
                    <input
                      type="number"
                      min="1"
                      max="120"
                      value={localSettings.focus}
                      onChange={(e) => handleChange("focus", e.target.value)}
                      className="w-full h-12 bg-muted/50 border border-border rounded-2xl px-4 font-black text-lg focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                  </div>

                  {/* Short Break Duration */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-teal-600 font-bold">
                      <Coffee size={16} />
                      <label className="text-xs uppercase tracking-wider">Short Break (min)</label>
                    </div>
                    <input
                      type="number"
                      min="1"
                      max="30"
                      value={localSettings.short}
                      onChange={(e) => handleChange("short", e.target.value)}
                      className="w-full h-12 bg-muted/50 border border-border rounded-2xl px-4 font-black text-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20 transition-all"
                    />
                  </div>

                  {/* Long Break Duration */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-purple-600 font-bold">
                      <Trophy size={16} />
                      <label className="text-xs uppercase tracking-wider">Long Break (min)</label>
                    </div>
                    <input
                      type="number"
                      min="1"
                      max="60"
                      value={localSettings.long}
                      onChange={(e) => handleChange("long", e.target.value)}
                      className="w-full h-12 bg-muted/50 border border-border rounded-2xl px-4 font-black text-lg focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all"
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-4 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setLocalSettings({ focus: 25, short: 5, long: 15 })}
                    className="flex-1 flex items-center justify-center gap-2 h-12 rounded-2xl border border-border font-bold text-sm text-muted-foreground hover:bg-muted transition-all"
                  >
                    <RotateCcw size={16} />
                    Reset Defaults
                  </button>
                  <button
                    type="submit"
                    className="flex-1 flex items-center justify-center gap-2 h-12 rounded-2xl bg-primary text-primary-foreground font-black text-sm shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                  >
                    <Save size={16} />
                    Save Settings
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
