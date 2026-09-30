"use client";

import Image from "next/image";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

type ProductImage = {
  url: string;
};

export function ProductGallery({
  images,
  name,
}: {
  images: ProductImage[];
  name: string;
}) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (images.length === 0) {
    return (
      <div className="aspect-[4/5] bg-[#FFF7F3] rounded-2xl flex items-center justify-center">
        <span className="font-serif text-6xl text-[#EDE2E5]">{name[0]}</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative aspect-[4/5] bg-[#FFF7F3] rounded-2xl overflow-hidden group">
        <Image
          src={images[activeIndex].url}
          alt={`${name} - Gambar ${activeIndex + 1}`}
          fill
          className="object-cover"
          priority={activeIndex === 0}
        />

        {images.length > 1 && (
          <>
            <button
              onClick={() => setActiveIndex((activeIndex - 1 + images.length) % images.length)}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Gambar sebelumnya"
            >
              <ChevronLeft className="w-5 h-5 text-[#3D3436]" />
            </button>
            <button
              onClick={() => setActiveIndex((activeIndex + 1) % images.length)}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Gambar selanjutnya"
            >
              <ChevronRight className="w-5 h-5 text-[#3D3436]" />
            </button>
          </>
        )}

        {/* Indicator dots */}
        {images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {images.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveIndex(idx)}
                className={`w-2 h-2 rounded-full transition-all ${
                  idx === activeIndex ? "bg-white w-6" : "bg-white/50"
                }`}
                aria-label={`Gambar ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-3">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIndex(idx)}
              className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                idx === activeIndex
                  ? "border-[#E8B7C6]"
                  : "border-transparent hover:border-[#EDE2E5]"
              }`}
            >
              <Image
                src={img.url}
                alt={`${name} thumbnail ${idx + 1}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
