"use client";

import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";

interface NotificationToastListenerProps {
  userId: string;
}

export default function NotificationToastListener({ userId }: NotificationToastListenerProps) {
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();
    
    const channel = supabase
      .channel(`user-notifications-${userId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "Notification",
          filter: `userId=eq.${userId}`,
        },
        (payload) => {
          const newNotif = payload.new as any;
          
          // Play a subtle sound if possible (optional)
          
          // Show Premium Toast
          Swal.fire({
            title: newNotif.title,
            text: newNotif.message,
            icon: (newNotif.type?.toLowerCase() as any) || "info",
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 5000,
            timerProgressBar: true,
            background: "var(--color-card)",
            color: "var(--color-primary)",
            padding: "1rem",
            customClass: {
              popup: "rounded-2xl border border-border shadow-2xl flex items-center gap-4",
              title: "!text-sm !font-black !m-0 !p-0 !text-left",
              htmlContainer: "!text-[11px] !m-0 !p-0 !text-left !text-muted-foreground",
            },
            didOpen: (toast) => {
              toast.addEventListener('click', () => {
                if (newNotif.link) {
                  router.push(newNotif.link);
                }
                Swal.close();
              });
            }
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, router]);

  return null; // This component doesn't render anything visible
}
