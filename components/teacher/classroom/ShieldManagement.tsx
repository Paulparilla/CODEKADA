"use client";

import { useState, useEffect } from "react";
import { Shield, ShieldAlert, ShieldCheck, Plus, X, Globe, Save, Loader2 } from "lucide-react";
import { getFocusPolicy, updateFocusPolicy } from "@/lib/actions/shield.actions";
import Swal from "sweetalert2";

interface ShieldManagementProps {
  classId: string;
}

const PRESET_DISTRACTIONS = [
  { name: "Facebook", domain: "facebook.com", icon: "📘" },
  { name: "YouTube", domain: "youtube.com", icon: "🔴" },
  { name: "TikTok", domain: "tiktok.com", icon: "🎵" },
  { name: "Instagram", domain: "instagram.com", icon: "📸" },
  { name: "Twitter / X", domain: "twitter.com", icon: "🐦" },
  { name: "Reddit", domain: "reddit.com", icon: "👽" },
  { name: "Twitch", domain: "twitch.tv", icon: "📺" },
  { name: "Netflix", domain: "netflix.com", icon: "🎬" },
];

export default function ShieldManagement({ classId }: ShieldManagementProps) {
  const [domains, setDomains] = useState<string[]>([]);
  const [newDomain, setNewDomain] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function loadPolicy() {
      const policy = await getFocusPolicy(classId);
      setDomains(policy.domains);
      setIsLoading(false);
    }
    loadPolicy();
  }, [classId]);

  const togglePreset = (domain: string) => {
    if (domains.includes(domain)) {
      setDomains(domains.filter((d) => d !== domain));
    } else {
      setDomains([...domains, domain]);
    }
  };

  const addCustomDomain = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDomain) return;
    
    // Basic cleaning
    const cleaned = newDomain.replace(/^(https?:\/\/)?(www\.)?/, "").split("/")[0];
    
    if (cleaned && !domains.includes(cleaned)) {
      setDomains([...domains, cleaned]);
      setNewDomain("");
    }
  };

  const removeDomain = (domain: string) => {
    setDomains(domains.filter((d) => d !== domain));
  };

  const handleSave = async () => {
    setIsSaving(true);
    const result = await updateFocusPolicy(classId, domains);
    setIsSaving(false);

    if (result.success) {
      Swal.fire({
        title: "Policy Updated",
        text: "The Focus Shield matrix has been updated for all students in this class.",
        icon: "success",
        confirmButtonColor: "var(--color-secondary)",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="premium-card flex flex-col items-center justify-center py-20 space-y-4">
        <Loader2 className="animate-spin text-secondary" size={32} />
        <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">Initializing Shield Matrix...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-secondary font-black tracking-widest uppercase text-[10px] mb-2">
            <ShieldCheck size={14} />
            Matrix Management
          </div>
          <h2 className="text-3xl font-black tracking-tight text-primary">Focus <span className="text-secondary italic">Shield</span></h2>
          <p className="text-sm text-muted-foreground mt-2 max-w-md">
            Define which websites and applications are blurred for your students during focus sessions.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={isSaving}
          className="btn-primary !px-8 !py-4 flex items-center gap-2 shadow-xl shadow-secondary/20"
        >
          {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
          {isSaving ? "Syncing Matrix..." : "Save Policy"}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {PRESET_DISTRACTIONS.map((item) => {
          const isActive = domains.includes(item.domain);
          return (
            <button
              key={item.domain}
              onClick={() => togglePreset(item.domain)}
              className={`p-6 rounded-[2rem] border transition-all duration-300 flex flex-col items-center text-center gap-3 group relative overflow-hidden ${
                isActive 
                  ? "bg-secondary/10 border-secondary shadow-lg shadow-secondary/5" 
                  : "bg-card border-border hover:border-secondary/30"
              }`}
            >
              <div className="text-4xl mb-1 group-hover:scale-110 transition-transform duration-300">{item.icon}</div>
              <div>
                <div className="text-sm font-black text-primary">{item.name}</div>
                <div className="text-[10px] text-muted-foreground font-medium">{item.domain}</div>
              </div>
              <div className={`mt-2 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                isActive ? "bg-secondary text-white" : "bg-muted text-muted-foreground"
              }`}>
                {isActive ? "Blocked" : "Allowed"}
              </div>
              
              {isActive && (
                <div className="absolute top-3 right-3 text-secondary">
                  <ShieldCheck size={16} />
                </div>
              )}
            </button>
          );
        })}
      </div>

      <div className="premium-card">
        <h3 className="text-lg font-black text-primary mb-6 flex items-center gap-2">
          <Globe size={18} className="text-secondary" />
          Custom Domain Matrix
        </h3>

        <form onSubmit={addCustomDomain} className="flex gap-4 mb-8">
          <input
            type="text"
            placeholder="Enter domain (e.g. game-site.com)"
            value={newDomain}
            onChange={(e) => setNewDomain(e.target.value)}
            className="flex-1 bg-muted/30 border border-border rounded-2xl px-6 py-4 text-sm font-medium focus:ring-2 focus:ring-secondary/20 outline-none transition-all"
          />
          <button type="submit" className="p-4 rounded-2xl bg-primary text-white hover:bg-primary/90 transition-all shadow-lg">
            <Plus size={24} />
          </button>
        </form>

        <div className="flex flex-wrap gap-3">
          {domains.filter(d => !PRESET_DISTRACTIONS.some(p => p.domain === d)).map((domain) => (
            <div 
              key={domain} 
              className="px-4 py-2 rounded-xl bg-muted/50 border border-border flex items-center gap-3 animate-in zoom-in-95 duration-200"
            >
              <span className="text-sm font-bold text-primary">{domain}</span>
              <button 
                onClick={() => removeDomain(domain)}
                className="text-muted-foreground hover:text-destructive transition-colors"
              >
                <X size={14} />
              </button>
            </div>
          ))}
          {domains.length === 0 && (
            <div className="w-full text-center py-8 border-2 border-dashed border-border rounded-3xl">
              <p className="text-sm text-muted-foreground font-medium italic">No custom domains added yet.</p>
            </div>
          )}
        </div>
      </div>

      <div className="p-6 rounded-3xl bg-secondary/5 border border-secondary/20 flex gap-4 items-start">
        <div className="p-3 rounded-2xl bg-secondary/10 text-secondary">
          <ShieldAlert size={20} />
        </div>
        <div>
          <h4 className="text-sm font-black text-primary uppercase tracking-tight">How it works</h4>
          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
            When students join a focus session or start a task in this class, the **FocusForge Shield** extension will automatically sync with this matrix. Any site in the "Blocked" state will be aggressively blurred to ensure students remain focused on their academic tasks.
          </p>
        </div>
      </div>
    </div>
  );
}
