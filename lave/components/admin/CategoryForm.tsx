"use client";

import { useState, useTransition } from "react";
import { slugify } from "@/lib/utils";
import type { CategoryInput } from "@/lib/validations/category";
import { ImageUploader } from "./ImageUploader";

const inputCls =
  "w-full rounded-[12px] border border-neutral-200 bg-white px-3 py-2 text-sm outline-none focus:border-[#E8B7C6]";

export function CategoryForm({
  id,
  initial,
  save,
}: {
  id: string | null;
  initial: CategoryInput;
  save: (
    id: string | null,
    data: CategoryInput
  ) => Promise<{ ok: boolean; errors?: Record<string, string> }>;
}) {
  const [data, setData] = useState<CategoryInput>(initial);
  const [slugTouched, setSlugTouched] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [pending, start] = useTransition();

  function set<K extends keyof CategoryInput>(key: K, value: CategoryInput[K]) {
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
      <div>
        <label className="mb-1 block text-sm font-medium">Gambar</label>
        {data.imageUrl ? (
          <div className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={data.imageUrl} alt="" className="h-16 w-16 rounded-xl object-cover" />
            <button
              type="button"
              onClick={() => set("imageUrl", "")}
              className="text-xs text-[#B86A72] underline"
            >
              Hapus
            </button>
          </div>
        ) : (
          <ImageUploader folder="banners" onUploaded={(url) => set("imageUrl", url)} />
        )}
      </div>
      <div>
        <label htmlFor="sortOrder" className="mb-1 block text-sm font-medium">
          Urutan
        </label>
        <input
          id="sortOrder"
          type="number"
          min={0}
          value={data.sortOrder}
          onChange={(e) => set("sortOrder", Number(e.target.value))}
          className={inputCls}
        />
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
