import { auth } from "@/lib/auth";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // Middleware is the main gatekeeper.
  // If user is accessing /admin/login or unauthenticated, let middleware handle routing.
  if (!session) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-[#FFFCFA]">
      <AdminSidebar />
      <div className="lg:pl-64">
        <div className="pt-16 lg:pt-0">
          <main className="p-6 lg:p-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
