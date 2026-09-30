import Image from "next/image";
import Link from "next/link";
import { priceOf } from "@/lib/pricing";
import { PriceDisplay } from "./PriceDisplay";

export type CardProduct = {
  id: string;
  name: string;
  slug: string;
  price: number;
  discountPrice: number | null;
  isBestSeller: boolean;
  isNewArrival: boolean;
  category: { name: string } | null;
  images: Array<{ url: string; alt: string | null }>;
  variants: Array<{ price: number; discountPrice: number | null; stock: number }>;
};

export function ProductCard({ product }: { product: CardProduct }) {
  const img = product.images[0];
  const sells = product.variants.length
    ? product.variants.map((v) => priceOf(product, v).sell)
    : [priceOf(product).sell];
  const min = Math.min(...sells);
  const max = Math.max(...sells);
  const out = product.variants.length > 0 && product.variants.every((v) => v.stock === 0);
  const badge = product.isNewArrival ? "New" : product.isBestSeller ? "Best Seller" : null;

  return (
    <Link
      href={`/product/${product.slug}`}
      className="group overflow-hidden rounded-[16px] border border-[#EDE2E5] bg-white"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-[#FBECEF]">
        {img ? (
          <Image
            src={img.url}
            alt={img.alt || product.name}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-[#A99B9F]">
            Tanpa foto
          </div>
        )}
        {badge && (
          <span className="absolute left-2 top-2 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-medium">
            {badge}
          </span>
        )}
        {out && (
          <span className="absolute right-2 top-2 rounded-full bg-[#3D3436]/80 px-2.5 py-1 text-[11px] font-medium text-white">
            Habis
          </span>
        )}
      </div>
      <div className="p-3">
        <p className="truncate text-[13px] text-[#75696C]">{product.category?.name ?? "—"}</p>
        <h3 className="mt-0.5 line-clamp-2 text-sm font-medium leading-snug">{product.name}</h3>
        <PriceDisplay
          sell={min}
          original={null}
          className="mt-1 text-sm"
        />
        {max > min && <span className="sr-only">hingga {max}</span>}
      </div>
    </Link>
  );
}

export function ProductGrid({ products }: { products: CardProduct[] }) {
  if (products.length === 0) {
    return (
      <div className="rounded-[16px] border border-[#EDE2E5] bg-white p-10 text-center">
        <p className="font-medium">Tidak ada produk ditemukan.</p>
        <p className="mt-1 text-sm text-[#75696C]">Coba ubah filter atau kata kunci.</p>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}
