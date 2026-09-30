import { z } from "zod";

export const checkoutItemSchema = z.object({
  variantId: z.string().min(1),
  qty: z.coerce.number().int().min(1).max(99),
});

export const checkoutSchema = z.object({
  name: z.string().min(2, "Nama minimal 2 karakter.").max(100),
  whatsapp: z
    .string()
    .min(9, "Nomor WhatsApp tidak valid.")
    .max(20)
    .regex(/^[+0-9][0-9\s-]+$/, "Nomor WhatsApp tidak valid."),
  address: z.string().min(10, "Alamat minimal 10 karakter.").max(500),
  notes: z.string().max(500).optional().or(z.literal("")),
  items: z.array(checkoutItemSchema).min(1, "Keranjang kosong.").max(50),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;
