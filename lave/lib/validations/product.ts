import { z } from "zod";

export const productImageSchema = z.object({
  url: z.string().min(1).max(8_000_000),
  alt: z.string().max(200).optional().or(z.literal("")),
});

export const productSchema = z
  .object({
    name: z.string().min(2, "Nama minimal 2 karakter.").max(200),
    slug: z
      .string()
      .min(2, "Slug minimal 2 karakter.")
      .max(200)
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug: huruf kecil, angka, strip."),
    description: z.string().max(10000).optional().or(z.literal("")),
    material: z.string().max(200).optional().or(z.literal("")),
    categoryId: z.string().optional().or(z.literal("")),
    price: z.coerce.number().int("Harga harus bilangan bulat.").min(0, "Harga minimal 0."),
    discountPrice: z.coerce.number().int().min(0).optional().nullable(),
    status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).default("DRAFT"),
    isFeatured: z.boolean().default(false),
    isBestSeller: z.boolean().default(false),
    isNewArrival: z.boolean().default(false),
    careGuide: z.string().max(5000).optional().or(z.literal("")),
    sizeGuide: z.string().max(5000).optional().or(z.literal("")),
    images: z.array(productImageSchema).max(10, "Maksimal 10 gambar.").default([]),
  })
  .refine(
    (d) =>
      d.discountPrice == null ||
      d.discountPrice === 0 ||
      d.discountPrice < d.price,
    { message: "Harga diskon harus lebih kecil dari harga normal.", path: ["discountPrice"] }
  );

export type ProductInput = z.infer<typeof productSchema>;
