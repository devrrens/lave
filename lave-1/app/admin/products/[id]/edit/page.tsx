import { getCategories } from "@/lib/actions/categories";
import { getProductById } from "@/lib/actions/products";
import { ProductForm } from "@/components/admin/ProductForm";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [product, categories] = await Promise.all([
    getProductById(id),
    getCategories(),
  ]);

  if (!product) notFound();

  return (
    <div>
      <div className="mb-6">
        <Link
          href="/admin/products"
          className="inline-flex items-center gap-1 text-sm text-[#75696C] hover:text-[#3D3436] mb-4"
        >
          <ChevronLeft className="w-4 h-4" />
          Kembali ke Produk
        </Link>
        <h1 className="text-2xl font-semibold text-[#3D3436]">Edit Produk</h1>
      </div>
      <div className="bg-white rounded-2xl border border-[#EDE2E5] p-6">
        <ProductForm categories={categories} product={product} />
      </div>
    </div>
  );
}
