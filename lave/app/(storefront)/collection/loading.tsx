export default function CollectionLoading() {
  return (
    <main className="mx-auto w-full max-w-[1200px] px-5 py-12 md:px-8" aria-busy="true" aria-label="Memuat koleksi">
      <div className="mx-auto h-9 w-48 animate-pulse rounded-lg bg-[#F6DDE5]" />
      <div className="mt-8 h-28 animate-pulse rounded-[16px] bg-[#FBECEF]" />
      <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="overflow-hidden rounded-[16px] border border-[#EDE2E5]">
            <div className="aspect-[4/5] animate-pulse bg-[#FBECEF]" />
            <div className="space-y-2 p-3">
              <div className="h-4 w-3/4 animate-pulse rounded bg-[#F6DDE5]" />
              <div className="h-4 w-1/2 animate-pulse rounded bg-[#F6DDE5]" />
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
