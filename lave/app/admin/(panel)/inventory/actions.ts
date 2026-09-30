"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { adjustSchema, variantSchema } from "@/lib/validations/variant";
import {
  adjustStock,
  createVariant,
  deleteVariant,
  updateVariant,
} from "@/lib/services/variants";

export async function saveVariant(
  id: string | null,
  raw: unknown
): Promise<{ ok: boolean; errors?: Record<string, string> }> {
  await requireAdmin("/admin/inventory");
  const parsed = variantSchema.safeParse(raw);
  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      errors[String(issue.path[0] ?? "form")] = issue.message;
    }
    return { ok: false, errors };
  }
  try {
    if (id) await updateVariant(id, parsed.data);
    else await createVariant(parsed.data);
  } catch (e) {
    return { ok: false, errors: { form: e instanceof Error ? e.message : "Gagal menyimpan." } };
  }
  revalidatePath("/admin/inventory");
  redirect("/admin/inventory");
}

export async function removeVariant(id: string): Promise<{ ok: boolean; error?: string }> {
  await requireAdmin("/admin/inventory");
  try {
    await deleteVariant(id);
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Gagal menghapus." };
  }
  revalidatePath("/admin/inventory");
  return { ok: true };
}

// Satu-satunya jalur perubahan stok — server-side, clamp >= 0.
export async function changeStock(raw: unknown): Promise<{ ok: boolean; error?: string }> {
  await requireAdmin("/admin/inventory");
  const parsed = adjustSchema.safeParse(raw);
  if (!parsed.success || parsed.data.delta === 0) {
    return { ok: false, error: "Delta tidak valid." };
  }
  try {
    await adjustStock(parsed.data.variantId, parsed.data.delta);
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Gagal update stok." };
  }
  revalidatePath("/admin/inventory");
  return { ok: true };
}
