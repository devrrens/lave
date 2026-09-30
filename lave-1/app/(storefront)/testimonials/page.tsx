import { db } from "@/lib/db";
import { Star } from "lucide-react";
import type { Metadata } from "next";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Testimoni Pelanggan",
  description: "Ulasan nyata dari pelanggan setia Barokah Jaya Fashion.",
};

export default async function TestimonialsPage() {
  const testimonials = await db.testimonial.findMany({
    where: { published: true },
    orderBy: { order: "asc" },
    include: { product: { select: { name: true, slug: true } } },
  });

  return (
    <main className="max-w-[1200px] mx-auto px-5 md:px-8 py-16 md:py-24">
      <div className="text-center max-w-xl mx-auto mb-14">
        <span className="text-xs tracking-[0.25em] text-[#E8B7C6] uppercase font-medium block mb-2">
          Kepuasan Pelanggan
        </span>
        <h1 className="font-serif text-3xl md:text-5xl font-bold text-[#3D3436]">
          Kata Mereka tentang Kami
        </h1>
        <p className="text-sm text-[#75696C] mt-4 leading-relaxed">
          Kepercayaan pelanggan adalah prioritas utama kami. Berikut ulasan langsung dari pelanggan setia Barokah Jaya Fashion.
        </p>
      </div>

      {testimonials.length === 0 ? (
        <div className="text-center py-20 bg-[#FFF7F3] rounded-2xl border border-[#EDE2E5]">
          <p className="text-[#A99B9F] text-sm">Belum ada testimoni tersedia.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div key={t.id} className="bg-white border border-[#EDE2E5] rounded-2xl p-6 flex flex-col justify-between">
              <div>
                <div className="flex gap-1 text-[#C79B55] mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < t.rating ? "fill-[#C79B55]" : "text-[#EDE2E5]"}`}
                    />
                  ))}
                </div>
                <p className="text-sm text-[#75696C] leading-relaxed italic">
                  &ldquo;{t.review}&rdquo;
                </p>
                {t.product && (
                  <p className="text-xs text-[#A99B9F] mt-3">
                    Produk: {t.product.name}
                  </p>
                )}
              </div>
              <div className="mt-5 pt-4 border-t border-[#EDE2E5] flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-[#3D3436]">{t.customerName}</p>
                  {t.verified && (
                    <span className="text-[10px] text-[#7A9B82] font-medium">✓ Pembeli Terverifikasi</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
