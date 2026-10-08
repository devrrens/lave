import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Tentang Kami",
  description: "Kenali Barokah Jaya Fashion — boutique fashion wanita dengan koleksi elegan dan feminin.",
};

export default function AboutPage() {
  return (
    <main className="max-w-[1200px] mx-auto px-5 md:px-8 py-16 md:py-24">
      {/* Hero */}
      <div className="text-center max-w-2xl mx-auto mb-16">
        <span className="text-xs tracking-[0.25em] text-[#E8B7C6] uppercase font-medium block mb-2">
          Kisah Kami
        </span>
        <h1 className="font-serif text-3xl md:text-5xl font-bold text-[#3D3436] leading-tight">
          Tentang<br />
          <em className="not-italic text-[#E8B7C6]">Barokah Jaya Fashion</em>
        </h1>
      </div>

      {/* Story */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center mb-20">
        <div className="relative aspect-[4/5] bg-[#F6DDE5] rounded-3xl overflow-hidden">
          <Image
            src="/images/store/toko-barokah-jaya-fashion.jpeg"
            alt="Toko Barokah Jaya Fashion"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
        <div className="space-y-6">
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-[#3D3436]">
            Untuk Wanita yang Menghargai Keindahan
          </h2>
          <p className="text-sm md:text-base text-[#75696C] leading-relaxed">
            Barokah Jaya Fashion lahir dari kecintaan terhadap busana wanita yang anggun, nyaman, dan terjangkau. Kami percaya bahwa setiap wanita berhak tampil terbaik dalam keseharian mereka.
          </p>
          <p className="text-sm md:text-base text-[#75696C] leading-relaxed">
            Setiap koleksi kami dirancang dengan penuh perhatian pada detail — dari pemilihan bahan yang lembut, potongan yang tepat, hingga warna yang harmonis. Hasilnya adalah busana yang tidak hanya indah dipandang, tetapi juga nyaman dipakai sepanjang hari.
          </p>
        </div>
      </div>

      {/* Values */}
      <div className="bg-[#FFF7F3] rounded-3xl p-10 md:p-16">
        <div className="text-center mb-10">
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-[#3D3436]">
            Nilai-Nilai Kami
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: "Kualitas Terjaga",
              desc: "Setiap produk melewati seleksi ketat untuk memastikan kualitas bahan dan jahitan terbaik.",
            },
            {
              title: "Desain Feminin",
              desc: "Koleksi kami dirancang khusus untuk menonjolkan keanggunan dan kelembutan wanita Indonesia.",
            },
            {
              title: "Pelayanan Tulus",
              desc: "Kami melayani setiap pelanggan dengan sepenuh hati, dari konsultasi ukuran hingga pengiriman.",
            },
          ].map((v) => (
            <div key={v.title} className="text-center">
              <div className="w-12 h-12 bg-[#F6DDE5] rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="font-serif text-xl text-[#E8B7C6]">✦</span>
              </div>
              <h3 className="font-serif font-bold text-lg text-[#3D3436] mb-2">{v.title}</h3>
              <p className="text-sm text-[#75696C] leading-relaxed">{v.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
