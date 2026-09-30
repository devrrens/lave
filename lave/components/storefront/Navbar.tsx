"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, ShoppingBag, X } from "lucide-react";
import { cartCount } from "@/lib/cart";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/collection", label: "Collection" },
  { href: "/about", label: "About" },
  { href: "/testimonials", label: "Testimonials" },
  { href: "/contact", label: "Contact" },
];

export function Navbar({ brand }: { brand: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const update = () => setCount(cartCount());
    update();
    window.addEventListener("bjf-cart", update);
    window.addEventListener("storage", update);
    return () => {
      window.removeEventListener("bjf-cart", update);
      window.removeEventListener("storage", update);
    };
  }, []);

  return (
    <header className="sticky top-0 z-40 border-b border-[#EDE2E5] bg-[#FFFCFA]/95 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-[1200px] items-center justify-between px-5 md:px-8">
        <Link href="/" className="font-serif text-lg font-semibold">
          {brand}
        </Link>

        <nav aria-label="Utama" className="hidden items-center gap-6 md:flex">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              aria-current={pathname === l.href ? "page" : undefined}
              className={cn(
                "text-sm",
                pathname === l.href ? "font-semibold" : "text-[#75696C] hover:text-[#3D3436]"
              )}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/cart"
            aria-label={`Keranjang${count > 0 ? `, ${count} item` : ""}`}
            className="relative rounded-full border border-[#EDE2E5] p-2.5"
          >
            <ShoppingBag className="h-4 w-4" />
            {count > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#E8B7C6] px-1 text-[11px] font-semibold">
                {count}
              </span>
            )}
          </Link>
          <Link
            href="/collection"
            className="hidden rounded-full bg-[#E8B7C6] px-4 py-2 text-sm font-medium sm:block"
          >
            Order Now
          </Link>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label={open ? "Tutup menu" : "Buka menu"}
            className="rounded-full border border-[#EDE2E5] p-2.5 md:hidden"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {open && (
        <nav aria-label="Mobile" className="border-t border-[#EDE2E5] px-5 py-3 md:hidden">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block rounded-lg px-2 py-2.5 text-sm hover:bg-[#FBECEF]"
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/collection"
            onClick={() => setOpen(false)}
            className="mt-2 block rounded-full bg-[#E8B7C6] px-4 py-2.5 text-center text-sm font-medium"
          >
            Order Now
          </Link>
        </nav>
      )}
    </header>
  );
}
