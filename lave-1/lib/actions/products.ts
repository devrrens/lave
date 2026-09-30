"use server";

import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

async function checkAdmin() {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");
}

export type ProductInput = {
  name: string;
  slug: string;
  description?: string;
  material?: string;
  price: number;
  discountPrice?: number;
  categoryId: string;
  status: "DRAFT" | "PUBLISHED";
  featured?: boolean;
  bestSeller?: boolean;
  newArrival?: boolean;
  images: { url: string; order: number }[];
  variants: {
    id?: string;
    color: string;
    size: string;
    sku: string;
    stock: number;
    price: number;
  }[];
};

export async function getProducts(options?: {
  categoryId?: string;
  status?: string;
  search?: string;
}) {
  const where: Record<string, unknown> = {};
  if (options?.categoryId) where.categoryId = options.categoryId;
  if (options?.status) where.status = options.status;
  if (options?.search) {
    where.OR = [
      { name: { contains: options.search, mode: "insensitive" } },
      { slug: { contains: options.search, mode: "insensitive" } },
    ];
  }

  return db.product.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: {
      category: { select: { id: true, name: true } },
      images: { orderBy: { order: "asc" } },
      variants: true,
    },
  });
}

export async function getProductById(id: string) {
  return db.product.findUnique({
    where: { id },
    include: {
      category: true,
      images: { orderBy: { order: "asc" } },
      variants: { orderBy: { createdAt: "asc" } },
    },
  });
}

export async function createProduct(data: ProductInput) {
  await checkAdmin();

  const product = await db.product.create({
    data: {
      name: data.name,
      slug: data.slug,
      description: data.description,
      material: data.material,
      price: data.price,
      discountPrice: data.discountPrice,
      categoryId: data.categoryId,
      status: data.status,
      featured: data.featured ?? false,
      bestSeller: data.bestSeller ?? false,
      newArrival: data.newArrival ?? false,
      images: {
        create: data.images.map((img, idx) => ({
          url: img.url,
          order: idx,
        })),
      },
      variants: {
        create: data.variants.map((v) => ({
          color: v.color,
          size: v.size,
          sku: v.sku,
          stock: v.stock,
          price: v.price,
        })),
      },
    },
  });

  revalidatePath("/admin/products");
  revalidatePath("/admin/inventory");
  revalidatePath("/collection");
  revalidatePath("/");
  return product;
}

export async function updateProduct(id: string, data: ProductInput) {
  await checkAdmin();

  await db.product.update({
    where: { id },
    data: {
      name: data.name,
      slug: data.slug,
      description: data.description,
      material: data.material,
      price: data.price,
      discountPrice: data.discountPrice,
      categoryId: data.categoryId,
      status: data.status,
      featured: data.featured ?? false,
      bestSeller: data.bestSeller ?? false,
      newArrival: data.newArrival ?? false,
      images: {
        deleteMany: {},
        create: data.images.map((img, idx) => ({
          url: img.url,
          order: idx,
        })),
      },
      variants: {
        deleteMany: {},
        create: data.variants.map((v) => ({
          color: v.color,
          size: v.size,
          sku: v.sku,
          stock: v.stock,
          price: v.price,
        })),
      },
    },
  });

  revalidatePath("/admin/products");
  revalidatePath("/admin/inventory");
  revalidatePath("/collection");
  revalidatePath(`/product/${data.slug}`);
  revalidatePath("/");
}

export async function deleteProduct(id: string) {
  await checkAdmin();
  await db.product.delete({ where: { id } });
  revalidatePath("/admin/products");
  revalidatePath("/admin/inventory");
  revalidatePath("/collection");
  revalidatePath("/");
}

export async function duplicateProduct(id: string) {
  await checkAdmin();
  const original = await db.product.findUnique({
    where: { id },
    include: { images: true, variants: true },
  });
  if (!original) throw new Error("Produk tidak ditemukan");

  const newSlug = `${original.slug}-copy-${Date.now()}`;
  return db.product.create({
    data: {
      name: `${original.name} (Salinan)`,
      slug: newSlug,
      description: original.description,
      material: original.material,
      price: original.price,
      discountPrice: original.discountPrice,
      categoryId: original.categoryId,
      status: "DRAFT",
      featured: false,
      bestSeller: false,
      newArrival: false,
      images: {
        create: original.images.map((img) => ({
          url: img.url,
          order: img.order,
        })),
      },
      variants: {
        create: original.variants.map((v, i) => ({
          color: v.color,
          size: v.size,
          sku: `${v.sku}-COPY-${i + 1}`,
          stock: v.stock,
          price: v.price,
        })),
      },
    },
  });
}
