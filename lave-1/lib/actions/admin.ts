"use server";

import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

async function checkAdmin() {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");
}

export async function updateStock(variantId: string, stock: number) {
  await checkAdmin();
  await db.productVariant.update({
    where: { id: variantId },
    data: { stock: Math.max(0, stock) },
  });
  revalidatePath("/admin/inventory");
}

export async function updateOrderStatus(orderId: string, status: string) {
  await checkAdmin();
  await db.order.update({
    where: { id: orderId },
    data: { status: status as never },
  });
  revalidatePath("/admin/orders");
}

export async function addOrderNote(orderId: string, notes: string) {
  await checkAdmin();
  await db.order.update({
    where: { id: orderId },
    data: { notes },
  });
  revalidatePath("/admin/orders");
}
