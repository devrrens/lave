import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

const SETTINGS: Array<[string, string]> = [
  ["brand_name", "Barokah Jaya Fashion"],
  ["whatsapp", "TODO-isi-nomor-WA-62xxxxxxxxxx"],
  ["phone", "TODO"],
  ["email", "TODO"],
  ["address", "TODO"],
  ["opening_hours", "TODO"],
  ["maps_url", "TODO"],
  ["instagram", "TODO"],
  ["tiktok", "TODO"],
  ["facebook", "TODO"],
  ["logo_url", "/images/logo/logo-barokah-jaya-fashion.jpeg"],
  ["seo_title", "Barokah Jaya Fashion"],
  ["seo_description", "TODO: isi deskripsi SEO."],
];

const SECTIONS = [
  { key: "hero", title: "Beauty in Every Detail", subtitle: "Discover feminine pieces made for your everyday moments.", ctaLabel: "Explore Collection", ctaUrl: "/collection", sortOrder: 1 },
  { key: "featured", title: "Featured Collection", sortOrder: 2 },
  { key: "new_arrivals", title: "New Arrivals", sortOrder: 3 },
  { key: "brand_story", title: "Brand Story", subtitle: "Barokah Jaya Fashion hadir dengan koleksi busana wanita yang anggun, nyaman, dan terjangkau.", imageUrl: "/images/store/toko-barokah-jaya-fashion.jpeg", sortOrder: 4 },
  { key: "best_sellers", title: "Best Sellers", sortOrder: 5 },
  { key: "banner", title: "Promotional Banner", sortOrder: 6 },
  { key: "testimonials", title: "Testimonials", sortOrder: 7 },
  { key: "store_info", title: "Store Information", sortOrder: 8 },
];

const CATEGORIES = [
  { name: "Blouse", slug: "blouse", sortOrder: 1 },
  { name: "Celana", slug: "celana", sortOrder: 2 },
  { name: "Leggings", slug: "leggings", sortOrder: 3 },
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
    const row = await db.category.upsert({
      where: { slug: c.slug },
      update: { name: c.name, sortOrder: c.sortOrder },
      create: c,
    });
    categoryIds.set(c.slug, row.id);
  }

  for (const p of PRODUCTS) {
    const exists = await db.product.findUnique({ where: { slug: p.slug }, select: { id: true } });
    if (exists) continue;
    await db.product.create({
      data: {
        name: p.name,
        slug: p.slug,
        description: p.description,
        material: p.material,
        categoryId: categoryIds.get(p.category) ?? null,
        price: p.price,
        discountPrice: p.discountPrice ?? null,
        status: "PUBLISHED",
        isFeatured: p.isFeatured ?? false,
        isBestSeller: p.isBestSeller ?? false,
        isNewArrival: p.isNewArrival ?? false,
        images: { create: [{ url: p.image, alt: p.name, sortOrder: 0 }] },
        variants: { create: p.variants },
      },
    });
  }
}

async function main() {
  for (const [key, value] of SETTINGS) {
    await db.storeSetting.upsert({ where: { key }, update: {}, create: { key, value } });
  }
  for (const s of SECTIONS) {
    await db.homepageSection.upsert({ where: { key: s.key }, update: {}, create: s });
  }
  await seedProducts();
  console.log("Seed OK: settings + homepage sections + kategori & produk contoh.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
