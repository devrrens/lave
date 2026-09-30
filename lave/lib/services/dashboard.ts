import { db } from "@/lib/db";
import { LOW_STOCK_THRESHOLD } from "@/lib/inventory";

export { LOW_STOCK_THRESHOLD };

export async function getDashboardStats() {
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const [today, todayCount, pendingCount, sold, lowStock, bestGroups] =
    await Promise.all([
      db.order.aggregate({
        _sum: { total: true },
        where: { createdAt: { gte: startOfDay }, status: { not: "CANCELLED" } },
      }),
      db.order.count({
        where: { createdAt: { gte: startOfDay } },
      }),
      db.order.count({ where: { status: "PENDING" } }),
      db.orderItem.aggregate({
        _sum: { quantity: true },
        where: {
          order: { createdAt: { gte: startOfDay }, status: { not: "CANCELLED" } },
        },
      }),
      db.productVariant.findMany({
        where: { stock: { lte: LOW_STOCK_THRESHOLD } },
        orderBy: { stock: "asc" },
        take: 10,
        include: { product: { select: { name: true } } },
      }),
      db.orderItem.groupBy({
        by: ["productId"],
        _sum: { quantity: true },
        where: { order: { status: { not: "CANCELLED" } } },
        orderBy: { _sum: { quantity: "desc" } },
        take: 5,
      }),
    ]);

  const productIds = bestGroups.map((g) => g.productId);
  const products = productIds.length
    ? await db.product.findMany({
        where: { id: { in: productIds } },
        select: { id: true, name: true },
      })
    : [];
  const nameById = new Map(products.map((p) => [p.id, p.name]));
  const bestSellers = bestGroups.map((g) => ({
    productId: g.productId,
    name: nameById.get(g.productId) ?? "Produk dihapus",
    sold: g._sum.quantity ?? 0,
  }));

  return {
    todayRevenue: today._sum.total ?? 0,
    todayOrders: todayCount,
    pendingOrders: pendingCount,
    productsSoldToday: sold._sum.quantity ?? 0,
    lowStock,
    bestSellers,
  };
}
