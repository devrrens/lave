import { db } from "@/lib/db";
import type { HomepageSectionInput } from "@/lib/validations/homepage";

export async function listHomepageSections() {
  return db.homepageSection.findMany({ orderBy: { sortOrder: "asc" } });
}

export async function getHomepageSection(key: string) {
  return db.homepageSection.findUnique({ where: { key } });
}

export async function updateHomepageSection(key: string, input: HomepageSectionInput) {
  return db.homepageSection.update({
    where: { key },
    data: {
      title: input.title || null,
      subtitle: input.subtitle || null,
      imageUrl: input.imageUrl || null,
      ctaLabel: input.ctaLabel || null,
      ctaUrl: input.ctaUrl || null,
      isVisible: input.isVisible,
      sortOrder: input.sortOrder,
    },
  });
}
