import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const CATEGORIES = [
  { name: "Blouse", slug: "blouse" },
  { name: "Celana", slug: "celana" },
  { name: "Leggings", slug: "leggings" },
];

type SeedVariant = { color: string; size: string; sku: string; stock: number; price: number };
type SeedProduct = {
  name: string;
  slug: string;
  category: string;
  price: number;
  discountPrice?: number;
  material: string;
  description: string;
  image: string;
  isFeatured?: boolean;
  isBestSeller?: boolean;
  isNewArrival?: boolean;
  variants: SeedVariant[];
};

const PRODUCTS: SeedProduct[] = [
  {
    name: "Celana Cutbray Beige",
    slug: "celana-cutbray-beige",
    category: "celana",
    price: 119000,
    discountPrice: 99000,
    material: "Katun stretch premium",
    description:
      "Celana cutbray high waist dengan bahan stretch premium. Nyaman, tidak menerawang, dan membuat kaki terlihat jenjang.",
    image: "/images/products/celana-cutbray-beige.jpeg",
    isFeatured: true,
    isBestSeller: true,
    variants: [{ color: "Beige", size: "All Size", sku: "BJF-CB-BEIGE", stock: 24, price: 119000 }],
  },
  {
    name: "Jeans Denim Biru",
    slug: "jeans-denim-biru",
    category: "celana",
    price: 149000,
    material: "Denim stretch",
    description:
      "Jeans denim biru dengan potongan slim yang lentur dan nyaman dipakai sehari-hari.",
    image: "/images/products/jeans-denim-biru.jpeg",
    isFeatured: true,
    isNewArrival: true,
    variants: [{ color: "Biru", size: "All Size", sku: "BJF-JD-BIRU", stock: 18, price: 149000 }],
  },
  {
    name: "Jeans Denim Hitam",
    slug: "jeans-denim-hitam",
    category: "celana",
    price: 155000,
    material: "Denim stretch",
    description:
      "Jeans denim hitam washed dengan potongan straight high waist yang mudah dipadukan.",
    image: "/images/products/jeans-denim-hitam.jpeg",
    isNewArrival: true,
    variants: [{ color: "Hitam", size: "All Size", sku: "BJF-JDH-HITAM", stock: 15, price: 155000 }],
  },
  {
    name: "Leggings Hitam",
    slug: "leggings-hitam",
    category: "leggings",
    price: 65000,
    material: "Nylon spandex",
    description:
      "Leggings high waist slim fit yang tebal, tidak menerawang, dan melar sempurna untuk aktivitas sehari-hari.",
    image: "/images/products/leggings-hitam.jpeg",
    isBestSeller: true,
    variants: [{ color: "Hitam", size: "All Size", sku: "BJF-LG-HITAM", stock: 40, price: 65000 }],
  },
  {
    name: "Blouse Bordir Olive",
    slug: "blouse-bordir-olive",
    category: "blouse",
    price: 135000,
    material: "Katun",
    description:
      "Blouse lengan panjang dengan detail bordir bunga di bagian lengan. Manis, stylish, dan nyaman.",
    image: "/images/products/blouse-bordir-olive.jpeg",
    isFeatured: true,
    variants: [{ color: "Olive", size: "All Size", sku: "BJF-BB-OLIVE", stock: 12, price: 135000 }],
  },
  {
    name: "Blouse Flower Cream",
    slug: "blouse-flower-cream",
    category: "blouse",
    price: 139000,
    material: "Katun",
    description:
      "Blouse dengan bordir bunga cantik sekujur badan. Anggun, adem, dan mudah dipadukan.",
    image: "/images/products/blouse-flower-cream.jpeg",
    isNewArrival: true,
    variants: [{ color: "Cream", size: "All Size", sku: "BJF-BFC-CREAM", stock: 14, price: 139000 }],
  },
  {
    name: "Blouse Polo Basic Sage",
    slug: "blouse-polo-basic-sage",
    category: "blouse",
    price: 129000,
    material: "Katun",
    description:
      "Blouse polo basic dengan potongan longgar dan bahan adem. Cocok untuk kuliah, kerja, dan hangout.",
    image: "/images/products/blouse-polo-basic-sage.jpeg",
    isFeatured: true,
    isBestSeller: true,
    variants: [{ color: "Sage", size: "All Size", sku: "BJF-BP-SAGE", stock: 20, price: 129000 }],
  },
];

async function seedProducts() {
  const categoryIds = new Map<string, string>();
  for (const c of CATEGORIES) {
    const row = await prisma.category.upsert({
      where: { slug: c.slug },
      update: { name: c.name },
      create: c,
    });
    categoryIds.set(c.slug, row.id);
  }

  for (const p of PRODUCTS) {
    const exists = await prisma.product.findUnique({ where: { slug: p.slug }, select: { id: true } });
    if (exists) continue;
    await prisma.product.create({
      data: {
        name: p.name,
        slug: p.slug,
        description: p.description,
        material: p.material,
        categoryId: categoryIds.get(p.category)!,
        price: p.price,
        discountPrice: p.discountPrice ?? null,
        status: "PUBLISHED",
        featured: p.isFeatured ?? false,
        bestSeller: p.isBestSeller ?? false,
        newArrival: p.isNewArrival ?? false,
        images: { create: [{ url: p.image, order: 0 }] },
        variants: { create: p.variants },
      },
    });
  }
}

async function main() {
  const hashedPassword = await bcrypt.hash("admin123", 10);

  const owner = await prisma.user.upsert({
    where: { email: "owner@barokahjaya.com" },
    update: {},
    create: {
      email: "owner@barokahjaya.com",
      name: "Owner Barokah",
      password: hashedPassword,
      role: "OWNER",
    },
  });

  await seedProducts();

  console.log("Seeded default owner:", owner.email);
  console.log("Seed OK: kategori & produk contoh.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
