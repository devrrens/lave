"use client";

import { useState, useTransition } from "react";
import { changeOrderStatus } from "@/app/admin/(panel)/orders/actions";

const STATUSES = ["PENDING", "CONFIRMED", "PROCESSING", "PACKED", "SHIPPED", "COMPLETED", "CANCELLED"];

export function OrderStatusForm({
  id,
  current,
  notes,
}: {
  id: string;
  current: string;
  notes: string | null;
}) {
  const [status, setStatus] = useState(current);
  const [adminNotes, setAdminNotes] = useState(notes ?? "");
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [pending, start] = useTransition();

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaved(false);
    start(async () => {
      const res = await changeOrderStatus(id, { status, adminNotes });
      if (!res.ok) setError(res.error ?? "Gagal.");
      else setSaved(true);
    });
  }

  return (
    <form onSubmit={submit} className="space-y-3 rounded-[16px] border border-neutral-200 p-4">
      <h2 className="text-sm font-semibold">Update Status</h2>
      <div>
        <label htmlFor="order-status" className="mb-1 block text-xs font-medium">Status</label>
        <select
          id="order-status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full rounded-[12px] border border-neutral-200 px-3 py-2 text-sm"
        >
          {STATUSES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="admin-notes" className="mb-1 block text-xs font-medium">Catatan admin</label>
        <textarea
          id="admin-notes"
          rows={2}
          value={adminNotes}
          onChange={(e) => setAdminNotes(e.target.value)}
          className="w-full rounded-[12px] border border-neutral-200 px-3 py-2 text-sm"
        />
      </div>
      {error && <p role="alert" className="text-xs text-[#B86A72]">{error}</p>}
      {saved && <p role="status" className="text-xs text-[#7A9B82]">Tersimpan ✓</p>}
      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-[#E8B7C6] px-4 py-1.5 text-sm font-medium disabled:opacity-60"
      >
        {pending ? "Menyimpan…" : "Simpan"}
      </button>
    </form>
  );
}
