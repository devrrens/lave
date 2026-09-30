import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { formatIDR } from "@/lib/format";
import { listProducts } from "@/lib/services/products";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { ProductRowActions } from "@/components/admin/ProductRowActions";
import { removeProduct } from "./actions";

export const dynamic = "force-dynamic";
export const metadata = { title: "Products" };

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string; page?: string }>;
}) {
  await requireAdmin("/admin/products");
  const sp = await searchParams;
  const { items, total, page, pageCount } = await listProducts({
    q: sp.q,
    status: sp.status,
    page: Number(sp.page ?? 1),
  });

  return (
    <main>
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Products ({total})</h1>
        <Link
          href="/admin/products/new"
          className="rounded-full bg-[#E8B7C6] px-4 py-2 text-sm font-medium"
        >
          + Produk
        </Link>
      </div>

      <form method="get" className="mt-4 flex flex-wrap gap-2">
        <input
          type="search"
          name="q"
          defaultValue={sp.q ?? ""}
          placeholder="Cari nama…"
          aria-label="Cari produk"
          className="rounded-[12px] border border-neutral-200 px-3 py-1.5 text-sm"
        />
        <select
          name="status"
          defaultValue={sp.status ?? ""}
          aria-label="Filter status"
          className="rounded-[12px] border border-neutral-200 px-3 py-1.5 text-sm"
        >
          <option value="">Semua status</option>
          <option value="DRAFT">Draft</option>
          <option value="PUBLISHED">Published</option>
          <option value="ARCHIVED">Archived</option>
        </select>
        <button type="submit" className="rounded-full border border-neutral-200 px-4 py-1.5 text-sm">
          Filter
        </button>
      </form>

      {items.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-neutral-200 bg-neutral-50 p-8 text-center">
          <p className="text-sm font-medium">Belum ada produk.</p>
          <p className="mt-1 text-sm text-[#75696C]">Tambahkan produk pertama Anda.</p>
          <Link
            href="/admin/products/new"
            className="mt-4 inline-block rounded-full bg-[#E8B7C6] px-4 py-2 text-sm font-medium"
          >
            Add Product
          </Link>
        </div>
      ) : (
        <div className="mt-4 overflow-x-auto rounded-2xl border border-neutral-200">
          <table className="w-full min-w-[800px] text-left text-sm">
            <thead>
              <tr className="border-b border-neutral-200 bg-neutral-50 text-xs text-[#75696C]">
                <th className="px-3 py-2">Produk</th>
                <th className="px-3 py-2">Kategori</th>
                <th className="px-3 py-2">Harga</th>
                <th className="px-3 py-2">Stok</th>
                <th className="px-3 py-2">Status</th>
                <th className="px-3 py-2">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {items.map((p) => {
                const stock = p.variants.reduce((s, v) => s + v.stock, 0);
                return (
                  <tr key={p.id} className="border-b border-neutral-100 last:border-0">
                    <td className="px-3 py-2">
                      <span className="font-medium">{p.name}</span>
                      <span className="block text-xs text-[#A99B9F]">
                        {p.slug}
                        {p.isFeatured && " · Featured"}
                        {p.isBestSeller && " · Best"}
                        {p.isNewArrival && " · New"}
                      </span>
                    </td>
                    <td className="px-3 py-2">{p.category?.name ?? "—"}</td>
                    <td className="px-3 py-2">
                      {formatIDR(p.discountPrice ?? p.price)}
                      {p.discountPrice != null && (
                        <span className="block text-xs text-[#A99B9F] line-through">
                          {formatIDR(p.price)}
                        </span>
                      )}
                    </td>
                    <td className="px-3 py-2">{stock}</td>
                    <td className="px-3 py-2 text-xs">{p.status}</td>
                    <td className="px-3 py-2">
                      <span className="flex flex-wrap items-center gap-2">
                        <Link
                          href={`/admin/products/${p.id}/edit`}
                          className="rounded-full border border-neutral-200 px-3 py-1 text-xs"
                        >
                          Edit
                        </Link>
                        <ProductRowActions id={p.id} status={p.status} />
                        <DeleteButton
                          label="Hapus"
                          confirmText={`Hapus ${p.name}?`}
                          action={removeProduct.bind(null, p.id)}
                        />
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {pageCount > 1 && (
        <div className="mt-4 flex items-center gap-3 text-sm">
          <span>
            Halaman {page} / {pageCount}
          </span>
          {page > 1 && <Link href={`?page=${page - 1}`} className="underline">← Prev</Link>}
          {page < pageCount && <Link href={`?page=${page + 1}`} className="underline">Next →</Link>}
        </div>
      )}
    </main>
  );
}
