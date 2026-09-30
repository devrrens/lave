"use client";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="rounded-2xl border border-neutral-200 p-8 text-center">
      <h1 className="text-lg font-semibold">Gagal memuat data.</h1>
      <p className="mt-1 text-sm text-[#75696C]">
        {process.env.NODE_ENV === "development" ? error.message : "Coba lagi dalam sesaat."}
      </p>
      <button
        type="button"
        onClick={reset}
        className="mt-4 rounded-full bg-[#E8B7C6] px-4 py-2 text-sm font-medium"
      >
        Coba lagi
      </button>
    </main>
  );
}
