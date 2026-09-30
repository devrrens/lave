export function BrandStorySection() {
  return (
    <section className="bg-[#FFF7F3] py-16 md:py-24">
      <div className="max-w-[1200px] mx-auto px-5 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">
          {/* Image side */}
          <div className="relative">
            <div className="aspect-[4/5] bg-[#F6DDE5] rounded-3xl overflow-hidden">
              <div className="w-full h-full flex items-center justify-center">
                <span className="font-serif text-6xl text-[#E8B7C6]/40 select-none">BJ</span>
              </div>
            </div>
            <div className="absolute -bottom-6 -right-4 md:-right-8 w-40 h-40 bg-[#FBECEF] rounded-3xl -z-10" />
          </div>

          {/* Text side */}
          <div className="space-y-6">
            <span className="text-xs tracking-[0.25em] text-[#E8B7C6] uppercase font-medium">
              Kisah Kami
            </span>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#3D3436] leading-tight">
              Untuk Wanita yang{" "}
              <em className="not-italic text-[#E8B7C6]">Menghargai Diri</em>
            </h2>
            <p className="text-sm md:text-base text-[#75696C] leading-relaxed">
              Barokah Jaya Fashion hadir dengan keyakinan bahwa setiap wanita berhak tampil anggun tanpa harus berkompromi dengan kenyamanan. Koleksi kami dirancang dengan penuh perhatian pada detail — mulai dari pemilihan material hingga setiap jahitan.
            </p>
            <p className="text-sm md:text-base text-[#75696C] leading-relaxed">
              Kami percaya bahwa busana yang baik bukan hanya soal penampilan, tetapi juga soal bagaimana Anda merasa memakainya.
            </p>
            <div className="flex gap-8 pt-2">
              <div>
                <p className="font-serif text-3xl font-bold text-[#3D3436]">100%</p>
                <p className="text-xs text-[#75696C] mt-0.5">Material Pilihan</p>
              </div>
              <div className="w-px bg-[#EDE2E5]" />
              <div>
                <p className="font-serif text-3xl font-bold text-[#3D3436]">4:5</p>
                <p className="text-xs text-[#75696C] mt-0.5">Rasio Foto Terbaik</p>
              </div>
              <div className="w-px bg-[#EDE2E5]" />
              <div>
                <p className="font-serif text-3xl font-bold text-[#3D3436]">Fast</p>
                <p className="text-xs text-[#75696C] mt-0.5">Respons WA</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
