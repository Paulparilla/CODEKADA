"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Generate a quiz using AI (OpenAI).
 */
export async function generateAIQuiz(params: {
  classId: string;
  topic: string;
  questionCount: number;
  type: "MCQ" | "FILL_IN_BLANKS" | "ESSAY";
}) {
  try {
    const prompt = `Generate a educational quiz about "${params.topic}".
    Number of questions: ${params.questionCount}
    Type: ${params.type}
    
    Return the response ONLY as a JSON object in this exact format:
    {
      "title": "A catchy title for the quiz",
      "description": "A short description of what the quiz covers",
      "questions": [
        {
          "content": "The question text",
          "options": ["Option A", "Option B", "Option C", "Option D"], // Only if MCQ, else null
          "correctAnswer": "The exact correct answer",
          "explanation": "Brief explanation of why it's correct"
        }
      ]
    }`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are an expert academic assistant. Strictly generate the EXACT number of questions requested." },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" }
    });

    const quizData = JSON.parse(completion.choices[0].message.content || "{}");
    const actualQuestionCount = quizData.questions?.length || 0;

    const classData = await prisma.class.findUnique({
      where: { id: params.classId },
      select: { teacherId: true }
    });

    // Create the Quiz in DB
    const newQuiz = await prisma.quiz.create({
      data: {
        classId: params.classId,
        title: quizData.title || "Untitled AI Quiz",
        description: quizData.description || "No description provided.",
        xpReward: actualQuestionCount * 25,
        questions: {
          create: (quizData.questions || []).map((q: any) => ({
            content: q.content,
            type: params.type,
            options: q.options,
            correctAnswer: q.correctAnswer,
            explanation: q.explanation
          }))
        }
      }
    });

    // Post to the Wall automatically
    if (classData) {
      await prisma.announcement.create({
        data: {
          classId: params.classId,
          authorId: classData.teacherId,
          content: `🚀 New AI Quiz Published: **${newQuiz.title}**! Test your knowledge with ${actualQuestionCount} questions and earn up to ${newQuiz.xpReward} XP.`,
          type: "QUIZ",
          attachmentId: newQuiz.id
        }
      });
    }

    revalidatePath(`/teacher/classes/${params.classId}`);
    revalidatePath(`/student/classes/${params.classId}`);
    
    return { success: true, quizId: newQuiz.id };
  } catch (error) {
    console.error("AI Quiz Generation Failed:", error);
    return { success: false, error: "Failed to generate AI quiz" };
  }
}

/**
 * Submit a quiz attempt and reward XP.
 */
export async function submitQuizAttempt(params: {
  userId: string;
  quizId: string;
  score: number;
  totalQuestions: number;
}) {
  try {
    const xpEarned = Math.round((params.score / params.totalQuestions) * 250); // Max 250 XP per quiz

    const submission = await prisma.quizSubmission.create({
      data: {
        userId: params.userId,
        quizId: params.quizId,
        score: params.score,
        totalQuestions: params.totalQuestions,
        xpEarned
      }
    });

    // Update User XP and Level
    const user = await prisma.user.findUnique({ where: { id: params.userId } });
    if (user) {
      const newXp = user.xp + xpEarned;
      const newLevel = Math.floor(newXp / 1000) + 1; // Basic level logic

      await prisma.user.update({
        where: { id: params.userId },
        data: {
          xp: newXp,
          level: newLevel
        }
      });
    }

    revalidatePath("/student/dashboard");
    return { success: true, xpEarned, submissionId: submission.id };
  } catch (error) {
    console.error("Quiz submission failed:", error);
    return { success: false, error: "Failed to submit quiz" };
  }
}
