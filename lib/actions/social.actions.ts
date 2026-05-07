"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function addComment(announcementId: string, authorId: string, content: string, classId: string) {
  try {
    await prisma.comment.create({
      data: {
        announcementId,
        authorId,
        content
      }
    });
    revalidatePath(`/teacher/classes/${classId}`);
    revalidatePath(`/student/classes/${classId}`);
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to post comment" };
  }
}

export async function toggleReaction(announcementId: string, userId: string, emoji: string, classId: string) {
  try {
    const existing = await prisma.reaction.findUnique({
      where: {
        announcementId_userId_emoji: {
          announcementId,
          userId,
          emoji
        }
      }
    });

    if (existing) {
      await prisma.reaction.delete({
        where: { id: existing.id }
      });
    } else {
      await prisma.reaction.create({
        data: {
          announcementId,
          userId,
          emoji
        }
      });
    }

    revalidatePath(`/teacher/classes/${classId}`);
    revalidatePath(`/student/classes/${classId}`);
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to toggle reaction" };
  }
}
