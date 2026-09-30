"use client";

import { useState } from "react";
import { updateOrderStatus } from "@/lib/actions/admin";
import { useRouter } from "next/navigation";
import { MessageCircle, ExternalLink } from "lucide-react";

type OrderItem = {
  id: string;
  reference: string;
  subtotal: number;
  total: number;
  status: string;
  notes: string | null;
  createdAt: Date;
  customer: {
    name: string;
    whatsapp: string;
    address: string | null;
  };
  items: {
    id: string;
    quantity: number;
    unitPrice: number;
    variant: {
      color: string;
      size: string;
      product: { name: string };
    };
  }[];
};

const STATUSES = [
  "PENDING",
  "CONFIRMED",
  "PROCESSING",
  "PACKED",
  "SHIPPED",
  "COMPLETED",
  "CANCELLED",
];

export function OrderListClient({ orders }: { orders: OrderItem[] }) {
  const router = useRouter();
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const handleStatusChange = async (id: string, status: string) => {
    setUpdatingId(id);
    try {
      await updateOrderStatus(id, status);
      router.refresh();
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-[#EDE2E5] overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-[#EDE2E5] bg-[#FFFCFA]">
            <th className="text-left px-5 py-3.5 text-[#75696C] font-medium">Referensi</th>
            <th className="text-left px-5 py-3.5 text-[#75696C] font-medium">Pelanggan</th>
            <th className="text-left px-5 py-3.5 text-[#75696C] font-medium hidden md:table-cell">Item</th>
            <th className="text-right px-5 py-3.5 text-[#75696C] font-medium">Total</th>
            <th className="text-center px-5 py-3.5 text-[#75696C] font-medium">Status</th>
            <th className="text-right px-5 py-3.5 text-[#75696C] font-medium">Kontak</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o.id} className="border-b border-[#EDE2E5] last:border-0 hover:bg-[#FFFCFA]">
              <td className="px-5 py-4 font-mono font-medium text-[#3D3436]">{o.reference}</td>
              <td className="px-5 py-4">
                <span className="font-medium text-[#3D3436] block">{o.customer.name}</span>
                <span className="text-xs text-[#A99B9F] truncate max-w-[150px] block">
                  {o.customer.address || "Tanpa alamat"}
                </span>
              </td>
              <td className="px-5 py-4 text-[#75696C] hidden md:table-cell">
                {o.items.map((i) => `${i.variant.product.name} (${i.variant.color}/${i.variant.size}) x${i.quantity}`).join(", ")}
              </td>
              <td className="px-5 py-4 text-right font-medium text-[#3D3436]">
                Rp {o.total.toLocaleString("id-ID")}
              </td>
              <td className="px-5 py-4 text-center">
                <select
                  value={o.status}
                  onChange={(e) => handleStatusChange(o.id, e.target.value)}
                  disabled={updatingId === o.id}
                  className="px-2.5 py-1 text-xs border border-[#EDE2E5] rounded-full focus:outline-none focus:ring-1 focus:ring-[#E8B7C6] bg-white font-medium text-[#3D3436]"
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </td>
              <td className="px-5 py-4 text-right">
                <a
                  href={`https://wa.me/${o.customer.whatsapp}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-medium text-[#7A9B82] hover:underline"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  WA
                  <ExternalLink className="w-3 h-3" />
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
