export function SectionHeading({
  eyebrow,
  title,
  desc,
}: {
  eyebrow?: string;
  title: string;
  desc?: string;
}) {
  return (
    <div className="mx-auto max-w-xl text-center">
      {eyebrow && (
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#A99B9F]">
          {eyebrow}
        </p>
      )}
      <h2 className="mt-2 font-serif text-[28px] leading-tight md:text-[36px]">{title}</h2>
      {desc && <p className="mt-2 text-[15px] text-[#75696C]">{desc}</p>}
    </div>
  );
}
