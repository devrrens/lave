import { randomBytes } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { rateLimit } from "@/lib/rate-limit";

const FOLDERS = ["products", "testimonials", "homepage", "banners", "settings"] as const;

const ALLOWED: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
};

const MAX_BYTES = 5 * 1024 * 1024;

export async function POST(req: Request) {
  const session = await auth();
  const role = (session?.user as { role?: string } | undefined)?.role;
  if (!session?.user || (role !== "OWNER" && role !== "ADMIN")) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    session.user.email ??
    "unknown";
  if (!rateLimit(`upload:${ip}`, 30, 60_000)) {
    return NextResponse.json({ error: "Terlalu banyak upload. Tunggu sebentar." }, { status: 429 });
  }

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ error: "Form tidak valid." }, { status: 400 });
  }

  const folder = String(form.get("folder") ?? "");
  const file = form.get("file");

  if (!(FOLDERS as readonly string[]).includes(folder)) {
    return NextResponse.json({ error: "Folder tidak diizinkan." }, { status: 400 });
  }
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "File wajib diisi." }, { status: 400 });
  }
  if (file.size === 0 || file.size > MAX_BYTES) {
    return NextResponse.json({ error: "Ukuran file maksimal 5 MB." }, { status: 400 });
  }

  const ext = ALLOWED[file.type];
  const originalExt = path.extname(file.name).toLowerCase();
  if (!ext || ![".jpg", ".jpeg", ".png", ".webp"].includes(originalExt)) {
    return NextResponse.json(
      { error: "Format file harus JPG, PNG, atau WEBP." },
      { status: 400 }
    );
  }

  const filename = `${Date.now()}-${randomBytes(8).toString("hex")}${ext}`;
  const dir = path.join(process.cwd(), "public", "uploads", folder);
  await mkdir(dir, { recursive: true });
  const dest = path.join(dir, path.basename(filename));
  const bytes = Buffer.from(await file.arrayBuffer());
  await writeFile(dest, bytes);

  return NextResponse.json({ url: `/uploads/${folder}/${filename}` });
}
