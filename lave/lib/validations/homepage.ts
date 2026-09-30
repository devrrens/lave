import { z } from "zod";

export const homepageSectionSchema = z.object({
  title: z.string().max(200).optional().or(z.literal("")),
  subtitle: z.string().max(2000).optional().or(z.literal("")),
  imageUrl: z.string().max(500).optional().or(z.literal("")),
  ctaLabel: z.string().max(100).optional().or(z.literal("")),
  ctaUrl: z.string().max(500).optional().or(z.literal("")),
  isVisible: z.boolean().default(true),
  sortOrder: z.coerce.number().int().min(0).default(0),
});

export type HomepageSectionInput = z.infer<typeof homepageSectionSchema>;
