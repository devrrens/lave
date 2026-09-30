"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { createOrder } from "@/lib/actions/orders";
import { CartItem } from "../cart/page";
import { ShoppingBag } from "lucide-react";

export default function CheckoutPage() {
  const router = useRouter();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Customer Form State
  const [name, setName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("cart");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setCart(parsed);
        if (parsed.length === 0) router.push("/cart");
      } catch (e) {
        console.error(e);
      }
    } else {
      router.push("/cart");
    }
    setIsLoaded(true);
  }, [router]);

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !whatsapp.trim() || cart.length === 0) {
      setError("Nama lengkap dan nomor WhatsApp wajib diisi.");
      return;
    }

    // Format WA number (indonesian prefix)
    let formattedWa = whatsapp.trim().replace(/\D/g, "");
    if (formattedWa.startsWith("0")) {
      formattedWa = "62" + formattedWa.slice(1);
    }

    setSubmitting(true);
    setError(null);

    try {
      const order = await createOrder({
        customerName: name,
        whatsapp: formattedWa,
        email: email || undefined,
        address: address || undefined,
        notes: notes || undefined,
        items: cart.map((item) => ({
          variantId: item.variantId,
          quantity: item.quantity,
        })),
      });

      // Clear Cart
      localStorage.removeItem("cart");

      // Build WA Redirect String per PRD
      const itemDetails = order.items
        .map(
          (i) =>
            `- ${i.variant.product.name} (${i.variant.color}/${i.variant.size}) x${i.quantity} = Rp ${(i.unitPrice * i.quantity).toLocaleString("id-ID")}`
        )
        .join("\n");

      const waMsg = encodeURIComponent(
        `Halo Barokah Jaya Fashion! ✨\n\n` +
          `Saya telah membuat pesanan dengan rincian berikut:\n\n` +
          `*No. Referensi:* ${order.reference}\n` +
          `*Nama:* ${order.customer.name}\n` +
          `*Alamat:* ${order.customer.address || "-"}\n\n` +
          `*Rincian Pesanan:*\n${itemDetails}\n\n` +
          `*Total Tagihan:* Rp ${order.total.toLocaleString("id-ID")}\n\n` +
          `Mohon informasi rekening pembayaran & estimasi pengiriman. Terima kasih!`
      );

      // Redirect to success page or directly to WhatsApp
      window.location.href = `https://wa.me/6281234567890?text=${waMsg}`;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan saat memproses pesanan.");
      setSubmitting(false);
    }
  };

  if (!isLoaded || cart.length === 0) return null;

  return (
    <div className="max-w-[1200px] mx-auto px-5 md:px-8 py-12">
      <h1 className="font-serif text-3xl font-bold text-[#3D3436] mb-8">
        Checkout Pesanan
      </h1>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-[#B86A72] text-sm rounded-xl">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Customer Information */}
        <div className="lg:col-span-2 bg-white border border-[#EDE2E5] rounded-2xl p-6 md:p-8 space-y-5">
          <h2 className="font-serif font-bold text-xl text-[#3D3436]">
            Informasi Pembeli
          </h2>

          <div>
            <label className="block text-sm font-medium text-[#3D3436] mb-1">
              Nama Lengkap <span className="text-[#B86A72]">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: Siti Rahma"
              className="w-full px-4 py-2.5 border border-[#EDE2E5] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#E8B7C6]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#3D3436] mb-1">
              Nomor WhatsApp <span className="text-[#B86A72]">*</span>
            </label>
            <input
              type="tel"
              required
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              placeholder="Contoh: 08123456789"
              className="w-full px-4 py-2.5 border border-[#EDE2E5] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#E8B7C6]"
            />
            <p className="text-xs text-[#A99B9F] mt-1">
              Digunakan untuk konfirmasi pesanan dan instruksi pembayaran.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#3D3436] mb-1">
              Email (Opsional)
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="siti@example.com"
              className="w-full px-4 py-2.5 border border-[#EDE2E5] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#E8B7C6]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#3D3436] mb-1">
              Alamat Pengiriman
            </label>
            <textarea
              rows={3}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Alamat lengkap beserta Kecamatan & Kota/Kabupaten..."
              className="w-full px-4 py-2.5 border border-[#EDE2E5] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#E8B7C6] resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#3D3436] mb-1">
              Catatan Pesanan (Opsional)
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Pesan khusus untuk penjual..."
              className="w-full px-4 py-2.5 border border-[#EDE2E5] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#E8B7C6]"
            />
          </div>
        </div>

        {/* Summary & Place Order */}
        <div className="bg-white border border-[#EDE2E5] rounded-2xl p-6 h-fit space-y-4">
          <h2 className="font-serif font-bold text-lg text-[#3D3436]">
            Detail Pesanan
          </h2>

          <div className="divide-y divide-[#EDE2E5] max-h-60 overflow-y-auto">
            {cart.map((item) => (
              <div key={item.variantId} className="py-3 flex gap-3 text-sm">
                <div className="relative w-12 h-14 bg-[#FFF7F3] rounded-lg overflow-hidden shrink-0">
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.productName}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center font-serif text-xs text-[#EDE2E5]">
                      {item.productName[0]}
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-[#3D3436] line-clamp-1">
                    {item.productName}
                  </p>
                  <p className="text-xs text-[#75696C]">
                    {item.color} / {item.size} x{item.quantity}
                  </p>
                  <p className="text-xs font-semibold text-[#3D3436] mt-0.5">
                    Rp {(item.price * item.quantity).toLocaleString("id-ID")}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-[#EDE2E5] pt-4 space-y-2 text-sm">
            <div className="flex justify-between font-bold text-base text-[#3D3436]">
              <span>Total Tagihan</span>
              <span>Rp {subtotal.toLocaleString("id-ID")}</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full flex items-center justify-center gap-2 py-3.5 bg-[#7A9B82] hover:bg-[#6a8a72] text-white font-medium rounded-full text-sm transition-colors mt-4 disabled:opacity-50"
          >
            <ShoppingBag className="w-4 h-4" />
            {submitting ? "Memproses..." : "Buat Pesanan via WhatsApp"}
          </button>
        </div>
      </form>
    </div>
  );
}
