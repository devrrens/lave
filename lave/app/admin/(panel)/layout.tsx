import { redirect } from "next/navigation";
import { auth, signOut } from "@/lib/auth";
import { AdminNav } from "@/components/admin/AdminNav";

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");
  const role = (session.user as { role?: string }).role ?? "ADMIN";

  return (
    <div className="min-h-dvh bg-white text-[#3D3436]">
      <AdminNav role={role} email={session.user.email ?? "-"} />
      <div className="lg:pl-60">
        <div className="mx-auto max-w-6xl px-4 py-6 lg:px-8">
          <div className="mb-6 flex justify-end">
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/admin/login" });
              }}
            >
              <button
                type="submit"
                className="rounded-full border border-neutral-200 px-4 py-1.5 text-sm text-[#75696C]"
              >
                Keluar
              </button>
            </form>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
