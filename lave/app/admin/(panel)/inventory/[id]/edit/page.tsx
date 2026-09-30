import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { getVariant, listProductsForSelect } from "@/lib/services/variants";
import { VariantForm } from "@/components/admin/VariantForm";
import { saveVariant } from "../../actions";

export const dynamic = "force-dynamic";
export const metadata = { title: "Edit Varian" };

export default async function EditVariantPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin("/admin/inventory");
  const { id } = await params;
  const [variant, products] = await Promise.all([
    getVariant(id),
    listProductsForSelect(),
  ]);
  if (!variant) notFound();

  return (
    <main>
      <h1 className="text-xl font-semibold">Edit Varian</h1>
      <p className="mt-1 text-sm text-[#75696C]">{variant.product.name}</p>
      <div className="mt-6">
        <VariantForm
          id={variant.id}
          initial={{
            productId: variant.productId,
            color: variant.color,
            size: variant.size,
            sku: variant.sku,
            stock: variant.stock,
            price: variant.price,
            discountPrice: variant.discountPrice,
          }}
          products={products}
          save={saveVariant}
        />
      </div>
    </main>
  );
}
