export function SectionPlaceholder({
  title,
  phase,
}: {
  title: string;
  phase: string;
}) {
  return (
    <main>
      <h1 className="text-xl font-semibold">{title}</h1>
      <div className="mt-6 rounded-2xl border border-neutral-200 bg-neutral-50 p-8 text-center">
        <p className="text-sm font-medium">Belum ada konten di sini.</p>
        <p className="mt-1 text-sm text-[#75696C]">Modul {title} menyusul di {phase}.</p>
      </div>
    </main>
  );
}
