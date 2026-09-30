"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";

type Category = {
  id: string;
  name: string;
  slug: string;
};

export function CollectionFilters({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentCategory = searchParams.get("category") || "";
  const currentSort = searchParams.get("sort") || "";
  const currentQuery = searchParams.get("q") || "";

  const updateParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/collection?${params.toString()}`);
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center bg-white p-4 rounded-2xl border border-[#EDE2E5]">
      {/* Search Input */}
      <div className="relative flex-1 max-w-md">
        <Search className="w-4 h-4 text-[#A99B9F] absolute left-3.5 top-3" />
        <input
          type="text"
          defaultValue={currentQuery}
          onChange={(e) => updateParam("q", e.target.value)}
          placeholder="Cari koleksi busana..."
          className="w-full pl-10 pr-4 py-2 border border-[#EDE2E5] rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#E8B7C6]"
        />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {/* Category Pills */}
        <select
          value={currentCategory}
          onChange={(e) => updateParam("category", e.target.value)}
          className="px-4 py-2 border border-[#EDE2E5] rounded-full text-sm text-[#3D3436] focus:outline-none focus:ring-2 focus:ring-[#E8B7C6] bg-white"
        >
          <option value="">Semua Kategori</option>
          {categories.map((c) => (
            <option key={c.id} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>

        {/* Sort */}
        <select
          value={currentSort}
          onChange={(e) => updateParam("sort", e.target.value)}
          className="px-4 py-2 border border-[#EDE2E5] rounded-full text-sm text-[#3D3436] focus:outline-none focus:ring-2 focus:ring-[#E8B7C6] bg-white"
        >
          <option value="">Urutkan: Terbaru</option>
          <option value="price-asc">Harga: Rendah ke Tinggi</option>
          <option value="price-desc">Harga: Tinggi ke Rendah</option>
        </select>
      </div>
    </div>
  );
}
