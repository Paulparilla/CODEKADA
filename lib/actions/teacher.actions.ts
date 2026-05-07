"use server";

import { prisma } from "@/lib/prisma";

export async function getTeacherClasses(teacherId: string) {
  try {
    const classes = await prisma.class.findMany({
      where: { teacherId },
      select: {
        id: true,
        name: true,
        code: true,
        _count: {
          select: { members: true }
        }
      },
      orderBy: { name: "asc" }
    });
    return classes;
  } catch (error) {
    console.error("Failed to fetch teacher classes:", error);
    return [];
  }
}
