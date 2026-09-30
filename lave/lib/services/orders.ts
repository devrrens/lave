import { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import type { CheckoutInput } from "@/lib/validations/order";

function buildReference(): string {
  const d = new Date();
  const p = (n: number) => String(n).padStart(2, "0");
  const ymd = `${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}`;
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `BJF-${ymd}-${rand}`;
}

export type CreateOrderResult =
  | { ok: true; reference: string }
  | { ok: false; errors: Record<string, string> };

// agent.md:26 — transaksi penuh, harga & stok dari DB, client tidak dipercaya.
export async function createOrder(input: CheckoutInput): Promise<CreateOrderResult> {
  const ids = [...new Set(input.items.map((i) => i.variantId))];
  const variants = await db.productVariant.findMany({
    where: { id: { in: ids } },
    include: { product: { select: { id: true, name: true, status: true } } },
  });
  const byId = new Map(variants.map((v) => [v.id, v]));

  const errors: Record<string, string> = {};
  for (const item of input.items) {
    const v = byId.get(item.variantId);
    if (!v || v.product.status !== "PUBLISHED") {
      errors[item.variantId] = "Produk tidak tersedia.";
    } else if (v.stock < item.qty) {
      errors[item.variantId] =
        v.stock === 0
          ? `${v.product.name} (${v.color}/${v.size}) habis.`
          : `${v.product.name} (${v.color}/${v.size}) tersisa ${v.stock}.`;
    }
  }
  if (Object.keys(errors).length > 0) return { ok: false, errors };

  const lines = input.items.map((item) => {
    const v = byId.get(item.variantId)!;
    const price = v.discountPrice ?? v.price;
    return {
      variantId: v.id,
      productId: v.product.id,
      name: v.product.name,
      variantLab: `${v.color} / ${v.size}`,
      sku: v.sku,
      price,
      quantity: item.qty,
      subtotal: price * item.qty,
    };
  });
  const subtotal = lines.reduce((s, l) => s + l.subtotal, 0);
  const whatsapp = input.whatsapp.replace(/[\s-]/g, "");

  for (let attempt = 0; attempt < 5; attempt++) {
    try {
      const reference = buildReference();
      await db.$transaction(async (tx) => {
        let customer = await tx.customer.findFirst({ where: { whatsapp } });
        if (customer) {
          customer = await tx.customer.update({
            where: { id: customer.id },
            data: {
              name: input.name,
              address: input.address,
              totalOrders: { increment: 1 },
              totalSpent: { increment: subtotal },
              lastOrderAt: new Date(),
            },
          });
        } else {
          customer = await tx.customer.create({
            data: {
              name: input.name,
              whatsapp,
              address: input.address,
              notes: input.notes || null,
              totalOrders: 1,
              totalSpent: subtotal,
              lastOrderAt: new Date(),
            },
          });
        }

        await tx.order.create({
          data: {
            reference,
            customerId: customer.id,
            customerName: input.name,
            customerWhats: whatsapp,
            customerAddress: input.address,
            customerNotes: input.notes || null,
            status: "PENDING",
            subtotal,
            discount: 0,
            total: subtotal,
            items: { create: lines },
          },
        });

        for (const l of lines) {
          await tx.productVariant.update({
            where: { id: l.variantId },
            data: { stock: { decrement: l.quantity } },
          });
        }
      });
      return { ok: true, reference };
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") continue;
      throw e;
    }
  }
  return { ok: false, errors: { form: "Gagal membuat order. Coba lagi." } };
}

export async function getOrderByReference(reference: string) {
  return db.order.findUnique({
    where: { reference },
    include: { items: true },
  });
}

const ORDER_PER_PAGE = 20;

export async function listOrders(opts: { q?: string; status?: string; page?: number }) {
  const page = Math.max(1, opts.page ?? 1);
  const where = {
    ...(opts.status && opts.status !== "" ? { status: opts.status as "PENDING" } : {}),
    ...(opts.q
      ? {
          OR: [
            { reference: { contains: opts.q } },
            { customerName: { contains: opts.q } },
            { customerWhats: { contains: opts.q } },
          ],
        }
      : {}),
  };
  const [total, items] = await Promise.all([
    db.order.count({ where }),
    db.order.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * ORDER_PER_PAGE,
      take: ORDER_PER_PAGE,
      include: { _count: { select: { items: true } } },
    }),
  ]);
  return { items, total, page, perPage: ORDER_PER_PAGE, pageCount: Math.max(1, Math.ceil(total / ORDER_PER_PAGE)) };
}

export async function getOrder(id: string) {
  return db.order.findUnique({
    where: { id },
    include: { items: true, customer: true },
  });
}

export async function updateOrderStatus(
  id: string,
  status: "PENDING" | "CONFIRMED" | "PROCESSING" | "PACKED" | "SHIPPED" | "COMPLETED" | "CANCELLED",
  adminNotes?: string
) {
  return db.$transaction(async (tx) => {
    const order = await tx.order.findUnique({
      where: { id },
      include: { items: true },
    });
    if (!order) throw new Error("Order tidak ditemukan.");
    if (order.status === "CANCELLED" && status !== "CANCELLED") {
      throw new Error("Order yang dibatalkan tidak bisa dibuka kembali.");
    }
    // Batal → kembalikan stok.
    if (status === "CANCELLED" && order.status !== "CANCELLED") {
      for (const item of order.items) {
        if (item.variantId) {
          await tx.productVariant.update({
            where: { id: item.variantId },
            data: { stock: { increment: item.quantity } },
          });
        }
      }
    }
    return tx.order.update({
      where: { id },
      data: { status, adminNotes: adminNotes ?? order.adminNotes },
    });
  });
}
