"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { nanoid } from "nanoid";

/**
 * Create a new class (Teacher only).
 */
export async function createClass(teacherId: string, name: string, description?: string) {
  try {
    const code = nanoid(6).toUpperCase(); // Unique 6-char code

    const newClass = await prisma.class.create({
      data: {
        name,
        description,
        code,
        teacherId,
      },
    });

    revalidatePath("/teacher/dashboard");
    revalidatePath("/teacher/classes");
    return { success: true, class: newClass };
  } catch (error) {
    console.error("Failed to create class:", error);
    return { success: false, error: "Failed to create class" };
  }
}

import { createNotification } from "./notification.actions";

/**
 * Join a class using a code (Student only).
 */
export async function joinClass(userId: string, code: string) {
  try {
    const targetClass = await prisma.class.findUnique({
      where: { code: code.toUpperCase() },
      include: { teacher: true }
    });

    if (!targetClass) {
      return { success: false, error: "Class not found. Please check the code." };
    }

    if (!targetClass.isActive) {
      return { success: false, error: "This class is no longer active." };
    }

    const existingMember = await prisma.classMember.findUnique({
      where: {
        classId_userId: {
          classId: targetClass.id,
          userId,
        },
      },
    });

    if (existingMember) {
      return { success: false, error: "You are already a member of this class." };
    }

    await prisma.classMember.create({
      data: {
        classId: targetClass.id,
        userId,
      },
    });

    // Notify Student
    await createNotification({
      userId,
      title: "Successfully Joined!",
      message: `You are now a member of ${targetClass.name}.`,
      type: "CLASS",
      link: `/student/classes/${targetClass.id}`
    });

    // Notify Teacher
    await createNotification({
      userId: targetClass.teacherId,
      title: "New Student Enrolled",
      message: `A new student has joined your class: ${targetClass.name}.`,
      type: "SUCCESS",
      link: `/teacher/classes/${targetClass.id}`
    });

    revalidatePath("/student/dashboard");
    revalidatePath("/student/classes");
    return { success: true, className: targetClass.name };
  } catch (error) {
    console.error("Failed to join class:", error);
    return { success: false, error: "An unexpected error occurred." };
  }
}

/**
 * Get student's enrolled classes.
 */
export async function getStudentClasses(userId: string) {
  try {
    const memberships = await prisma.classMember.findMany({
      where: { userId },
      include: {
        class: {
          include: {
            teacher: {
              select: { name: true, avatar: true },
            },
            _count: {
              select: { members: true },
            },
          },
        },
      },
      orderBy: { joinedAt: "desc" },
    });

    return memberships.map((m) => m.class);
  } catch (error) {
    console.error("Failed to fetch student classes:", error);
    return [];
  }
}

/**
 * Get teacher's classes.
 */
export async function getTeacherClasses(teacherId: string) {
  try {
    const classes = await prisma.class.findMany({
      where: { teacherId },
      include: {
        _count: {
          select: { members: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return classes;
  } catch (error) {
    console.error("Failed to fetch teacher classes:", error);
    return [];
  }
}

/**
 * Get class details (Members, etc.)
 */
export async function getClassDetails(classId: string) {
  try {
    const classData = await prisma.class.findUnique({
      where: { id: classId },
      include: {
        teacher: { select: { name: true, avatar: true } },
        members: {
          include: {
            user: { select: { id: true, name: true, avatar: true, level: true, xp: true } },
          },
        },
        _count: { select: { members: true } },
      },
    });

    return classData;
  } catch (error) {
    console.error("Failed to fetch class details:", error);
    return null;
  }
}
