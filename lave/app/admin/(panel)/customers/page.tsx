import { requireAdmin } from "@/lib/auth";
import { formatIDR } from "@/lib/format";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";
export const metadata = { title: "Customers" };

export default async function CustomersPage() {
  await requireAdmin("/admin/customers");
  const items = await db.customer.findMany({
    orderBy: { lastOrderAt: "desc" },
    take: 50,
  });

  return (
    <main>
      <h1 className="text-xl font-semibold">Customers ({items.length})</h1>
      {items.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-neutral-200 bg-neutral-50 p-8 text-center">
          <p className="text-sm font-medium">Belum ada customer.</p>
          <p className="mt-1 text-sm text-[#75696C]">Customer tercatat otomatis dari order.</p>
        </div>
      ) : (
        <div className="mt-4 overflow-x-auto rounded-2xl border border-neutral-200">
          <table className="w-full min-w-[680px] text-left text-sm">
            <thead>
              <tr className="border-b border-neutral-200 bg-neutral-50 text-xs text-[#75696C]">
                <th className="px-3 py-2">Nama</th>
                <th className="px-3 py-2">WhatsApp</th>
                <th className="px-3 py-2">Order</th>
                <th className="px-3 py-2">Belanja</th>
                <th className="px-3 py-2">Terakhir</th>
              </tr>
            </thead>
            <tbody>
              {items.map((c) => (
                <tr key={c.id} className="border-b border-neutral-100 last:border-0">
                  <td className="px-3 py-2 font-medium">{c.name}</td>
                  <td className="px-3 py-2">{c.whatsapp}</td>
                  <td className="px-3 py-2">{c.totalOrders}</td>
                  <td className="px-3 py-2">{formatIDR(c.totalSpent)}</td>
                  <td className="px-3 py-2 text-xs text-[#75696C]">
                    {c.lastOrderAt
                      ? new Date(c.lastOrderAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })
                      : "—"}
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
