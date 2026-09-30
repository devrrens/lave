"use client";

import { useState, useTransition } from "react";
import { slugify } from "@/lib/utils";
import type { ProductInput } from "@/lib/validations/product";
import { ImageUploader } from "./ImageUploader";

const inputCls =
  "w-full rounded-[12px] border border-neutral-200 bg-white px-3 py-2 text-sm outline-none focus:border-[#E8B7C6]";

export function ProductForm({
  id,
  initial,
  categories,
  save,
}: {
  id: string | null;
  initial: ProductInput;
  categories: Array<{ id: string; name: string }>;
  save: (
    id: string | null,
    data: ProductInput
  ) => Promise<{ ok: boolean; errors?: Record<string, string> }>;
}) {
  const [data, setData] = useState<ProductInput>(initial);
  const [slugTouched, setSlugTouched] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [pending, start] = useTransition();

  function set<K extends keyof ProductInput>(key: K, value: ProductInput[K]) {
    setData((d) => ({ ...d, [key]: value }));
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
    <form onSubmit={submit} className="max-w-2xl space-y-4" noValidate>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="mb-1 block text-sm font-medium">
            Nama <span aria-hidden="true">*</span>
          </label>
          <input
            id="name"
            value={data.name}
            onChange={(e) => {
              set("name", e.target.value);
              if (!slugTouched) set("slug", slugify(e.target.value));
            }}
            required
            className={inputCls}
          />
          {errors.name && <FieldError msg={errors.name} />}
        </div>
        <div>
          <label htmlFor="slug" className="mb-1 block text-sm font-medium">
            Slug <span aria-hidden="true">*</span>
          </label>
          <input
            id="slug"
            value={data.slug}
            onChange={(e) => {
              setSlugTouched(true);
              set("slug", slugify(e.target.value));
            }}
            required
            className={inputCls}
          />
          {errors.slug && <FieldError msg={errors.slug} />}
        </div>
      </div>

      <div>
        <label htmlFor="description" className="mb-1 block text-sm font-medium">
          Deskripsi
        </label>
        <textarea
          id="description"
          value={data.description ?? ""}
          onChange={(e) => set("description", e.target.value)}
          rows={4}
          className={inputCls}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="categoryId" className="mb-1 block text-sm font-medium">
            Kategori
          </label>
          <select
            id="categoryId"
            value={data.categoryId ?? ""}
            onChange={(e) => set("categoryId", e.target.value)}
            className={inputCls}
          >
            <option value="">— Tanpa kategori —</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="material" className="mb-1 block text-sm font-medium">
            Material
          </label>
          <input
            id="material"
            value={data.material ?? ""}
            onChange={(e) => set("material", e.target.value)}
            className={inputCls}
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label htmlFor="price" className="mb-1 block text-sm font-medium">
            Harga (Rp) <span aria-hidden="true">*</span>
          </label>
          <input
            id="price"
            type="number"
            min={0}
            step={1}
            value={data.price}
            onChange={(e) => set("price", Number(e.target.value))}
            required
            className={inputCls}
          />
          {errors.price && <FieldError msg={errors.price} />}
        </div>
        <div>
          <label htmlFor="discountPrice" className="mb-1 block text-sm font-medium">
            Harga diskon (Rp)
          </label>
          <input
            id="discountPrice"
            type="number"
            min={0}
            step={1}
            value={data.discountPrice ?? ""}
            onChange={(e) =>
              set("discountPrice", e.target.value === "" ? null : Number(e.target.value))
            }
            className={inputCls}
          />
          {errors.discountPrice && <FieldError msg={errors.discountPrice} />}
        </div>
        <div>
          <label htmlFor="status" className="mb-1 block text-sm font-medium">
            Status
          </label>
          <select
            id="status"
            value={data.status}
            onChange={(e) => set("status", e.target.value as ProductInput["status"])}
            className={inputCls}
          >
            <option value="DRAFT">Draft</option>
            <option value="PUBLISHED">Published</option>
            <option value="ARCHIVED">Archived</option>
          </select>
        </div>
      </div>

      <fieldset className="flex flex-wrap gap-4">
        <legend className="sr-only">Penanda</legend>
        {(
          [
            ["isFeatured", "Featured"],
            ["isBestSeller", "Best seller"],
            ["isNewArrival", "New arrival"],
          ] as const
        ).map(([key, label]) => (
          <label key={key} className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={data[key]}
              onChange={(e) => set(key, e.target.checked)}
              className="h-4 w-4 accent-[#E8B7C6]"
            />
            {label}
          </label>
        ))}
      </fieldset>

      <div>
        <span className="mb-1 block text-sm font-medium">
          Gambar ({data.images.length}/10)
        </span>
        {data.images.length > 0 && (
          <ul className="mb-3 grid grid-cols-3 gap-2 sm:grid-cols-5">
            {data.images.map((img, i) => (
              <li key={`${img.url}-${i}`} className="relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img.url}
                  alt={img.alt || data.name}
                  className="aspect-[4/5] w-full rounded-xl object-cover"
                />
                {i === 0 && (
                  <span className="absolute left-1 top-1 rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-medium">
                    Cover
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => set("images", data.images.filter((_, j) => j !== i))}
                  aria-label={`Hapus gambar ${i + 1}`}
                  className="absolute right-1 top-1 rounded-full bg-white/90 px-2 py-0.5 text-[10px] text-[#B86A72]"
                >
                  Hapus
                </button>
              </li>
            ))}
          </ul>
        )}
        {data.images.length < 10 && (
          <ImageUploader
            folder="products"
            onUploaded={(url) => set("images", [...data.images, { url, alt: "" }])}
          />
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="sizeGuide" className="mb-1 block text-sm font-medium">
            Size guide
          </label>
          <textarea
            id="sizeGuide"
            value={data.sizeGuide ?? ""}
            onChange={(e) => set("sizeGuide", e.target.value)}
            rows={3}
            className={inputCls}
          />
        </div>
        <div>
          <label htmlFor="careGuide" className="mb-1 block text-sm font-medium">
            Care instructions
          </label>
          <textarea
            id="careGuide"
            value={data.careGuide ?? ""}
            onChange={(e) => set("careGuide", e.target.value)}
            rows={3}
            className={inputCls}
          />
        </div>
      </div>

      {errors.form && (
        <p role="alert" className="text-sm text-[#B86A72]">
          {errors.form}
        </p>
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
  return (
    <p role="alert" className="mt-1 text-xs text-[#B86A72]">
      {msg}
    </p>
  );
}
