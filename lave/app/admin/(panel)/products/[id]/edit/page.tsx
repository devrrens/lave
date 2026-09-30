import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { listCategories } from "@/lib/services/categories";
import { getProduct } from "@/lib/services/products";
import { ProductForm } from "@/components/admin/ProductForm";
import { saveProduct } from "../../actions";

export const dynamic = "force-dynamic";
export const metadata = { title: "Edit Produk" };

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin("/admin/products");
  const { id } = await params;
  const [product, categories] = await Promise.all([
    getProduct(id),
    listCategories(),
  ]);
  if (!product) notFound();

  return (
    <main>
      <h1 className="text-xl font-semibold">Edit Produk</h1>
      <p className="mt-1 text-sm text-[#75696C]">
        {product.variants.length} varian ·{" "}
        <Link href={`/admin/inventory?product=${product.id}`} className="underline">
          Kelola varian & stok →
        </Link>
      </p>
      <div className="mt-6">
        <ProductForm
          id={product.id}
          initial={{
            name: product.name,
            slug: product.slug,
            description: product.description ?? "",
            material: product.material ?? "",
            categoryId: product.categoryId ?? "",
            price: product.price,
            discountPrice: product.discountPrice,
            status: product.status,
            isFeatured: product.isFeatured,
            isBestSeller: product.isBestSeller,
            isNewArrival: product.isNewArrival,
            careGuide: product.careGuide ?? "",
            sizeGuide: product.sizeGuide ?? "",
            images: product.images.map((i) => ({ url: i.url, alt: i.alt ?? "" })),
          }}
          categories={categories}
          save={saveProduct}
        />
      </div>
    </main>
  );
}
