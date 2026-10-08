import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { rateLimit } from "@/lib/rate-limit";

const ALLOWED: Record<string, string> = {
  "image/jpeg": "image/jpeg",
  "image/png": "image/png",
  "image/webp": "image/webp",
};

const MAX_BYTES = 3 * 1024 * 1024;

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

  const file = form.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "File wajib diisi." }, { status: 400 });
  }
  if (file.size === 0 || file.size > MAX_BYTES) {
    return NextResponse.json({ error: "Ukuran file maksimal 3 MB." }, { status: 400 });
  }

  const mime = ALLOWED[file.type];
  if (!mime) {
    return NextResponse.json(
      { error: "Format file harus JPG, PNG, atau WEBP." },
      { status: 400 }
    );
  }

  const bytes = Buffer.from(await file.arrayBuffer());
  const url = `data:${mime};base64,${bytes.toString("base64")}`;

  return NextResponse.json({ url });
}
