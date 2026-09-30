import { formatIDR } from "./format";

export function normalizeWaNumber(raw: string | null | undefined): string | null {
  if (!raw || raw.startsWith("TODO")) return null;
  const digits = raw.replace(/\D/g, "");
  if (digits.length < 9) return null;
  return digits;
}

export function waLink(number: string, message: string): string {
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

export function productWaMessage(opts: {
  brand: string;
  product: string;
  variantLabel?: string | null;
  qty: number;
  unitPrice: number;
}): string {
  const total = opts.unitPrice * opts.qty;
  const lines = [
    `Halo ${opts.brand}! Saya mau order:`,
    ``,
    `• Produk: ${opts.product}`,
    ...(opts.variantLabel ? [`• Varian: ${opts.variantLabel}`] : []),
    `• Qty: ${opts.qty}`,
    `• Harga: ${formatIDR(opts.unitPrice)}`,
    ``,
    `Total: ${formatIDR(total)}`,
    `Terima kasih.`,
  ];
  return lines.join("\n");
}

export function toIntlWaNumber(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  if (digits.startsWith("0")) return `62${digits.slice(1)}`;
  return digits;
}

export function orderWaMessage(opts: {
  brand: string;
  reference: string;
  customerName: string;
  items: Array<{ name: string; variantLab: string | null; qty: number; price: number }>;
  total: number;
}): string {
  const lines = [
    `Halo ${opts.brand}! Konfirmasi order ${opts.reference}:`,
    ``,
    ...opts.items.map(
      (i) => `• ${i.name}${i.variantLab ? ` (${i.variantLab})` : ""} x${i.qty} — ${formatIDR(i.price * i.qty)}`
    ),
    ``,
    `Total: ${formatIDR(opts.total)}`,
    `Nama: ${opts.customerName}`,
    `Terima kasih.`,
  ];
  return lines.join("\n");
}
