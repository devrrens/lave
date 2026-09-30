import { requireAdmin } from "@/lib/auth";
import { TestimonialForm } from "@/components/admin/TestimonialForm";
import { saveTestimonial } from "../actions";

export const dynamic = "force-dynamic";
export const metadata = { title: "Tambah Testimoni" };

export default async function NewTestimonialPage() {
  await requireAdmin("/admin/testimonials");

  return (
    <main>
      <h1 className="text-xl font-semibold">Tambah Testimoni</h1>
      <div className="mt-6">
        <TestimonialForm
          id={null}
          initial={{
            customerName: "", profileImage: "", rating: 5, review: "",
            productName: "", verified: false, published: false, sortOrder: 0,
          }}
          save={saveTestimonial}
        />
      </div>
    </main>
  );
}
