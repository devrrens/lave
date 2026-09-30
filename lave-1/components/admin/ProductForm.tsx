"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Upload, X, Plus, Trash2 } from "lucide-react";
import { createProduct, updateProduct, type ProductInput } from "@/lib/actions/products";

type Category = { id: string; name: string };
type ProductFormProps = {
  categories: Category[];
  product?: {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    material: string | null;
    price: number;
    discountPrice: number | null;
    categoryId: string;
    status: string;
    featured: boolean;
    bestSeller: boolean;
    newArrival: boolean;
    images: { url: string }[];
    variants: {
      id: string;
      color: string;
      size: string;
      sku: string;
      stock: number;
      price: number;
    }[];
  };
};

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

export function ProductForm({ categories, product }: ProductFormProps) {
  const router = useRouter();
  const isEdit = !!product;

  const [name, setName] = useState(product?.name || "");
  const [slug, setSlug] = useState(product?.slug || "");
  const [description, setDescription] = useState(product?.description || "");
  const [material, setMaterial] = useState(product?.material || "");
  const [price, setPrice] = useState(product?.price.toString() || "");
  const [discountPrice, setDiscountPrice] = useState(product?.discountPrice?.toString() || "");
  const [categoryId, setCategoryId] = useState(product?.categoryId || "");
  const [status, setStatus] = useState<"DRAFT" | "PUBLISHED">(
    (product?.status as "DRAFT" | "PUBLISHED") || "DRAFT"
  );
  const [featured, setFeatured] = useState(product?.featured || false);
  const [bestSeller, setBestSeller] = useState(product?.bestSeller || false);
  const [newArrival, setNewArrival] = useState(product?.newArrival || false);

  const [images, setImages] = useState<string[]>(product?.images.map((i) => i.url) || []);
  const [variants, setVariants] = useState(
    product?.variants || [{ color: "", size: "", sku: "", stock: 0, price: 0 }]
  );

  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleNameChange = (val: string) => {
    setName(val);
    if (!isEdit) setSlug(slugify(val));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("folder", "products");
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload gagal");
      setImages((prev) => [...prev, data.url]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload gagal");
    } finally {
      setUploading(false);
    }
  };

  const addVariant = () => {
    setVariants([...variants, { color: "", size: "", sku: "", stock: 0, price: parseFloat(price) || 0 }]);
  };

  const removeVariant = (idx: number) => {
    setVariants(variants.filter((_, i) => i !== idx));
  };

  const updateVariant = (idx: number, field: string, value: string | number) => {
    const updated = [...variants];
    updated[idx] = { ...updated[idx], [field]: value };
    setVariants(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !slug.trim() || !categoryId || variants.length === 0) {
      setError("Nama, slug, kategori, dan minimal 1 varian wajib diisi");
      return;
    }

    const input: ProductInput = {
      name,
      slug,
      description: description || undefined,
      material: material || undefined,
      price: parseFloat(price) || 0,
      discountPrice: discountPrice ? parseFloat(discountPrice) : undefined,
      categoryId,
      status,
      featured,
      bestSeller,
      newArrival,
      images: images.map((url, idx) => ({ url, order: idx })),
      variants: variants.map((v) => ({
        color: v.color,
        size: v.size,
        sku: v.sku,
        stock: Number(v.stock),
        price: Number(v.price),
      })),
    };

    setSaving(true);
    setError(null);
    try {
      if (isEdit) {
        await updateProduct(product.id, input);
      } else {
        await createProduct(input);
      }
      router.push("/admin/products");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-[#B86A72] text-sm rounded-xl">
          {error}
        </div>
      )}

      {/* Basic Info */}
      <div className="space-y-4">
        <h2 className="font-semibold text-[#3D3436]">Informasi Dasar</h2>

        <div>
          <label className="block text-sm font-medium text-[#3D3436] mb-1">
            Nama Produk <span className="text-[#B86A72]">*</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => handleNameChange(e.target.value)}
            required
            className="w-full px-3 py-2.5 border border-[#EDE2E5] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#E8B7C6]"
            placeholder="Contoh: Gamis Katun Premium"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#3D3436] mb-1">
            Slug <span className="text-[#B86A72]">*</span>
          </label>
          <input
            type="text"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            required
            className="w-full px-3 py-2.5 border border-[#EDE2E5] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#E8B7C6] font-mono"
            placeholder="gamis-katun-premium"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#3D3436] mb-1">Deskripsi</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="w-full px-3 py-2.5 border border-[#EDE2E5] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#E8B7C6] resize-none"
            placeholder="Deskripsi lengkap produk..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#3D3436] mb-1">Material</label>
          <input
            type="text"
            value={material}
            onChange={(e) => setMaterial(e.target.value)}
            className="w-full px-3 py-2.5 border border-[#EDE2E5] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#E8B7C6]"
            placeholder="Contoh: Katun Rayon"
          />
        </div>
      </div>

      {/* Pricing */}
      <div className="space-y-4">
        <h2 className="font-semibold text-[#3D3436]">Harga</h2>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-[#3D3436] mb-1">
              Harga Normal <span className="text-[#B86A72]">*</span>
            </label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
              min="0"
              step="1000"
              className="w-full px-3 py-2.5 border border-[#EDE2E5] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#E8B7C6]"
              placeholder="150000"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#3D3436] mb-1">Harga Diskon</label>
            <input
              type="number"
              value={discountPrice}
              onChange={(e) => setDiscountPrice(e.target.value)}
              min="0"
              step="1000"
              className="w-full px-3 py-2.5 border border-[#EDE2E5] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#E8B7C6]"
              placeholder="120000"
            />
          </div>
        </div>
      </div>

      {/* Category & Status */}
      <div className="space-y-4">
        <h2 className="font-semibold text-[#3D3436]">Kategori & Status</h2>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-[#3D3436] mb-1">
              Kategori <span className="text-[#B86A72]">*</span>
            </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              required
              className="w-full px-3 py-2.5 border border-[#EDE2E5] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#E8B7C6]"
            >
              <option value="">Pilih kategori</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#3D3436] mb-1">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as "DRAFT" | "PUBLISHED")}
              className="w-full px-3 py-2.5 border border-[#EDE2E5] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#E8B7C6]"
            >
              <option value="DRAFT">Draft</option>
              <option value="PUBLISHED">Published</option>
            </select>
          </div>
        </div>

        <div className="flex flex-wrap gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={featured}
              onChange={(e) => setFeatured(e.target.checked)}
              className="w-4 h-4 text-[#E8B7C6] border-[#EDE2E5] rounded focus:ring-[#E8B7C6]"
            />
            <span className="text-sm text-[#3D3436]">Featured</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={bestSeller}
              onChange={(e) => setBestSeller(e.target.checked)}
              className="w-4 h-4 text-[#E8B7C6] border-[#EDE2E5] rounded focus:ring-[#E8B7C6]"
            />
            <span className="text-sm text-[#3D3436]">Best Seller</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={newArrival}
              onChange={(e) => setNewArrival(e.target.checked)}
              className="w-4 h-4 text-[#E8B7C6] border-[#EDE2E5] rounded focus:ring-[#E8B7C6]"
            />
            <span className="text-sm text-[#3D3436]">New Arrival</span>
          </label>
        </div>
      </div>

      {/* Images */}
      <div className="space-y-3">
        <h2 className="font-semibold text-[#3D3436]">Gambar Produk</h2>
        <div className="flex flex-wrap gap-3">
          {images.map((url, idx) => (
            <div key={idx} className="relative w-24 h-24 rounded-xl overflow-hidden border border-[#EDE2E5] group">
              <Image src={url} alt={`Image ${idx + 1}`} fill className="object-cover" />
              <button
                type="button"
                onClick={() => setImages(images.filter((_, i) => i !== idx))}
                className="absolute top-1 right-1 bg-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-3 h-3 text-[#B86A72]" />
              </button>
              {idx === 0 && (
                <span className="absolute bottom-1 left-1 bg-[#E8B7C6] text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                  UTAMA
                </span>
              )}
            </div>
          ))}
          <label className="flex flex-col items-center justify-center w-24 h-24 border-2 border-dashed border-[#EDE2E5] rounded-xl cursor-pointer hover:border-[#E8B7C6] transition-colors">
            {uploading ? (
              <p className="text-[10px] text-[#A99B9F]">Upload...</p>
            ) : (
              <>
                <Upload className="w-5 h-5 text-[#A99B9F] mb-1" />
                <p className="text-[10px] text-[#A99B9F]">Upload</p>
              </>
            )}
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={handleImageUpload}
              disabled={uploading}
            />
          </label>
        </div>
      </div>

      {/* Variants */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-[#3D3436]">
            Varian <span className="text-[#B86A72]">*</span>
          </h2>
          <button
            type="button"
            onClick={addVariant}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#FBECEF] hover:bg-[#F6DDE5] text-[#3D3436] text-sm font-medium rounded-lg transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            Tambah Varian
          </button>
        </div>

        <div className="space-y-2">
          {variants.map((v, idx) => (
            <div key={idx} className="grid grid-cols-1 sm:grid-cols-6 gap-2 p-3 bg-[#FFFCFA] border border-[#EDE2E5] rounded-xl">
              <input
                type="text"
                value={v.color}
                onChange={(e) => updateVariant(idx, "color", e.target.value)}
                placeholder="Warna"
                required
                className="px-2.5 py-2 border border-[#EDE2E5] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#E8B7C6]"
              />
              <input
                type="text"
                value={v.size}
                onChange={(e) => updateVariant(idx, "size", e.target.value)}
                placeholder="Ukuran"
                required
                className="px-2.5 py-2 border border-[#EDE2E5] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#E8B7C6]"
              />
              <input
                type="text"
                value={v.sku}
                onChange={(e) => updateVariant(idx, "sku", e.target.value)}
                placeholder="SKU"
                required
                className="px-2.5 py-2 border border-[#EDE2E5] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#E8B7C6] font-mono"
              />
              <input
                type="number"
                value={v.stock}
                onChange={(e) => updateVariant(idx, "stock", parseInt(e.target.value) || 0)}
                placeholder="Stok"
                required
                min="0"
                className="px-2.5 py-2 border border-[#EDE2E5] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#E8B7C6]"
              />
              <input
                type="number"
                value={v.price}
                onChange={(e) => updateVariant(idx, "price", parseFloat(e.target.value) || 0)}
                placeholder="Harga"
                required
                min="0"
                className="px-2.5 py-2 border border-[#EDE2E5] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#E8B7C6]"
              />
              <button
                type="button"
                onClick={() => removeVariant(idx)}
                disabled={variants.length === 1}
                className="p-2 text-[#A99B9F] hover:text-[#B86A72] hover:bg-red-50 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Submit */}
      <div className="flex gap-3 pt-4 border-t border-[#EDE2E5]">
        <button
          type="submit"
          disabled={saving}
          className="px-6 py-2.5 bg-[#E8B7C6] hover:bg-[#dca4b4] text-[#3D3436] font-medium rounded-full text-sm transition-colors disabled:opacity-50"
        >
          {saving ? "Menyimpan..." : isEdit ? "Simpan Perubahan" : "Buat Produk"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-2.5 border border-[#EDE2E5] text-[#75696C] hover:bg-[#FFF7F3] font-medium rounded-full text-sm transition-colors"
        >
          Batal
        </button>
      </div>
    </form>
  );
}
