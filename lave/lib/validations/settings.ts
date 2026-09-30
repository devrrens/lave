import { z } from "zod";

const OPTIONAL_URL = z.string().max(500).optional().or(z.literal(""));

export const settingsSchema = z.object({
  brand_name: z.string().min(2).max(100),
  whatsapp: z.string().max(30).optional().or(z.literal("")),
  phone: z.string().max(30).optional().or(z.literal("")),
  email: z.string().max(100).optional().or(z.literal("")),
  address: z.string().max(500).optional().or(z.literal("")),
  opening_hours: z.string().max(200).optional().or(z.literal("")),
  maps_url: OPTIONAL_URL,
  instagram: z.string().max(100).optional().or(z.literal("")),
  tiktok: z.string().max(100).optional().or(z.literal("")),
  facebook: z.string().max(100).optional().or(z.literal("")),
  logo_url: OPTIONAL_URL,
  seo_title: z.string().max(120).optional().or(z.literal("")),
  seo_description: z.string().max(300).optional().or(z.literal("")),
});

export type SettingsInput = z.infer<typeof settingsSchema>;

export const SETTING_FIELDS: Array<{ key: keyof SettingsInput; label: string; hint?: string }> = [
  { key: "brand_name", label: "Nama brand" },
  { key: "whatsapp", label: "WhatsApp", hint: "cth. 62812xxxx (dipakai tombol order)" },
  { key: "phone", label: "Telepon" },
  { key: "email", label: "Email" },
  { key: "address", label: "Alamat" },
  { key: "opening_hours", label: "Jam buka" },
  { key: "maps_url", label: "Google Maps URL" },
  { key: "instagram", label: "Instagram", hint: "username saja" },
  { key: "tiktok", label: "TikTok", hint: "username saja" },
  { key: "facebook", label: "Facebook", hint: "username/slug saja" },
  { key: "seo_title", label: "SEO title" },
  { key: "seo_description", label: "SEO description" },
];
