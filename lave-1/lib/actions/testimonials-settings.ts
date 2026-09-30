"use server";

import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

async function checkAdmin() {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");
}

export async function getTestimonials() {
  return db.testimonial.findMany({
    orderBy: { order: "asc" },
    include: { product: { select: { name: true } } },
  });
}

export async function createTestimonial(data: {
  customerName: string;
  rating: number;
  review: string;
  image?: string;
  productId?: string;
  verified?: boolean;
  published?: boolean;
  order?: number;
}) {
  await checkAdmin();
  const testimonial = await db.testimonial.create({
    data: {
      customerName: data.customerName,
      rating: data.rating,
      review: data.review,
      image: data.image,
      productId: data.productId || undefined,
      verified: data.verified ?? false,
      published: data.published ?? false,
      order: data.order ?? 0,
    },
  });
  revalidatePath("/admin/testimonials");
  revalidatePath("/testimonials");
  revalidatePath("/");
  return testimonial;
}

export async function updateTestimonial(
  id: string,
  data: {
    customerName?: string;
    rating?: number;
    review?: string;
    image?: string;
    productId?: string;
    verified?: boolean;
    published?: boolean;
    order?: number;
  }
) {
  await checkAdmin();
  const testimonial = await db.testimonial.update({
    where: { id },
    data,
  });
  revalidatePath("/admin/testimonials");
  revalidatePath("/testimonials");
  revalidatePath("/");
  return testimonial;
}

export async function deleteTestimonial(id: string) {
  await checkAdmin();
  await db.testimonial.delete({ where: { id } });
  revalidatePath("/admin/testimonials");
  revalidatePath("/testimonials");
  revalidatePath("/");
}

export async function getSettings() {
  const rows = await db.storeSetting.findMany();
  const map: Record<string, string> = {};
  for (const r of rows) {
    map[r.key] = r.value;
  }
  return map;
}

export async function updateSettings(data: Record<string, string>) {
  await checkAdmin();
  for (const [key, value] of Object.entries(data)) {
    await db.storeSetting.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    });
  }
  revalidatePath("/admin/settings");
  revalidatePath("/");
  revalidatePath("/contact");
  revalidatePath("/about");
}
