import Link from "next/link";

function isSet(v?: string): v is string {
  return !!v && !v.startsWith("TODO");
}

export function Footer({ settings }: { settings: Record<string, string> }) {
  const brand = settings.brand_name || "Barokah Jaya Fashion";
  const socials = [
    { key: "instagram", label: "Instagram", prefix: "https://instagram.com/" },
    { key: "tiktok", label: "TikTok", prefix: "https://tiktok.com/@" },
    { key: "facebook", label: "Facebook", prefix: "https://facebook.com/" },
  ].filter((s) => isSet(settings[s.key]));

  return (
    <footer className="mt-24 border-t border-[#EDE2E5] bg-[#FFF7F3]">
      <div className="mx-auto grid w-full max-w-[1200px] gap-10 px-5 py-12 md:grid-cols-3 md:px-8">
        <div>
          <p className="font-serif text-lg font-semibold">{brand}</p>
          <p className="mt-2 max-w-xs text-sm text-[#75696C]">
            Feminine pieces made for your everyday moments.
          </p>
        </div>
        <nav aria-label="Footer">
          <p className="text-sm font-semibold">Jelajah</p>
          <ul className="mt-3 space-y-2 text-sm text-[#75696C]">
            <li><Link href="/collection" className="hover:text-[#3D3436]">Collection</Link></li>
            <li><Link href="/about" className="hover:text-[#3D3436]">About</Link></li>
            <li><Link href="/testimonials" className="hover:text-[#3D3436]">Testimonials</Link></li>
            <li><Link href="/contact" className="hover:text-[#3D3436]">Contact</Link></li>
          </ul>
        </nav>
        <div>
          <p className="text-sm font-semibold">Toko</p>
          <ul className="mt-3 space-y-2 text-sm text-[#75696C]">
            {isSet(settings.address) && <li>{settings.address}</li>}
            {isSet(settings.opening_hours) && <li>{settings.opening_hours}</li>}
            {isSet(settings.phone) && <li>{settings.phone}</li>}
            {socials.map((s) => (
              <li key={s.key}>
                <a
                  href={`${s.prefix}${settings[s.key]}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#3D3436]"
                >
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-[#EDE2E5]">
        <p className="mx-auto w-full max-w-[1200px] px-5 py-4 text-xs text-[#A99B9F] md:px-8">
          © {new Date().getFullYear()} {brand}
        </p>
      </div>
    </footer>
  );
}
