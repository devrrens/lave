import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { listHomepageSections } from "@/lib/services/homepage-admin";

export const dynamic = "force-dynamic";
export const metadata = { title: "Homepage" };

export default async function HomepageAdminPage() {
  await requireAdmin("/admin/homepage");
  const items = await listHomepageSections();

  return (
    <main>
      <h1 className="text-xl font-semibold">Homepage</h1>
      <p className="mt-1 text-sm text-[#75696C]">
        Edit konten tiap section tanpa ubah kode. Perubahan langsung tampil di homepage.
      </p>
      {items.length === 0 ? (
        <p className="mt-6 text-sm text-[#75696C]">
          Section belum di-seed. Jalankan <span className="font-mono">npm run db:seed</span>.
        </p>
      ) : (
        <ul className="mt-4 space-y-3">
          {items.map((s) => (
            <li key={s.key} className="flex items-center justify-between gap-3 rounded-2xl border border-neutral-200 p-4">
              <div>
                <p className="text-sm font-semibold">{s.title || s.key}</p>
                <p className="text-xs text-[#A99B9F]">
                  key: <span className="font-mono">{s.key}</span> · {s.isVisible ? "Tampil" : "Disembunyikan"}
                </p>
              </div>
              <Link
                href={`/admin/homepage/${s.key}/edit`}
                className="shrink-0 rounded-full border border-neutral-200 px-4 py-1.5 text-sm"
              >
                Edit
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
