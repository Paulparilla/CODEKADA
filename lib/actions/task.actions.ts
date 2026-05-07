"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

/**
 * Mark a schedule/task as completed and award XP.
 */
export async function completeTask(userId: string, scheduleId: string) {
  try {
    // 1. Check if already completed
    const existingSession = await prisma.studySession.findFirst({
      where: {
        userId,
        scheduleId,
        status: "COMPLETED"
      }
    });

    if (existingSession) {
      return { success: false, error: "Task already completed" };
    }

    // 2. Create a completed study session for this task
    const xpAwarded = 150; // Standard XP for task completion
    
    await prisma.studySession.create({
      data: {
        userId,
        scheduleId,
        status: "COMPLETED",
        xpEarned: xpAwarded,
        startedAt: new Date(),
        endedAt: new Date(),
        plannedDuration: 0,
        actualDuration: 0,
        completedAt: new Date(),
      }
    });

    // 3. Update user XP and Level
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { xp: true }
    });

    if (user) {
      const newXp = user.xp + xpAwarded;
      const newLevel = Math.floor(newXp / 1000) + 1;

      await prisma.user.update({
        where: { id: userId },
        data: {
          xp: newXp,
          level: newLevel,
        }
      });
    }

    revalidatePath("/student/pomodoro");
    return { success: true, xpEarned: xpAwarded };
  } catch (error) {
    console.error("Failed to complete task:", error);
    return { success: false, error: "Internal server error" };
  }
}
