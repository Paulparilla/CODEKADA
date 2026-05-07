"use server";

import { prisma } from "@/lib/prisma";

/**
 * Get active exams for a student.
 * Active means isExamMode is true and it belongs to a class they are in.
 */
export async function getActiveExams(userId: string) {
  try {
    // 1. Get student's class IDs
    const memberships = await prisma.classMember.findMany({
      where: { userId },
      select: { classId: true },
    });

    const classIds = memberships.map((m) => m.classId);

    // 2. Find schedules marked as Exam for those classes or the user specifically
    const exams = await prisma.schedule.findMany({
      where: {
        isExamMode: true,
        OR: [
          { classId: { in: classIds } },
          { userId: userId },
        ],
      },
      include: {
        class: {
          select: { name: true },
        },
      },
      orderBy: { startTime: "asc" },
    });

    return exams;
  } catch (error) {
    console.error("Failed to fetch active exams:", error);
    return [];
  }
}
