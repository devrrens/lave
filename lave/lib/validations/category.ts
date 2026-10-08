import { z } from "zod";

export const categorySchema = z.object({
  name: z.string().min(2, "Nama minimal 2 karakter.").max(100),
  slug: z
    .string()
    .min(2, "Slug minimal 2 karakter.")
    .max(120)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug: huruf kecil, angka, strip."),
  imageUrl: z.string().max(8_000_000).optional().or(z.literal("")),
  sortOrder: z.coerce.number().int().min(0).default(0),
});

export type CategoryInput = z.infer<typeof categorySchema>;
