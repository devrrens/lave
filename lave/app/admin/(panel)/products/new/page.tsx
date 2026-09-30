import { requireAdmin } from "@/lib/auth";
import { listCategories } from "@/lib/services/categories";
import { ProductForm } from "@/components/admin/ProductForm";
import { saveProduct } from "../actions";

export const dynamic = "force-dynamic";
export const metadata = { title: "Tambah Produk" };

const EMPTY = {
  name: "",
  slug: "",
  description: "",
  material: "",
  categoryId: "",
  price: 0,
  discountPrice: null as number | null,
  status: "DRAFT" as const,
  isFeatured: false,
  isBestSeller: false,
  isNewArrival: true,
  careGuide: "",
  sizeGuide: "",
  images: [] as Array<{ url: string; alt?: string }>,
};

export default async function NewProductPage() {
  await requireAdmin("/admin/products");
  const categories = await listCategories();

  return (
    <main>
      <h1 className="text-xl font-semibold">Tambah Produk</h1>
      <p className="mt-1 text-sm text-[#75696C]">
        Varian (warna/ukuran/stok) dikelola di modul Inventory — Fase 7.
      </p>
      <div className="mt-6">
        <ProductForm id={null} initial={EMPTY} categories={categories} save={saveProduct} />
      </div>
    </main>
  );
}
