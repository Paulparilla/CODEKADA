"use client";

import { useState, useEffect } from "react";
import { 
  Bell, 
  CheckCheck, 
  Circle, 
  ExternalLink,
  Info,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Zap,
  BookOpen,
  Brain
} from "lucide-react";
import { 
  getNotifications, 
  markNotificationRead, 
  markAllAsRead 
} from "@/lib/actions/notification.actions";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

interface NotificationInboxProps {
  userId: string;
}

export default function NotificationInbox({ userId }: NotificationInboxProps) {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    const data = await getNotifications(userId);
    setNotifications(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchNotifications();
    // Poll for new notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [userId]);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleMarkRead = async (id: string) => {
    const res = await markNotificationRead(id);
    if (res.success) {
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
    }
  };

  const handleMarkAllRead = async () => {
    const res = await markAllAsRead(userId);
    if (res.success) {
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "SUCCESS": return <CheckCircle2 size={16} className="text-green-500" />;
      case "WARNING": return <AlertTriangle size={16} className="text-amber-500" />;
      case "ERROR": return <XCircle size={16} className="text-red-500" />;
      case "XP": return <Zap size={16} className="text-secondary" />;
      case "CLASS": return <BookOpen size={16} className="text-primary" />;
      case "QUIZ": return <Brain size={16} className="text-purple-500" />;
      default: return <Info size={16} className="text-blue-500" />;
    }
  };

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-3 rounded-2xl bg-muted/50 hover:bg-muted text-muted-foreground transition-all group"
      >
        <Bell size={20} className="group-hover:scale-110 transition-transform" />
        {unreadCount > 0 && (
          <span className="absolute top-2.5 right-2.5 w-4 h-4 bg-secondary text-white text-[10px] font-black flex items-center justify-center rounded-full border-2 border-background animate-in zoom-in duration-300">
            {unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setIsOpen(false)} 
            />
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute right-0 mt-4 w-96 max-h-[500px] bg-card border border-border rounded-3xl shadow-2xl z-50 overflow-hidden flex flex-col"
            >
              {/* Header */}
              <div className="p-5 border-b border-border bg-muted/30 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-black text-foreground tracking-tight">Notifications</h4>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                    You have {unreadCount} unread alerts
                  </p>
                </div>
                {unreadCount > 0 && (
                  <button 
                    onClick={handleMarkAllRead}
                    className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-primary hover:text-primary/80 transition-colors"
                  >
                    <CheckCheck size={12} />
                    Mark all read
                  </button>
                )}
              </div>

              {/* List */}
              <div className="flex-1 overflow-y-auto custom-scrollbar">
                {loading ? (
                  <div className="p-20 text-center opacity-40">
                    <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-[10px] font-black uppercase tracking-widest">Loading alerts...</p>
                  </div>
                ) : notifications.length === 0 ? (
                  <div className="p-20 text-center opacity-40">
                    <Bell size={32} className="mx-auto mb-4" />
                    <p className="text-[10px] font-black uppercase tracking-widest">No notifications yet</p>
                  </div>
                ) : (
                  <div className="divide-y divide-border/50">
                    {notifications.map((n) => (
                      <div 
                        key={n.id}
                        className={`p-5 flex gap-4 hover:bg-muted/30 transition-all group relative ${!n.isRead ? "bg-primary/5" : ""}`}
                      >
                        <div className="shrink-0 mt-1">
                          {getIcon(n.type)}
                        </div>
                        <div className="flex-1 space-y-1">
                          <div className="flex items-start justify-between gap-2">
                            <p className={`text-xs font-black tracking-tight ${!n.isRead ? "text-primary" : "text-foreground"}`}>
                              {n.title}
                            </p>
                            {!n.isRead && <Circle size={6} fill="currentColor" className="text-primary mt-1" />}
                          </div>
                          <p className="text-[11px] text-muted-foreground leading-relaxed">
                            {n.message}
                          </p>
                          <div className="pt-2 flex items-center justify-between">
                            <span className="text-[9px] font-bold text-muted-foreground/60 uppercase">
                              {new Date(n.createdAt).toLocaleDateString()}
                            </span>
                            <div className="flex items-center gap-3">
                              {!n.isRead && (
                                <button 
                                  onClick={() => handleMarkRead(n.id)}
                                  className="text-[9px] font-black text-primary uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  Mark Read
                                </button>
                              )}
                              {n.link && (
                                <Link 
                                  href={n.link}
                                  onClick={() => {
                                    setIsOpen(false);
                                    handleMarkRead(n.id);
                                  }}
                                  className="text-muted-foreground hover:text-primary transition-colors"
                                >
                                  <ExternalLink size={12} />
                                </Link>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="p-4 bg-muted/30 border-t border-border text-center">
                <button className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground hover:text-primary transition-colors">
                  View Notification History
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
