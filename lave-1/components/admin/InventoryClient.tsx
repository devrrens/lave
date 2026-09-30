"use client";

import { useState } from "react";
import Image from "next/image";
import { updateStock } from "@/lib/actions/admin";
import { useRouter } from "next/navigation";
import { Check, Search } from "lucide-react";

type VariantItem = {
  id: string;
  color: string;
  size: string;
  sku: string;
  stock: number;
  price: number;
  product: {
    name: string;
    category: { name: string };
    images: { url: string }[];
  };
};

export function InventoryClient({ variants }: { variants: VariantItem[] }) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editVal, setEditVal] = useState<number>(0);
  const [saving, setSaving] = useState(false);

  const filtered = variants.filter(
    (v) =>
      v.product.name.toLowerCase().includes(search.toLowerCase()) ||
      v.sku.toLowerCase().includes(search.toLowerCase()) ||
      v.color.toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = async (id: string) => {
    setSaving(true);
    try {
      await updateStock(id, editVal);
      setEditingId(null);
      router.refresh();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-white p-4 rounded-2xl border border-[#EDE2E5] max-w-sm relative">
        <Search className="w-4 h-4 text-[#A99B9F] absolute left-7 top-7" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari produk, SKU, atau warna..."
          className="w-full pl-9 pr-3 py-2 border border-[#EDE2E5] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#E8B7C6]"
        />
      </div>

      <div className="bg-white rounded-2xl border border-[#EDE2E5] overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#EDE2E5] bg-[#FFFCFA]">
              <th className="text-left px-5 py-3.5 text-[#75696C] font-medium">Produk</th>
              <th className="text-left px-5 py-3.5 text-[#75696C] font-medium">SKU</th>
              <th className="text-left px-5 py-3.5 text-[#75696C] font-medium">Varian</th>
              <th className="text-center px-5 py-3.5 text-[#75696C] font-medium">Status Stok</th>
              <th className="text-right px-5 py-3.5 text-[#75696C] font-medium">Jumlah Stok</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((v) => {
              const isLow = v.stock > 0 && v.stock <= 5;
              const isOut = v.stock === 0;
              const img = v.product.images[0]?.url;

              return (
                <tr key={v.id} className="border-b border-[#EDE2E5] last:border-0 hover:bg-[#FFFCFA]">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      {img ? (
                        <Image src={img} alt="" width={36} height={36} className="rounded-lg object-cover" />
                      ) : (
                        <div className="w-9 h-9 rounded-lg bg-[#FBECEF] flex items-center justify-center text-xs font-bold text-[#E8B7C6]">
                          {v.product.name[0]}
                        </div>
                      )}
                      <div>
                        <span className="font-medium text-[#3D3436] block">{v.product.name}</span>
                        <span className="text-xs text-[#A99B9F]">{v.product.category.name}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 font-mono text-xs text-[#75696C]">{v.sku}</td>
                  <td className="px-5 py-4 text-[#75696C]">{v.color} / {v.size}</td>
                  <td className="px-5 py-4 text-center">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        isOut
                          ? "bg-red-50 text-[#B86A72]"
                          : isLow
                          ? "bg-amber-50 text-[#C79B55]"
                          : "bg-emerald-50 text-[#7A9B82]"
                      }`}
                    >
                      {isOut ? "Habis" : isLow ? "Menipis" : "Tersedia"}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    {editingId === v.id ? (
                      <div className="flex items-center justify-end gap-1.5">
                        <input
                          type="number"
                          value={editVal}
                          onChange={(e) => setEditVal(parseInt(e.target.value) || 0)}
                          min="0"
                          className="w-16 px-2 py-1 border border-[#EDE2E5] rounded-lg text-sm text-right focus:outline-none focus:ring-1 focus:ring-[#E8B7C6]"
                        />
                        <button
                          onClick={() => handleSave(v.id)}
                          disabled={saving}
                          className="p-1 bg-[#E8B7C6] text-[#3D3436] rounded-lg hover:bg-[#dca4b4]"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          setEditingId(v.id);
                          setEditVal(v.stock);
                        }}
                        className="font-medium text-[#3D3436] hover:text-[#E8B7C6] underline decoration-dotted underline-offset-4"
                      >
                        {v.stock} pcs
                      </button>
                    )}
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
