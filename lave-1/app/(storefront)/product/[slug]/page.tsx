export const runtime = 'edge';
import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { ProductGallery } from "@/components/storefront/ProductGallery";
import { VariantSelector } from "@/components/storefront/VariantSelector";
import { ProductGrid, SectionHeading } from "@/components/storefront/ProductSections";
import { Metadata } from "next";

export const revalidate = 60;

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await db.product.findUnique({
    where: { slug },
  });

  if (!product) return {};

  return {
    title: product.name,
    description: product.description || `Beli ${product.name} di Barokah Jaya Fashion`,
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;

  const product = await db.product.findUnique({
    where: { slug },
    include: {
      category: true,
      images: { orderBy: { order: "asc" } },
      variants: { orderBy: { createdAt: "asc" } },
    },
  });

  if (!product || product.status !== "PUBLISHED") {
    notFound();
  }

  const relatedProducts = await db.product.findMany({
    where: {
      categoryId: product.categoryId,
      id: { not: product.id },
      status: "PUBLISHED",
    },
    include: {
      images: { orderBy: { order: "asc" } },
      category: true,
    },
    take: 4,
  });

  const storeSetting = await db.storeSetting.findUnique({
    where: { key: "whatsapp" },
  });
  const whatsappNumber = storeSetting?.value || "6281234567890";

  return (
    <div className="max-w-[1200px] mx-auto px-5 md:px-8 py-10 md:py-16">
      {/* Product Detail Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16">
        {/* Left: Gallery */}
        <ProductGallery images={product.images} name={product.name} />

        {/* Right: Info & Purchase Form */}
        <div className="space-y-6">
          <div>
            <span className="text-xs text-[#A99B9F] uppercase tracking-wider block mb-1">
              {product.category.name}
            </span>
            <h1 className="font-serif text-2xl md:text-4xl font-bold text-[#3D3436] leading-tight">
              {product.name}
            </h1>
          </div>

          {/* Pricing */}
          <div className="flex items-baseline gap-3 border-b border-[#EDE2E5] pb-6">
            <span className="text-2xl font-bold text-[#3D3436]">
              Rp {(product.discountPrice ?? product.price).toLocaleString("id-ID")}
            </span>
            {product.discountPrice && (
              <span className="text-base text-[#A99B9F] line-through">
                Rp {product.price.toLocaleString("id-ID")}
              </span>
            )}
          </div>

          {/* Material */}
          {product.material && (
            <div className="text-sm text-[#75696C]">
              <span className="font-medium text-[#3D3436]">Bahan:</span> {product.material}
            </div>
          )}

          {/* Variant Selector + Add to Cart / WA CTA */}
          <VariantSelector
            product={{
              id: product.id,
              name: product.name,
              price: product.discountPrice ?? product.price,
              slug: product.slug,
              image: product.images[0]?.url,
            }}
            variants={product.variants}
            whatsappNumber={whatsappNumber}
          />

          {/* Description & Care */}
          {product.description && (
            <div className="pt-6 border-t border-[#EDE2E5] space-y-3">
              <h3 className="font-serif font-bold text-[#3D3436]">Deskripsi Produk</h3>
              <p className="text-sm text-[#75696C] leading-relaxed whitespace-pre-line">
                {product.description}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="mt-24 pt-16 border-t border-[#EDE2E5]">
          <SectionHeading title="Produk Serupa" label="Rekomendasi" />
          <ProductGrid products={relatedProducts} />
        </div>
      )}
    </div>
  );
}
