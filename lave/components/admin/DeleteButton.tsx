"use client";

import { useState, useTransition } from "react";

export function DeleteButton({
  label,
  confirmText,
  action,
}: {
  label: string;
  confirmText: string;
  action: () => Promise<{ ok: boolean; error?: string }>;
}) {
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);

  return (
    <span>
      <button
        type="button"
        disabled={pending}
        onClick={() => {
          if (!window.confirm(confirmText)) return;
          setError(null);
          start(async () => {
            const res = await action();
            if (!res.ok) setError(res.error ?? "Gagal menghapus.");
          });
        }}
        className="rounded-full border border-[#EDE2E5] px-3 py-1 text-xs text-[#B86A72] disabled:opacity-60"
      >
        {pending ? "Menghapus…" : label}
      </button>
      {error && (
        <span role="alert" className="ml-2 text-xs text-[#B86A72]">
          {error}
        </span>
      )}
    </span>
  );
}
