import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { getHomepageSection } from "@/lib/services/homepage-admin";
import { HomepageSectionForm } from "@/components/admin/HomepageSectionForm";
import { saveHomepageSection } from "../../actions";

export const dynamic = "force-dynamic";
export const metadata = { title: "Edit Section" };

export default async function EditHomepageSectionPage({
  params,
}: {
  params: Promise<{ key: string }>;
}) {
  await requireAdmin("/admin/homepage");
  const { key } = await params;
  const section = await getHomepageSection(key);
  if (!section) notFound();

  return (
    <main>
      <h1 className="text-xl font-semibold">Edit: {section.title || section.key}</h1>
      <p className="mt-1 font-mono text-xs text-[#A99B9F]">{section.key}</p>
      <div className="mt-6">
        <HomepageSectionForm
          sectionKey={section.key}
          initial={{
            title: section.title ?? "",
            subtitle: section.subtitle ?? "",
            imageUrl: section.imageUrl ?? "",
            ctaLabel: section.ctaLabel ?? "",
            ctaUrl: section.ctaUrl ?? "",
            isVisible: section.isVisible,
            sortOrder: section.sortOrder,
          }}
          save={saveHomepageSection}
        />
      </div>
    </main>
  );
}
