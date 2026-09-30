import { requireAdmin } from "@/lib/auth";
import { listProductsForSelect } from "@/lib/services/variants";
import { VariantForm } from "@/components/admin/VariantForm";
import { saveVariant } from "../actions";

export const dynamic = "force-dynamic";
export const metadata = { title: "Tambah Varian" };

export default async function NewVariantPage() {
  await requireAdmin("/admin/inventory");
  const products = await listProductsForSelect();

  return (
    <main>
      <h1 className="text-xl font-semibold">Tambah Varian</h1>
      <div className="mt-6">
        <VariantForm
          id={null}
          initial={{ productId: "", color: "", size: "", sku: "", stock: 0, price: 0, discountPrice: null }}
          products={products}
          save={saveVariant}
        />
      </div>
    </main>
  );
}
