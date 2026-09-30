"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { productSchema } from "@/lib/validations/product";
import {
  createProduct,
  deleteProduct,
  duplicateProduct,
  setProductStatus,
  updateProduct,
} from "@/lib/services/products";

export async function saveProduct(
  id: string | null,
  raw: unknown
): Promise<{ ok: boolean; errors?: Record<string, string> }> {
  await requireAdmin("/admin/products");
  const parsed = productSchema.safeParse(raw);
  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      errors[String(issue.path[0] ?? "form")] = issue.message;
    }
    return { ok: false, errors };
  }
  try {
    if (id) await updateProduct(id, parsed.data);
    else await createProduct(parsed.data);
  } catch (e) {
    return { ok: false, errors: { form: e instanceof Error ? e.message : "Gagal menyimpan." } };
  }
  revalidatePath("/admin/products");
  redirect("/admin/products");
}

export async function removeProduct(id: string): Promise<{ ok: boolean; error?: string }> {
  await requireAdmin("/admin/products");
  try {
    await deleteProduct(id);
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Gagal menghapus." };
  }
  revalidatePath("/admin/products");
  return { ok: true };
}

export async function publishProduct(id: string, status: "DRAFT" | "PUBLISHED" | "ARCHIVED") {
  await requireAdmin("/admin/products");
  await setProductStatus(id, status);
  revalidatePath("/admin/products");
}

export async function copyProduct(id: string) {
  await requireAdmin("/admin/products");
  await duplicateProduct(id);
  revalidatePath("/admin/products");
}
