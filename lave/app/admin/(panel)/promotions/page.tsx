import { requireAdmin } from "@/lib/auth";
import { SectionPlaceholder } from "@/components/admin/SectionPlaceholder";

export const dynamic = "force-dynamic";
export const metadata = { title: "Promotions" };

export default async function PromotionsPage() {
  await requireAdmin("/admin/promotions");
  return <SectionPlaceholder title="Promotions" phase="setelah MVP stabil" />;
}
