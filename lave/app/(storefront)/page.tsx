import Link from "next/link";
import type { Metadata } from "next";
import { ProductGrid } from "@/components/storefront/ProductCard";
import { SectionHeading } from "@/components/storefront/SectionHeading";
import { TestimonialCard } from "@/components/storefront/TestimonialCard";
import { BrandStory, Hero, PromoBanner, StoreInfo } from "@/components/storefront/HomeSections";
import { getHomepage } from "@/lib/services/homepage";
import { getPublicSettings } from "@/lib/services/storefront";

export const metadata: Metadata = {
  title: "Barokah Jaya Fashion",
  description: "Discover feminine pieces made for your everyday moments.",
  alternates: { canonical: "/" },
};

export default async function HomePage() {
  const [{ section, featured, newArrivals, bestSellers, testimonials }, settings] =
    await Promise.all([
      getHomepage().catch(() => ({
        section: () => undefined,
        featured: [],
        newArrivals: [],
        bestSellers: [],
        testimonials: [],
      })),
      getPublicSettings().catch(() => ({} as Record<string, string>)),
    ]);

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ClothingStore",
            name: settings.brand_name || "Barokah Jaya Fashion",
            url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
            ...(settings.address && !settings.address.startsWith("TODO")
              ? { address: settings.address }
              : {}),
            ...(["instagram", "tiktok", "facebook"]
              .map((k) => settings[k])
              .filter((v) => v && !v.startsWith("TODO")).length > 0
              ? {
                  sameAs: ["instagram", "tiktok", "facebook"]
                    .map((k) => settings[k])
                    .filter((v): v is string => !!v && !v.startsWith("TODO")),
                }
              : {}),
          }),
        }}
      />
      <Hero section={section("hero")} fallbackImage={featured[0]?.images[0]?.url} />

      <div className="mt-16 space-y-16 md:mt-24 md:space-y-24">
        {featured.length > 0 && (
          <section aria-label="Featured collection" className="mx-auto w-full max-w-[1200px] px-5 md:px-8">
            <SectionHeading eyebrow="Pilihan kami" title={section("featured")?.title || "Featured Collection"} />
            <div className="mt-8">
              <ProductGrid products={featured} />
            </div>
          </section>
        )}

        {newArrivals.length > 0 && (
          <section aria-label="New arrivals" className="mx-auto w-full max-w-[1200px] px-5 md:px-8">
            <SectionHeading eyebrow="Baru datang" title={section("new_arrivals")?.title || "New Arrivals"} />
            <div className="mt-8">
              <ProductGrid products={newArrivals} />
            </div>
          </section>
        )}

        <BrandStory section={section("brand_story")} />

        {bestSellers.length > 0 && (
          <section aria-label="Best sellers" className="mx-auto w-full max-w-[1200px] px-5 md:px-8">
            <SectionHeading eyebrow="Favorit pelanggan" title={section("best_sellers")?.title || "Best Sellers"} />
            <div className="mt-8">
              <ProductGrid products={bestSellers} />
            </div>
          </section>
        )}

        <PromoBanner section={section("banner")} />

        {testimonials.length > 0 && section("testimonials")?.isVisible !== false && (
          <section aria-label="Testimonials" className="mx-auto w-full max-w-[1200px] px-5 md:px-8">
            <SectionHeading
              eyebrow="Kata mereka"
              title={section("testimonials")?.title || "Testimonials"}
            />
            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {testimonials.map((t) => (
                <TestimonialCard key={t.id} t={t} />
              ))}
            </div>
            <p className="mt-6 text-center">
              <Link href="/testimonials" className="text-sm font-medium underline">
                Lihat semua ulasan →
              </Link>
            </p>
          </section>
        )}

        <StoreInfo settings={settings} />
      </div>
    </main>
  );
}
