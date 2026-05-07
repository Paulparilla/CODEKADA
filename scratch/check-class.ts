import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const classId = "388b4f25-18ee-471d-ab07-53d5a23c0d1e"
  const classData = await prisma.class.findUnique({
    where: { id: classId },
  })
  console.log("Class Data:", classData)
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect())
