import Link from "next/link";
import type { Metadata } from "next";
import { CheckCircle2 } from "lucide-react";
import { WhatsAppButton } from "@/components/storefront/WhatsAppButton";
import { formatIDR } from "@/lib/format";
import { getOrderByReference } from "@/lib/services/orders";
import { getPublicSettings } from "@/lib/services/storefront";
import { normalizeWaNumber, orderWaMessage, toIntlWaNumber, waLink } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Order Berhasil",
  alternates: { canonical: "/order-success" },
};

export default async function OrderSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ ref?: string }>;
}) {
  const { ref } = await searchParams;
  if (!ref) {
    return (
      <main className="mx-auto w-full max-w-xl px-5 py-12 text-center">
        <p>Order tidak ditemukan.</p>
        <Link href="/collection" className="mt-4 inline-block underline">Kembali belanja →</Link>
      </main>
    );
  }

  const [order, settings] = await Promise.all([
    getOrderByReference(ref),
    getPublicSettings().catch(() => ({} as Record<string, string>)),
  ]);

  if (!order) {
    return (
      <main className="mx-auto w-full max-w-xl px-5 py-12 text-center">
        <p>Order <span className="font-mono">{ref}</span> tidak ditemukan.</p>
        <Link href="/collection" className="mt-4 inline-block underline">Kembali belanja →</Link>
      </main>
    );
  }

  const brand = settings.brand_name || "Barokah Jaya Fashion";
  const waNumber = normalizeWaNumber(settings.whatsapp);
  const waHref = waNumber
    ? waLink(
        toIntlWaNumber(waNumber),
        orderWaMessage({
          brand,
          reference: order.reference,
          customerName: order.customerName,
          items: order.items.map((i) => ({
            name: i.name,
            variantLab: i.variantLab,
            qty: i.quantity,
            price: i.price,
          })),
          total: order.total,
        })
      )
    : undefined;

  return (
    <main className="mx-auto w-full max-w-xl px-5 py-12 md:px-8">
      <div className="text-center">
        <CheckCircle2 className="mx-auto h-10 w-10 text-[#7A9B82]" />
        <h1 className="mt-3 font-serif text-[32px]">Order Berhasil!</h1>
        <p className="mt-2 text-sm text-[#75696C]">
          Referensi: <span className="font-mono font-semibold text-[#3D3436]">{order.reference}</span>
        </p>
      </div>

      <section aria-label="Ringkasan order" className="mt-8 rounded-[16px] border border-[#EDE2E5] bg-white p-5">
        <ul className="divide-y divide-neutral-100 text-sm">
          {order.items.map((i) => (
            <li key={i.id} className="flex justify-between gap-3 py-2">
              <span>
                {i.name}
                {i.variantLab && <span className="text-[#75696C]"> ({i.variantLab})</span>}
                <span className="text-[#75696C]"> x{i.quantity}</span>
              </span>
              <span className="font-medium">{formatIDR(i.subtotal)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-3 flex justify-between border-t border-[#EDE2E5] pt-3 font-semibold">
          <span>Total</span>
          <span>{formatIDR(order.total)}</span>
        </div>
        <p className="mt-3 text-xs text-[#75696C]">
          {order.customerName} · {order.customerWhats}
        </p>
      </section>

      <div className="mt-6">
        <WhatsAppButton href={waHref} disabled={!waHref} label="Lanjutkan via WhatsApp" />
        {!waHref && (
          <p className="mt-2 text-center text-xs text-[#A99B9F]">
            Nomor WhatsApp toko belum dikonfigurasi.
          </p>
        )}
      </div>

      <p className="mt-6 text-center">
        <Link href="/collection" className="text-sm text-[#75696C] underline">
          Lanjut belanja →
        </Link>
      </p>
    </main>
  );
}
