"use client";

import { useState } from "react";
import { updateSettings } from "@/lib/actions/testimonials-settings";
import { useRouter } from "next/navigation";

const FIELDS = [
  { key: "brandName", label: "Nama Toko", placeholder: "Barokah Jaya Fashion" },
  { key: "whatsapp", label: "Nomor WhatsApp", placeholder: "6281234567890" },
  { key: "phone", label: "Nomor Telepon", placeholder: "02112345678" },
  { key: "email", label: "Email", placeholder: "info@barokahjaya.com" },
  { key: "address", label: "Alamat", placeholder: "Jl. Contoh No. 1, Jakarta" },
  { key: "openingHours", label: "Jam Buka", placeholder: "Senin-Sabtu 09:00-17:00 WIB" },
  { key: "instagram", label: "Instagram", placeholder: "@barokahjaya" },
  { key: "tiktok", label: "TikTok", placeholder: "@barokahjaya" },
  { key: "facebook", label: "Facebook", placeholder: "Barokah Jaya Fashion" },
  { key: "googleMapsUrl", label: "Google Maps URL", placeholder: "https://maps.google.com/..." },
  { key: "seoTitle", label: "SEO Title", placeholder: "Barokah Jaya Fashion – Busana Wanita Pilihan" },
  { key: "seoDescription", label: "SEO Description", placeholder: "Temukan koleksi busana wanita pilihan..." },
];

export function SettingsForm({ settings }: { settings: Record<string, string> }) {
  const router = useRouter();
  const [values, setValues] = useState<Record<string, string>>(settings);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);
    try {
      await updateSettings(values);
      setSuccess(true);
      router.refresh();
      setTimeout(() => setSuccess(false), 3000);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-xl space-y-5">
      {success && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-[#7A9B82] text-sm rounded-xl">
          Pengaturan berhasil disimpan.
        </div>
      )}

      {FIELDS.map((f) => (
        <div key={f.key}>
          <label className="block text-sm font-medium text-[#3D3436] mb-1">{f.label}</label>
          <input
            type="text"
            value={values[f.key] || ""}
            onChange={(e) => setValues({ ...values, [f.key]: e.target.value })}
            placeholder={f.placeholder}
            className="w-full px-3 py-2.5 border border-[#EDE2E5] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#E8B7C6]"
          />
        </div>
      ))}

      <div className="pt-2">
        <button
          type="submit"
          disabled={saving}
          className="px-6 py-2.5 bg-[#E8B7C6] hover:bg-[#dca4b4] text-[#3D3436] font-medium rounded-full text-sm transition-colors disabled:opacity-50"
        >
          {saving ? "Menyimpan..." : "Simpan Pengaturan"}
        </button>
      </div>
    </form>
  );
}
