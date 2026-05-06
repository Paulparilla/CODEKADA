import { createClient } from "@supabase/supabase-js";
import { PrismaClient } from "@prisma/client";
import * as dotenv from "dotenv";

dotenv.config();

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

const prisma = new PrismaClient();

async function fixIds() {
  console.log("Checking ID sync between Supabase Auth and Prisma...\n");

  // 1. List all auth users
  const { data: authData, error } = await supabaseAdmin.auth.admin.listUsers();
  if (error) { console.error("Error listing auth users:", error.message); return; }

  const emails = ["student.focus@forge.app", "teacher.focus@forge.app"];

  for (const email of emails) {
    const authUser = authData.users.find((u) => u.email === email);
    if (!authUser) { console.log(`✗ ${email}: NOT found in Supabase Auth`); continue; }

    const prismaUser = await prisma.user.findUnique({ where: { email } });
    
    console.log(`→ ${email}`);
    console.log(`  Auth ID:   ${authUser.id}`);
    console.log(`  Prisma ID: ${prismaUser?.id ?? "NOT FOUND"}`);

    if (!prismaUser) {
      console.log(`  ✗ Missing Prisma record — this should not happen.`);
      continue;
    }

    if (prismaUser.id !== authUser.id) {
      console.log(`  ⚠ ID MISMATCH — fixing...`);
      // Delete old record and recreate with correct ID
      await prisma.user.delete({ where: { email } });
      await prisma.user.create({
        data: {
          ...prismaUser,
          id: authUser.id, // Use the correct Supabase Auth ID
        },
      });
      console.log(`  ✓ Fixed! Prisma ID now matches Auth ID.`);
    } else {
      console.log(`  ✓ IDs are in sync.`);
    }
  }

  await prisma.$disconnect();
  console.log("\nDone.");
}

fixIds();
