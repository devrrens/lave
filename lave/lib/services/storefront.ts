import { db } from "@/lib/db";

const PER_PAGE = 12;

export type SortKey = "newest" | "popular" | "price-asc" | "price-desc";

export type CollectionParams = {
  q?: string;
  category?: string;
  color?: string;
  size?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  sort?: SortKey;
  page?: number;
};

export async function getStorefrontProducts(params: CollectionParams) {
  const page = Math.max(1, params.page ?? 1);
  const variantFilter = {
    ...(params.color ? { color: params.color } : {}),
    ...(params.size ? { size: params.size } : {}),
    ...(params.inStock ? { stock: { gt: 0 } } : {}),
    ...(params.minPrice != null || params.maxPrice != null
      ? {
          price: {
            ...(params.minPrice != null ? { gte: params.minPrice } : {}),
            ...(params.maxPrice != null ? { lte: params.maxPrice } : {}),
          },
        }
      : {}),
  };
  const hasVariantFilter = Object.keys(variantFilter).length > 0;

  const where = {
    status: "PUBLISHED" as const,
    ...(params.q ? { name: { contains: params.q } } : {}),
    ...(params.category ? { category: { slug: params.category } } : {}),
    ...(hasVariantFilter ? { variants: { some: variantFilter } } : {}),
  };

  const orderBy =
    params.sort === "price-asc"
      ? { price: "asc" as const }
      : params.sort === "price-desc"
        ? { price: "desc" as const }
        : params.sort === "popular"
          ? [{ isBestSeller: "desc" as const }, { createdAt: "desc" as const }]
          : { createdAt: "desc" as const };

  const [total, items, colors, sizes] = await Promise.all([
    db.product.count({ where }),
    db.product.findMany({
      where,
      orderBy,
      skip: (page - 1) * PER_PAGE,
      take: PER_PAGE,
      include: {
        category: { select: { name: true, slug: true } },
        images: { orderBy: { sortOrder: "asc" }, take: 2 },
        variants: { select: { price: true, discountPrice: true, stock: true } },
      },
    }),
    db.productVariant.findMany({
      where: { product: { status: "PUBLISHED" } },
      select: { color: true },
      distinct: ["color"],
      orderBy: { color: "asc" },
    }),
    db.productVariant.findMany({
      where: { product: { status: "PUBLISHED" } },
      select: { size: true },
      distinct: ["size"],
      orderBy: { size: "asc" },
    }),
  ]);

  return {
    items,
    total,
    page,
    perPage: PER_PAGE,
    pageCount: Math.max(1, Math.ceil(total / PER_PAGE)),
    colors: colors.map((c) => c.color),
    sizes: sizes.map((s) => s.size),
  };
}

export async function getProductBySlug(slug: string) {
  return db.product.findFirst({
    where: { slug, status: "PUBLISHED" },
    include: {
      category: { select: { name: true, slug: true } },
      images: { orderBy: { sortOrder: "asc" } },
      variants: { orderBy: [{ color: "asc" }, { size: "asc" }] },
    },
  });
}

export async function getRelatedProducts(productId: string, categoryId: string | null) {
  return db.product.findMany({
    where: {
      status: "PUBLISHED",
      id: { not: productId },
      ...(categoryId ? { categoryId } : {}),
    },
    orderBy: { createdAt: "desc" },
    take: 4,
    include: {
      category: { select: { name: true } },
      images: { orderBy: { sortOrder: "asc" }, take: 1 },
      variants: { select: { price: true, discountPrice: true, stock: true } },
    },
  });
}

export async function getStorefrontCategories() {
  return db.category.findMany({
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    include: { _count: { select: { products: { where: { status: "PUBLISHED" } } } } },
  });
}

export async function getSetting(key: string): Promise<string | null> {
  const s = await db.storeSetting.findUnique({ where: { key } });
  return s?.value ?? null;
}

export async function getPublicSettings() {
  const rows = await db.storeSetting.findMany();
  return Object.fromEntries(rows.map((r) => [r.key, r.value]));
}
