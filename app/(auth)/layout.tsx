import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // If already logged in, redirect to dashboard
  const session = await getSession();
  if (session) {
    const role = session.user_metadata?.role ?? "STUDENT";
    redirect(role === "TEACHER" || role === "ADMIN" ? "/teacher/dashboard" : "/student/dashboard");
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 top-12 h-72 w-72 rounded-full bg-secondary/10 blur-3xl" />
        <div className="absolute -bottom-20 right-0 h-80 w-80 rounded-full bg-accent/10 blur-3xl" />
      </div>
      <div className="relative flex min-h-screen items-center justify-center px-4 py-8">
        <div className="w-full max-w-5xl">{children}</div>
      </div>
    </div>
  );
}
