"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth";
import { updateOrderStatus } from "@/lib/services/orders";

const STATUSES = ["PENDING", "CONFIRMED", "PROCESSING", "PACKED", "SHIPPED", "COMPLETED", "CANCELLED"] as const;

export async function changeOrderStatus(
  id: string,
  raw: { status: string; adminNotes?: string }
): Promise<{ ok: boolean; error?: string }> {
  await requireAdmin("/admin/orders");
  const parsed = z
    .object({ status: z.enum(STATUSES), adminNotes: z.string().max(2000).optional() })
    .safeParse(raw);
  if (!parsed.success) return { ok: false, error: "Status tidak valid." };
  try {
    await updateOrderStatus(id, parsed.data.status, parsed.data.adminNotes);
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Gagal update status." };
  }
  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${id}`);
  return { ok: true };
}
