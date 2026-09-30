"use client";

import { useState, useMemo } from "react";
import { ShoppingBag, MessageCircle, Plus, Minus } from "lucide-react";
import { useRouter } from "next/navigation";

type Variant = {
  id: string;
  color: string;
  size: string;
  sku: string;
  stock: number;
  price: number;
};

type ProductInfo = {
  id: string;
  name: string;
  price: number;
  slug: string;
  image?: string;
};

export function VariantSelector({
  product,
  variants,
  whatsappNumber,
}: {
  product: ProductInfo;
  variants: Variant[];
  whatsappNumber: string;
}) {
  const router = useRouter();
  const colors = [...new Set(variants.map((v) => v.color))];
  const sizes = [...new Set(variants.map((v) => v.size))];

  const [selectedColor, setSelectedColor] = useState<string>(colors[0] || "");
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [quantity, setQuantity] = useState(1);

  const selectedVariant = useMemo(() => {
    if (!selectedColor || !selectedSize) return null;
    return variants.find(
      (v) => v.color === selectedColor && v.size === selectedSize
    ) || null;
  }, [selectedColor, selectedSize, variants]);

  const isSizeAvailable = (size: string) => {
    return variants.some((v) => v.color === selectedColor && v.size === size && v.stock > 0);
  };

  const maxQty = selectedVariant?.stock || 1;

  const handleAddToCart = () => {
    if (!selectedVariant) return;
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const existing = cart.findIndex(
      (item: { variantId: string }) => item.variantId === selectedVariant.id
    );
    if (existing > -1) {
      cart[existing].quantity = Math.min(cart[existing].quantity + quantity, selectedVariant.stock);
    } else {
      cart.push({
        variantId: selectedVariant.id,
        productId: product.id,
        productName: product.name,
        productSlug: product.slug,
        image: product.image || "",
        color: selectedVariant.color,
        size: selectedVariant.size,
        price: selectedVariant.price,
        quantity,
      });
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    router.push("/cart");
  };

  const handleWhatsApp = () => {
    if (!selectedVariant) return;
    const totalPrice = selectedVariant.price * quantity;
    const message = encodeURIComponent(
      `Halo Barokah Jaya Fashion! 😊\n\nSaya ingin memesan:\n\n` +
      `*Produk:* ${product.name}\n` +
      `*Warna:* ${selectedVariant.color}\n` +
      `*Ukuran:* ${selectedVariant.size}\n` +
      `*Jumlah:* ${quantity} pcs\n` +
      `*Harga Satuan:* Rp ${selectedVariant.price.toLocaleString("id-ID")}\n` +
      `*Total:* Rp ${totalPrice.toLocaleString("id-ID")}\n\n` +
      `Mohon konfirmasi ketersediaan. Terima kasih! 🙏`
    );
    window.open(`https://wa.me/${whatsappNumber}?text=${message}`, "_blank");
  };

  return (
    <div className="space-y-5">
      {/* Color Selection */}
      {colors.length > 0 && (
        <div>
          <p className="text-sm font-medium text-[#3D3436] mb-2.5">
            Warna: <span className="text-[#75696C] font-normal">{selectedColor}</span>
          </p>
          <div className="flex flex-wrap gap-2.5">
            {colors.map((color) => (
              <button
                key={color}
                onClick={() => {
                  setSelectedColor(color);
                  setSelectedSize("");
                  setQuantity(1);
                }}
                className={`px-4 py-2 text-sm rounded-full border transition-all ${
                  selectedColor === color
                    ? "border-[#E8B7C6] bg-[#FBECEF] text-[#3D3436] font-medium"
                    : "border-[#EDE2E5] text-[#75696C] hover:border-[#E8B7C6]"
                }`}
              >
                {color}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Size Selection */}
      {sizes.length > 0 && (
        <div>
          <p className="text-sm font-medium text-[#3D3436] mb-2.5">
            Ukuran: <span className="text-[#75696C] font-normal">{selectedSize || "Pilih ukuran"}</span>
          </p>
          <div className="flex flex-wrap gap-2.5">
            {sizes.map((size) => {
              const available = isSizeAvailable(size);
              return (
                <button
                  key={size}
                  onClick={() => available && setSelectedSize(size)}
                  disabled={!available}
                  className={`w-12 h-12 text-sm rounded-xl border transition-all font-medium ${
                    selectedSize === size
                      ? "border-[#E8B7C6] bg-[#FBECEF] text-[#3D3436]"
                      : available
                      ? "border-[#EDE2E5] text-[#75696C] hover:border-[#E8B7C6]"
                      : "border-[#EDE2E5] text-[#EDE2E5] cursor-not-allowed line-through bg-[#FFFCFA]"
                  }`}
                  aria-label={`Ukuran ${size}${!available ? " - habis" : ""}`}
                >
                  {size}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Stock Indicator */}
      {selectedVariant && (
        <p className={`text-xs font-medium ${
          selectedVariant.stock === 0
            ? "text-[#B86A72]"
            : selectedVariant.stock <= 5
            ? "text-[#C79B55]"
            : "text-[#7A9B82]"
        }`}>
          {selectedVariant.stock === 0
            ? "Stok habis"
            : selectedVariant.stock <= 5
            ? `Stok hampir habis (${selectedVariant.stock} tersisa)`
            : `Stok tersedia (${selectedVariant.stock} pcs)`}
        </p>
      )}

      {/* Quantity */}
      {selectedVariant && selectedVariant.stock > 0 && (
        <div>
          <p className="text-sm font-medium text-[#3D3436] mb-2.5">Jumlah</p>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-10 h-10 border border-[#EDE2E5] rounded-full flex items-center justify-center hover:bg-[#FFF7F3] transition-colors"
              aria-label="Kurangi jumlah"
            >
              <Minus className="w-4 h-4 text-[#75696C]" />
            </button>
            <span className="w-10 text-center font-medium text-[#3D3436]">{quantity}</span>
            <button
              onClick={() => setQuantity(Math.min(maxQty, quantity + 1))}
              className="w-10 h-10 border border-[#EDE2E5] rounded-full flex items-center justify-center hover:bg-[#FFF7F3] transition-colors"
              aria-label="Tambah jumlah"
            >
              <Plus className="w-4 h-4 text-[#75696C]" />
            </button>
          </div>
        </div>
      )}

      {/* CTAs */}
      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <button
          onClick={handleAddToCart}
          disabled={!selectedVariant || selectedVariant.stock === 0}
          className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 bg-[#E8B7C6] hover:bg-[#dca4b4] text-[#3D3436] font-medium rounded-full text-sm transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <ShoppingBag className="w-4 h-4" />
          Tambah ke Keranjang
        </button>
        <button
          onClick={handleWhatsApp}
          disabled={!selectedVariant || selectedVariant.stock === 0}
          className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 bg-[#7A9B82] hover:bg-[#6a8a72] text-white font-medium rounded-full text-sm transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <MessageCircle className="w-4 h-4" />
          Pesan via WhatsApp
        </button>
      </div>

      {!selectedVariant && (
        <p className="text-xs text-[#A99B9F] text-center">
          Pilih warna dan ukuran untuk melanjutkan pemesanan
        </p>
      )}
    </div>
  );
}
