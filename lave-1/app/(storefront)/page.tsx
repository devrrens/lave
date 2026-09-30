import { db } from "@/lib/db";
import { HeroSection } from "@/components/storefront/HeroSection";
import {
  FeaturedSection,
  NewArrivalsSection,
  BestSellersSection,
} from "@/components/storefront/ProductSections";
import { BrandStorySection } from "@/components/storefront/BrandStorySection";
import { TestimonialsSection } from "@/components/storefront/TestimonialsSection";

export const revalidate = 60; // ISR 1 minute

export default async function HomePage() {
  const [featuredProducts, newArrivals, bestSellers, testimonials] =
    await Promise.all([
      db.product.findMany({
        where: { status: "PUBLISHED", featured: true },
        include: {
          images: { orderBy: { order: "asc" } },
          category: true,
        },
        take: 8,
        orderBy: { createdAt: "desc" },
      }),
      db.product.findMany({
        where: { status: "PUBLISHED", newArrival: true },
        include: {
          images: { orderBy: { order: "asc" } },
          category: true,
        },
        take: 4,
        orderBy: { createdAt: "desc" },
      }),
      db.product.findMany({
        where: { status: "PUBLISHED", bestSeller: true },
        include: {
          images: { orderBy: { order: "asc" } },
          category: true,
        },
        take: 4,
        orderBy: { createdAt: "desc" },
      }),
      db.testimonial.findMany({
        where: { published: true },
        orderBy: { order: "asc" },
        take: 3,
      }),
    ]);

  return (
    <main>
      <HeroSection />
      <FeaturedSection products={featuredProducts} />
      <NewArrivalsSection products={newArrivals} />
      <BrandStorySection />
      <BestSellersSection products={bestSellers} />
      <TestimonialsSection testimonials={testimonials} />
    </main>
  );
}
