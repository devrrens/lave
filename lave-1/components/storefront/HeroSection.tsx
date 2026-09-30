import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function HeroSection() {
  return (
    <section className="bg-[#FFF7F3] overflow-hidden">
      <div className="max-w-[1200px] mx-auto px-5 md:px-8 py-20 md:py-32">
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
          <span className="text-xs tracking-[0.3em] text-[#E8B7C6] uppercase font-medium mb-6">
            New Collection 2026
          </span>
          <h1 className="font-serif text-[40px] md:text-[64px] font-bold leading-tight text-[#3D3436]">
            Beauty in
            <br />
            <em className="not-italic text-[#E8B7C6]">Every Detail</em>
          </h1>
          <p className="text-sm md:text-base text-[#75696C] mt-6 max-w-md leading-relaxed">
            Temukan koleksi busana wanita pilihan yang feminin, elegan, dan nyaman untuk momen istimewa Anda.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 mt-10">
            <Link
              href="/collection"
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-[#E8B7C6] hover:bg-[#dca4b4] text-[#3D3436] font-medium rounded-full text-sm transition-colors"
            >
              Lihat Koleksi
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center justify-center px-7 py-3.5 border border-[#EDE2E5] hover:bg-[#FBECEF] text-[#3D3436] font-medium rounded-full text-sm transition-colors"
            >
              Tentang Kami
            </Link>
          </div>
        </div>

        {/* Decorative strip */}
        <div className="flex justify-center gap-3 mt-16 overflow-hidden">
          {["Gamis", "Kebaya Modern", "Tunik", "Rok", "Kaftan"].map((label) => (
            <Link
              key={label}
              href={`/collection?q=${encodeURIComponent(label)}`}
              className="shrink-0 px-4 py-1.5 bg-white border border-[#EDE2E5] rounded-full text-xs text-[#75696C] hover:border-[#E8B7C6] hover:text-[#3D3436] transition-colors"
            >
              {label}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
