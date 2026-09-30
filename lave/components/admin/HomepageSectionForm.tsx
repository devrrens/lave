"use client";

import { useState, useTransition } from "react";
import type { HomepageSectionInput } from "@/lib/validations/homepage";
import { ImageUploader } from "./ImageUploader";

const inputCls =
  "w-full rounded-[12px] border border-neutral-200 bg-white px-3 py-2 text-sm outline-none focus:border-[#E8B7C6]";

export function HomepageSectionForm({
  sectionKey,
  initial,
  save,
}: {
  sectionKey: string;
  initial: HomepageSectionInput;
  save: (
    key: string,
    data: HomepageSectionInput
  ) => Promise<{ ok: boolean; errors?: Record<string, string> }>;
}) {
  const [data, setData] = useState<HomepageSectionInput>(initial);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState(false);
  const [pending, start] = useTransition();

  function set<K extends keyof HomepageSectionInput>(key: K, value: HomepageSectionInput[K]) {
    setData((d) => ({ ...d, [key]: value }));
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setErrors({});
    setSaved(false);
    start(async () => {
      const res = await save(sectionKey, data);
      if (!res.ok) setErrors(res.errors ?? { form: "Gagal menyimpan." });
      else setSaved(true);
    });
  }

  return (
    <form onSubmit={submit} className="max-w-xl space-y-4" noValidate>
      <div>
        <label htmlFor="title" className="mb-1 block text-sm font-medium">Judul</label>
        <input id="title" value={data.title ?? ""} onChange={(e) => set("title", e.target.value)} className={inputCls} />
      </div>
      <div>
        <label htmlFor="subtitle" className="mb-1 block text-sm font-medium">Deskripsi</label>
        <textarea id="subtitle" rows={4} value={data.subtitle ?? ""} onChange={(e) => set("subtitle", e.target.value)} className={inputCls} />
      </div>
      <div>
        <span className="mb-1 block text-sm font-medium">Gambar</span>
        {data.imageUrl ? (
          <div className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={data.imageUrl} alt="" className="h-20 w-16 rounded-xl object-cover" />
            <button type="button" onClick={() => set("imageUrl", "")} className="text-xs text-[#B86A72] underline">
              Hapus
            </button>
          </div>
        ) : (
          <ImageUploader folder="homepage" onUploaded={(url) => set("imageUrl", url)} />
        )}
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="ctaLabel" className="mb-1 block text-sm font-medium">Label CTA</label>
          <input id="ctaLabel" value={data.ctaLabel ?? ""} onChange={(e) => set("ctaLabel", e.target.value)} className={inputCls} />
        </div>
        <div>
          <label htmlFor="ctaUrl" className="mb-1 block text-sm font-medium">Tujuan CTA</label>
          <input id="ctaUrl" value={data.ctaUrl ?? ""} onChange={(e) => set("ctaUrl", e.target.value)} placeholder="/collection" className={inputCls} />
        </div>
      </div>
      <div className="flex flex-wrap gap-4">
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={data.isVisible} onChange={(e) => set("isVisible", e.target.checked)} className="h-4 w-4 accent-[#E8B7C6]" />
          Tampilkan di homepage
        </label>
      </div>
      {errors.form && <p role="alert" className="text-sm text-[#B86A72]">{errors.form}</p>}
      {saved && <p role="status" className="text-sm text-[#7A9B82]">Tersimpan ✓</p>}
      <button type="submit" disabled={pending} className="rounded-full bg-[#E8B7C6] px-5 py-2 text-sm font-medium disabled:opacity-60">
        {pending ? "Menyimpan…" : "Simpan"}
      </button>
    </form>
  );
}
