import Link from "next/link";
import type { Metadata } from "next";
import { ProductGrid } from "@/components/storefront/ProductCard";
import { SectionHeading } from "@/components/storefront/SectionHeading";
import {
  getStorefrontCategories,
  getStorefrontProducts,
  type SortKey,
} from "@/lib/services/storefront";

export const metadata: Metadata = {
  title: "Collection",
  description: "Jelajahi koleksi fashion wanita Barokah Jaya Fashion.",
  alternates: { canonical: "/collection" },
  openGraph: {
    title: "Collection | Barokah Jaya Fashion",
    description: "Jelajahi koleksi fashion wanita Barokah Jaya Fashion.",
    type: "website",
  },
};

const SORTS: Array<{ value: SortKey; label: string }> = [
  { value: "newest", label: "Terbaru" },
  { value: "popular", label: "Populer" },
  { value: "price-asc", label: "Harga terendah" },
  { value: "price-desc", label: "Harga tertinggi" },
];

const inputCls =
  "rounded-[12px] border border-[#EDE2E5] bg-white px-3 py-2 text-sm outline-none focus:border-[#E8B7C6]";

export default async function CollectionPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const sp = await searchParams;
  const sort: SortKey = ["newest", "popular", "price-asc", "price-desc"].includes(sp.sort ?? "")
    ? (sp.sort as SortKey)
    : "newest";
  const page = Math.max(1, Number(sp.page ?? 1) || 1);

  const [result, categories] = await Promise.all([
    getStorefrontProducts({
      q: sp.q || undefined,
      category: sp.category || undefined,
      color: sp.color || undefined,
      size: sp.size || undefined,
      minPrice: sp.minPrice ? Number(sp.minPrice) : undefined,
      maxPrice: sp.maxPrice ? Number(sp.maxPrice) : undefined,
      inStock: sp.inStock === "1",
      sort,
      page,
    }),
    getStorefrontCategories(),
  ]);

  function pageHref(next: number): string {
    const p = new URLSearchParams();
    for (const [k, v] of Object.entries(sp)) if (v) p.set(k, v);
    p.set("page", String(next));
    return `/collection?${p.toString()}`;
  }

  return (
    <main className="mx-auto w-full max-w-[1200px] px-5 py-12 md:px-8">
      <SectionHeading eyebrow="Katalog" title="Collection" />

      <form method="get" className="mt-8 rounded-[16px] border border-[#EDE2E5] bg-white p-4">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
          <input
            type="search"
            name="q"
            defaultValue={sp.q ?? ""}
            placeholder="Cari produk…"
            aria-label="Cari produk"
            className={inputCls}
          />
          <select name="category" defaultValue={sp.category ?? ""} aria-label="Kategori" className={inputCls}>
            <option value="">Semua kategori</option>
            {categories.map((c) => (
              <option key={c.id} value={c.slug}>
                {c.name} ({c._count.products})
              </option>
            ))}
          </select>
          <select name="color" defaultValue={sp.color ?? ""} aria-label="Warna" className={inputCls}>
            <option value="">Semua warna</option>
            {result.colors.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <select name="size" defaultValue={sp.size ?? ""} aria-label="Ukuran" className={inputCls}>
            <option value="">Semua ukuran</option>
            {result.sizes.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <select name="sort" defaultValue={sort} aria-label="Urutkan" className={inputCls}>
            {SORTS.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              name="inStock"
              value="1"
              defaultChecked={sp.inStock === "1"}
              className="h-4 w-4 accent-[#E8B7C6]"
            />
            Stok tersedia
          </label>
        </div>
        <div className="mt-3 flex items-center gap-3">
          <button
            type="submit"
            className="rounded-full bg-[#E8B7C6] px-5 py-2 text-sm font-medium"
          >
            Terapkan
          </button>
          <Link href="/collection" className="text-sm text-[#75696C] underline">
            Reset
          </Link>
          <span className="ml-auto text-sm text-[#A99B9F]">{result.total} produk</span>
        </div>
      </form>

      <div className="mt-8">
        <ProductGrid products={result.items} />
      </div>

      {result.pageCount > 1 && (
        <nav aria-label="Halaman" className="mt-8 flex items-center justify-center gap-4 text-sm">
          {result.page > 1 ? (
            <Link href={pageHref(result.page - 1)} className="rounded-full border border-[#EDE2E5] px-4 py-2">
              ← Prev
            </Link>
          ) : null}
          <span>Halaman {result.page} / {result.pageCount}</span>
          {result.page < result.pageCount ? (
            <Link href={pageHref(result.page + 1)} className="rounded-full border border-[#EDE2E5] px-4 py-2">
              Next →
            </Link>
          ) : null}
        </nav>
      )}
    </main>
  );
}
