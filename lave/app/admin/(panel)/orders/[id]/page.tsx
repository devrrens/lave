import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { formatIDR } from "@/lib/format";
import { getOrder } from "@/lib/services/orders";
import { OrderStatusForm } from "@/components/admin/OrderStatusForm";

export const dynamic = "force-dynamic";
export const metadata = { title: "Detail Order" };

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin("/admin/orders");
  const { id } = await params;
  const order = await getOrder(id);
  if (!order) notFound();

  return (
    <main>
      <h1 className="font-mono text-xl font-semibold">{order.reference}</h1>
      <p className="mt-1 text-sm text-[#75696C]">
        {new Date(order.createdAt).toLocaleString("id-ID")} · Status:{" "}
        <span className="font-semibold text-[#3D3436]">{order.status}</span>
      </p>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <section aria-label="Customer" className="rounded-[16px] border border-neutral-200 p-4">
            <h2 className="text-sm font-semibold">Customer</h2>
            <dl className="mt-2 space-y-1 text-sm">
              <div className="flex gap-2"><dt className="w-20 text-[#75696C]">Nama</dt><dd>{order.customerName}</dd></div>
              <div className="flex gap-2"><dt className="w-20 text-[#75696C]">WA</dt><dd>{order.customerWhats}</dd></div>
              <div className="flex gap-2"><dt className="w-20 text-[#75696C]">Alamat</dt><dd>{order.customerAddress}</dd></div>
              {order.customerNotes && (
                <div className="flex gap-2"><dt className="w-20 text-[#75696C]">Catatan</dt><dd>{order.customerNotes}</dd></div>
              )}
              {order.customer && (
                <div className="flex gap-2">
                  <dt className="w-20 text-[#75696C]">Riwayat</dt>
                  <dd>{order.customer.totalOrders} order · {formatIDR(order.customer.totalSpent)}</dd>
                </div>
              )}
            </dl>
          </section>

          <section aria-label="Items" className="rounded-[16px] border border-neutral-200 p-4">
            <h2 className="text-sm font-semibold">Items ({order.items.length})</h2>
            <ul className="mt-2 divide-y divide-neutral-100 text-sm">
              {order.items.map((i) => (
                <li key={i.id} className="flex justify-between gap-3 py-2">
                  <span>
                    {i.name}
                    {i.variantLab && <span className="text-[#75696C]"> ({i.variantLab})</span>}
                    <span className="block text-xs text-[#A99B9F]">{i.sku} · {formatIDR(i.price)} x{i.quantity}</span>
                  </span>
                  <span className="font-medium">{formatIDR(i.subtotal)}</span>
                </li>
              ))}
            </ul>
            <dl className="mt-2 space-y-1 border-t border-neutral-200 pt-2 text-sm">
              <div className="flex justify-between"><dt>Subtotal</dt><dd>{formatIDR(order.subtotal)}</dd></div>
              <div className="flex justify-between"><dt>Diskon</dt><dd>{formatIDR(order.discount)}</dd></div>
              <div className="flex justify-between font-semibold"><dt>Total</dt><dd>{formatIDR(order.total)}</dd></div>
            </dl>
          </section>
        </div>

        <div>
          <OrderStatusForm id={order.id} current={order.status} notes={order.adminNotes} />
        </div>
      </div>
    </main>
  );
}
