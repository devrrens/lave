"use client";

export type CartItem = {
  productId: string;
  productSlug: string;
  variantId: string | null;
  name: string;
  variantLabel: string | null;
  price: number;
  image?: string;
  qty: number;
};

const KEY = "bjf-cart";

export function getCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveCart(items: CartItem[]) {
  localStorage.setItem(KEY, JSON.stringify(items));
  window.dispatchEvent(new CustomEvent("bjf-cart"));
}

export function cartCount(): number {
  return getCart().reduce((s, i) => s + i.qty, 0);
}

export function addToCart(item: Omit<CartItem, "qty">, qty: number) {
  const items = getCart();
  const key = `${item.productId}:${item.variantId ?? "-"}`;
  const found = items.find((i) => `${i.productId}:${i.variantId ?? "-"}` === key);
  if (found) found.qty = Math.min(found.qty + qty, 99);
  else items.push({ ...item, qty });
  saveCart(items);
}
