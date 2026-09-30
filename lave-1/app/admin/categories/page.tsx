import { getCategories } from "@/lib/actions/categories";
import Link from "next/link";
import { Plus, Package } from "lucide-react";
import { CategoryListClient } from "@/components/admin/CategoryListClient";

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-[#3D3436]">Kategori</h1>
          <p className="text-sm text-[#75696C] mt-1">
            Kelola kategori produk
          </p>
        </div>
        <Link
          href="/admin/categories/new"
          className="flex items-center gap-2 px-4 py-2 bg-[#E8B7C6] hover:bg-[#dca4b4] text-[#3D3436] font-medium rounded-full text-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          Tambah Kategori
        </Link>
      </div>

      {categories.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#EDE2E5] p-12 text-center">
          <Package className="w-12 h-12 text-[#EDE2E5] mx-auto mb-3" />
          <p className="text-[#A99B9F] text-sm mb-4">Belum ada kategori</p>
          <Link
            href="/admin/categories/new"
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#E8B7C6] hover:bg-[#dca4b4] text-[#3D3436] font-medium rounded-full text-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            Buat Kategori Pertama
          </Link>
        </div>
      ) : (
        <CategoryListClient categories={categories} />
      )}
    </div>
  );
}
