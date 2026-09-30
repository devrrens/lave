import type { Metadata } from "next";
import { getPublicSettings } from "@/lib/services/storefront";

export const metadata: Metadata = {
  title: "Contact",
  description: "Hubungi Barokah Jaya Fashion.",
  alternates: { canonical: "/contact" },
};

function isSet(v?: string): v is string {
  return !!v && !v.startsWith("TODO");
}

export default async function ContactPage() {
  const settings = await getPublicSettings().catch(() => ({} as Record<string, string>));
  const rows = [
    ["Alamat", settings.address],
    ["Telepon", settings.phone],
    ["WhatsApp", settings.whatsapp],
    ["Email", settings.email],
    ["Jam buka", settings.opening_hours],
  ].filter(([, v]) => isSet(v)) as Array<[string, string]>;

  return (
    <main className="mx-auto w-full max-w-[1200px] px-5 py-12 md:px-8">
      <p className="text-sm text-[#A99B9F]">Hubungi kami</p>
      <h1 className="mt-1 font-serif text-[32px] md:text-[48px]">Contact</h1>
      {rows.length === 0 ? (
        <p className="mt-4 max-w-xl text-[15px] text-[#75696C]">
          Informasi kontak sedang dilengkapi. Silakan kembali lagi.
        </p>
      ) : (
        <dl className="mt-6 max-w-xl space-y-3">
          {rows.map(([label, value]) => (
            <div key={label} className="rounded-[16px] border border-[#EDE2E5] bg-white p-4">
              <dt className="text-xs uppercase tracking-wide text-[#A99B9F]">{label}</dt>
              <dd className="mt-1 text-[15px]">{value}</dd>
            </div>
          ))}
        </dl>
      )}
    </main>
  );
}
