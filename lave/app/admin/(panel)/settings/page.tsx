import { requireAdmin } from "@/lib/auth";
import { getAllSettings } from "@/lib/services/settings";
import { SettingsForm } from "@/components/admin/SettingsForm";
import type { SettingsInput } from "@/lib/validations/settings";
import { saveSettings } from "./actions";

export const dynamic = "force-dynamic";
export const metadata = { title: "Settings" };

const DEFAULTS: SettingsInput = {
  brand_name: "Barokah Jaya Fashion",
  whatsapp: "",
  phone: "",
  email: "",
  address: "",
  opening_hours: "",
  maps_url: "",
  instagram: "",
  tiktok: "",
  facebook: "",
  logo_url: "",
  seo_title: "",
  seo_description: "",
};

export default async function SettingsPage() {
  await requireAdmin("/admin/settings");
  const stored = await getAllSettings();

  return (
    <main>
      <h1 className="text-xl font-semibold">Settings</h1>
      <p className="mt-1 text-sm text-[#75696C]">
        Hanya OWNER. Nomor WhatsApp di sini dipakai semua tombol order — tanpa hardcode.
      </p>
      <div className="mt-6">
        <SettingsForm initial={{ ...DEFAULTS, ...stored }} save={saveSettings} />
      </div>
    </main>
  );
}
