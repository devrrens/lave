import Link from "next/link";
import {
  AlertTriangle,
  Hourglass,
  ShoppingBag,
  Trophy,
  Wallet,
} from "lucide-react";
import { requireAdmin } from "@/lib/auth";
import { formatIDR } from "@/lib/format";
import {
  LOW_STOCK_THRESHOLD,
  getDashboardStats,
} from "@/lib/services/dashboard";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Dashboard",
};

export default async function AdminDashboardPage() {
  await requireAdmin("/admin");
  const stats = await getDashboardStats();

  const cards = [
    { label: "Revenue hari ini", value: formatIDR(stats.todayRevenue), icon: Wallet },
    { label: "Order hari ini", value: String(stats.todayOrders), icon: ShoppingBag },
    { label: "Pending", value: String(stats.pendingOrders), icon: Hourglass },
    { label: "Produk terjual hari ini", value: String(stats.productsSoldToday), icon: Trophy },
  ];

  return (
    <main>
      <h1 className="text-xl font-semibold">Dashboard</h1>

      <section aria-label="Ringkasan" className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <div key={c.label} className="rounded-2xl border border-neutral-200 bg-white p-4">
              <div className="flex items-center gap-2 text-[#75696C]">
                <Icon className="h-4 w-4" />
                <p className="text-xs">{c.label}</p>
              </div>
              <p className="mt-2 text-xl font-semibold">{c.value}</p>
            </div>
          );
        })}
      </section>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <section aria-label="Stok menipis" className="rounded-2xl border border-neutral-200 p-4">
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-sm font-semibold">
              <AlertTriangle className="h-4 w-4 text-[#C79B55]" />
              Stok menipis (≤ {LOW_STOCK_THRESHOLD})
            </h2>
            <Link href="/admin/inventory" className="text-sm text-[#75696C] underline">
              Inventory
            </Link>
          </div>
          {stats.lowStock.length === 0 ? (
            <p className="mt-4 text-sm text-[#75696C]">Semua stok aman.</p>
          ) : (
            <ul className="mt-4 divide-y divide-neutral-100 text-sm">
              {stats.lowStock.map((v) => (
                <li key={v.id} className="flex items-center justify-between py-2">
                  <span className="truncate">
                    {v.product.name} · {v.color} / {v.size}
                    <span className="ml-2 text-xs text-[#A99B9F]">{v.sku}</span>
                  </span>
                  <span
                    className={
                      v.stock === 0
                        ? "font-semibold text-[#B86A72]"
                        : "font-semibold text-[#C79B55]"
                    }
                  >
                    {v.stock === 0 ? "Habis" : `${v.stock} pcs`}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section aria-label="Produk terlaris" className="rounded-2xl border border-neutral-200 p-4">
          <h2 className="text-sm font-semibold">Produk terlaris</h2>
          {stats.bestSellers.length === 0 ? (
            <p className="mt-4 text-sm text-[#75696C]">Belum ada penjualan.</p>
          ) : (
            <ol className="mt-4 space-y-2 text-sm">
              {stats.bestSellers.map((b, i) => (
                <li key={b.productId} className="flex items-center justify-between">
                  <span className="truncate">
                    <span className="mr-2 text-[#A99B9F]">{i + 1}.</span>
                    {b.name}
                  </span>
                  <span className="font-medium">{b.sold} terjual</span>
                </li>
              ))}
            </ol>
          )}
        </section>
      </div>

      {stats.pendingOrders > 0 && (
        <Link
          href="/admin/orders"
          className="mt-6 block rounded-2xl bg-[#FBECEF] p-4 text-sm font-medium"
        >
          {stats.pendingOrders} order menunggu konfirmasi — lihat orders →
        </Link>
      )}
    </main>
  );
}
