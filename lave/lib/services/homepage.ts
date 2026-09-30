import { db } from "@/lib/db";

export type HomeSection = {
  key: string;
  title: string | null;
  subtitle: string | null;
  imageUrl: string | null;
  ctaLabel: string | null;
  ctaUrl: string | null;
  isVisible: boolean;
};

const PRODUCT_INCLUDE = {
  category: { select: { name: true } },
  images: { orderBy: { sortOrder: "asc" as const }, take: 2 },
  variants: { select: { price: true, discountPrice: true, stock: true } },
};

export async function getHomepage() {
  const [sections, featured, newArrivals, bestGroups, testimonials] = await Promise.all([
    db.homepageSection.findMany({ orderBy: { sortOrder: "asc" } }),
    db.product.findMany({
      where: { status: "PUBLISHED", isFeatured: true },
      orderBy: { updatedAt: "desc" },
      take: 4,
      include: PRODUCT_INCLUDE,
    }),
    db.product.findMany({
      where: { status: "PUBLISHED", isNewArrival: true },
      orderBy: { createdAt: "desc" },
      take: 4,
      include: PRODUCT_INCLUDE,
    }),
    db.orderItem.groupBy({
      by: ["productId"],
      _sum: { quantity: true },
      where: { order: { status: { not: "CANCELLED" } } },
      orderBy: { _sum: { quantity: "desc" } },
      take: 4,
    }),
    db.testimonial.findMany({
      where: { published: true },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
      take: 3,
    }),
  ]);

  const sectionByKey = new Map(sections.map((s) => [s.key, s as HomeSection]));
  const section = (key: string): HomeSection | undefined => sectionByKey.get(key);

  let bestSellers: typeof featured = [];
  if (bestGroups.length > 0) {
    bestSellers = await db.product.findMany({
      where: { id: { in: bestGroups.map((g) => g.productId) }, status: "PUBLISHED" },
      include: PRODUCT_INCLUDE,
    });
    const rank = new Map(bestGroups.map((g, i) => [g.productId, i]));
    bestSellers.sort((a, b) => (rank.get(a.id) ?? 99) - (rank.get(b.id) ?? 99));
  }

  return { section, featured, newArrivals, bestSellers, testimonials };
}
