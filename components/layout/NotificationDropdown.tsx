"use client";

import { useEffect, useState } from "react";
import { 
  Bell, 
  CheckCheck, 
  BookOpen, 
  Trophy, 
  AlertCircle, 
  Info, 
  Calendar,
  X
} from "lucide-react";
import { 
  getNotifications, 
  markNotificationRead, 
  markAllAsRead 
} from "@/lib/actions/notification.actions";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

interface NotificationDropdownProps {
  userId: string;
}

export default function NotificationDropdown({ userId }: NotificationDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = async () => {
    const data = await getNotifications(userId);
    setNotifications(data);
    setUnreadCount(data.filter((n: any) => !n.isRead).length);
  };

  useEffect(() => {
    fetchNotifications();

    // Set up real-time subscription via Supabase
    const supabase = createClient();
    const channel = supabase
      .channel("realtime-notifications")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "Notification",
          filter: `userId=eq.${userId}`,
        },
        () => {
          fetchNotifications();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  const handleMarkRead = async (id: string) => {
    await markNotificationRead(id);
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, isRead: true } : n)
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const handleMarkAllRead = async () => {
    await markAllAsRead(userId);
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    setUnreadCount(0);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "CLASS": return <BookOpen className="w-4 h-4 text-secondary" />;
      case "XP": return <Trophy className="w-4 h-4 text-accent" />;
      case "EXAM": return <Calendar className="w-4 h-4 text-sky-500" />;
      case "WARNING": return <AlertCircle className="w-4 h-4 text-orange-500" />;
      default: return <Info className="w-4 h-4 text-primary" />;
    }
  };

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2.5 rounded-2xl hover:bg-muted transition-all active:scale-95 group"
      >
        <Bell className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
        {unreadCount > 0 && (
          <span className="absolute top-2 right-2 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-secondary border-2 border-background flex items-center justify-center text-[8px] font-black text-white leading-none">
              {unreadCount}
            </span>
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40 bg-black/5" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-4 w-[380px] rounded-3xl bg-card border border-border shadow-2xl p-0 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="p-5 border-b border-border/50 flex items-center justify-between bg-muted/20">
              <div>
                <h3 className="text-sm font-black text-primary uppercase tracking-widest">Notifications</h3>
                <p className="text-[10px] text-muted-foreground font-bold mt-1">You have {unreadCount} unread alerts</p>
              </div>
              <button 
                onClick={handleMarkAllRead}
                className="p-2 rounded-xl hover:bg-secondary/10 text-secondary transition-all"
                title="Mark all as read"
              >
                <CheckCheck className="w-5 h-5" />
              </button>
            </div>

            {/* List */}
            <div className="max-h-[450px] overflow-y-auto premium-scrollbar">
              {notifications.length > 0 ? (
                notifications.map((notif) => (
                  <div 
                    key={notif.id}
                    className={`p-4 flex gap-4 transition-colors cursor-pointer relative group ${notif.isRead ? "opacity-70 hover:bg-muted/30" : "bg-secondary/5 hover:bg-secondary/10"}`}
                    onClick={() => handleMarkRead(notif.id)}
                  >
                    {!notif.isRead && (
                      <div className="absolute left-2 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-secondary" />
                    )}
                    
                    <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-background border border-border flex items-center justify-center shadow-sm transition-transform group-hover:scale-110">
                      {getIcon(notif.type)}
                    </div>

                    <div className="flex-1 space-y-1">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className={`text-sm tracking-tight leading-snug ${notif.isRead ? "font-bold text-muted-foreground" : "font-black text-primary"}`}>
                          {notif.title}
                        </h4>
                        <span className="text-[10px] font-bold text-muted-foreground whitespace-nowrap">
                          {formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true })}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground font-medium line-clamp-2">
                        {notif.message}
                      </p>
                      {notif.link && (
                        <Link 
                          href={notif.link}
                          className="inline-block pt-1 text-[10px] font-black uppercase tracking-widest text-secondary hover:underline"
                        >
                          View Details →
                        </Link>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-16 flex flex-col items-center justify-center text-center px-8">
                  <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center text-2xl mb-4 opacity-50">
                    🔕
                  </div>
                  <h4 className="text-sm font-black text-primary">All caught up!</h4>
                  <p className="text-xs text-muted-foreground font-medium mt-2">
                    When you receive updates about classes or exams, they will appear here.
                  </p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-border/50 bg-muted/20">
              <button 
                onClick={() => setIsOpen(false)}
                className="w-full py-3 rounded-2xl bg-primary text-white text-[10px] font-black uppercase tracking-widest hover:bg-primary/90 transition-all shadow-lg"
              >
                Close Notifications
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
