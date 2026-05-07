"use client";

import { useState } from "react";
import { X, User, Shield, Bell, Loader2, Camera } from "lucide-react";
import { updateProfile } from "@/lib/actions/auth.actions";
import type { AuthUser } from "@/types";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: AuthUser;
}

export default function SettingsModal({ isOpen, onClose, user }: SettingsModalProps) {
  const [name, setName] = useState(user.name || "");
  const [avatar, setAvatar] = useState(user.avatar || "");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [activeTab, setActiveTab] = useState<"profile" | "account" | "notifications">("profile");

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    const result = await updateProfile(user.id, { name, avatar });

    if (result.success) {
      setStatus("success");
      setTimeout(() => {
        setStatus("idle");
        onClose();
      }, 1500);
    } else {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 3000);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="premium-card w-full max-w-2xl flex flex-col md:flex-row p-0 overflow-hidden animate-in zoom-in-95 duration-300">
        {/* Sidebar Navigation */}
        <div className="w-full md:w-64 bg-muted/30 border-r border-border p-6 space-y-2">
          <h3 className="text-xl font-black text-primary mb-6">Settings</h3>
          
          {[
            { id: "profile", label: "Profile", icon: User },
            { id: "account", label: "Account", icon: Shield },
            { id: "notifications", label: "Notifications", icon: Bell },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                activeTab === tab.id 
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" 
                  : "text-muted-foreground hover:bg-muted"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 p-8 relative">
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 rounded-xl hover:bg-muted transition-colors"
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </button>

          {activeTab === "profile" && (
            <form onSubmit={handleUpdate} className="space-y-8">
              <div>
                <h4 className="text-lg font-black text-primary">Profile Information</h4>
                <p className="text-sm text-muted-foreground font-medium">Update your photo and personal details.</p>
              </div>

              {/* Avatar Upload Placeholder */}
              <div className="flex items-center gap-6">
                <div className="relative group">
                  <div className="w-20 h-20 rounded-3xl bg-secondary/10 flex items-center justify-center border border-secondary/20 overflow-hidden">
                    {avatar ? (
                      <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-2xl font-black text-secondary">{name[0]?.toUpperCase()}</span>
                    )}
                  </div>
                  <button type="button" className="absolute -bottom-2 -right-2 p-2 rounded-xl bg-background border border-border shadow-lg hover:bg-muted transition-all">
                    <Camera className="w-3.5 h-3.5 text-primary" />
                  </button>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-black uppercase tracking-widest text-primary">Avatar URL</p>
                  <input 
                    type="text" 
                    value={avatar}
                    onChange={(e) => setAvatar(e.target.value)}
                    placeholder="https://images.com/photo.jpg"
                    className="input-field text-[11px] h-9 w-64"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="input-field"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Email Address</label>
                  <input
                    type="email"
                    value={user.email}
                    disabled
                    className="input-field opacity-50 cursor-not-allowed"
                  />
                  <p className="text-[10px] text-muted-foreground font-medium ml-1 italic">* Email cannot be changed here.</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4">
                {status === "success" && (
                  <p className="text-xs font-bold text-green-500 uppercase tracking-widest">Saved Successfully!</p>
                )}
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="btn-primary ml-auto flex items-center gap-2 h-11 px-8"
                >
                  {status === "loading" ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    "Save Changes"
                  )}
                </button>
              </div>
            </form>
          )}

          {activeTab !== "profile" && (
            <div className="h-full flex flex-col items-center justify-center text-center opacity-40 py-20">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center text-2xl mb-4">⚙️</div>
              <p className="text-sm font-bold uppercase tracking-widest">Coming Soon</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
