import { z } from "zod";

export const variantSchema = z
  .object({
    productId: z.string().min(1, "Produk wajib dipilih."),
    color: z.string().min(1, "Warna wajib diisi.").max(50),
    size: z.string().min(1, "Ukuran wajib diisi.").max(20),
    sku: z
      .string()
      .min(2, "SKU minimal 2 karakter.")
      .max(100)
      .regex(/^[A-Za-z0-9-_]+$/, "SKU: huruf, angka, strip, underscore."),
    stock: z.coerce.number().int().min(0, "Stok minimal 0."),
    price: z.coerce.number().int().min(0, "Harga minimal 0."),
    discountPrice: z.coerce.number().int().min(0).optional().nullable(),
  })
  .refine(
    (d) => d.discountPrice == null || d.discountPrice === 0 || d.discountPrice < d.price,
    { message: "Harga diskon harus lebih kecil dari harga.", path: ["discountPrice"] }
  );

export const adjustSchema = z.object({
  variantId: z.string().min(1),
  delta: z.coerce.number().int().min(-10000).max(10000),
});

export type VariantInput = z.infer<typeof variantSchema>;
