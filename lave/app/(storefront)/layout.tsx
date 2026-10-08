import type { Metadata } from "next";
import { Footer } from "@/components/storefront/Footer";
import { Navbar } from "@/components/storefront/Navbar";
import { getPublicSettings } from "@/lib/services/storefront";

function siteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
}

export async function generateMetadata(): Promise<Metadata> {
  let settings: Record<string, string> = {};
  try {
    settings = await getPublicSettings();
  } catch {
    settings = {};
  }
  const title = settings.seo_title || settings.brand_name || "Barokah Jaya Fashion";
  const description =
    settings.seo_description || "Discover feminine pieces made for your everyday moments.";
  return {
    title: { default: title, template: `%s | ${settings.brand_name || "Barokah Jaya Fashion"}` },
    description,
    openGraph: {
      title,
      description,
      type: "website",
      url: siteUrl(),
      siteName: settings.brand_name || "Barokah Jaya Fashion",
    },
  };
}

export default async function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let settings: Record<string, string> = {};
  try {
    settings = await getPublicSettings();
  } catch {
    settings = {};
  }

  return (
    <div className="min-h-dvh bg-[#FFFCFA] text-[#3D3436]">
      <Navbar brand={settings.brand_name || "Barokah Jaya Fashion"} logoUrl={settings.logo_url} />
      {children}
      <Footer settings={settings} />
    </div>
  );
}
