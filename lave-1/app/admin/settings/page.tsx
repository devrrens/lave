export const runtime = 'edge';
import { getSettings } from "@/lib/actions/testimonials-settings";
import { SettingsForm } from "@/components/admin/SettingsForm";

export default async function AdminSettingsPage() {
  const settings = await getSettings();

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-[#3D3436]">Pengaturan Toko</h1>
        <p className="text-sm text-[#75696C] mt-1">Informasi toko, kontak, dan media sosial</p>
      </div>
      <div className="bg-white rounded-2xl border border-[#EDE2E5] p-6 md:p-8">
        <SettingsForm settings={settings} />
      </div>
    </div>
  );
}
