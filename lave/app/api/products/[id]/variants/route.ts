import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// Varian produk published utk cart (ganti varian) — hanya data publik.
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await db.product.findFirst({
    where: { id, status: "PUBLISHED" },
    select: {
      id: true,
      name: true,
      price: true,
      discountPrice: true,
      variants: {
        orderBy: [{ color: "asc" }, { size: "asc" }],
        select: { id: true, color: true, size: true, stock: true, price: true, discountPrice: true },
      },
    },
  });
  if (!product) return NextResponse.json({ error: "Not found." }, { status: 404 });
  return NextResponse.json(product);
}
