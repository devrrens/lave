import { z } from "zod";

export const testimonialSchema = z.object({
  customerName: z.string().min(2, "Nama minimal 2 karakter.").max(100),
  profileImage: z.string().max(500).optional().or(z.literal("")),
  rating: z.coerce.number().int().min(1).max(5).default(5),
  review: z.string().min(10, "Ulasan minimal 10 karakter.").max(2000),
  productName: z.string().max(200).optional().or(z.literal("")),
  verified: z.boolean().default(false),
  published: z.boolean().default(false),
  sortOrder: z.coerce.number().int().min(0).default(0),
});

export type TestimonialInput = z.infer<typeof testimonialSchema>;
