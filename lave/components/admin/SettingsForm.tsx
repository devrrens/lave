"use client";

import { useState, useTransition } from "react";
import { SETTING_FIELDS, type SettingsInput } from "@/lib/validations/settings";
import { ImageUploader } from "./ImageUploader";

const inputCls =
  "w-full rounded-[12px] border border-neutral-200 bg-white px-3 py-2 text-sm outline-none focus:border-[#E8B7C6]";

export function SettingsForm({
  initial,
  save,
}: {
  initial: SettingsInput;
  save: (data: SettingsInput) => Promise<{ ok: boolean; errors?: Record<string, string> }>;
}) {
  const [data, setData] = useState<SettingsInput>(initial);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState(false);
  const [pending, start] = useTransition();

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setErrors({});
    setSaved(false);
    start(async () => {
      const res = await save(data);
      if (!res.ok) setErrors(res.errors ?? { form: "Gagal menyimpan." });
      else setSaved(true);
    });
  }

  return (
    <form onSubmit={submit} className="max-w-2xl space-y-4" noValidate>
      <div>
        <span className="mb-1 block text-sm font-medium">Logo</span>
        {data.logo_url ? (
          <div className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={data.logo_url} alt="Logo" className="h-12 w-auto rounded-lg bg-neutral-50" />
            <button type="button" onClick={() => setData((d) => ({ ...d, logo_url: "" }))} className="text-xs text-[#B86A72] underline">
              Hapus
            </button>
          </div>
        ) : (
          <ImageUploader folder="settings" onUploaded={(url) => setData((d) => ({ ...d, logo_url: url }))} />
        )}
      </div>

      {SETTING_FIELDS.map((f) => (
        <div key={f.key}>
          <label htmlFor={f.key} className="mb-1 block text-sm font-medium">
            {f.label}
            {f.key === "brand_name" && <> <span aria-hidden="true">*</span></>}
          </label>
          <input
            id={f.key}
            value={data[f.key] ?? ""}
            onChange={(e) => setData((d) => ({ ...d, [f.key]: e.target.value }))}
            placeholder={f.hint ?? ""}
            className={inputCls}
          />
          {errors[f.key] && (
            <p role="alert" className="mt-1 text-xs text-[#B86A72]">{errors[f.key]}</p>
          )}
        </div>
      ))}

      {errors.form && <p role="alert" className="text-sm text-[#B86A72]">{errors.form}</p>}
      {saved && <p role="status" className="text-sm text-[#7A9B82]">Tersimpan ✓</p>}
      <button type="submit" disabled={pending} className="rounded-full bg-[#E8B7C6] px-5 py-2 text-sm font-medium disabled:opacity-60">
        {pending ? "Menyimpan…" : "Simpan"}
      </button>
    </form>
  );
}
