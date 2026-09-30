import { Star } from "lucide-react";

type Testimonial = {
  id: string;
  customerName: string;
  image: string | null;
  rating: number;
  review: string;
  verified: boolean;
};

export function TestimonialsSection({ testimonials }: { testimonials: Testimonial[] }) {
  if (testimonials.length === 0) return null;

  return (
    <section className="max-w-[1200px] mx-auto px-5 md:px-8 py-16 md:py-24">
      <div className="text-center max-w-xl mx-auto mb-12">
        <span className="text-xs tracking-[0.25em] text-[#E8B7C6] uppercase font-medium block mb-2">
          Testimoni
        </span>
        <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#3D3436]">
          Kata Mereka tentang Kami
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {testimonials.map((t) => (
          <div
            key={t.id}
            className="bg-white border border-[#EDE2E5] rounded-2xl p-6 flex flex-col justify-between"
          >
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
            </div>
            <div className="mt-6 pt-4 border-t border-[#EDE2E5] flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-[#3D3436]">{t.customerName}</p>
                {t.verified && (
                  <span className="text-[10px] text-[#7A9B82] font-medium">
                    ✓ Pembeli Terverifikasi
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
