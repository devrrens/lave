type P = { price: number; discountPrice: number | null };
type V = { price: number; discountPrice: number | null } | null | undefined;

// Harga jual = variant.discountPrice ?? variant.price ?? product.discountPrice ?? product.price.
// Harga coret = harga normal yang didiskon (hanya bila > harga jual).
export function priceOf(product: P, variant?: V): { sell: number; original: number | null } {
  const sell = variant?.discountPrice ?? variant?.price ?? product.discountPrice ?? product.price;
  const normal = variant?.discountPrice != null ? variant.price : product.price;
  return { sell, original: normal > sell ? normal : null };
}
