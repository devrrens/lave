export default function AdminLoading() {
  return (
    <main aria-busy="true" aria-label="Memuat">
      <div className="h-7 w-40 animate-pulse rounded-lg bg-neutral-100" />
      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-2xl border border-neutral-200 p-4">
            <div className="h-4 w-20 animate-pulse rounded bg-neutral-100" />
            <div className="mt-2 h-7 w-24 animate-pulse rounded bg-neutral-100" />
          </div>
        ))}
      </div>
      <div className="mt-6 h-48 animate-pulse rounded-2xl bg-neutral-100" />
    </main>
  );
}
