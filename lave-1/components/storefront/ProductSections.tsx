import Link from "next/link";
import { ProductCard } from "./ProductCard";

type Product = {
  id: string;
  name: string;
  slug: string;
  price: number;
  discountPrice: number | null;
  images: { url: string }[];
  category: { name: string };
  newArrival: boolean;
  bestSeller: boolean;
};

type SectionHeadingProps = {
  label?: string;
  title: string;
  href?: string;
  hrefLabel?: string;
};

export function SectionHeading({ label, title, href, hrefLabel }: SectionHeadingProps) {
  return (
    <div className="flex items-end justify-between mb-8">
      <div>
        {label && (
          <span className="text-xs tracking-[0.25em] text-[#E8B7C6] uppercase font-medium block mb-2">
            {label}
          </span>
        )}
        <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#3D3436]">{title}</h2>
      </div>
      {href && (
        <Link
          href={href}
          className="text-sm font-medium text-[#75696C] hover:text-[#3D3436] border-b border-[#EDE2E5] hover:border-[#3D3436] transition-colors pb-0.5 hidden sm:block"
        >
          {hrefLabel || "Lihat Semua"}
        </Link>
      )}
    </div>
  );
}

export function ProductGrid({ products }: { products: Product[] }) {
  if (products.length === 0) return null;
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}

export function FeaturedSection({ products }: { products: Product[] }) {
  if (products.length === 0) return null;
  return (
    <section className="max-w-[1200px] mx-auto px-5 md:px-8 py-16 md:py-24">
      <SectionHeading
        label="Pilihan Terbaik"
        title="Koleksi Unggulan"
        href="/collection?featured=1"
      />
      <ProductGrid products={products.slice(0, 8)} />
    </section>
  );
}

export function NewArrivalsSection({ products }: { products: Product[] }) {
  if (products.length === 0) return null;
  return (
    <section className="bg-[#FFFCFA] py-16 md:py-24">
      <div className="max-w-[1200px] mx-auto px-5 md:px-8">
        <SectionHeading
          label="Terbaru"
          title="New Arrivals"
          href="/collection?new=1"
        />
        <ProductGrid products={products.slice(0, 4)} />
        <div className="mt-10 text-center sm:hidden">
          <Link
            href="/collection?new=1"
            className="inline-flex items-center justify-center px-7 py-3 border border-[#EDE2E5] text-[#3D3436] font-medium rounded-full text-sm"
          >
            Lihat Semua Produk Baru
          </Link>
        </div>
      </div>
    </section>
  );
}

export function BestSellersSection({ products }: { products: Product[] }) {
  if (products.length === 0) return null;
  return (
    <section className="max-w-[1200px] mx-auto px-5 md:px-8 py-16 md:py-24">
      <SectionHeading
        label="Paling Diminati"
        title="Best Sellers"
        href="/collection?bestseller=1"
      />
      <ProductGrid products={products.slice(0, 4)} />
    </section>
  );
}
