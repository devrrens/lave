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
  ["seo_title", "Barokah Jaya Fashion"],
  ["seo_description", "TODO: isi deskripsi SEO."],
];

const SECTIONS = [
  { key: "hero", title: "Beauty in Every Detail", subtitle: "Discover feminine pieces made for your everyday moments.", ctaLabel: "Explore Collection", ctaUrl: "/collection", sortOrder: 1 },
  { key: "featured", title: "Featured Collection", sortOrder: 2 },
  { key: "new_arrivals", title: "New Arrivals", sortOrder: 3 },
  { key: "brand_story", title: "Brand Story", sortOrder: 4 },
  { key: "best_sellers", title: "Best Sellers", sortOrder: 5 },
  { key: "banner", title: "Promotional Banner", sortOrder: 6 },
  { key: "testimonials", title: "Testimonials", sortOrder: 7 },
  { key: "store_info", title: "Store Information", sortOrder: 8 },
];

async function main() {
  for (const [key, value] of SETTINGS) {
    await db.storeSetting.upsert({ where: { key }, update: {}, create: { key, value } });
  }
  for (const s of SECTIONS) {
    await db.homepageSection.upsert({ where: { key: s.key }, update: {}, create: s });
  }
  console.log("Seed OK: settings + homepage sections (placeholder, tanpa data fake).");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
