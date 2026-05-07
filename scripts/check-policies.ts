import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const policies = await prisma.focusPolicy.findMany();
  console.log("Current Focus Policies:", JSON.stringify(policies, null, 2));
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
