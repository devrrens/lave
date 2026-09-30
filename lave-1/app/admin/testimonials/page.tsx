import { getTestimonials } from "@/lib/actions/testimonials-settings";
import { getProducts } from "@/lib/actions/products";
import { TestimonialListClient } from "@/components/admin/TestimonialListClient";

export default async function AdminTestimonialsPage() {
  const [testimonials, products] = await Promise.all([
    getTestimonials(),
    getProducts(),
  ]);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-[#3D3436]">Testimoni</h1>
        <p className="text-sm text-[#75696C] mt-1">Kelola ulasan dan testimoni pelanggan</p>
      </div>

      <TestimonialListClient testimonials={testimonials} products={products} />
    </div>
  );
}
