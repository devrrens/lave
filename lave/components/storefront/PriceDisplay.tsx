import { formatIDR } from "@/lib/format";
import { cn } from "@/lib/utils";

export function PriceDisplay({
  sell,
  original,
  className,
}: {
  sell: number;
  original?: number | null;
  className?: string;
}) {
  return (
    <span className={cn("flex flex-wrap items-baseline gap-2", className)}>
      <span className="font-semibold">{formatIDR(sell)}</span>
      {original != null && (
        <span className="text-sm text-[#A99B9F] line-through">{formatIDR(original)}</span>
      )}
    </span>
  );
}
