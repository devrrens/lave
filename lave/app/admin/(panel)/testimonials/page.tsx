import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { listTestimonialsAdmin } from "@/lib/services/testimonials";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { removeTestimonial } from "./actions";

export const dynamic = "force-dynamic";
export const metadata = { title: "Testimonials" };

export default async function TestimonialsAdminPage({
  searchParams,
}: {
  searchParams: Promise<{ published?: string }>;
}) {
  await requireAdmin("/admin/testimonials");
  const sp = await searchParams;
  const items = await listTestimonialsAdmin({ published: sp.published });

  return (
    <main>
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Testimonials ({items.length})</h1>
        <Link
          href="/admin/testimonials/new"
          className="rounded-full bg-[#E8B7C6] px-4 py-2 text-sm font-medium"
        >
          + Testimoni
        </Link>
      </div>

      <form method="get" className="mt-4 flex gap-2">
        <select
          name="published"
          defaultValue={sp.published ?? ""}
          aria-label="Filter publikasi"
          className="rounded-[12px] border border-neutral-200 px-3 py-1.5 text-sm"
        >
          <option value="">Semua</option>
          <option value="1">Published</option>
          <option value="0">Draft</option>
        </select>
        <button type="submit" className="rounded-full border border-neutral-200 px-4 py-1.5 text-sm">
          Filter
        </button>
      </form>

      {items.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-neutral-200 bg-neutral-50 p-8 text-center">
          <p className="text-sm font-medium">Belum ada testimoni.</p>
          <Link
            href="/admin/testimonials/new"
            className="mt-4 inline-block rounded-full bg-[#E8B7C6] px-4 py-2 text-sm font-medium"
          >
            Tambah testimoni
          </Link>
        </div>
      ) : (
        <ul className="mt-4 space-y-3">
          {items.map((t) => (
            <li key={t.id} className="rounded-2xl border border-neutral-200 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold">
                    {t.customerName}
                    <span className="ml-2 font-normal text-[#A99B9F]">
                      {"★".repeat(t.rating)}{"☆".repeat(5 - t.rating)}
                    </span>
                  </p>
                  <p className="mt-1 line-clamp-2 text-sm text-[#75696C]">{t.review}</p>
                  <p className="mt-1 text-xs text-[#A99B9F]">
                    {t.published ? "Published" : "Draft"}
                    {t.verified ? " · Verified" : ""}
                    {t.productName ? ` · ${t.productName}` : ""}
                  </p>
                </div>
                <span className="flex shrink-0 items-center gap-2">
                  <Link
                    href={`/admin/testimonials/${t.id}/edit`}
                    className="rounded-full border border-neutral-200 px-3 py-1 text-xs"
                  >
                    Edit
                  </Link>
                  <DeleteButton
                    label="Hapus"
                    confirmText={`Hapus testimoni ${t.customerName}?`}
                    action={removeTestimonial.bind(null, t.id)}
                  />
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
