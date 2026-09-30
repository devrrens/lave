"use client";

import Link from "next/link";
import { useState } from "react";
import { ShoppingBag, Menu, X, Search } from "lucide-react";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-[#FFFCFA]/90 backdrop-blur-md border-b border-[#EDE2E5]">
      <div className="max-w-[1200px] mx-auto px-5 md:px-8 h-20 flex items-center justify-between">
        {/* Mobile menu trigger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-[#3D3436]"
          aria-label="Menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        {/* Brand Logo */}
        <Link href="/" className="text-center md:text-left">
          <span className="font-serif text-2xl md:text-3xl font-bold tracking-tight text-[#3D3436]">
            Barokah Jaya
          </span>
          <span className="block text-[10px] tracking-[0.2em] text-[#75696C] uppercase font-sans -mt-1">
            Fashion Boutique
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <Link
            href="/"
            className="text-sm font-medium text-[#3D3436] hover:text-[#E8B7C6] transition-colors"
          >
            Beranda
          </Link>
          <Link
            href="/collection"
            className="text-sm font-medium text-[#3D3436] hover:text-[#E8B7C6] transition-colors"
          >
            Koleksi
          </Link>
          <Link
            href="/about"
            className="text-sm font-medium text-[#3D3436] hover:text-[#E8B7C6] transition-colors"
          >
            Tentang Kami
          </Link>
          <Link
            href="/testimonials"
            className="text-sm font-medium text-[#3D3436] hover:text-[#E8B7C6] transition-colors"
          >
            Testimoni
          </Link>
          <Link
            href="/contact"
            className="text-sm font-medium text-[#3D3436] hover:text-[#E8B7C6] transition-colors"
          >
            Kontak
          </Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <Link
            href="/collection"
            className="p-2 text-[#3D3436] hover:text-[#E8B7C6] transition-colors"
            aria-label="Cari"
          >
            <Search className="w-5 h-5" />
          </Link>
          <Link
            href="/cart"
            className="p-2 text-[#3D3436] hover:text-[#E8B7C6] transition-colors relative"
            aria-label="Keranjang Belanja"
          >
            <ShoppingBag className="w-5 h-5" />
          </Link>
          <Link
            href="/collection"
            className="hidden sm:inline-flex items-center justify-center px-5 py-2 bg-[#E8B7C6] hover:bg-[#dca4b4] text-[#3D3436] font-medium text-xs rounded-full transition-colors tracking-wide"
          >
            Belanja Sekarang
          </Link>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-[#EDE2E5] bg-[#FFFCFA] px-6 py-6 space-y-4">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-base font-medium text-[#3D3436] py-1"
          >
            Beranda
          </Link>
          <Link
            href="/collection"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-base font-medium text-[#3D3436] py-1"
          >
            Koleksi
          </Link>
          <Link
            href="/about"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-base font-medium text-[#3D3436] py-1"
          >
            Tentang Kami
          </Link>
          <Link
            href="/testimonials"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-base font-medium text-[#3D3436] py-1"
          >
            Testimoni
          </Link>
          <Link
            href="/contact"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-base font-medium text-[#3D3436] py-1"
          >
            Kontak
          </Link>
          <div className="pt-4 border-t border-[#EDE2E5]">
            <Link
              href="/collection"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full inline-flex items-center justify-center px-6 py-3 bg-[#E8B7C6] text-[#3D3436] font-medium text-sm rounded-full"
            >
              Belanja Sekarang
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
