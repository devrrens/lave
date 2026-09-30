export const LOW_STOCK_THRESHOLD = 5;

export type StockStatus = "IN_STOCK" | "LOW_STOCK" | "OUT_OF_STOCK";

export function stockStatus(stock: number): StockStatus {
  if (stock <= 0) return "OUT_OF_STOCK";
  if (stock <= LOW_STOCK_THRESHOLD) return "LOW_STOCK";
  return "IN_STOCK";
}

export const STOCK_LABEL: Record<StockStatus, string> = {
  IN_STOCK: "Tersedia",
  LOW_STOCK: "Menipis",
  OUT_OF_STOCK: "Habis",
};
