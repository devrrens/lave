import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductGallery } from "@/components/storefront/ProductGallery";
import { ProductGrid } from "@/components/storefront/ProductCard";
import { PurchasePanel } from "@/components/storefront/PurchasePanel";
import {
  getProductBySlug,
  getPublicSettings,
  getRelatedProducts,
} from "@/lib/services/storefront";
import { normalizeWaNumber } from "@/lib/whatsapp";

function siteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Produk tidak ditemukan" };
  const desc = product.description?.slice(0, 160) ?? `${product.name} — Barokah Jaya Fashion.`;
  return {
    title: product.name,
    description: desc,
    alternates: { canonical: `/product/${product.slug}` },
    openGraph: {
      title: product.name,
      description: desc,
      type: "website",
      url: `${siteUrl()}/product/${product.slug}`,
      images: product.images[0] ? [{ url: product.images[0].url }] : undefined,
    },
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const [settings, related] = await Promise.all([
    getPublicSettings().catch(() => ({} as Record<string, string>)),
    getRelatedProducts(product.id, product.categoryId),
  ]);

  const waNumber = normalizeWaNumber(settings.whatsapp);
  const brand = settings.brand_name || "Barokah Jaya Fashion";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description ?? undefined,
    category: product.category?.name ?? undefined,
    material: product.material ?? undefined,
    image: product.images.map((i) => i.url),
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "IDR",
      lowPrice: Math.min(
        ...product.variants.map((v) => v.discountPrice ?? v.price),
        product.discountPrice ?? product.price
      ),
      offerCount: Math.max(1, product.variants.length),
      availability:
        product.variants.length === 0 || product.variants.every((v) => v.stock === 0)
          ? "https://schema.org/OutOfStock"
          : "https://schema.org/InStock",
    },
  };

  return (
    <main className="mx-auto w-full max-w-[1200px] px-5 py-8 md:px-8 md:py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <nav aria-label="Breadcrumb" className="text-sm text-[#75696C]">
        <Link href="/" className="hover:text-[#3D3436]">Home</Link>
        {" / "}
        <Link href="/collection" className="hover:text-[#3D3436]">Collection</Link>
        {" / "}
        <span aria-current="page" className="text-[#3D3436]">{product.name}</span>
      </nav>

      <div className="mt-6 grid gap-8 lg:grid-cols-2 lg:gap-12">
        <ProductGallery images={product.images} name={product.name} />

        <div>
          {product.category && (
            <Link
              href={`/collection?category=${product.category.slug}`}
              className="text-sm text-[#75696C] hover:text-[#3D3436]"
            >
              {product.category.name}
            </Link>
          )}
          <h1 className="mt-1 font-serif text-[32px] leading-tight md:text-[40px]">
            {product.name}
          </h1>
          {product.material && (
            <p className="mt-1 text-sm text-[#75696C]">Material: {product.material}</p>
          )}

          <div className="mt-6">
            <PurchasePanel
              product={{
                id: product.id,
                slug: product.slug,
                name: product.name,
                price: product.price,
                discountPrice: product.discountPrice,
              }}
              brand={brand}
              waNumber={waNumber}
              coverImage={product.images[0]?.url}
              variants={product.variants}
            />
          </div>

          {product.description && (
            <section aria-label="Deskripsi" className="mt-8">
              <h2 className="text-sm font-semibold">Deskripsi</h2>
              <p className="mt-2 whitespace-pre-line text-[15px] leading-relaxed text-[#3D3436]">
                {product.description}
              </p>
            </section>
          )}

          {(product.sizeGuide || product.careGuide) && (
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {product.sizeGuide && (
                <section aria-label="Size guide" className="rounded-[16px] bg-[#FFF7F3] p-4">
                  <h2 className="text-sm font-semibold">Size Guide</h2>
                  <p className="mt-1 whitespace-pre-line text-sm text-[#75696C]">
                    {product.sizeGuide}
                  </p>
                </section>
              )}
              {product.careGuide && (
                <section aria-label="Perawatan" className="rounded-[16px] bg-[#FFF7F3] p-4">
                  <h2 className="text-sm font-semibold">Care Instructions</h2>
                  <p className="mt-1 whitespace-pre-line text-sm text-[#75696C]">
                    {product.careGuide}
                  </p>
                </section>
              )}
            </div>
          )}
        </div>
      </div>

      {related.length > 0 && (
        <section aria-label="Produk terkait" className="mt-16 md:mt-24">
          <h2 className="font-serif text-[24px] md:text-[28px]">Produk Terkait</h2>
          <div className="mt-6">
            <ProductGrid products={related} />
          </div>
        </section>
      )}
    </main>
  );
}
