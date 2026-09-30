"use client";

import { cn } from "@/lib/utils";

export type VariantOption = {
  id: string;
  color: string;
  size: string;
  stock: number;
};

export function VariantSelector({
  variants,
  color,
  size,
  onChange,
}: {
  variants: VariantOption[];
  color: string | null;
  size: string | null;
  onChange: (color: string | null, size: string | null) => void;
}) {
  const colors = [...new Set(variants.map((v) => v.color))];
  const sizesForColor = color
    ? [...new Set(variants.filter((v) => v.color === color).map((v) => v.size))]
    : [...new Set(variants.map((v) => v.size))];

  function stockOf(c: string, s: string): number {
    return variants.find((v) => v.color === c && v.size === s)?.stock ?? 0;
  }

  return (
    <div className="space-y-4">
      <div>
        <p className="mb-2 text-sm font-medium" id="variant-color-label">
          Warna{color && `: ${color}`}
        </p>
        <div role="group" aria-labelledby="variant-color-label" className="flex flex-wrap gap-2">
          {colors.map((c) => {
            const hasStock = variants.some((v) => v.color === c && v.stock > 0);
            return (
              <button
                key={c}
                type="button"
                disabled={!hasStock}
                aria-pressed={color === c}
                onClick={() => onChange(c, null)}
                className={cn(
                  "rounded-full border px-4 py-1.5 text-sm",
                  color === c
                    ? "border-[#3D3436] bg-[#3D3436] text-white"
                    : "border-[#EDE2E5] bg-white",
                  !hasStock && "cursor-not-allowed opacity-40 line-through"
                )}
              >
                {c}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <p className="mb-2 text-sm font-medium" id="variant-size-label">
          Ukuran{size && `: ${size}`}
        </p>
        <div role="group" aria-labelledby="variant-size-label" className="flex flex-wrap gap-2">
          {sizesForColor.map((s) => {
            const stock = color ? stockOf(color, s) : 0;
            const disabled = color ? stock === 0 : false;
            return (
              <button
                key={s}
                type="button"
                disabled={disabled}
                aria-pressed={size === s}
                onClick={() => onChange(color, s)}
                className={cn(
                  "min-w-11 rounded-[12px] border px-3 py-1.5 text-sm",
                  size === s
                    ? "border-[#3D3436] bg-[#3D3436] text-white"
                    : "border-[#EDE2E5] bg-white",
                  disabled && "cursor-not-allowed opacity-40 line-through"
                )}
              >
                {s}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
