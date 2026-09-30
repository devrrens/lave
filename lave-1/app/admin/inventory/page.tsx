export const runtime = 'edge';
import { db } from "@/lib/db";
import { InventoryClient } from "@/components/admin/InventoryClient";

export default async function InventoryPage() {
  const variants = await db.productVariant.findMany({
    include: {
      product: {
        include: {
          category: { select: { name: true } },
          images: { orderBy: { order: "asc" }, take: 1 },
        },
      },
    },
    orderBy: { stock: "asc" },
  });

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-[#3D3436]">Stok & Inventaris</h1>
        <p className="text-sm text-[#75696C] mt-1">Kelola stok semua varian produk</p>
      </div>
      <InventoryClient variants={variants} />
    </div>
  );
}
