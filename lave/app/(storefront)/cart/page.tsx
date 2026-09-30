import type { Metadata } from "next";
import { CartClient } from "./CartClient";

export const metadata: Metadata = {
  title: "Keranjang",
  description: "Keranjang belanja Anda.",
  alternates: { canonical: "/cart" },
};

export default function CartPage() {
  return (
    <main className="mx-auto w-full max-w-[1200px] px-5 py-12 md:px-8">
      <h1 className="font-serif text-[32px] md:text-[40px]">Keranjang</h1>
      <CartClient />
    </main>
  );
}
