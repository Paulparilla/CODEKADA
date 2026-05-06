import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import * as dotenv from "dotenv";

dotenv.config();

const prisma = new PrismaClient();

async function seedPrismaOnly() {
  const password = "123456";
  const hashedPassword = await bcrypt.hash(password, 10);

  const users = [
    {
      email: "student.focus@forge.app",
      name: "Test Student",
      role: "STUDENT" as const,
    },
    {
      email: "teacher.focus@forge.app",
      name: "Test Teacher",
      role: "TEACHER" as const,
    },
  ];

  for (const user of users) {
    console.log(`Upserting Prisma record for: ${user.email}...`);
    try {
      await prisma.user.upsert({
        where: { email: user.email },
        update: {
          password: hashedPassword,
          name: user.name,
          role: user.role,
        },
        create: {
          id: uuidv4(),
          email: user.email,
          password: hashedPassword,
          name: user.name,
          role: user.role,
        },
      });
      console.log(`Successfully created/updated ${user.email} in Prisma.`);
    } catch (err) {
      console.error(`Error for ${user.email}:`, err);
    }
  }

  await prisma.$disconnect();
}

seedPrismaOnly();
