"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Minus, Plus, ShoppingBag } from "lucide-react";
import { addToCart } from "@/lib/cart";
import { priceOf } from "@/lib/pricing";
import { productWaMessage, waLink } from "@/lib/whatsapp";
import { PriceDisplay } from "./PriceDisplay";
import { VariantSelector } from "./VariantSelector";
import { WhatsAppButton } from "./WhatsAppButton";

type V = {
  id: string;
  color: string;
  size: string;
  sku: string;
  stock: number;
  price: number;
  discountPrice: number | null;
};

export function PurchasePanel({
  product,
  brand,
  waNumber,
  coverImage,
  variants,
}: {
  product: { id: string; slug: string; name: string; price: number; discountPrice: number | null };
  brand: string;
  waNumber: string | null;
  coverImage?: string;
  variants: V[];
}) {
  const [color, setColor] = useState<string | null>(null);
  const [size, setSize] = useState<string | null>(null);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const selected = useMemo(
    () => variants.find((v) => v.color === color && v.size === size) ?? null,
    [variants, color, size]
  );
  const { sell, original } = priceOf(product, selected);
  const maxQty = selected ? Math.max(1, Math.min(selected.stock, 99)) : 1;

  function handleAdd() {
    if (!selected || selected.stock === 0) return;
    addToCart(
      {
        productId: product.id,
        productSlug: product.slug,
        variantId: selected.id,
        name: product.name,
        variantLabel: `${selected.color} / ${selected.size}`,
        price: sell,
        image: coverImage,
      },
      Math.min(qty, selected.stock)
    );
    setAdded(true);
    window.setTimeout(() => setAdded(false), 2500);
  }

  const waHref =
    waNumber && selected
      ? waLink(
          waNumber,
          productWaMessage({
            brand,
            product: product.name,
            variantLabel: `${selected.color} / ${selected.size}`,
            qty: Math.min(qty, Math.max(1, selected.stock)),
            unitPrice: sell,
          })
        )
      : undefined;

  if (variants.length === 0) {
    return (
      <div className="rounded-[16px] border border-[#EDE2E5] bg-[#FFFCFA] p-4 text-sm text-[#75696C]">
        Stok produk ini belum tersedia. Hubungi kami untuk info lebih lanjut.
        <WhatsAppButton
          className="mt-3"
          href={waNumber ? waLink(waNumber, `Halo ${brand}! Saya mau tanya produk: ${product.name}`) : undefined}
          disabled={!waNumber}
          label="Tanya via WhatsApp"
        />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <PriceDisplay sell={sell} original={original} className="text-xl" />

      <VariantSelector
        variants={variants}
        color={color}
        size={size}
        onChange={(c, s) => {
          setColor(c);
          setSize(s);
          setQty(1);
        }}
      />

      {selected ? (
        <p className="text-sm" aria-live="polite">
          {selected.stock > 0 ? (
            <>
              Stok: <span className="font-semibold">{selected.stock} pcs</span>
              <span className="ml-2 text-xs text-[#A99B9F]">{selected.sku}</span>
            </>
          ) : (
            <span className="font-medium text-[#B86A72]">Varian ini habis.</span>
          )}
        </p>
      ) : (
        <p className="text-sm text-[#75696C]">Pilih warna dan ukuran dulu.</p>
      )}

      <div className="flex items-center gap-3">
        <div className="flex items-center rounded-full border border-[#EDE2E5]">
          <button
            type="button"
            aria-label="Kurangi jumlah"
            disabled={qty <= 1}
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            className="p-2.5 disabled:opacity-40"
          >
            <Minus className="h-4 w-4" />
          </button>
          <span aria-live="polite" className="w-8 text-center text-sm font-medium">
            {qty}
          </span>
          <button
            type="button"
            aria-label="Tambah jumlah"
            disabled={!selected || qty >= maxQty}
            onClick={() => setQty((q) => Math.min(maxQty, q + 1))}
            className="p-2.5 disabled:opacity-40"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
        <button
          type="button"
          disabled={!selected || selected.stock === 0}
          onClick={handleAdd}
          className="flex flex-1 items-center justify-center gap-2 rounded-full bg-[#F6DDE5] px-5 py-3 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-50"
        >
          <ShoppingBag className="h-4 w-4" />
          {added ? "Ditambahkan ✓" : "Add to Cart"}
        </button>
      </div>
      {added && (
        <p className="text-sm">
          <Link href="/cart" className="font-medium underline">
            Lihat keranjang →
          </Link>
        </p>
      )}

      <WhatsAppButton href={waHref} disabled={!waHref} />
    </div>
  );
}
