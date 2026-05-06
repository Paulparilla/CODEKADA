import { createClient } from "@supabase/supabase-js";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import * as dotenv from "dotenv";

dotenv.config();

const prisma = new PrismaClient();
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function seed() {
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
    console.log(`Creating user: ${user.email}...`);

    // 1. Create in Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email: user.email,
      password: password,
      options: {
        data: {
          name: user.name,
          role: user.role,
        },
      },
    });

    if (error) {
      console.error(`Supabase error for ${user.email}:`, error.message);
      // Continue if user already exists
    }

    if (data.user) {
      // 2. Create in Prisma
      try {
        await prisma.user.upsert({
          where: { email: user.email },
          update: {
            password: hashedPassword,
            role: user.role,
            name: user.name,
          },
          create: {
            id: data.user.id,
            email: user.email,
            password: hashedPassword,
            name: user.name,
            role: user.role,
          },
        });
        console.log(`Successfully created/updated ${user.email}`);
      } catch (prismaError) {
        console.error(`Prisma error for ${user.email}:`, prismaError);
      }
    }
  }

  await prisma.$disconnect();
}

seed();
