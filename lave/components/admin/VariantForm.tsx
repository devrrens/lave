"use client";

import { useState, useTransition } from "react";
import type { VariantInput } from "@/lib/validations/variant";

const inputCls =
  "w-full rounded-[12px] border border-neutral-200 bg-white px-3 py-2 text-sm outline-none focus:border-[#E8B7C6]";

export function VariantForm({
  id,
  initial,
  products,
  save,
}: {
  id: string | null;
  initial: VariantInput;
  products: Array<{ id: string; name: string; price: number }>;
  save: (
    id: string | null,
    data: VariantInput
  ) => Promise<{ ok: boolean; errors?: Record<string, string> }>;
}) {
  const [data, setData] = useState<VariantInput>(initial);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [pending, start] = useTransition();

  function set<K extends keyof VariantInput>(key: K, value: VariantInput[K]) {
    setData((d) => ({ ...d, [key]: value }));
  }

  function suggestSku() {
    const p = products.find((x) => x.id === data.productId);
    const base = [
      p?.name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 4) || "PRD",
      data.color.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 6) || "C",
      data.size.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 4) || "S",
    ].join("-");
    set("sku", base);
    const prod = products.find((x) => x.id === data.productId);
    if (prod && data.price === 0) set("price", prod.price);
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setErrors({});
    start(async () => {
      const res = await save(id, data);
      if (!res.ok) setErrors(res.errors ?? { form: "Gagal menyimpan." });
    });
  }

  return (
    <form onSubmit={submit} className="max-w-xl space-y-4" noValidate>
      <div>
        <label htmlFor="productId" className="mb-1 block text-sm font-medium">
          Produk <span aria-hidden="true">*</span>
        </label>
        <select
          id="productId"
          value={data.productId}
          onChange={(e) => set("productId", e.target.value)}
          required
          className={inputCls}
        >
          <option value="">— Pilih produk —</option>
          {products.map((p) => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
        {errors.productId && <FieldError msg={errors.productId} />}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="color" className="mb-1 block text-sm font-medium">
            Warna <span aria-hidden="true">*</span>
          </label>
          <input
            id="color"
            value={data.color}
            onChange={(e) => set("color", e.target.value)}
            required
            placeholder="cth. Dusty Pink"
            className={inputCls}
          />
          {errors.color && <FieldError msg={errors.color} />}
        </div>
        <div>
          <label htmlFor="size" className="mb-1 block text-sm font-medium">
            Ukuran <span aria-hidden="true">*</span>
          </label>
          <input
            id="size"
            value={data.size}
            onChange={(e) => set("size", e.target.value)}
            required
            placeholder="cth. M"
            className={inputCls}
          />
          {errors.size && <FieldError msg={errors.size} />}
        </div>
      </div>

      <div>
        <label htmlFor="sku" className="mb-1 block text-sm font-medium">
          SKU <span aria-hidden="true">*</span>
        </label>
        <div className="flex gap-2">
          <input
            id="sku"
            value={data.sku}
            onChange={(e) => set("sku", e.target.value.toUpperCase().replace(/\s+/g, "-"))}
            required
            className={inputCls}
          />
          <button
            type="button"
            onClick={suggestSku}
            className="shrink-0 rounded-[12px] border border-neutral-200 px-3 text-sm"
          >
            Auto
          </button>
        </div>
        {errors.sku && <FieldError msg={errors.sku} />}
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label htmlFor="stock" className="mb-1 block text-sm font-medium">
            Stok
          </label>
          <input
            id="stock"
            type="number"
            min={0}
            value={data.stock}
            onChange={(e) => set("stock", Number(e.target.value))}
            className={inputCls}
          />
          {errors.stock && <FieldError msg={errors.stock} />}
        </div>
        <div>
          <label htmlFor="price" className="mb-1 block text-sm font-medium">
            Harga (Rp) <span aria-hidden="true">*</span>
          </label>
          <input
            id="price"
            type="number"
            min={0}
            value={data.price}
            onChange={(e) => set("price", Number(e.target.value))}
            required
            className={inputCls}
          />
          {errors.price && <FieldError msg={errors.price} />}
        </div>
        <div>
          <label htmlFor="discountPrice" className="mb-1 block text-sm font-medium">
            Diskon (Rp)
          </label>
          <input
            id="discountPrice"
            type="number"
            min={0}
            value={data.discountPrice ?? ""}
            onChange={(e) => set("discountPrice", e.target.value === "" ? null : Number(e.target.value))}
            className={inputCls}
          />
          {errors.discountPrice && <FieldError msg={errors.discountPrice} />}
        </div>
      </div>

      {errors.form && (
        <p role="alert" className="text-sm text-[#B86A72]">{errors.form}</p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-[#E8B7C6] px-5 py-2 text-sm font-medium disabled:opacity-60"
      >
        {pending ? "Menyimpan…" : "Simpan"}
      </button>
    </form>
  );
}

function FieldError({ msg }: { msg: string }) {
  return <p role="alert" className="mt-1 text-xs text-[#B86A72]">{msg}</p>;
}
