import { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import type { VariantInput } from "@/lib/validations/variant";

const PER_PAGE = 20;

export async function listVariants(opts: {
  q?: string;
  status?: "IN_STOCK" | "LOW_STOCK" | "OUT_OF_STOCK" | "";
  productId?: string;
  page?: number;
}) {
  const page = Math.max(1, opts.page ?? 1);
  const stockWhere =
    opts.status === "OUT_OF_STOCK"
      ? { lte: 0 }
      : opts.status === "LOW_STOCK"
        ? { gte: 1, lte: 5 }
        : opts.status === "IN_STOCK"
          ? { gt: 5 }
          : undefined;

  const where: Prisma.ProductVariantWhereInput = {
    ...(opts.productId ? { productId: opts.productId } : {}),
    ...(stockWhere ? { stock: stockWhere } : {}),
    ...(opts.q
      ? {
          OR: [
            { sku: { contains: opts.q } },
            { color: { contains: opts.q } },
            { product: { name: { contains: opts.q } } },
          ],
        }
      : {}),
  };

  const [total, items] = await Promise.all([
    db.productVariant.count({ where }),
    db.productVariant.findMany({
      where,
      orderBy: [{ stock: "asc" }, { updatedAt: "desc" }],
      skip: (page - 1) * PER_PAGE,
      take: PER_PAGE,
      include: { product: { select: { id: true, name: true, slug: true } } },
    }),
  ]);

  return {
    items,
    total,
    page,
    perPage: PER_PAGE,
    pageCount: Math.max(1, Math.ceil(total / PER_PAGE)),
  };
}

export async function inventorySummary() {
  const [ok, low, out] = await Promise.all([
    db.productVariant.count({ where: { stock: { gt: 5 } } }),
    db.productVariant.count({ where: { stock: { gte: 1, lte: 5 } } }),
    db.productVariant.count({ where: { stock: { lte: 0 } } }),
  ]);
  return { ok, low, out, total: ok + low + out };
}

export async function getVariant(id: string) {
  return db.productVariant.findUnique({
    where: { id },
    include: { product: { select: { id: true, name: true } } },
  });
}

function friendlyError(e: unknown): Error {
  if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
    return new Error("SKU sudah dipakai varian lain.");
  }
  return e instanceof Error ? e : new Error("Gagal menyimpan.");
}

export async function createVariant(input: VariantInput) {
  try {
    return await db.productVariant.create({
      data: {
        productId: input.productId,
        color: input.color,
        size: input.size,
        sku: input.sku,
        stock: input.stock,
        price: input.price,
        discountPrice: input.discountPrice || null,
      },
    });
  } catch (e) {
    throw friendlyError(e);
  }
}

export async function updateVariant(id: string, input: VariantInput) {
  try {
    return await db.productVariant.update({
      where: { id },
      data: {
        productId: input.productId,
        color: input.color,
        size: input.size,
        sku: input.sku,
        stock: input.stock,
        price: input.price,
        discountPrice: input.discountPrice || null,
      },
    });
  } catch (e) {
    throw friendlyError(e);
  }
}

export async function deleteVariant(id: string) {
  const used = await db.orderItem.count({ where: { variantId: id } });
  if (used > 0) {
    throw new Error(`Varian dipakai ${used} order item — stok diset 0 saja, jangan hapus.`);
  }
  await db.productVariant.delete({ where: { id } });
}

// Semua perubahan stok lewat sini — tidak ada mutasi langsung dari client.
export async function adjustStock(variantId: string, delta: number) {
  return db.$transaction(async (tx) => {
    const v = await tx.productVariant.findUnique({ where: { id: variantId } });
    if (!v) throw new Error("Varian tidak ditemukan.");
    const next = Math.max(0, v.stock + delta);
    return tx.productVariant.update({ where: { id: variantId }, data: { stock: next } });
  });
}

export async function listProductsForSelect() {
  return db.product.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true, price: true },
  });
}
