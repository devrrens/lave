import { MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export function WhatsAppButton({
  href,
  label = "Order via WhatsApp",
  disabled,
  className,
}: {
  href?: string;
  label?: string;
  disabled?: boolean;
  className?: string;
}) {
  if (disabled || !href) {
    return (
      <button
        type="button"
        disabled
        title="Nomor WhatsApp toko belum dikonfigurasi."
        className={cn(
          "flex w-full items-center justify-center gap-2 rounded-full border border-[#EDE2E5] px-5 py-3 text-sm text-[#A99B9F]",
          className
        )}
      >
        <MessageCircle className="h-4 w-4" />
        {label}
      </button>
    );
  }
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "flex w-full items-center justify-center gap-2 rounded-full bg-[#7A9B82] px-5 py-3 text-sm font-medium text-white",
        className
      )}
    >
      <MessageCircle className="h-4 w-4" />
      {label}
    </a>
  );
}
