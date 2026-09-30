"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { categorySchema } from "@/lib/validations/category";
import {
  createCategory,
  deleteCategory,
  updateCategory,
} from "@/lib/services/categories";

export async function saveCategory(
  id: string | null,
  raw: unknown
): Promise<{ ok: boolean; errors?: Record<string, string> }> {
  await requireAdmin("/admin/categories");
  const parsed = categorySchema.safeParse(raw);
  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      errors[String(issue.path[0] ?? "form")] = issue.message;
    }
    return { ok: false, errors };
  }
  try {
    if (id) await updateCategory(id, parsed.data);
    else await createCategory(parsed.data);
  } catch (e) {
    return { ok: false, errors: { form: e instanceof Error ? e.message : "Gagal menyimpan." } };
  }
  revalidatePath("/admin/categories");
  redirect("/admin/categories");
}

export async function removeCategory(id: string): Promise<{ ok: boolean; error?: string }> {
  await requireAdmin("/admin/categories");
  try {
    await deleteCategory(id);
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Gagal menghapus." };
  }
  revalidatePath("/admin/categories");
  return { ok: true };
}
