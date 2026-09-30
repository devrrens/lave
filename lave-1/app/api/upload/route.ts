export const runtime = 'edge';
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function POST(req: Request) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // NOTE: Di Cloudflare Pages, upload gambar memerlukan Cloudflare R2 bucket.
  // Filesystem lokal tidak tersedia di serverless edge.
  return NextResponse.json(
    { 
      error: "Upload file via filesystem tidak didukung di Cloudflare edge. Gunakan Cloudflare R2.",
      hint: "Setup Cloudflare R2 binding untuk upload gambar." 
    },
    { status: 501 }
  );
}
