"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

interface SessionResult {
  userId: string;
  durationMinutes: number;
  xpEarned: number;
  status: "COMPLETED" | "FAILED";
}

/**
 * Record a completed study session and award XP.
 */
export async function completeSession(data: SessionResult) {
  try {
    const { userId, durationMinutes, xpEarned, status } = data;

    // 1. Create the session record
    const session = await prisma.studySession.create({
      data: {
        userId,
        startedAt: new Date(Date.now() - durationMinutes * 60000),
        endedAt: new Date(),
        plannedDuration: durationMinutes,
        actualDuration: durationMinutes,
        status: status,
        xpEarned,
      },
    });

    // 2. Update user XP and Level
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { xp: true, level: true },
    });

    if (user) {
      const newXp = user.xp + xpEarned;
      const newLevel = Math.floor(newXp / 1000) + 1; // Simple leveling: 1000 XP per level

      await prisma.user.update({
        where: { id: userId },
        data: {
          xp: newXp,
          level: newLevel,
          totalStudyTime: { increment: durationMinutes },
        },
      });
    }

    revalidatePath("/student/dashboard");
    return { success: true, session };
  } catch (error) {
    console.error("Failed to complete session:", error);
    return { success: false, error: "Database transaction failed" };
  }
}

/**
 * Log a penalty (e.g. for breaking focus).
 */
export async function logPenalty(userId: string, xpLost: number, reason: string) {
  try {
    await prisma.penalty.create({
      data: {
        userId,
        reason,
        xpLost,
        streakReset: true,
      },
    });

    await prisma.user.update({
      where: { id: userId },
      data: {
        xp: { decrement: xpLost },
        streak: 0,
      },
    });

    revalidatePath("/student/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Failed to log penalty:", error);
    return { success: false };
  }
}
