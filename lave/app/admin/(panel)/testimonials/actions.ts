"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { testimonialSchema } from "@/lib/validations/testimonial";
import {
  createTestimonial,
  deleteTestimonial,
  updateTestimonial,
} from "@/lib/services/testimonials";

export async function saveTestimonial(
  id: string | null,
  raw: unknown
): Promise<{ ok: boolean; errors?: Record<string, string> }> {
  await requireAdmin("/admin/testimonials");
  const parsed = testimonialSchema.safeParse(raw);
  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      errors[String(issue.path[0] ?? "form")] = issue.message;
    }
    return { ok: false, errors };
  }
  try {
    if (id) await updateTestimonial(id, parsed.data);
    else await createTestimonial(parsed.data);
  } catch (e) {
    return { ok: false, errors: { form: e instanceof Error ? e.message : "Gagal menyimpan." } };
  }
  revalidatePath("/admin/testimonials");
  revalidatePath("/testimonials");
  revalidatePath("/");
  redirect("/admin/testimonials");
}

export async function removeTestimonial(id: string): Promise<{ ok: boolean; error?: string }> {
  await requireAdmin("/admin/testimonials");
  try {
    await deleteTestimonial(id);
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Gagal menghapus." };
  }
  revalidatePath("/admin/testimonials");
  revalidatePath("/testimonials");
  revalidatePath("/");
  return { ok: true };
}
