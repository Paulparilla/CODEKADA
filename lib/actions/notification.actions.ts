"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export type NotificationType = "INFO" | "SUCCESS" | "WARNING" | "ERROR" | "XP" | "CLASS" | "EXAM";

/**
 * Fetch notifications for a user.
 */
export async function getNotifications(userId: string) {
  try {
    const notifications = await prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 20,
    });
    return notifications;
  } catch (error) {
    console.error("Failed to fetch notifications:", error);
    return [];
  }
}

/**
 * Create a new notification.
 */
export async function createNotification(data: {
  userId: string;
  title: string;
  message: string;
  type?: NotificationType;
  link?: string;
}) {
  try {
    const notification = await prisma.notification.create({
      data: {
        userId: data.userId,
        title: data.title,
        message: data.message,
        type: data.type || "INFO",
        link: data.link,
      },
    });
    return notification;
  } catch (error) {
    console.error("Failed to create notification:", error);
    return null;
  }
}

/**
 * Mark a single notification as read.
 */
export async function markNotificationRead(notificationId: string) {
  try {
    await prisma.notification.update({
      where: { id: notificationId },
      data: { isRead: true },
    });
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Failed to mark notification read:", error);
    return { success: false };
  }
}

/**
 * Mark all notifications as read for a user.
 */
export async function markAllAsRead(userId: string) {
  try {
    await prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Failed to mark all notifications read:", error);
    return { success: false };
  }
}
