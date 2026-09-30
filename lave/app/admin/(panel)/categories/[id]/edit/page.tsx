import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { getCategory } from "@/lib/services/categories";
import { CategoryForm } from "@/components/admin/CategoryForm";
import { saveCategory } from "../../actions";

export const dynamic = "force-dynamic";
export const metadata = { title: "Edit Kategori" };

export default async function EditCategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin("/admin/categories");
  const { id } = await params;
  const category = await getCategory(id);
  if (!category) notFound();

  return (
    <main>
      <h1 className="text-xl font-semibold">Edit Kategori</h1>
      <div className="mt-6">
        <CategoryForm
          id={category.id}
          initial={{
            name: category.name,
            slug: category.slug,
            imageUrl: category.imageUrl ?? "",
            sortOrder: category.sortOrder,
          }}
          save={saveCategory}
        />
      </div>
    </main>
  );
}
