export const runtime = 'edge';
import { db } from "@/lib/db";
import { ProductGrid } from "@/components/storefront/ProductSections";
import { CollectionFilters } from "@/components/storefront/CollectionFilters";
import { Suspense } from "react";

export const revalidate = 60;

type Props = {
  searchParams: Promise<{
    category?: string;
    q?: string;
    sort?: string;
    minPrice?: string;
    maxPrice?: string;
    featured?: string;
    new?: string;
    bestseller?: string;
  }>;
};

export default async function CollectionPage({ searchParams }: Props) {
  const params = await searchParams;

  const categories = await db.category.findMany({
    orderBy: { name: "asc" },
  });

  const where: Record<string, unknown> = {
    status: "PUBLISHED",
  };

  if (params.category) {
    where.category = { slug: params.category };
  }

  if (params.q) {
    where.OR = [
      { name: { contains: params.q, mode: "insensitive" } },
      { description: { contains: params.q, mode: "insensitive" } },
    ];
  }

  if (params.featured === "1") where.featured = true;
  if (params.new === "1") where.newArrival = true;
  if (params.bestseller === "1") where.bestSeller = true;

  if (params.minPrice || params.maxPrice) {
    where.price = {};
    if (params.minPrice) (where.price as Record<string, number>).gte = parseFloat(params.minPrice);
    if (params.maxPrice) (where.price as Record<string, number>).lte = parseFloat(params.maxPrice);
  }

  let orderBy: Record<string, "asc" | "desc"> = { createdAt: "desc" };
  if (params.sort === "price-asc") orderBy = { price: "asc" };
  if (params.sort === "price-desc") orderBy = { price: "desc" };

  const products = await db.product.findMany({
    where,
    orderBy,
    include: {
      images: { orderBy: { order: "asc" } },
      category: true,
    },
  });

  return (
    <div className="max-w-[1200px] mx-auto px-5 md:px-8 py-12">
      {/* Header */}
      <div className="mb-10 text-center max-w-xl mx-auto">
        <span className="text-xs tracking-[0.25em] text-[#E8B7C6] uppercase font-medium block mb-2">
          Koleksi Kami
        </span>
        <h1 className="font-serif text-3xl md:text-5xl font-bold text-[#3D3436]">
          Semua Produk
        </h1>
        <p className="text-sm text-[#75696C] mt-3">
          Temukan busana wanita yang tepat untuk melengkapi pesona dan gaya Anda sehari-hari.
        </p>
      </div>

      {/* Filter and Content */}
      <div className="space-y-8">
        <Suspense fallback={null}>
          <CollectionFilters categories={categories} />
        </Suspense>

        {products.length === 0 ? (
          <div className="text-center py-20 bg-[#FFF7F3] rounded-2xl border border-[#EDE2E5]">
            <p className="font-serif text-lg text-[#3D3436] mb-1">
              Tidak ada produk yang sesuai
            </p>
            <p className="text-xs text-[#A99B9F]">
              Coba ubah kata kunci pencarian atau reset filter.
            </p>
          </div>
        ) : (
          <ProductGrid products={products} />
        )}
      </div>
    </div>
  );
}
