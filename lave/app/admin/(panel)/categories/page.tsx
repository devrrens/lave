import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { listCategories } from "@/lib/services/categories";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { removeCategory } from "./actions";

export const dynamic = "force-dynamic";
export const metadata = { title: "Categories" };

export default async function CategoriesPage() {
  await requireAdmin("/admin/categories");
  const items = await listCategories();

  return (
    <main>
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Categories ({items.length})</h1>
        <Link
          href="/admin/categories/new"
          className="rounded-full bg-[#E8B7C6] px-4 py-2 text-sm font-medium"
        >
          + Kategori
        </Link>
      </div>

      {items.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-neutral-200 bg-neutral-50 p-8 text-center">
          <p className="text-sm font-medium">Belum ada kategori.</p>
          <Link
            href="/admin/categories/new"
            className="mt-4 inline-block rounded-full bg-[#E8B7C6] px-4 py-2 text-sm font-medium"
          >
            Tambah kategori
          </Link>
        </div>
      ) : (
        <div className="mt-4 overflow-x-auto rounded-2xl border border-neutral-200">
          <table className="w-full min-w-[600px] text-left text-sm">
            <thead>
              <tr className="border-b border-neutral-200 bg-neutral-50 text-xs text-[#75696C]">
                <th className="px-3 py-2">Nama</th>
                <th className="px-3 py-2">Slug</th>
                <th className="px-3 py-2">Produk</th>
                <th className="px-3 py-2">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {items.map((c) => (
                <tr key={c.id} className="border-b border-neutral-100 last:border-0">
                  <td className="px-3 py-2 font-medium">{c.name}</td>
                  <td className="px-3 py-2 text-xs text-[#A99B9F]">{c.slug}</td>
                  <td className="px-3 py-2">{c._count.products}</td>
                  <td className="px-3 py-2">
                    <span className="flex items-center gap-2">
                      <Link
                        href={`/admin/categories/${c.id}/edit`}
                        className="rounded-full border border-neutral-200 px-3 py-1 text-xs"
                      >
                        Edit
                      </Link>
                      <DeleteButton
                        label="Hapus"
                        confirmText={`Hapus kategori ${c.name}?`}
                        action={removeCategory.bind(null, c.id)}
                      />
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
