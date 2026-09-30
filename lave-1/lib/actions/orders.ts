"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export type CreateOrderItemInput = {
  variantId: string;
  quantity: number;
};

export type CreateOrderInput = {
  customerName: string;
  whatsapp: string;
  email?: string;
  address?: string;
  notes?: string;
  items: CreateOrderItemInput[];
};

export async function createOrder(data: CreateOrderInput) {
  if (!data.customerName || !data.whatsapp || data.items.length === 0) {
    throw new Error("Data pemesanan tidak lengkap");
  }

  // Generate Reference: BJF-YYYYMMDD-XXXX
  const today = new Date();
  const dateStr = today.toISOString().slice(0, 10).replace(/-/g, "");
  const randomSuffix = Math.floor(1000 + Math.random() * 9000).toString();
  const reference = `BJF-${dateStr}-${randomSuffix}`;

  // Execute in Transaction (PRD Section 26 & agent.md)
  return await db.$transaction(async (tx) => {
    // 1. Find or create customer
    let customer = await tx.customer.findFirst({
      where: { whatsapp: data.whatsapp },
    });

    if (!customer) {
      customer = await tx.customer.create({
        data: {
          name: data.customerName,
          whatsapp: data.whatsapp,
          email: data.email,
          address: data.address,
        },
      });
    } else {
      customer = await tx.customer.update({
        where: { id: customer.id },
        data: {
          name: data.customerName,
          email: data.email || customer.email,
          address: data.address || customer.address,
        },
      });
    }

    // 2. Validate variants & stock, calculate server-side subtotal
    let subtotal = 0;
    const validatedItems: {
      variantId: string;
      quantity: number;
      unitPrice: number;
      productName: string;
      color: string;
      size: string;
    }[] = [];

    for (const item of data.items) {
      const variant = await tx.productVariant.findUnique({
        where: { id: item.variantId },
        include: { product: true },
      });

      if (!variant) {
        throw new Error(`Varian tidak ditemukan`);
      }

      if (variant.stock < item.quantity) {
        throw new Error(
          `Stok untuk ${variant.product.name} (${variant.color} - ${variant.size}) tidak mencukupi (sisa ${variant.stock})`
        );
      }

      const unitPrice = variant.product.discountPrice ?? variant.price;
      subtotal += unitPrice * item.quantity;

      validatedItems.push({
        variantId: variant.id,
        quantity: item.quantity,
        unitPrice,
        productName: variant.product.name,
        color: variant.color,
        size: variant.size,
      });

      // 3. Decrement stock
      await tx.productVariant.update({
        where: { id: variant.id },
        data: {
          stock: { decrement: item.quantity },
        },
      });
    }

    // 4. Create Order
    const order = await tx.order.create({
      data: {
        reference,
        customerId: customer.id,
        subtotal,
        discount: 0,
        total: subtotal,
        notes: data.notes,
        items: {
          create: validatedItems.map((item) => ({
            variantId: item.variantId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
          })),
        },
      },
      include: {
        items: {
          include: {
            variant: {
              include: { product: true },
            },
          },
        },
        customer: true,
      },
    });

    revalidatePath("/admin/orders");
    revalidatePath("/admin/inventory");
    return order;
  });
}
