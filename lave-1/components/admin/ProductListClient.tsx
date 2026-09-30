"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Pencil, Trash2, Copy, Eye, Search } from "lucide-react";
import { deleteProduct, duplicateProduct } from "@/lib/actions/products";
import { useRouter, useSearchParams } from "next/navigation";

type Product = {
  id: string;
  name: string;
  slug: string;
  price: number;
  discountPrice: number | null;
  status: string;
  featured: boolean;
  bestSeller: boolean;
  newArrival: boolean;
  category: { id: string; name: string };
  images: { url: string }[];
  variants: { stock: number }[];
};

type Category = {
  id: string;
  name: string;
};

export function ProductListClient({
  products,
  categories,
}: {
  products: Product[];
  categories: Category[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const q = fd.get("q") as string;
    const cat = fd.get("category") as string;
    const st = fd.get("status") as string;
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (cat) params.set("category", cat);
    if (st) params.set("status", st);
    router.push(`/admin/products?${params.toString()}`);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Hapus produk "${name}" beserta semua variannya?`)) return;
    setLoadingId(id);
    try {
      await deleteProduct(id);
      router.refresh();
    } finally {
      setLoadingId(null);
    }
  };

  const handleDuplicate = async (id: string) => {
    setLoadingId(id);
    try {
      await duplicateProduct(id);
      router.refresh();
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <form onSubmit={handleSearch} className="bg-white p-4 rounded-2xl border border-[#EDE2E5] flex flex-wrap gap-3 items-center">
        <div className="flex-1 min-w-[200px] relative">
          <Search className="w-4 h-4 text-[#A99B9F] absolute left-3 top-3" />
          <input
            type="text"
            name="q"
            defaultValue={searchParams.get("q") || ""}
            placeholder="Cari nama produk..."
            className="w-full pl-9 pr-3 py-2 border border-[#EDE2E5] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#E8B7C6]"
          />
        </div>

        <select
          name="category"
          defaultValue={searchParams.get("category") || ""}
          className="px-3 py-2 border border-[#EDE2E5] rounded-xl text-sm text-[#3D3436] focus:outline-none focus:ring-2 focus:ring-[#E8B7C6]"
        >
          <option value="">Semua Kategori</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        <select
          name="status"
          defaultValue={searchParams.get("status") || ""}
          className="px-3 py-2 border border-[#EDE2E5] rounded-xl text-sm text-[#3D3436] focus:outline-none focus:ring-2 focus:ring-[#E8B7C6]"
        >
          <option value="">Semua Status</option>
          <option value="PUBLISHED">Published</option>
          <option value="DRAFT">Draft</option>
        </select>

        <button
          type="submit"
          className="px-4 py-2 bg-[#FBECEF] hover:bg-[#F6DDE5] text-[#3D3436] font-medium rounded-xl text-sm transition-colors"
        >
          Filter
        </button>
      </form>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-[#EDE2E5] overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#EDE2E5] bg-[#FFFCFA]">
              <th className="text-left px-5 py-3.5 text-[#75696C] font-medium">Produk</th>
              <th className="text-left px-5 py-3.5 text-[#75696C] font-medium hidden md:table-cell">Kategori</th>
              <th className="text-[#75696C] font-medium px-5 py-3.5 text-right">Harga</th>
              <th className="text-[#75696C] font-medium px-5 py-3.5 text-center hidden sm:table-cell">Stok Total</th>
              <th className="text-[#75696C] font-medium px-5 py-3.5 text-center">Status</th>
              <th className="text-[#75696C] font-medium px-5 py-3.5 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => {
              const totalStock = p.variants.reduce((acc, v) => acc + v.stock, 0);
              const mainImg = p.images[0]?.url;

              return (
                <tr key={p.id} className="border-b border-[#EDE2E5] last:border-0 hover:bg-[#FFFCFA]">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      {mainImg ? (
                        <Image
                          src={mainImg}
                          alt={p.name}
                          width={44}
                          height={44}
                          className="rounded-xl object-cover"
                        />
                      ) : (
                        <div className="w-11 h-11 rounded-xl bg-[#FBECEF] flex items-center justify-center text-[#E8B7C6] text-xs font-bold">
                          {p.name[0]}
                        </div>
                      )}
                      <div>
                        <span className="font-medium text-[#3D3436] block">{p.name}</span>
                        <div className="flex gap-1.5 mt-0.5">
                          {p.featured && (
                            <span className="text-[10px] bg-[#FBECEF] text-[#3D3436] px-1.5 py-0.5 rounded font-medium">
                              Featured
                            </span>
                          )}
                          {p.bestSeller && (
                            <span className="text-[10px] bg-amber-50 text-[#C79B55] px-1.5 py-0.5 rounded font-medium">
                              Best Seller
                            </span>
                          )}
                          {p.newArrival && (
                            <span className="text-[10px] bg-emerald-50 text-[#7A9B82] px-1.5 py-0.5 rounded font-medium">
                              New
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-[#75696C] hidden md:table-cell">{p.category.name}</td>
                  <td className="px-5 py-4 text-right">
                    {p.discountPrice ? (
                      <div>
                        <span className="font-medium text-[#3D3436]">
                          Rp {p.discountPrice.toLocaleString("id-ID")}
                        </span>
                        <span className="text-xs text-[#A99B9F] line-through block">
                          Rp {p.price.toLocaleString("id-ID")}
                        </span>
                      </div>
                    ) : (
                      <span className="font-medium text-[#3D3436]">
                        Rp {p.price.toLocaleString("id-ID")}
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-4 text-center hidden sm:table-cell">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        totalStock === 0
                          ? "bg-red-50 text-[#B86A72]"
                          : totalStock <= 5
                          ? "bg-amber-50 text-[#C79B55]"
                          : "bg-emerald-50 text-[#7A9B82]"
                      }`}
                    >
                      {totalStock} pcs
                    </span>
                  </td>
                  <td className="px-5 py-4 text-center">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        p.status === "PUBLISHED"
                          ? "bg-emerald-50 text-[#7A9B82]"
                          : "bg-gray-100 text-[#75696C]"
                      }`}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        href={`/product/${p.slug}`}
                        target="_blank"
                        className="p-1.5 text-[#75696C] hover:text-[#3D3436] hover:bg-[#FFF7F3] rounded-lg transition-colors"
                        title="Lihat Storefront"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleDuplicate(p.id)}
                        disabled={loadingId === p.id}
                        className="p-1.5 text-[#75696C] hover:text-[#3D3436] hover:bg-[#FFF7F3] rounded-lg transition-colors disabled:opacity-50"
                        title="Duplikat"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                      <Link
                        href={`/admin/products/${p.id}/edit`}
                        className="p-1.5 text-[#75696C] hover:text-[#3D3436] hover:bg-[#FFF7F3] rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Pencil className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(p.id, p.name)}
                        disabled={loadingId === p.id}
                        className="p-1.5 text-[#A99B9F] hover:text-[#B86A72] hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                        title="Hapus"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
