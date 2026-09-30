import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { getTestimonial } from "@/lib/services/testimonials";
import { TestimonialForm } from "@/components/admin/TestimonialForm";
import { saveTestimonial } from "../../actions";

export const dynamic = "force-dynamic";
export const metadata = { title: "Edit Testimoni" };

export default async function EditTestimonialPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin("/admin/testimonials");
  const { id } = await params;
  const t = await getTestimonial(id);
  if (!t) notFound();

  return (
    <main>
      <h1 className="text-xl font-semibold">Edit Testimoni</h1>
      <div className="mt-6">
        <TestimonialForm
          id={t.id}
          initial={{
            customerName: t.customerName,
            profileImage: t.profileImage ?? "",
            rating: t.rating,
            review: t.review,
            productName: t.productName ?? "",
            verified: t.verified,
            published: t.published,
            sortOrder: t.sortOrder,
          }}
          save={saveTestimonial}
        />
      </div>
    </main>
  );
}
