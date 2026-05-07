import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const quizzes = await prisma.quiz.findMany({ take: 1 })
  console.log("Quizzes check:", quizzes)
}

main()
  .catch(e => console.error("DEBUG ERROR:", e))
  .finally(async () => await prisma.$disconnect())
