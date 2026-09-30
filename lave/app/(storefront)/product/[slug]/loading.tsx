export default function ProductLoading() {
  return (
    <main className="mx-auto w-full max-w-[1200px] px-5 py-8 md:px-8 md:py-12" aria-busy="true" aria-label="Memuat produk">
      <div className="h-4 w-48 animate-pulse rounded bg-[#F6DDE5]" />
      <div className="mt-6 grid gap-8 lg:grid-cols-2">
        <div className="aspect-[4/5] animate-pulse rounded-[16px] bg-[#FBECEF]" />
        <div className="space-y-4">
          <div className="h-10 w-3/4 animate-pulse rounded-lg bg-[#F6DDE5]" />
          <div className="h-6 w-1/3 animate-pulse rounded bg-[#F6DDE5]" />
          <div className="h-24 animate-pulse rounded-[16px] bg-[#FBECEF]" />
          <div className="h-12 animate-pulse rounded-full bg-[#F6DDE5]" />
        </div>
      </div>
    </main>
  );
}
