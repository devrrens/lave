import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Tentang Kami",
  description: "Cerita Barokah Jaya Fashion.",
  alternates: { canonical: "/about" },
};

const VALUES = [
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
];

export default function AboutPage() {
  return (
    <main className="mx-auto w-full max-w-[1200px] px-5 py-12 md:px-8 md:py-24">
      <div className="mx-auto mb-16 max-w-2xl text-center">
        <span className="mb-2 block text-xs font-medium uppercase tracking-[0.25em] text-[#E8B7C6]">
          Kisah Kami
        </span>
        <h1 className="font-serif text-[32px] leading-tight md:text-[48px]">
          Tentang Barokah Jaya Fashion
        </h1>
      </div>

      <div className="mb-20 grid items-center gap-12 md:grid-cols-2 md:gap-20">
        <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-[#F6DDE5]">
          <Image
            src="/images/store/toko-barokah-jaya-fashion.jpeg"
            alt="Toko Barokah Jaya Fashion"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
        <div className="space-y-6">
          <h2 className="font-serif text-2xl font-semibold md:text-3xl">
            Untuk Wanita yang Menghargai Keindahan
          </h2>
          <p className="text-[15px] leading-relaxed text-[#75696C]">
            Barokah Jaya Fashion lahir dari kecintaan terhadap busana wanita yang anggun,
            nyaman, dan terjangkau. Kami percaya bahwa setiap wanita berhak tampil terbaik
            dalam keseharian mereka.
          </p>
          <p className="text-[15px] leading-relaxed text-[#75696C]">
            Setiap koleksi kami dirancang dengan penuh perhatian pada detail — dari pemilihan
            bahan yang lembut, potongan yang tepat, hingga warna yang harmonis.
          </p>
        </div>
      </div>

      <div className="rounded-3xl bg-[#FFF7F3] p-10 md:p-16">
        <h2 className="mb-10 text-center font-serif text-2xl md:text-3xl">Nilai-Nilai Kami</h2>
        <div className="grid gap-8 md:grid-cols-3">
          {VALUES.map((v) => (
            <div key={v.title} className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F6DDE5]">
                <span className="font-serif text-xl text-[#E8B7C6]">✦</span>
              </div>
              <h3 className="mb-2 font-serif text-lg font-semibold">{v.title}</h3>
              <p className="text-sm leading-relaxed text-[#75696C]">{v.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
