import { db } from "@/lib/db";
import type { CategoryInput } from "@/lib/validations/category";

export async function listCategories() {
  return db.category.findMany({
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    include: { _count: { select: { products: true } } },
  });
}

export async function getCategory(id: string) {
  return db.category.findUnique({ where: { id } });
}

async function uniqueSlug(base: string, ignoreId?: string): Promise<string> {
  let slug = base;
  let n = 2;
  for (;;) {
    const found = await db.category.findUnique({ where: { slug } });
    if (!found || found.id === ignoreId) return slug;
    slug = `${base}-${n++}`;
  }
}

export async function createCategory(input: CategoryInput) {
  const slug = await uniqueSlug(input.slug);
  return db.category.create({
    data: {
      name: input.name,
      slug,
      imageUrl: input.imageUrl || null,
      sortOrder: input.sortOrder,
    },
  });
}

export async function updateCategory(id: string, input: CategoryInput) {
  const slug = await uniqueSlug(input.slug, id);
  return db.category.update({
    where: { id },
    data: {
      name: input.name,
      slug,
      imageUrl: input.imageUrl || null,
      sortOrder: input.sortOrder,
    },
  });
}

export async function deleteCategory(id: string) {
  const count = await db.product.count({ where: { categoryId: id } });
  if (count > 0) {
    throw new Error(`Kategori dipakai ${count} produk — pindahkan dulu sebelum hapus.`);
  }
  await db.category.delete({ where: { id } });
}
