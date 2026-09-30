import { db } from "@/lib/db";

export default async function CustomersPage() {
  const customers = await db.customer.findMany({
    include: {
      orders: {
        select: {
          total: true,
          status: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const customersWithStats = customers.map((c) => ({
    ...c,
    totalOrders: c.orders.length,
    totalSpent: c.orders.reduce((sum, o) => sum + o.total, 0),
    lastOrderDate: c.createdAt,
  }));

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-[#3D3436]">Pelanggan</h1>
        <p className="text-sm text-[#75696C] mt-1">Daftar pelanggan dan riwayat transaksi</p>
      </div>

      <div className="bg-white rounded-2xl border border-[#EDE2E5] overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#EDE2E5] bg-[#FFFCFA]">
              <th className="text-left px-5 py-3.5 text-[#75696C] font-medium">Nama</th>
              <th className="text-left px-5 py-3.5 text-[#75696C] font-medium hidden md:table-cell">
                WhatsApp
              </th>
              <th className="text-center px-5 py-3.5 text-[#75696C] font-medium">Total Pesanan</th>
              <th className="text-right px-5 py-3.5 text-[#75696C] font-medium">Total Belanja</th>
            </tr>
          </thead>
          <tbody>
            {customersWithStats.map((c) => (
              <tr key={c.id} className="border-b border-[#EDE2E5] last:border-0 hover:bg-[#FFFCFA]">
                <td className="px-5 py-4">
                  <span className="font-medium text-[#3D3436] block">{c.name}</span>
                  {c.email && (
                    <span className="text-xs text-[#A99B9F]">{c.email}</span>
                  )}
                </td>
                <td className="px-5 py-4 font-mono text-xs text-[#75696C] hidden md:table-cell">
                  +{c.whatsapp}
                </td>
                <td className="px-5 py-4 text-center">
                  <span className="inline-block px-2.5 py-0.5 bg-[#FBECEF] text-[#3D3436] rounded-full text-xs font-medium">
                    {c.totalOrders} order
                  </span>
                </td>
                <td className="px-5 py-4 text-right font-medium text-[#3D3436]">
                  Rp {c.totalSpent.toLocaleString("id-ID")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
