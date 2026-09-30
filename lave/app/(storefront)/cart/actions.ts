"use server";

import { headers } from "next/headers";
import { checkoutSchema } from "@/lib/validations/order";
import { rateLimit } from "@/lib/rate-limit";
import { createOrder } from "@/lib/services/orders";

export async function placeOrder(
  raw: unknown
): Promise<{ ok: true; reference: string } | { ok: false; errors: Record<string, string> }> {
  const ip = (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (!rateLimit(`order:${ip}`, 10, 60_000)) {
    return { ok: false, errors: { form: "Terlalu banyak percobaan. Tunggu sebentar." } };
  }
  const parsed = checkoutSchema.safeParse(raw);
  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] === "items" && issue.path.length > 2 ? String(issue.path[1]) : String(issue.path[0] ?? "form");
      errors[key] = issue.message;
    }
    return { ok: false, errors };
  }
  try {
    return await createOrder(parsed.data);
  } catch (e) {
    console.error("[placeOrder]", e);
    return { ok: false, errors: { form: "Terjadi kesalahan. Coba lagi." } };
  }
}
