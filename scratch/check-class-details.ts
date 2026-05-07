import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const classId = "388b4f25-18ee-471d-ab07-53d5a23c0d1e"
  const classData = await prisma.class.findUnique({
    where: { id: classId },
    include: {
        teacher: { select: { id: true, name: true, avatar: true } },
        members: {
          include: {
            user: { select: { id: true, name: true, avatar: true, level: true, xp: true } },
          },
          orderBy: { joinedAt: "desc" }
        },
        announcements: {
          include: { author: { select: { name: true, avatar: true } } },
          orderBy: { createdAt: "desc" }
        },
        assignments: {
          orderBy: { createdAt: "desc" }
        },
        documents: {
          orderBy: { createdAt: "desc" }
        },
        _count: { select: { members: true } },
      },
  })
  console.log("Class Data with includes:", JSON.stringify(classData, null, 2))
}

main()
  .catch(e => console.error("DEBUG ERROR:", e))
  .finally(async () => await prisma.$disconnect())
