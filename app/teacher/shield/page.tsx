import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getTeacherClasses } from "@/lib/actions/teacher.actions";
import ShieldMatrixHub from "@/components/teacher/shield/ShieldMatrixHub";

export const metadata = {
  title: "Shield Matrix | FocusForge",
  description: "Centralized website restriction management for educators.",
};

export default async function ShieldMatrixPage() {
  const supabase = await createClient();
  const { data: { user: authUser } } = await supabase.auth.getUser();

  if (!authUser) {
    redirect("/login");
  }

  // Double check role
  if (authUser.user_metadata?.role !== "TEACHER") {
    redirect("/dashboard");
  }

  const initialClasses = await getTeacherClasses(authUser.id);

  return <ShieldMatrixHub initialClasses={initialClasses} />;
}
