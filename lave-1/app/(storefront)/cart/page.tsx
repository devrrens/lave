"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from "lucide-react";

export type CartItem = {
  variantId: string;
  productId: string;
  productName: string;
  productSlug: string;
  image: string;
  color: string;
  size: string;
  price: number;
  quantity: number;
};

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("cart");
    if (saved) {
      try {
        setCart(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }
    setIsLoaded(true);
  }, []);

  const updateQuantity = (variantId: string, qty: number) => {
    if (qty <= 0) {
      removeItem(variantId);
      return;
    }
    const updated = cart.map((item) =>
      item.variantId === variantId ? { ...item, quantity: qty } : item
    );
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  const removeItem = (variantId: string) => {
    const updated = cart.filter((item) => item.variantId !== variantId);
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  if (!isLoaded) return null;

  if (cart.length === 0) {
    return (
      <div className="max-w-[1200px] mx-auto px-5 md:px-8 py-20 text-center">
        <div className="w-16 h-16 bg-[#FBECEF] rounded-full flex items-center justify-center mx-auto mb-4">
          <ShoppingBag className="w-8 h-8 text-[#E8B7C6]" />
        </div>
        <h1 className="font-serif text-2xl md:text-3xl font-bold text-[#3D3436] mb-2">
          Keranjang Belanja Kosong
        </h1>
        <p className="text-sm text-[#75696C] mb-8">
          Belum ada produk yang ditambahkan ke keranjang belanja Anda.
        </p>
        <Link
          href="/collection"
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#E8B7C6] hover:bg-[#dca4b4] text-[#3D3436] font-medium rounded-full text-sm transition-colors"
        >
          Mulai Belanja
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-[1200px] mx-auto px-5 md:px-8 py-12">
      <h1 className="font-serif text-3xl font-bold text-[#3D3436] mb-8">
        Keranjang Belanja
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item) => (
            <div
              key={item.variantId}
              className="flex gap-4 p-4 bg-white border border-[#EDE2E5] rounded-2xl"
            >
              {/* Image */}
              <div className="relative w-20 h-24 rounded-xl overflow-hidden bg-[#FFF7F3] shrink-0">
                {item.image ? (
                  <Image
                    src={item.image}
                    alt={item.productName}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[#EDE2E5] font-serif text-xl">
                    {item.productName[0]}
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start">
                    <Link
                      href={`/product/${item.productSlug}`}
                      className="font-medium text-sm text-[#3D3436] hover:text-[#E8B7C6] transition-colors"
                    >
                      {item.productName}
                    </Link>
                    <button
                      onClick={() => removeItem(item.variantId)}
                      className="text-[#A99B9F] hover:text-[#B86A72] p-1 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-xs text-[#75696C] mt-1">
                    Warna: {item.color} | Ukuran: {item.size}
                  </p>
                </div>

                <div className="flex justify-between items-center mt-3">
                  <div className="flex items-center gap-2 border border-[#EDE2E5] rounded-full p-1">
                    <button
                      onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                      className="w-6 h-6 flex items-center justify-center text-[#75696C] hover:bg-[#FFF7F3] rounded-full transition-colors"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="text-xs font-medium w-6 text-center text-[#3D3436]">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                      className="w-6 h-6 flex items-center justify-center text-[#75696C] hover:bg-[#FFF7F3] rounded-full transition-colors"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                  <span className="font-semibold text-sm text-[#3D3436]">
                    Rp {(item.price * item.quantity).toLocaleString("id-ID")}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="bg-white border border-[#EDE2E5] rounded-2xl p-6 h-fit space-y-4">
          <h2 className="font-serif font-bold text-lg text-[#3D3436]">
            Ringkasan Pesanan
          </h2>

          <div className="border-t border-[#EDE2E5] pt-4 space-y-2 text-sm">
            <div className="flex justify-between text-[#75696C]">
              <span>Subtotal</span>
              <span>Rp {subtotal.toLocaleString("id-ID")}</span>
            </div>
            <div className="flex justify-between text-[#75696C]">
              <span>Estimasi Ongkir</span>
              <span className="text-xs text-[#A99B9F]">Dihitung saat checkout</span>
            </div>
            <div className="border-t border-[#EDE2E5] pt-3 flex justify-between font-bold text-base text-[#3D3436]">
              <span>Total</span>
              <span>Rp {subtotal.toLocaleString("id-ID")}</span>
            </div>
          </div>

          <Link
            href="/checkout"
            className="w-full flex items-center justify-center gap-2 py-3.5 bg-[#E8B7C6] hover:bg-[#dca4b4] text-[#3D3436] font-medium rounded-full text-sm transition-colors mt-4"
          >
            Lanjut ke Checkout
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
