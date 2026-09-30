"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { settingsSchema } from "@/lib/validations/settings";
import { updateSettings } from "@/lib/services/settings";

export async function saveSettings(
  raw: unknown
): Promise<{ ok: boolean; errors?: Record<string, string> }> {
  await requireAdmin("/admin/settings");
  const parsed = settingsSchema.safeParse(raw);
  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      errors[String(issue.path[0] ?? "form")] = issue.message;
    }
    return { ok: false, errors };
  }
  try {
    await updateSettings(parsed.data);
  } catch (e) {
    return { ok: false, errors: { form: e instanceof Error ? e.message : "Gagal menyimpan." } };
  }
  revalidatePath("/", "layout");
  revalidatePath("/admin/settings");
  return { ok: true };
}
