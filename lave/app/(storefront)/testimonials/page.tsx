import type { Metadata } from "next";
import { SectionHeading } from "@/components/storefront/SectionHeading";
import { TestimonialCard } from "@/components/storefront/TestimonialCard";
import { db } from "@/lib/db";

export const metadata: Metadata = {
  title: "Testimonials",
  description: "Ulasan pelanggan Barokah Jaya Fashion.",
  alternates: { canonical: "/testimonials" },
};

export default async function TestimonialsPage() {
  const items = await db.testimonial.findMany({
    where: { published: true },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  }).catch(() => []);

  return (
    <main className="mx-auto w-full max-w-[1200px] px-5 py-12 md:px-8">
      <SectionHeading eyebrow="Ulasan pelanggan" title="Testimonials" />
      {items.length === 0 ? (
        <p className="mx-auto mt-8 max-w-md text-center text-[15px] text-[#75696C]">
          Belum ada ulasan yang dipublikasikan. Jadilah yang pertama bercerita tentang pengalamanmu.
        </p>
      ) : (
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {items.map((t) => (
            <TestimonialCard key={t.id} t={t} />
          ))}
        </div>
      )}
    </main>
  );
}
