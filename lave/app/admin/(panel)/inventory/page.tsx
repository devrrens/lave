import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { formatIDR } from "@/lib/format";
import { STOCK_LABEL, stockStatus } from "@/lib/inventory";
import { cn } from "@/lib/utils";
import { inventorySummary, listVariants } from "@/lib/services/variants";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { StockAdjuster } from "@/components/admin/StockAdjuster";
import { removeVariant } from "./actions";

export const dynamic = "force-dynamic";
export const metadata = { title: "Inventory" };

const STATUS_STYLE: Record<string, string> = {
  IN_STOCK: "bg-green-50 text-[#7A9B82]",
  LOW_STOCK: "bg-yellow-50 text-[#C79B55]",
  OUT_OF_STOCK: "bg-red-50 text-[#B86A72]",
};

export default async function InventoryPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string; product?: string; page?: string }>;
}) {
  await requireAdmin("/admin/inventory");
  const sp = await searchParams;
  const status = ["IN_STOCK", "LOW_STOCK", "OUT_OF_STOCK"].includes(sp.status ?? "")
    ? (sp.status as "IN_STOCK" | "LOW_STOCK" | "OUT_OF_STOCK")
    : "";
  const [{ items, total, page, pageCount }, summary] = await Promise.all([
    listVariants({
      q: sp.q,
      status,
      productId: sp.product || undefined,
      page: Number(sp.page ?? 1),
    }),
    inventorySummary(),
  ]);

  return (
    <main>
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Inventory ({total})</h1>
        <Link
          href="/admin/inventory/new"
          className="rounded-full bg-[#E8B7C6] px-4 py-2 text-sm font-medium"
        >
          + Varian
        </Link>
      </div>

      <section aria-label="Ringkasan stok" className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          ["Total varian", String(summary.total)],
          ["Tersedia", String(summary.ok)],
          ["Menipis ≤5", String(summary.low)],
          ["Habis", String(summary.out)],
        ].map(([label, value]) => (
          <div key={label} className="rounded-2xl border border-neutral-200 p-3">
            <p className="text-xs text-[#75696C]">{label}</p>
            <p className="mt-1 text-xl font-semibold">{value}</p>
          </div>
        ))}
      </section>

      <form method="get" className="mt-4 flex flex-wrap gap-2">
        <input
          type="search"
          name="q"
          defaultValue={sp.q ?? ""}
          placeholder="Cari SKU / warna / produk…"
          aria-label="Cari varian"
          className="rounded-[12px] border border-neutral-200 px-3 py-1.5 text-sm"
        />
        <select
          name="status"
          defaultValue={status}
          aria-label="Filter status stok"
          className="rounded-[12px] border border-neutral-200 px-3 py-1.5 text-sm"
        >
          <option value="">Semua status</option>
          <option value="IN_STOCK">Tersedia</option>
          <option value="LOW_STOCK">Menipis</option>
          <option value="OUT_OF_STOCK">Habis</option>
        </select>
        <button type="submit" className="rounded-full border border-neutral-200 px-4 py-1.5 text-sm">
          Filter
        </button>
      </form>

      {items.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-neutral-200 bg-neutral-50 p-8 text-center">
          <p className="text-sm font-medium">Belum ada varian.</p>
          <p className="mt-1 text-sm text-[#75696C]">Tambahkan varian warna/ukuran per produk.</p>
          <Link
            href="/admin/inventory/new"
            className="mt-4 inline-block rounded-full bg-[#E8B7C6] px-4 py-2 text-sm font-medium"
          >
            Tambah varian
          </Link>
        </div>
      ) : (
        <div className="mt-4 overflow-x-auto rounded-2xl border border-neutral-200">
          <table className="w-full min-w-[820px] text-left text-sm">
            <thead>
              <tr className="border-b border-neutral-200 bg-neutral-50 text-xs text-[#75696C]">
                <th className="px-3 py-2">Produk / Varian</th>
                <th className="px-3 py-2">SKU</th>
                <th className="px-3 py-2">Harga</th>
                <th className="px-3 py-2">Stok</th>
                <th className="px-3 py-2">Status</th>
                <th className="px-3 py-2">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {items.map((v) => {
                const st = stockStatus(v.stock);
                return (
                  <tr key={v.id} className="border-b border-neutral-100 last:border-0">
                    <td className="px-3 py-2">
                      <span className="font-medium">{v.product.name}</span>
                      <span className="block text-xs text-[#A99B9F]">
                        {v.color} / {v.size}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-xs">{v.sku}</td>
                    <td className="px-3 py-2">{formatIDR(v.discountPrice ?? v.price)}</td>
                    <td className="px-3 py-2">
                      <StockAdjuster variantId={v.id} stock={v.stock} />
                    </td>
                    <td className="px-3 py-2">
                      <span
                        className={cn(
                          "rounded-full px-2.5 py-1 text-xs font-medium",
                          STATUS_STYLE[st]
                        )}
                      >
                        {STOCK_LABEL[st]}
                      </span>
                    </td>
                    <td className="px-3 py-2">
                      <span className="flex items-center gap-2">
                        <Link
                          href={`/admin/inventory/${v.id}/edit`}
                          className="rounded-full border border-neutral-200 px-3 py-1 text-xs"
                        >
                          Edit
                        </Link>
                        <DeleteButton
                          label="Hapus"
                          confirmText={`Hapus varian ${v.color}/${v.size} (${v.sku})?`}
                          action={removeVariant.bind(null, v.id)}
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
        <p className="mt-4 text-sm">Halaman {page} / {pageCount}</p>
      )}
    </main>
  );
}
