"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BadgePercent,
  Boxes,
  LayoutDashboard,
  LayoutTemplate,
  Menu,
  ReceiptText,
  Settings,
  Shirt,
  Star,
  Tags,
  Users,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

type NavItem = {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  ownerOnly?: boolean;
};

const ITEMS: NavItem[] = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Shirt },
  { href: "/admin/categories", label: "Categories", icon: Tags },
  { href: "/admin/inventory", label: "Inventory", icon: Boxes },
  { href: "/admin/orders", label: "Orders", icon: ReceiptText },
  { href: "/admin/customers", label: "Customers", icon: Users, ownerOnly: true },
  { href: "/admin/testimonials", label: "Testimonials", icon: Star },
  { href: "/admin/homepage", label: "Homepage", icon: LayoutTemplate },
  { href: "/admin/promotions", label: "Promotions", icon: BadgePercent, ownerOnly: true },
  { href: "/admin/settings", label: "Settings", icon: Settings, ownerOnly: true },
];

export function AdminNav({ role, email }: { role: string; email: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const items = ITEMS.filter((i) => !(i.ownerOnly && role !== "OWNER"));

  const list = (
    <nav aria-label="Admin" className="space-y-1">
      {items.map((item) => {
        const active =
          item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setOpen(false)}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex items-center gap-2 rounded-lg px-3 py-2 text-sm",
              active
                ? "bg-[#FBECEF] font-medium text-[#3D3436]"
                : "text-[#75696C] hover:bg-neutral-100"
            )}
          >
            <Icon className="h-4 w-4" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <>
      {/* Topbar mobile */}
      <div className="flex items-center justify-between border-b border-neutral-200 px-4 py-3 lg:hidden">
        <p className="text-sm font-semibold">BJF Admin</p>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label={open ? "Tutup menu" : "Buka menu"}
          className="rounded-lg border border-neutral-200 p-2"
        >
          {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>
      </div>
      {open && (
        <div className="border-b border-neutral-200 px-4 py-3 lg:hidden">{list}</div>
      )}

      {/* Sidebar desktop */}
      <aside className="hidden w-60 shrink-0 flex-col border-r border-neutral-200 bg-neutral-50 px-4 py-6 lg:fixed lg:inset-y-0 lg:left-0 lg:flex">
        <p className="px-3 text-sm font-semibold">BJF Admin</p>
        <p className="mt-1 truncate px-3 text-xs text-[#A99B9F]">
          {email} · {role}
        </p>
        <div className="mt-6">{list}</div>
      </aside>
    </>
  );
}
