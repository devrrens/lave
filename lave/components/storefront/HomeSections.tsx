import Image from "next/image";
import Link from "next/link";
import type { HomeSection } from "@/lib/services/homepage";

export function Hero({
  section,
  fallbackImage,
}: {
  section?: HomeSection;
  fallbackImage?: string;
}) {
  if (section && !section.isVisible) return null;
  const title = section?.title || "Beauty in Every Detail";
  const desc =
    section?.subtitle || "Discover feminine pieces made for your everyday moments.";
  const ctaLabel = section?.ctaLabel || "Explore Collection";
  const ctaUrl = section?.ctaUrl || "/collection";
  const image = section?.imageUrl || fallbackImage;

  return (
    <section aria-label="Hero" className="bg-[#FFF7F3]">
      <div className="mx-auto grid w-full max-w-[1200px] items-center gap-8 px-5 py-12 md:grid-cols-2 md:px-8 md:py-20">
        <div>
          <h1 className="font-serif text-[40px] leading-[1.1] md:text-[64px]">
            {title}
          </h1>
          <p className="mt-4 max-w-md text-[15px] leading-relaxed text-[#75696C] md:text-base">
            {desc}
          </p>
          <Link
            href={ctaUrl}
            className="mt-8 inline-block rounded-full bg-[#E8B7C6] px-7 py-3 text-sm font-medium"
          >
            {ctaLabel}
          </Link>
        </div>
        <div className="relative aspect-[4/5] overflow-hidden rounded-[24px] bg-[#FBECEF]">
          {image ? (
            <Image
              src={image}
              alt={title}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center px-8 text-center text-sm text-[#A99B9F]">
              Foto hero diatur lewat CMS homepage.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export function BrandStory({ section }: { section?: HomeSection }) {
  if (!section || !section.isVisible) return null;
  return (
    <section aria-label="Brand story" className="mx-auto w-full max-w-[1200px] px-5 md:px-8">
      <div className="grid items-center gap-8 md:grid-cols-5">
        {section.imageUrl && (
          <div className="relative aspect-[4/5] overflow-hidden rounded-[24px] bg-[#FBECEF] md:col-span-2">
            <Image
              src={section.imageUrl}
              alt={section.title || "Brand story"}
              fill
              sizes="(max-width: 768px) 100vw, 40vw"
              className="object-cover"
            />
          </div>
        )}
        <div className={section.imageUrl ? "md:col-span-3" : "md:col-span-5 max-w-2xl"}>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#A99B9F]">
            Our Story
          </p>
          <h2 className="mt-2 font-serif text-[28px] md:text-[36px]">
            {section.title || "Brand Story"}
          </h2>
          {section.subtitle && (
            <p className="mt-4 whitespace-pre-line text-[15px] leading-relaxed text-[#75696C]">
              {section.subtitle}
            </p>
          )}
          <Link
            href="/about"
            className="mt-6 inline-block rounded-full border border-[#EDE2E5] px-6 py-2.5 text-sm font-medium"
          >
            Our Story
          </Link>
        </div>
      </div>
    </section>
  );
}

export function PromoBanner({ section }: { section?: HomeSection }) {
  if (!section || !section.isVisible) return null;
  if (!section.title && !section.subtitle) return null;
  return (
    <section aria-label="Promo" className="mx-auto w-full max-w-[1200px] px-5 md:px-8">
      <div className="relative overflow-hidden rounded-[24px] bg-[#F6DDE5] px-6 py-10 text-center md:py-14">
        {section.imageUrl && (
          <Image
            src={section.imageUrl}
            alt=""
            fill
            sizes="100vw"
            className="object-cover opacity-20"
          />
        )}
        <div className="relative">
          <h2 className="mx-auto max-w-xl font-serif text-[28px] leading-tight md:text-[36px]">
            {section.title}
          </h2>
          {section.subtitle && (
            <p className="mx-auto mt-2 max-w-lg text-[15px] text-[#3D3436]/80">
              {section.subtitle}
            </p>
          )}
          {section.ctaLabel && section.ctaUrl && (
            <Link
              href={section.ctaUrl}
              className="mt-6 inline-block rounded-full bg-white px-7 py-3 text-sm font-medium"
            >
              {section.ctaLabel}
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}

function isSet(v?: string): v is string {
  return !!v && !v.startsWith("TODO");
}

export function StoreInfo({ settings }: { settings: Record<string, string> }) {
  const rows = [
    ["Alamat", settings.address],
    ["Jam buka", settings.opening_hours],
    ["Telepon", settings.phone],
    ["WhatsApp", settings.whatsapp],
    ["Email", settings.email],
  ].filter(([, v]) => isSet(v)) as Array<[string, string]>;
  const socials = [
    ["Instagram", settings.instagram, "https://instagram.com/"],
    ["TikTok", settings.tiktok, "https://tiktok.com/@"],
    ["Facebook", settings.facebook, "https://facebook.com/"],
  ].filter(([, v]) => isSet(v)) as Array<[string, string, string]>;

  if (rows.length === 0 && socials.length === 0) return null;

  return (
    <section aria-label="Store information" className="mx-auto w-full max-w-[1200px] px-5 md:px-8">
      <div className="grid gap-8 rounded-[24px] bg-[#FFF7F3] p-6 md:grid-cols-2 md:p-10">
        <div>
          <h2 className="font-serif text-[24px] md:text-[28px]">Visit Our Store</h2>
          <dl className="mt-4 space-y-2 text-[15px]">
            {rows.map(([label, value]) => (
              <div key={label} className="flex gap-2">
                <dt className="w-24 shrink-0 text-[#A99B9F]">{label}</dt>
                <dd>{label === "WhatsApp" ? (
                  <a href={`https://wa.me/${value.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer" className="underline">
                    {value}
                  </a>
                ) : value}</dd>
              </div>
            ))}
          </dl>
          {isSet(settings.maps_url) && (
            <a
              href={settings.maps_url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-block rounded-full border border-[#EDE2E5] bg-white px-6 py-2.5 text-sm font-medium"
            >
              Google Maps
            </a>
          )}
        </div>
        {socials.length > 0 && (
          <div className="md:text-right">
            <h2 className="font-serif text-[24px] md:text-[28px]">Follow Us</h2>
            <ul className="mt-4 space-y-2 md:flex md:justify-end md:gap-3 md:space-y-0">
              {socials.map(([label, handle, prefix]) => (
                <li key={label}>
                  <a
                    href={`${prefix}${handle}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block rounded-full bg-white px-6 py-2.5 text-sm font-medium"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}
