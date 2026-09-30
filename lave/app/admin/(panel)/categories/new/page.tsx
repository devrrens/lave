import { requireAdmin } from "@/lib/auth";
import { CategoryForm } from "@/components/admin/CategoryForm";
import { saveCategory } from "../actions";

export const dynamic = "force-dynamic";
export const metadata = { title: "Tambah Kategori" };

export default async function NewCategoryPage() {
  await requireAdmin("/admin/categories");

  return (
    <main>
      <h1 className="text-xl font-semibold">Tambah Kategori</h1>
      <div className="mt-6">
        <CategoryForm
          id={null}
          initial={{ name: "", slug: "", imageUrl: "", sortOrder: 0 }}
          save={saveCategory}
        />
      </div>
    </main>
  );
}
