import { db } from "@/lib/db";
import type { TestimonialInput } from "@/lib/validations/testimonial";

export async function listTestimonialsAdmin(opts: { published?: string }) {
  return db.testimonial.findMany({
    where: opts.published === "1" ? { published: true } : opts.published === "0" ? { published: false } : {},
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  });
}

export async function getTestimonial(id: string) {
  return db.testimonial.findUnique({ where: { id } });
}

export async function createTestimonial(input: TestimonialInput) {
  return db.testimonial.create({
    data: {
      customerName: input.customerName,
      profileImage: input.profileImage || null,
      rating: input.rating,
      review: input.review,
      productName: input.productName || null,
      verified: input.verified,
      published: input.published,
      sortOrder: input.sortOrder,
    },
  });
}

export async function updateTestimonial(id: string, input: TestimonialInput) {
  return db.testimonial.update({
    where: { id },
    data: {
      customerName: input.customerName,
      profileImage: input.profileImage || null,
      rating: input.rating,
      review: input.review,
      productName: input.productName || null,
      verified: input.verified,
      published: input.published,
      sortOrder: input.sortOrder,
    },
  });
}

export async function deleteTestimonial(id: string) {
  await db.testimonial.delete({ where: { id } });
}
