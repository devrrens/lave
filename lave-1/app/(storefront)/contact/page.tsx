export const runtime = 'edge';
import { getSettings } from "@/lib/actions/testimonials-settings";
import { MessageCircle, MapPin, Clock, Mail, Phone } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kontak & Lokasi",
  description: "Hubungi Barokah Jaya Fashion atau kunjungi butik kami.",
};

export default async function ContactPage() {
  const settings = await getSettings();

  const whatsapp = settings.whatsapp || "6281234567890";
  const phone = settings.phone || "-";
  const email = settings.email || "-";
  const address = settings.address || "Jakarta, Indonesia";
  const openingHours = settings.openingHours || "Senin - Sabtu: 09:00 - 17:00 WIB";

  return (
    <main className="max-w-[1200px] mx-auto px-5 md:px-8 py-16 md:py-24">
      <div className="text-center max-w-xl mx-auto mb-14">
        <span className="text-xs tracking-[0.25em] text-[#E8B7C6] uppercase font-medium block mb-2">
          Hubungi Kami
        </span>
        <h1 className="font-serif text-3xl md:text-5xl font-bold text-[#3D3436]">
          Kami Senang Mendengar dari Anda
        </h1>
        <p className="text-sm text-[#75696C] mt-4 leading-relaxed">
          Punya pertanyaan tentang produk, ukuran, atau ingin memesan langsung? Tim kami siap membantu.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
        {/* WhatsApp Card */}
        <div className="bg-[#FFF7F3] border border-[#EDE2E5] rounded-3xl p-8 flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 bg-[#7A9B82]/20 rounded-2xl flex items-center justify-center mb-6">
              <MessageCircle className="w-6 h-6 text-[#7A9B82]" />
            </div>
            <h2 className="font-serif font-bold text-xl text-[#3D3436] mb-2">
              WhatsApp CS
            </h2>
            <p className="text-sm text-[#75696C] leading-relaxed mb-6">
              Respon tercepat untuk konsultasi produk, cek stok, dan pemesanan langsung.
            </p>
          </div>
          <a
            href={`https://wa.me/${whatsapp}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center gap-2 w-full py-3.5 bg-[#7A9B82] hover:bg-[#6a8a72] text-white font-medium rounded-full text-sm transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            Chat Sekarang
          </a>
        </div>

        {/* Store Info Card */}
        <div className="bg-white border border-[#EDE2E5] rounded-3xl p-8 space-y-6">
          <h2 className="font-serif font-bold text-xl text-[#3D3436]">
            Informasi Butik
          </h2>

          <div className="space-y-4 text-sm">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-[#E8B7C6] shrink-0 mt-0.5" />
              <div>
                <span className="font-medium text-[#3D3436] block">Alamat</span>
                <span className="text-[#75696C]">{address}</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-[#E8B7C6] shrink-0 mt-0.5" />
              <div>
                <span className="font-medium text-[#3D3436] block">Jam Buka</span>
                <span className="text-[#75696C]">{openingHours}</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone className="w-5 h-5 text-[#E8B7C6] shrink-0 mt-0.5" />
              <div>
                <span className="font-medium text-[#3D3436] block">Telepon</span>
                <span className="text-[#75696C]">{phone}</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-[#E8B7C6] shrink-0 mt-0.5" />
              <div>
                <span className="font-medium text-[#3D3436] block">Email</span>
                <span className="text-[#75696C]">{email}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
