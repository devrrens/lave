"use server";

import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

async function checkAdmin() {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");
}

export async function getCategories() {
  return db.category.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { products: true } } },
  });
}

export async function createCategory(data: {
  name: string;
  slug: string;
  description?: string;
  image?: string;
}) {
  await checkAdmin();
  const category = await db.category.create({ data });
  revalidatePath("/admin/categories");
  revalidatePath("/collection");
  return category;
}

export async function updateCategory(
  id: string,
  data: {
    name: string;
    slug: string;
    description?: string;
    image?: string;
  }
) {
  await checkAdmin();
  const category = await db.category.update({ where: { id }, data });
  revalidatePath("/admin/categories");
  revalidatePath("/collection");
  return category;
}

export async function deleteCategory(id: string) {
  await checkAdmin();
  await db.category.delete({ where: { id } });
  revalidatePath("/admin/categories");
  revalidatePath("/collection");
}
