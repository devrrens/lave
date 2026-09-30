import { db } from "@/lib/db";
import type { ProductInput } from "@/lib/validations/product";

const PER_PAGE = 20;

export async function listProducts(opts: {
  q?: string;
  status?: string;
  page?: number;
}) {
  const page = Math.max(1, opts.page ?? 1);
  const where = {
    ...(opts.q ? { name: { contains: opts.q } } : {}),
    ...(opts.status && ["DRAFT", "PUBLISHED", "ARCHIVED"].includes(opts.status)
      ? { status: opts.status as "DRAFT" | "PUBLISHED" | "ARCHIVED" }
      : {}),
  };
  const [total, items] = await Promise.all([
    db.product.count({ where }),
    db.product.findMany({
      where,
      orderBy: { updatedAt: "desc" },
      skip: (page - 1) * PER_PAGE,
      take: PER_PAGE,
      include: {
        category: { select: { name: true } },
        images: { orderBy: { sortOrder: "asc" }, take: 1 },
        variants: { select: { stock: true } },
      },
    }),
  ]);
  return { items, total, page, perPage: PER_PAGE, pageCount: Math.max(1, Math.ceil(total / PER_PAGE)) };
}

export async function getProduct(id: string) {
  return db.product.findUnique({
    where: { id },
    include: {
      images: { orderBy: { sortOrder: "asc" } },
      variants: { orderBy: [{ color: "asc" }, { size: "asc" }] },
    },
  });
}

async function uniqueSlug(base: string, ignoreId?: string): Promise<string> {
  let slug = base;
  let n = 2;
  for (;;) {
    const found = await db.product.findUnique({ where: { slug } });
    if (!found || found.id === ignoreId) return slug;
    slug = `${base}-${n++}`;
  }
}

function imageData(images: ProductInput["images"]) {
  return {
    deleteMany: {},
    create: images.map((img, i) => ({
      url: img.url,
      alt: img.alt || null,
      sortOrder: i,
    })),
  };
}

export async function createProduct(input: ProductInput) {
  const slug = await uniqueSlug(input.slug);
  return db.product.create({
    data: {
      name: input.name,
      slug,
      description: input.description || null,
      material: input.material || null,
      categoryId: input.categoryId || null,
      price: input.price,
      discountPrice: input.discountPrice || null,
      status: input.status,
      isFeatured: input.isFeatured,
      isBestSeller: input.isBestSeller,
      isNewArrival: input.isNewArrival,
      careGuide: input.careGuide || null,
      sizeGuide: input.sizeGuide || null,
      images: {
        create: input.images.map((img, i) => ({
          url: img.url,
          alt: img.alt || null,
          sortOrder: i,
        })),
      },
    },
  });
}

export async function updateProduct(id: string, input: ProductInput) {
  const slug = await uniqueSlug(input.slug, id);
  return db.product.update({
    where: { id },
    data: {
      name: input.name,
      slug,
      description: input.description || null,
      material: input.material || null,
      categoryId: input.categoryId || null,
      price: input.price,
      discountPrice: input.discountPrice || null,
      status: input.status,
      isFeatured: input.isFeatured,
      isBestSeller: input.isBestSeller,
      isNewArrival: input.isNewArrival,
      careGuide: input.careGuide || null,
      sizeGuide: input.sizeGuide || null,
      images: imageData(input.images),
    },
  });
}

export async function deleteProduct(id: string) {
  await db.product.delete({ where: { id } });
}

export async function setProductStatus(id: string, status: "DRAFT" | "PUBLISHED" | "ARCHIVED") {
  return db.product.update({ where: { id }, data: { status } });
}

export async function duplicateProduct(id: string) {
  const src = await db.product.findUnique({
    where: { id },
    include: {
      images: { orderBy: { sortOrder: "asc" } },
      variants: true,
    },
  });
  if (!src) throw new Error("Produk tidak ditemukan.");
  const slug = await uniqueSlug(`${src.slug}-copy`);
  return db.product.create({
    data: {
      name: `${src.name} (Copy)`,
      slug,
      description: src.description,
      material: src.material,
      categoryId: src.categoryId,
      price: src.price,
      discountPrice: src.discountPrice,
      status: "DRAFT",
      isFeatured: false,
      isBestSeller: false,
      isNewArrival: true,
      careGuide: src.careGuide,
      sizeGuide: src.sizeGuide,
      images: {
        create: src.images.map((img) => ({
          url: img.url,
          alt: img.alt,
          sortOrder: img.sortOrder,
        })),
      },
      variants: {
        create: src.variants.map((v) => ({
          color: v.color,
          size: v.size,
          sku: `${v.sku}-COPY-${Date.now().toString(36).toUpperCase()}`,
          stock: 0,
          price: v.price,
          discountPrice: v.discountPrice,
        })),
      },
    },
  });
}
