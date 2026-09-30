"use client";

import { useEffect, useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Minus, Plus, Trash2 } from "lucide-react";
import { getCart, type CartItem } from "@/lib/cart";
import { formatIDR } from "@/lib/format";
import { placeOrder } from "./actions";

type Variant = { id: string; color: string; size: string; stock: number; price: number; discountPrice: number | null };

const inputCls =
  "w-full rounded-[12px] border border-[#EDE2E5] bg-white px-3 py-2 text-sm outline-none focus:border-[#E8B7C6]";

function save(items: CartItem[]) {
  localStorage.setItem("bjf-cart", JSON.stringify(items));
  window.dispatchEvent(new CustomEvent("bjf-cart"));
}

export function CartClient() {
  const router = useRouter();
  const [items, setItems] = useState<CartItem[] | null>(null);
  const [editing, setEditing] = useState<string | null>(null);
  const [options, setOptions] = useState<Variant[] | null>(null);
  const [form, setForm] = useState({ name: "", whatsapp: "", address: "", notes: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [pending, start] = useTransition();

  useEffect(() => {
    const update = () => setItems(getCart());
    update();
    window.addEventListener("bjf-cart", update);
    return () => window.removeEventListener("bjf-cart", update);
  }, []);

  const cart = items ?? [];

  function update(next: CartItem[]) {
    setItems(next);
    save(next);
  }

  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);

  async function openVariantEditor(item: CartItem) {
    const key = `${item.productId}:${item.variantId ?? "-"}`;
    setEditing(key);
    setOptions(null);
    try {
      const res = await fetch(`/api/products/${item.productId}/variants`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      setOptions(data.variants);
    } catch {
      setOptions([]);
    }
  }

  function applyVariant(item: CartItem, variantId: string) {
    const v = options?.find((o) => o.id === variantId);
    if (!v) return;
    const sell = v.discountPrice ?? v.price;
    update(
      cart.map((i) =>
        i === item
          ? { ...i, variantId: v.id, variantLabel: `${v.color} / ${v.size}`, price: sell, qty: Math.min(i.qty, Math.max(1, v.stock)) }
          : i
      )
    );
    setEditing(null);
  }

  function checkout(e: React.FormEvent) {
    e.preventDefault();
    setErrors({});
    start(async () => {
      const res = await placeOrder({
        ...form,
        items: cart.map((i) => ({ variantId: i.variantId, qty: i.qty })),
      });
      if (res.ok) {
        localStorage.removeItem("bjf-cart");
        window.dispatchEvent(new CustomEvent("bjf-cart"));
        router.push(`/order-success?ref=${encodeURIComponent(res.reference)}`);
      } else {
        setErrors(res.errors);
      }
    });
  }

  if (items === null) {
    return <p className="mt-6 text-sm text-[#75696C]">Memuat keranjang…</p>;
  }

  if (items.length === 0) {
    return (
      <div className="mt-8 rounded-[16px] border border-[#EDE2E5] bg-white p-10 text-center">
        <p className="font-medium">Keranjang kosong.</p>
        <p className="mt-1 text-sm text-[#75696C]">Yuk lihat koleksi terbaru kami.</p>
        <Link
          href="/collection"
          className="mt-4 inline-block rounded-full bg-[#E8B7C6] px-6 py-2.5 text-sm font-medium"
        >
          Explore Collection
        </Link>
      </div>
    );
  }

  return (
    <div className="mt-8 grid gap-8 lg:grid-cols-5">
      <section aria-label="Item keranjang" className="space-y-4 lg:col-span-3">
        {items.map((item) => {
          const key = `${item.productId}:${item.variantId ?? "-"}`;
          const err = item.variantId ? errors[item.variantId] : undefined;
          return (
            <div key={key} className="rounded-[16px] border border-[#EDE2E5] bg-white p-4">
              <div className="flex gap-4">
                {item.image && (
                  <div className="relative h-20 w-16 shrink-0 overflow-hidden rounded-[12px] bg-[#FBECEF]">
                    <Image src={item.image} alt="" fill sizes="64px" className="object-cover" />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">{item.name}</p>
                  {item.variantLabel && <p className="text-xs text-[#75696C]">{item.variantLabel}</p>}
                  <p className="mt-1 text-sm font-medium">{formatIDR(item.price)}</p>
                  {err && (
                    <p role="alert" className="mt-1 text-xs text-[#B86A72]">{err}</p>
                  )}
                </div>
                <button
                  type="button"
                  aria-label={`Hapus ${item.name}`}
                  onClick={() => update(items.filter((i) => i !== item))}
                  className="h-fit rounded-full border border-[#EDE2E5] p-2"
                >
                  <Trash2 className="h-4 w-4 text-[#B86A72]" />
                </button>
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-3">
                <div className="flex items-center rounded-full border border-[#EDE2E5]">
                  <button
                    type="button"
                    aria-label="Kurangi"
                    disabled={item.qty <= 1}
                    onClick={() => update(items.map((i) => (i === item ? { ...i, qty: i.qty - 1 } : i)))}
                    className="p-2 disabled:opacity-40"
                  >
                    <Minus className="h-3.5 w-3.5" />
                  </button>
                  <span className="w-8 text-center text-sm font-medium">{item.qty}</span>
                  <button
                    type="button"
                    aria-label="Tambah"
                    disabled={item.qty >= 99}
                    onClick={() => update(items.map((i) => (i === item ? { ...i, qty: Math.min(99, i.qty + 1) } : i)))}
                    className="p-2 disabled:opacity-40"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>
                {item.variantId && (
                  <button
                    type="button"
                    onClick={() => (editing === key ? setEditing(null) : openVariantEditor(item))}
                    className="text-xs text-[#75696C] underline"
                  >
                    Ganti varian
                  </button>
                )}
                <span className="ml-auto text-sm font-semibold">{formatIDR(item.price * item.qty)}</span>
              </div>

              {editing === key && (
                <div className="mt-3 rounded-[12px] bg-[#FFFCFA] p-3 text-sm">
                  {!options ? (
                    <p className="text-xs text-[#75696C]">Memuat varian…</p>
                  ) : options.length === 0 ? (
                    <p className="text-xs text-[#B86A72]">Varian tidak tersedia.</p>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {options.map((v) => (
                        <button
                          key={v.id}
                          type="button"
                          disabled={v.stock === 0}
                          onClick={() => applyVariant(item, v.id)}
                          className="rounded-full border border-[#EDE2E5] bg-white px-3 py-1 text-xs disabled:opacity-40 disabled:line-through"
                        >
                          {v.color}/{v.size}{v.stock === 0 ? " (habis)" : ""}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </section>

      <section aria-label="Checkout" className="lg:col-span-2">
        <form onSubmit={checkout} className="space-y-4 rounded-[16px] border border-[#EDE2E5] bg-white p-5" noValidate>
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-xl">Checkout</h2>
            <p className="text-sm font-semibold">Subtotal: {formatIDR(subtotal)}</p>
          </div>
          <div>
            <label htmlFor="name" className="mb-1 block text-sm font-medium">Nama <span aria-hidden="true">*</span></label>
            <input id="name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputCls} autoComplete="name" />
            {errors.name && <FormError msg={errors.name} />}
          </div>
          <div>
            <label htmlFor="whatsapp" className="mb-1 block text-sm font-medium">WhatsApp <span aria-hidden="true">*</span></label>
            <input id="whatsapp" required value={form.whatsapp} onChange={(e) => setForm({ ...form, whatsapp: e.target.value })} className={inputCls} autoComplete="tel" placeholder="cth. 0812xxxx" />
            {errors.whatsapp && <FormError msg={errors.whatsapp} />}
          </div>
          <div>
            <label htmlFor="address" className="mb-1 block text-sm font-medium">Alamat <span aria-hidden="true">*</span></label>
            <textarea id="address" required rows={3} value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className={inputCls} autoComplete="street-address" />
            {errors.address && <FormError msg={errors.address} />}
          </div>
          <div>
            <label htmlFor="notes" className="mb-1 block text-sm font-medium">Catatan (opsional)</label>
            <input id="notes" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className={inputCls} />
          </div>
          {errors.form && <p role="alert" className="text-sm text-[#B86A72]">{errors.form}</p>}
          {errors.items && <p role="alert" className="text-sm text-[#B86A72]">{errors.items}</p>}
          <button
            type="submit"
            disabled={pending}
            className="w-full rounded-full bg-[#E8B7C6] px-5 py-3 text-sm font-medium disabled:opacity-60"
          >
            {pending ? "Memproses…" : `Buat Order · ${formatIDR(subtotal)}`}
          </button>
          <p className="text-xs text-[#A99B9F]">Harga & stok final dihitung ulang server sebelum order dibuat.</p>
        </form>
      </section>
    </div>
  );
}

function FormError({ msg }: { msg: string }) {
  return <p role="alert" className="mt-1 text-xs text-[#B86A72]">{msg}</p>;
}
