import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export type TestimonialData = {
  id: string;
  customerName: string;
  rating: number;
  review: string;
  productName: string | null;
  verified: boolean;
};

export function TestimonialCard({ t }: { t: TestimonialData }) {
  return (
    <figure className="flex h-full flex-col rounded-[16px] border border-[#EDE2E5] bg-white p-5">
      <div className="flex gap-0.5" aria-label={`Rating ${t.rating} dari 5`}>
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={cn("h-4 w-4", i < t.rating ? "fill-[#C79B55] text-[#C79B55]" : "text-[#EDE2E5]")}
          />
        ))}
      </div>
      <blockquote className="mt-3 flex-1 text-[15px] leading-relaxed">“{t.review}”</blockquote>
      <figcaption className="mt-4">
        <p className="text-sm font-semibold">{t.customerName}</p>
        <p className="mt-0.5 flex flex-wrap items-center gap-2 text-xs text-[#A99B9F]">
          {t.productName && <span>{t.productName}</span>}
          {t.verified && (
            <span className="rounded-full bg-green-50 px-2 py-0.5 font-medium text-[#7A9B82]">
              Verified buyer
            </span>
          )}
        </p>
      </figcaption>
    </figure>
  );
}
