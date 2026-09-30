import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { CategoryForm } from "@/components/admin/CategoryForm";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default async function EditCategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const category = await db.category.findUnique({ where: { id } });
  if (!category) notFound();

  return (
    <div>
      <div className="mb-6">
        <Link
          href="/admin/categories"
          className="inline-flex items-center gap-1 text-sm text-[#75696C] hover:text-[#3D3436] mb-4"
        >
          <ChevronLeft className="w-4 h-4" />
          Kembali ke Kategori
        </Link>
        <h1 className="text-2xl font-semibold text-[#3D3436]">Edit Kategori</h1>
      </div>
      <div className="bg-white rounded-2xl border border-[#EDE2E5] p-6">
        <CategoryForm category={category} />
      </div>
    </div>
  );
}
