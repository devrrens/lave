"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Upload, X } from "lucide-react";
import { createCategory, updateCategory } from "@/lib/actions/categories";

type CategoryFormProps = {
  category?: {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    image: string | null;
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

export function CategoryForm({ category }: CategoryFormProps) {
  const router = useRouter();
  const isEdit = !!category;

  const [name, setName] = useState(category?.name || "");
  const [slug, setSlug] = useState(category?.slug || "");
  const [description, setDescription] = useState(category?.description || "");
  const [image, setImage] = useState(category?.image || "");
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
      setImage(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload gagal");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !slug.trim()) {
      setError("Nama dan slug wajib diisi");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      if (isEdit) {
        await updateCategory(category.id, { name, slug, description: description || undefined, image: image || undefined });
      } else {
        await createCategory({ name, slug, description: description || undefined, image: image || undefined });
      }
      router.push("/admin/categories");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-xl space-y-5">
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-[#B86A72] text-sm rounded-xl">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-[#3D3436] mb-1">
          Nama Kategori <span className="text-[#B86A72]">*</span>
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => handleNameChange(e.target.value)}
          required
          className="w-full px-3 py-2.5 border border-[#EDE2E5] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#E8B7C6]"
          placeholder="Contoh: Gamis"
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
          placeholder="contoh-gamis"
        />
        <p className="text-xs text-[#A99B9F] mt-1">URL: /collection?category={slug || "slug"}</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-[#3D3436] mb-1">
          Deskripsi
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="w-full px-3 py-2.5 border border-[#EDE2E5] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#E8B7C6] resize-none"
          placeholder="Deskripsi singkat kategori..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-[#3D3436] mb-1">
          Gambar Kategori
        </label>
        {image ? (
          <div className="relative w-32 h-32 rounded-xl overflow-hidden border border-[#EDE2E5] group">
            <Image src={image} alt="Category" fill className="object-cover" />
            <button
              type="button"
              onClick={() => setImage("")}
              className="absolute top-1 right-1 bg-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="w-3.5 h-3.5 text-[#B86A72]" />
            </button>
          </div>
        ) : (
          <label className="flex flex-col items-center justify-center w-32 h-32 border-2 border-dashed border-[#EDE2E5] rounded-xl cursor-pointer hover:border-[#E8B7C6] transition-colors">
            {uploading ? (
              <p className="text-xs text-[#A99B9F]">Mengupload...</p>
            ) : (
              <>
                <Upload className="w-6 h-6 text-[#A99B9F] mb-1" />
                <p className="text-xs text-[#A99B9F]">Upload gambar</p>
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
        )}
        <p className="text-xs text-[#A99B9F] mt-1">JPG, PNG, WEBP — maks 5MB</p>
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={saving}
          className="px-5 py-2.5 bg-[#E8B7C6] hover:bg-[#dca4b4] text-[#3D3436] font-medium rounded-full text-sm transition-colors disabled:opacity-50"
        >
          {saving ? "Menyimpan..." : isEdit ? "Simpan Perubahan" : "Buat Kategori"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-5 py-2.5 border border-[#EDE2E5] text-[#75696C] hover:bg-[#FFF7F3] font-medium rounded-full text-sm transition-colors"
        >
          Batal
        </button>
      </div>
    </form>
  );
}
