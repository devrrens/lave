"use client";

import { useState, useTransition } from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import type { TestimonialInput } from "@/lib/validations/testimonial";
import { ImageUploader } from "./ImageUploader";

const inputCls =
  "w-full rounded-[12px] border border-neutral-200 bg-white px-3 py-2 text-sm outline-none focus:border-[#E8B7C6]";

export function TestimonialForm({
  id,
  initial,
  save,
}: {
  id: string | null;
  initial: TestimonialInput;
  save: (
    id: string | null,
    data: TestimonialInput
  ) => Promise<{ ok: boolean; errors?: Record<string, string> }>;
}) {
  const [data, setData] = useState<TestimonialInput>(initial);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [pending, start] = useTransition();

  function set<K extends keyof TestimonialInput>(key: K, value: TestimonialInput[K]) {
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
    <form onSubmit={submit} className="max-w-xl space-y-4" noValidate>
      <div>
        <label htmlFor="customerName" className="mb-1 block text-sm font-medium">
          Nama customer <span aria-hidden="true">*</span>
        </label>
        <input
          id="customerName"
          value={data.customerName}
          onChange={(e) => set("customerName", e.target.value)}
          required
          className={inputCls}
        />
        {errors.customerName && <FieldError msg={errors.customerName} />}
      </div>

      <div>
        <span className="mb-1 block text-sm font-medium">Rating</span>
        <div className="flex gap-1" role="radiogroup" aria-label="Rating">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              role="radio"
              aria-checked={data.rating === n}
              aria-label={`${n} bintang`}
              onClick={() => set("rating", n)}
              className="p-1"
            >
              <Star
                className={cn("h-6 w-6", n <= data.rating ? "fill-[#C79B55] text-[#C79B55]" : "text-neutral-300")}
              />
            </button>
          ))}
        </div>
      </div>

      <div>
        <label htmlFor="review" className="mb-1 block text-sm font-medium">
          Ulasan <span aria-hidden="true">*</span>
        </label>
        <textarea
          id="review"
          rows={4}
          value={data.review}
          onChange={(e) => set("review", e.target.value)}
          required
          className={inputCls}
        />
        {errors.review && <FieldError msg={errors.review} />}
      </div>

      <div>
        <label htmlFor="productName" className="mb-1 block text-sm font-medium">
          Produk (opsional)
        </label>
        <input
          id="productName"
          value={data.productName ?? ""}
          onChange={(e) => set("productName", e.target.value)}
          placeholder="cth. Dress Sakura"
          className={inputCls}
        />
      </div>

      <div>
        <span className="mb-1 block text-sm font-medium">Foto profil (opsional)</span>
        {data.profileImage ? (
          <div className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={data.profileImage} alt="" className="h-12 w-12 rounded-full object-cover" />
            <button
              type="button"
              onClick={() => set("profileImage", "")}
              className="text-xs text-[#B86A72] underline"
            >
              Hapus
            </button>
          </div>
        ) : (
          <ImageUploader folder="testimonials" onUploaded={(url) => set("profileImage", url)} />
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={data.verified}
            onChange={(e) => set("verified", e.target.checked)}
            className="h-4 w-4 accent-[#E8B7C6]"
          />
          Verified buyer
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={data.published}
            onChange={(e) => set("published", e.target.checked)}
            className="h-4 w-4 accent-[#E8B7C6]"
          />
          Published (tampil publik)
        </label>
      </div>

      <div>
        <label htmlFor="sortOrder" className="mb-1 block text-sm font-medium">Urutan tampil</label>
        <input
          id="sortOrder"
          type="number"
          min={0}
          value={data.sortOrder}
          onChange={(e) => set("sortOrder", Number(e.target.value))}
          className={inputCls}
        />
      </div>

      {errors.form && <p role="alert" className="text-sm text-[#B86A72]">{errors.form}</p>}
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
