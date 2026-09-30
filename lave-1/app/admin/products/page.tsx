export const runtime = 'edge';
import { getProducts } from "@/lib/actions/products";
import { getCategories } from "@/lib/actions/categories";
import Link from "next/link";
import { Plus, Package } from "lucide-react";
import { ProductListClient } from "@/components/admin/ProductListClient";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; status?: string; q?: string }>;
}) {
  const params = await searchParams;
  const [products, categories] = await Promise.all([
    getProducts({
      categoryId: params.category,
      status: params.status,
      search: params.q,
    }),
    getCategories(),
  ]);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-[#3D3436]">Produk</h1>
          <p className="text-sm text-[#75696C] mt-1">
            Kelola katalog dan varian produk
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="flex items-center gap-2 px-4 py-2 bg-[#E8B7C6] hover:bg-[#dca4b4] text-[#3D3436] font-medium rounded-full text-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          Tambah Produk
        </Link>
      </div>

      {products.length === 0 && !params.q && !params.category && !params.status ? (
        <div className="bg-white rounded-2xl border border-[#EDE2E5] p-12 text-center">
          <Package className="w-12 h-12 text-[#EDE2E5] mx-auto mb-3" />
          <p className="text-[#A99B9F] text-sm mb-4">Belum ada produk</p>
          <Link
            href="/admin/products/new"
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#E8B7C6] hover:bg-[#dca4b4] text-[#3D3436] font-medium rounded-full text-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            Buat Produk Pertama
          </Link>
        </div>
      ) : (
        <ProductListClient products={products} categories={categories} />
      )}
    </div>
  );
}
