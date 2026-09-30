import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { formatIDR } from "@/lib/format";
import { listOrders } from "@/lib/services/orders";

export const dynamic = "force-dynamic";
export const metadata = { title: "Orders" };

const STATUSES = ["PENDING", "CONFIRMED", "PROCESSING", "PACKED", "SHIPPED", "COMPLETED", "CANCELLED"];

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string; page?: string }>;
}) {
  await requireAdmin("/admin/orders");
  const sp = await searchParams;
  const { items, total, page, pageCount } = await listOrders({
    q: sp.q,
    status: sp.status,
    page: Number(sp.page ?? 1),
  });

  return (
    <main>
      <h1 className="text-xl font-semibold">Orders ({total})</h1>

      <form method="get" className="mt-4 flex flex-wrap gap-2">
        <input
          type="search"
          name="q"
          defaultValue={sp.q ?? ""}
          placeholder="Cari ref / nama / WA…"
          aria-label="Cari order"
          className="rounded-[12px] border border-neutral-200 px-3 py-1.5 text-sm"
        />
        <select
          name="status"
          defaultValue={sp.status ?? ""}
          aria-label="Filter status"
          className="rounded-[12px] border border-neutral-200 px-3 py-1.5 text-sm"
        >
          <option value="">Semua status</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <button type="submit" className="rounded-full border border-neutral-200 px-4 py-1.5 text-sm">
          Filter
        </button>
      </form>

      {items.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-neutral-200 bg-neutral-50 p-8 text-center">
          <p className="text-sm font-medium">Belum ada order.</p>
        </div>
      ) : (
        <div className="mt-4 overflow-x-auto rounded-2xl border border-neutral-200">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead>
              <tr className="border-b border-neutral-200 bg-neutral-50 text-xs text-[#75696C]">
                <th className="px-3 py-2">Referensi</th>
                <th className="px-3 py-2">Customer</th>
                <th className="px-3 py-2">Item</th>
                <th className="px-3 py-2">Total</th>
                <th className="px-3 py-2">Status</th>
                <th className="px-3 py-2">Tanggal</th>
              </tr>
            </thead>
            <tbody>
              {items.map((o) => (
                <tr key={o.id} className="border-b border-neutral-100 last:border-0">
                  <td className="px-3 py-2">
                    <Link href={`/admin/orders/${o.id}`} className="font-mono text-xs font-semibold underline">
                      {o.reference}
                    </Link>
                  </td>
                  <td className="px-3 py-2">
                    {o.customerName}
                    <span className="block text-xs text-[#A99B9F]">{o.customerWhats}</span>
                  </td>
                  <td className="px-3 py-2">{o._count.items}</td>
                  <td className="px-3 py-2 font-medium">{formatIDR(o.total)}</td>
                  <td className="px-3 py-2 text-xs">{o.status}</td>
                  <td className="px-3 py-2 text-xs text-[#75696C]">
                    {new Date(o.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                  </td>
                </tr>
              ))}
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
