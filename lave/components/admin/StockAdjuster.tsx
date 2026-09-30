"use client";

import { useState, useTransition } from "react";
import { changeStock } from "@/app/admin/(panel)/inventory/actions";

export function StockAdjuster({ variantId, stock }: { variantId: string; stock: number }) {
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function run(delta: number) {
    setError(null);
    start(async () => {
      const res = await changeStock({ variantId, delta });
      if (!res.ok) setError(res.error ?? "Gagal.");
    });
  }

  return (
    <span className="inline-flex items-center gap-1">
      <button
        type="button"
        aria-label="Kurangi stok 1"
        disabled={pending || stock <= 0}
        onClick={() => run(-1)}
        className="rounded-lg border border-neutral-200 px-2 py-0.5 text-sm disabled:opacity-40"
      >
        −
      </button>
      <span aria-live="polite" className="w-10 text-center font-semibold">{stock}</span>
      <button
        type="button"
        aria-label="Tambah stok 1"
        disabled={pending}
        onClick={() => run(1)}
        className="rounded-lg border border-neutral-200 px-2 py-0.5 text-sm disabled:opacity-40"
      >
        +
      </button>
      {error && (
        <span role="alert" className="text-xs text-[#B86A72]">{error}</span>
      )}
    </span>
  );
}
