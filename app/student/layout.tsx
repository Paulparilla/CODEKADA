import { requireAuth } from "@/lib/auth";
import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";
import Footer from "@/components/layout/Footer";

export default async function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Server-side role guard — redirects if not a STUDENT
  const user = await requireAuth(["STUDENT"]);

  return (
    <div className="min-h-screen bg-background text-foreground flex">
      {/* Sidebar - Desktop Only */}
      <Sidebar role="STUDENT" />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:pl-72 min-h-screen">
        <Topbar user={user} />
        
        <main className="flex-1 p-4 md:p-8 animate-in fade-in duration-500">
          {children}
        </main>

        <Footer />
      </div>
    </div>
  );
}
