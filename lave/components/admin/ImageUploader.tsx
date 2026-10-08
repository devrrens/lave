"use client";

import { useRef, useState } from "react";
import { compressImage } from "@/lib/image";

const MAX_BYTES = 3 * 1024 * 1024;

export function ImageUploader({
  folder,
  onUploaded,
}: {
  folder: string;
  onUploaded: (url: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handle(file: File | undefined) {
    if (!file) return;
    setError(null);
    if (!file.type.startsWith("image/")) {
      setError("File harus berupa gambar (JPG, PNG, WEBP).");
      return;
    }
    setUploading(true);
    try {
      const optimized = await compressImage(file);
      if (optimized.size > MAX_BYTES) {
        setError("Ukuran gambar masih lebih dari 3 MB setelah dikompres.");
        return;
      }
      const form = new FormData();
      form.set("folder", folder);
      form.set("file", optimized);
      const res = await fetch("/api/upload", { method: "POST", body: form });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Upload gagal.");
        return;
      }
      onUploaded(data.url);
      if (inputRef.current) inputRef.current.value = "";
    } catch {
      setError("Upload gagal. Coba lagi.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept=".jpg,.jpeg,.png,.webp"
        disabled={uploading}
        onChange={(e) => handle(e.target.files?.[0])}
        aria-label="Upload gambar"
        className="block text-sm file:mr-3 file:rounded-full file:border file:border-neutral-200 file:bg-neutral-50 file:px-4 file:py-1.5 file:text-sm disabled:opacity-60"
      />
      {uploading && <p className="mt-1 text-xs text-[#75696C]">Mengupload…</p>}
      {error && (
        <p role="alert" className="mt-1 text-xs text-[#B86A72]">
          {error}
        </p>
      )}
    </div>
  );
}
