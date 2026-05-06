import { createClient } from "@supabase/supabase-js";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import * as dotenv from "dotenv";

dotenv.config();

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

const prisma = new PrismaClient();

const users = [
  { email: "student.focus@forge.app", name: "Test Student", role: "STUDENT" as const },
  { email: "teacher.focus@forge.app", name: "Test Teacher", role: "TEACHER" as const },
];

async function seedAdmin() {
  const password = "123456";
  const hashedPassword = await bcrypt.hash(password, 10);

  for (const user of users) {
    console.log(`\n→ Processing ${user.email}...`);

    // 1. Create in Supabase Auth using Admin API (bypasses rate limit & email validation)
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email: user.email,
      password: password,
      email_confirm: true, // Skip email confirmation
      user_metadata: { name: user.name, role: user.role },
    });

    if (error && !error.message.includes("already")) {
      console.error(`  ✗ Supabase Auth error:`, error.message);
      continue;
    }

    const authId = data?.user?.id;
    console.log(`  ✓ Supabase Auth: ${authId ? `Created (${authId})` : "Already exists"}`);

    // If user already existed, fetch their ID
    let userId = authId;
    if (!userId) {
      const { data: existing } = await supabaseAdmin.auth.admin.listUsers();
      const found = existing?.users.find((u) => u.email === user.email);
      userId = found?.id;
      console.log(`  ✓ Found existing auth user: ${userId}`);
    }

    if (!userId) {
      console.error(`  ✗ Could not resolve auth user ID for ${user.email}`);
      continue;
    }

    // 2. Upsert in Prisma with hashed password
    try {
      await prisma.user.upsert({
        where: { email: user.email },
        update: { password: hashedPassword, name: user.name, role: user.role },
        create: {
          id: userId,
          email: user.email,
          password: hashedPassword,
          name: user.name,
          role: user.role,
        },
      });
      console.log(`  ✓ Prisma record saved with hashed password.`);
    } catch (err: any) {
      console.error(`  ✗ Prisma error:`, err.message);
    }
  }

  console.log("\n✅ Seeding complete!");
  console.log("   Student Login: student.focus@forge.app / 123456");
  console.log("   Teacher Login: teacher.focus@forge.app / 123456");
  await prisma.$disconnect();
}

seedAdmin();
