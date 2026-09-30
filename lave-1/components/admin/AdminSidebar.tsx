"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  FolderTree,
  Boxes,
  ShoppingCart,
  Users,
  MessageSquareQuote,
  LayoutTemplate,
  Tag,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { signOut } from "next-auth/react";
import { useState } from "react";

const navigation = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Produk", href: "/admin/products", icon: Package },
  { name: "Kategori", href: "/admin/categories", icon: FolderTree },
  { name: "Stok & Inventaris", href: "/admin/inventory", icon: Boxes },
  { name: "Pesanan", href: "/admin/orders", icon: ShoppingCart },
  { name: "Pelanggan", href: "/admin/customers", icon: Users },
  { name: "Testimoni", href: "/admin/testimonials", icon: MessageSquareQuote },
  { name: "CMS Beranda", href: "/admin/homepage", icon: LayoutTemplate },
  { name: "Promosi", href: "/admin/promotions", icon: Tag },
  { name: "Pengaturan", href: "/admin/settings", icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile Menu Toggle */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-[#EDE2E5] px-4 flex items-center justify-between z-40">
        <span className="font-serif font-bold text-lg text-[#3D3436]">
          Barokah Jaya Admin
        </span>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 rounded-lg text-[#75696C] hover:bg-[#FFF7F3]"
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Backdrop */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="lg:hidden fixed inset-0 bg-black/20 z-40"
        />
      )}

      {/* Sidebar Content */}
      <aside
        className={`fixed top-0 bottom-0 left-0 w-64 bg-white border-r border-[#EDE2E5] flex flex-col z-50 transition-transform duration-200 lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-6 border-b border-[#EDE2E5]">
          <Link href="/admin" className="block">
            <h1 className="font-serif font-bold text-xl text-[#3D3436]">
              Barokah Jaya
            </h1>
            <p className="text-xs text-[#75696C] mt-0.5">Backoffice Management</p>
          </Link>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {navigation.map((item) => {
            const isActive =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);

            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-[#FBECEF] text-[#3D3436] font-semibold"
                    : "text-[#75696C] hover:bg-[#FFF7F3] hover:text-[#3D3436]"
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? "text-[#E8B7C6]" : "text-[#A99B9F]"}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-[#EDE2E5]">
          <button
            onClick={() => signOut({ callbackUrl: "/admin/login" })}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-[#B86A72] hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Keluar
          </button>
        </div>
      </aside>
    </>
  );
}
