"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Pencil, Trash2 } from "lucide-react";
import { deleteCategory } from "@/lib/actions/categories";
import { useRouter } from "next/navigation";

type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  _count: { products: number };
};

export function CategoryListClient({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState<string | null>(null);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Hapus kategori "${name}"? Produk di dalamnya tidak akan terhapus.`)) return;
    setDeleting(id);
    try {
      await deleteCategory(id);
      router.refresh();
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-[#EDE2E5] overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-[#EDE2E5] bg-[#FFFCFA]">
            <th className="text-left px-5 py-3.5 text-[#75696C] font-medium">Kategori</th>
            <th className="text-left px-5 py-3.5 text-[#75696C] font-medium hidden sm:table-cell">Slug</th>
            <th className="text-right px-5 py-3.5 text-[#75696C] font-medium">Produk</th>
            <th className="text-right px-5 py-3.5 text-[#75696C] font-medium">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((cat) => (
            <tr key={cat.id} className="border-b border-[#EDE2E5] last:border-0 hover:bg-[#FFFCFA]">
              <td className="px-5 py-4">
                <div className="flex items-center gap-3">
                  {cat.image ? (
                    <Image
                      src={cat.image}
                      alt={cat.name}
                      width={36}
                      height={36}
                      className="rounded-lg object-cover"
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-lg bg-[#FBECEF] flex items-center justify-center text-[#E8B7C6] text-xs font-bold">
                      {cat.name[0]}
                    </div>
                  )}
                  <span className="font-medium text-[#3D3436]">{cat.name}</span>
                </div>
              </td>
              <td className="px-5 py-4 text-[#75696C] hidden sm:table-cell">{cat.slug}</td>
              <td className="px-5 py-4 text-right text-[#75696C]">{cat._count.products}</td>
              <td className="px-5 py-4 text-right">
                <div className="flex items-center justify-end gap-2">
                  <Link
                    href={`/admin/categories/${cat.id}/edit`}
                    className="p-1.5 text-[#75696C] hover:text-[#3D3436] hover:bg-[#FFF7F3] rounded-lg transition-colors"
                  >
                    <Pencil className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={() => handleDelete(cat.id, cat.name)}
                    disabled={deleting === cat.id}
                    className="p-1.5 text-[#A99B9F] hover:text-[#B86A72] hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
