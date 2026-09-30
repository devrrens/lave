import { db } from "@/lib/db";
import { OrderListClient } from "@/components/admin/OrderListClient";

export default async function OrdersPage() {
  const orders = await db.order.findMany({
    include: {
      customer: true,
      items: {
        include: {
          variant: {
            include: { product: true },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-[#3D3436]">Pesanan</h1>
        <p className="text-sm text-[#75696C] mt-1">Daftar transaksi dan pesanan masuk</p>
      </div>
      <OrderListClient orders={orders} />
    </div>
  );
}
