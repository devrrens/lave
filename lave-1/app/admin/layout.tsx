import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // Server-side auth check
  return (
    <div className="min-h-screen bg-[#FFFCFA]">
      {session && <AdminSidebar />}
      <div className={session ? "lg:pl-64" : ""}>
        <div className={session ? "pt-16 lg:pt-0" : ""}>
          <main className={session ? "p-6 lg:p-8" : ""}>{children}</main>
        </div>
      </div>
    </div>
  );
}
