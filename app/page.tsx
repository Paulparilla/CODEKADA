import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  const role = session.user_metadata?.role ?? "STUDENT";
  redirect(role === "TEACHER" || role === "ADMIN" ? "/teacher/dashboard" : "/student/dashboard");
}
