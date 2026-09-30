"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { homepageSectionSchema } from "@/lib/validations/homepage";
import { updateHomepageSection } from "@/lib/services/homepage-admin";

export async function saveHomepageSection(
  key: string,
  raw: unknown
): Promise<{ ok: boolean; errors?: Record<string, string> }> {
  await requireAdmin("/admin/homepage");
  const parsed = homepageSectionSchema.safeParse(raw);
  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      errors[String(issue.path[0] ?? "form")] = issue.message;
    }
    return { ok: false, errors };
  }
  try {
    await updateHomepageSection(key, parsed.data);
  } catch (e) {
    return { ok: false, errors: { form: e instanceof Error ? e.message : "Gagal menyimpan." } };
  }
  revalidatePath("/");
  revalidatePath("/admin/homepage");
  return { ok: true };
}
