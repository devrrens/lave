import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-[#FFF7F3] border-t border-[#EDE2E5] text-[#3D3436] mt-24">
      <div className="max-w-[1200px] mx-auto px-5 md:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand Col */}
          <div className="md:col-span-1 space-y-4">
            <h3 className="font-serif text-2xl font-bold">Barokah Jaya</h3>
            <p className="text-xs text-[#75696C] leading-relaxed">
              Boutique fashion wanita dengan koleksi pilihan yang anggun, feminin, dan nyaman untuk momen istimewa Anda.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold tracking-widest text-[#75696C] uppercase">
              Navigasi
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="hover:text-[#E8B7C6] transition-colors">
                  Beranda
                </Link>
              </li>
              <li>
                <Link href="/collection" className="hover:text-[#E8B7C6] transition-colors">
                  Koleksi Lengkap
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-[#E8B7C6] transition-colors">
                  Tentang Kami
                </Link>
              </li>
              <li>
                <Link href="/testimonials" className="hover:text-[#E8B7C6] transition-colors">
                  Testimoni Pelanggan
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold tracking-widest text-[#75696C] uppercase">
              Bantuan
            </h4>
            <ul className="space-y-2 text-sm text-[#75696C]">
              <li>Cara Pemesanan</li>
              <li>Panduan Ukuran</li>
              <li>Pertanyaan Umum (FAQ)</li>
              <li>
                <Link href="/contact" className="hover:text-[#E8B7C6] transition-colors">
                  Hubungi Kami
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Hours */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold tracking-widest text-[#75696C] uppercase">
              Jam Operasional
            </h4>
            <p className="text-xs text-[#75696C] leading-relaxed">
              Senin - Sabtu: 09:00 - 17:00 WIB
              <br />
              Minggu & Hari Libur: Tutup
            </p>
            <div className="pt-2">
              <span className="text-xs text-[#75696C]">Pemesanan via WhatsApp:</span>
              <p className="text-sm font-semibold text-[#3D3436]">
                Respons Cepat Setiap Hari
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-[#EDE2E5] mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#A99B9F]">
          <p>© {new Date().getFullYear()} Barokah Jaya Fashion. Hak Cipta Dilindungi.</p>
          <p className="font-serif italic">Soft Pink Boutique Collection</p>
        </div>
      </div>
    </footer>
  );
}
