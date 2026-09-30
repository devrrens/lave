"use client";

import { useState } from "react";
import { Plus, Star, Pencil, Trash2, Eye, EyeOff } from "lucide-react";
import {
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
} from "@/lib/actions/testimonials-settings";
import { useRouter } from "next/navigation";

type Testimonial = {
  id: string;
  customerName: string;
  rating: number;
  review: string;
  image: string | null;
  verified: boolean;
  published: boolean;
  order: number;
  product: { name: string } | null;
};

type Product = {
  id: string;
  name: string;
};

export function TestimonialListClient({
  testimonials,
  products,
}: {
  testimonials: Testimonial[];
  products: Product[];
}) {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [customerName, setCustomerName] = useState("");
  const [rating, setRating] = useState(5);
  const [review, setReview] = useState("");
  const [productId, setProductId] = useState("");
  const [verified, setVerified] = useState(false);
  const [published, setPublished] = useState(false);
  const [order, setOrder] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const resetForm = () => {
    setCustomerName("");
    setRating(5);
    setReview("");
    setProductId("");
    setVerified(false);
    setPublished(false);
    setOrder(0);
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (t: Testimonial) => {
    setEditingId(t.id);
    setCustomerName(t.customerName);
    setRating(t.rating);
    setReview(t.review);
    setProductId(t.product?.name || "");
    setVerified(t.verified);
    setPublished(t.published);
    setOrder(t.order);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingId) {
        await updateTestimonial(editingId, {
          customerName,
          rating,
          review,
          productId: productId || undefined,
          verified,
          published,
          order,
        });
      } else {
        await createTestimonial({
          customerName,
          rating,
          review,
          productId: productId || undefined,
          verified,
          published,
          order,
        });
      }
      resetForm();
      router.refresh();
    } finally {
      setSubmitting(false);
    }
  };

  const togglePublished = async (id: string, current: boolean) => {
    await updateTestimonial(id, { published: !current });
    router.refresh();
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Hapus testimoni dari ${name}?`)) return;
    await deleteTestimonial(id);
    router.refresh();
  };

  return (
    <div className="space-y-6">
      {!showForm && (
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#E8B7C6] hover:bg-[#dca4b4] text-[#3D3436] font-medium rounded-full text-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          Tambah Testimoni
        </button>
      )}

      {showForm && (
        <div className="bg-white rounded-2xl border border-[#EDE2E5] p-6">
          <h2 className="font-semibold text-[#3D3436] mb-4">
            {editingId ? "Edit Testimoni" : "Tambah Testimoni Baru"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
            <div>
              <label className="block text-sm font-medium text-[#3D3436] mb-1">
                Nama Pelanggan
              </label>
              <input
                type="text"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full px-3 py-2 border border-[#EDE2E5] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#E8B7C6]"
                placeholder="Nama pelanggan"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#3D3436] mb-1">
                Rating
              </label>
              <select
                value={rating}
                onChange={(e) => setRating(parseInt(e.target.value))}
                className="px-3 py-2 border border-[#EDE2E5] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#E8B7C6]"
              >
                {[5, 4, 3, 2, 1].map((n) => (
                  <option key={n} value={n}>
                    {n} Bintang
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#3D3436] mb-1">
                Ulasan
              </label>
              <textarea
                required
                value={review}
                onChange={(e) => setReview(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-[#EDE2E5] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#E8B7C6] resize-none"
                placeholder="Tulis ulasan pelanggan..."
              />
            </div>

            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={verified}
                  onChange={(e) => setVerified(e.target.checked)}
                  className="w-4 h-4 text-[#E8B7C6] border-[#EDE2E5] rounded focus:ring-[#E8B7C6]"
                />
                <span className="text-sm text-[#3D3436]">Terverifikasi</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={published}
                  onChange={(e) => setPublished(e.target.checked)}
                  className="w-4 h-4 text-[#E8B7C6] border-[#EDE2E5] rounded focus:ring-[#E8B7C6]"
                />
                <span className="text-sm text-[#3D3436]">Tampilkan</span>
              </label>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="px-5 py-2 bg-[#E8B7C6] hover:bg-[#dca4b4] text-[#3D3436] font-medium rounded-full text-sm transition-colors disabled:opacity-50"
              >
                {submitting ? "Menyimpan..." : editingId ? "Simpan" : "Tambah"}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="px-5 py-2 border border-[#EDE2E5] text-[#75696C] hover:bg-[#FFF7F3] font-medium rounded-full text-sm transition-colors"
              >
                Batal
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-[#EDE2E5] overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#EDE2E5] bg-[#FFFCFA]">
              <th className="text-left px-5 py-3.5 text-[#75696C] font-medium">Pelanggan</th>
              <th className="text-left px-5 py-3.5 text-[#75696C] font-medium">Ulasan</th>
              <th className="text-center px-5 py-3.5 text-[#75696C] font-medium">Rating</th>
              <th className="text-center px-5 py-3.5 text-[#75696C] font-medium">Status</th>
              <th className="text-right px-5 py-3.5 text-[#75696C] font-medium">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {testimonials.map((t) => (
              <tr key={t.id} className="border-b border-[#EDE2E5] last:border-0 hover:bg-[#FFFCFA]">
                <td className="px-5 py-4">
                  <span className="font-medium text-[#3D3436] block">{t.customerName}</span>
                  {t.verified && (
                    <span className="text-[10px] text-[#7A9B82]">✓ Terverifikasi</span>
                  )}
                </td>
                <td className="px-5 py-4 text-[#75696C] max-w-xs truncate">
                  {t.review}
                </td>
                <td className="px-5 py-4 text-center">
                  <div className="flex gap-0.5 justify-center">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < t.rating ? "fill-[#C79B55] text-[#C79B55]" : "text-[#EDE2E5]"
                        }`}
                      />
                    ))}
                  </div>
                </td>
                <td className="px-5 py-4 text-center">
                  <button
                    onClick={() => togglePublished(t.id, t.published)}
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      t.published
                        ? "bg-emerald-50 text-[#7A9B82]"
                        : "bg-gray-100 text-[#A99B9F]"
                    }`}
                  >
                    {t.published ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                    {t.published ? "Tampil" : "Tersembunyi"}
                  </button>
                </td>
                <td className="px-5 py-4 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => handleEdit(t)}
                      className="p-1.5 text-[#75696C] hover:text-[#3D3436] hover:bg-[#FFF7F3] rounded-lg transition-colors"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(t.id, t.customerName)}
                      className="p-1.5 text-[#A99B9F] hover:text-[#B86A72] hover:bg-red-50 rounded-lg transition-colors"
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
    </div>
  );
}
