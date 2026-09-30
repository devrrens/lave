"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { copyProduct, publishProduct } from "@/app/admin/(panel)/products/actions";

export function ProductRowActions({
  id,
  status,
}: {
  id: string;
  status: string;
}) {
  const [pending, start] = useTransition();
  const router = useRouter();

  function run(fn: () => Promise<unknown>) {
    start(async () => {
      await fn();
      router.refresh();
    });
  }

  return (
    <span className="flex flex-wrap gap-2">
      {status === "PUBLISHED" ? (
        <button
          type="button"
          disabled={pending}
          onClick={() => run(() => publishProduct(id, "DRAFT"))}
          className="rounded-full border border-neutral-200 px-3 py-1 text-xs disabled:opacity-60"
        >
          Unpublish
        </button>
      ) : (
        <button
          type="button"
          disabled={pending}
          onClick={() => run(() => publishProduct(id, "PUBLISHED"))}
          className="rounded-full border border-neutral-200 px-3 py-1 text-xs disabled:opacity-60"
        >
          Publish
        </button>
      )}
      <button
        type="button"
        disabled={pending}
        onClick={() => run(() => copyProduct(id))}
        className="rounded-full border border-neutral-200 px-3 py-1 text-xs disabled:opacity-60"
      >
        Duplikat
      </button>
    </span>
  );
}
