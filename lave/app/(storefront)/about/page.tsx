import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description: "Cerita Barokah Jaya Fashion.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <main className="mx-auto w-full max-w-[1200px] px-5 py-12 md:px-8">
      <p className="text-sm text-[#A99B9F]">Tentang kami</p>
      <h1 className="mt-1 font-serif text-[32px] md:text-[48px]">Brand Story</h1>
      <p className="mt-4 max-w-xl text-[15px] text-[#75696C]">
        Halaman brand story lengkap menyusul di Fase 8 (Homepage & CMS).
      </p>
    </main>
  );
}
