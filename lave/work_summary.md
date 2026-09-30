# Work Summary — Barokah Jaya Fashion

## Fase 1 — Project Setup (done 2026-09-29)
- Next.js 16.3.7 + React 19 + TS + Tailwind v4 + ESLint, App Router.
- package: barokah-jaya-fashion. Deps: next-auth v5 beta, prisma 6, zod, lucide-react, clsx, tailwind-merge, cva.
- Tema Soft Pink Boutique di app/globals.css (@theme tokens design.md).
- Font: Inter + Playfair Display, lang id, metadata dasar.
- Struktur: app/(storefront), app/admin, app/api/upload, components/{ui,storefront,admin}, lib/{validations,services}, prisma, types, public/uploads/{products,testimonials,homepage,banners,settings}.
- Docker: docker-compose (postgres16 + app, volume ./data/uploads:/app/public/uploads), Dockerfile, .env.example.
- Verifikasi: npm run lint bersih, npm run build sukses (route / static).
- Catatan: Node 24 diinstal via winget (sebelumnya tidak ada). Breaking change Next 16: RootLayout pakai LayoutProps<"/">.

## Fase 2 — Database Schema (done 2026-09-29)
- prisma/schema.prisma: 13 model PRD (User+Account/Session/Token Auth.js, Category, Product, ProductImage, ProductVariant, Customer, Order, OrderItem, Testimonial, HomepageSection, Promotion, PromotionUsage, StoreSetting) + index (slug, SKU, order ref, WA, status, createdAt).
- Aturan: stok di variant, harga Int IDR, ref BJF-YYYYMMDD-XXXX, WA dari settings.
- prisma/seed.ts: settings TODO + 8 homepage sections, tanpa data fake.
- Verifikasi: prisma validate valid, generate OK, tsc+lint bersih, build sukses.
- Belum jalan: db:migrate + db:seed butuh Postgres. Jalankan: docker compose up -d db, lalu npm run db:migrate && npm run db:seed.

## Fase 3 — Authentication (done 2026-09-29)
- Auth.js v5 (credentials email+password, bcryptjs, JWT session, PrismaAdapter).
- File: lib/auth.ts (handlers/auth/signIn/signOut + canAccess/requireAdmin), lib/validations/auth.ts, app/api/auth/[...nextauth]/route.ts, proxy.ts (cek cookie sesi utk /admin/*, otorisasi nyata di layout), types/next-auth.d.ts.
- Guard ganda: proxy redirect ke /admin/login + app/admin/layout.tsx verifikasi auth() server-side.
- Halaman: /admin/login (form client dgn loading/error/empty validation), /admin (placeholder + sign out server action).
- Role: OWNER full; ADMIN hanya dashboard/products/categories/inventory/orders/testimonials/homepage (customers/promotions/settings owner-only).
- scripts/create-admin.ts + npm run admin:create. Buat owner: npx tsx scripts/create-admin.ts admin@bjf.local <pass> --owner.
- Verifikasi: tsc bersih, lint bersih, build sukses (routes /, /admin, /admin/login, /api/auth + Proxy). Catatan: LayoutProps<"/admin"> tidak valid di Next 16 → pakai { children: React.ReactNode }.
- Belum diuji end-to-end (butuh Postgres + AUTH_SECRET asli): docker compose up -d db → db:migrate → admin:create → dev → login.

## Fase 4 — Admin Layout (done 2026-09-29)
- Restruktur: app/admin/(panel)/ (route group) agar /admin/login bebas dari guard layout — perbaiki potensi redirect loop Fase 3.
- Shell: components/admin/AdminNav.tsx (client: sidebar fixed desktop + drawer mobile + active path + filter role), (panel)/layout.tsx (guard auth + sign out), loading.tsx (skeleton), error.tsx (retry).
- Dashboard: revenue/order/pending/terjual hari ini + stok menipis (≤5) + terlaris + banner pending → orders. Query di lib/services/dashboard.ts, format di lib/format.ts.
- 9 halaman section (products…settings) placeholder dgn requireAdmin(path) per-route — enforce canAccess sejak awal.
- Gaya admin netral putih/abu, pink hanya aksen aktif. Tanpa data fake (nol alami + empty state).
- Verifikasi: tsc bersih, lint bersih, build sukses (14 routes + Proxy). Catatan: hapus .next bila validator types stale.

## Fase 5 — Product/Category CRUD (done 2026-09-29)
- Upload: app/api/upload/route.ts — auth admin, folder allowlist, max 5 MB, MIME+ext JPG/PNG/WEBP, filename server-generated, anti path-traversal. Folder /public/uploads/products|testimonials|homepage|banners|settings.
- Validasi: lib/validations/{product,category}.ts (zod, discount < price, slug regex).
- Service: lib/services/{products,categories}.ts — pagination+search+filter, slug unik otomatis, hapus kategori diblokir bila dipakai, duplikat produk (DRAFT, stok varian 0, SKU unik).
- Actions: (panel)/{products,categories}/actions.ts — requireAdmin + revalidate + redirect.
- UI: ProductForm/CategoryForm (client, validasi+loading+error, slug otomatis), ImageUploader, DeleteButton (konfirmasi), ProductRowActions (publish/unpublish/duplikat). List produk: tabel + search + filter status + pagination + empty state. Varian dikelola di Fase 7.
- Verifikasi: tsc bersih, lint bersih, build sukses (20 routes + /api/upload + Proxy).

## Fase 6 — Product Storefront (done 2026-09-29)
- Layout: (storefront)/layout.tsx — Navbar sticky (client: menu mobile, badge cart localStorage, Order Now) + Footer (render hanya settings yg terisi, tanpa data fake).
- Katalog /collection: filter kategori/warna/ukuran/stok + search + sort (terbaru/populer/harga) + pagination. Grid 2/3/4 kolom.
- Detail /product/[slug]: gallery+thumbs, VariantSelector (kombinasi habis disabled), qty, PriceDisplay, Add to Cart (localStorage, lib/cart.ts), WhatsAppButton (pesan pre-fill, nomor dari settings), size/care guide, related, breadcrumb, JSON-LD Product, metadata+canonical+OG.
- Aturan harga: lib/pricing.ts (sell = discount varian ?? harga varian ?? discount produk ?? harga produk).
- Stub minimal: /about, /testimonials, /contact (diganti Fase 8/10/11). Homepage penuh di Fase 8.
- Verifikasi: tsc bersih, lint bersih, build sukses (25 routes + Proxy).

## Fase 7 — Variants/Inventory (done 2026-09-29)
- Aturan: lib/inventory.ts — threshold 5, status IN_STOCK/LOW_STOCK/OUT_OF_STOCK + label ID (status selalu teks, bukan warna saja).
- Validasi: lib/validations/variant.ts (SKU regex, stok ≥0, diskon < harga).
- Service: lib/services/variants.ts — list (search SKU/warna/produk + filter status/produk), summary, CRUD (SKU duplikat → error jelas), adjustStock transaksional clamp ≥0, hapus diblokir bila dipakai order.
- Stok hanya berubah via Server Action changeStock (±1) — tanpa mutasi langsung dari client.
- UI: tabel inventory + ringkasan + StockAdjuster, VariantForm (SKU auto + harga default produk), new/edit pages, link dari produk edit → inventory terfilter.
- Verifikasi: tsc bersih, lint bersih, build sukses.

## Fase 8 — Homepage (done 2026-09-29)
- Pindah homepage ke (storefront)/page.tsx agar memakai Navbar/Footer (hapus app/page.tsx).
- Section: Hero editorial (CMS: heading/desc/image/CTA/visibility) → Featured → New Arrivals → Brand Story asimetris → Best Sellers (real sold rank) → Promo Banner → Testimonials (published) → Store Info + Social (hanya data terisi).
- Section kosong otomatis disembunyikan — homepage tidak overload.
- Komponen baru: TestimonialCard (rating+verified, dipakai lagi Fase 10), Hero/BrandStory/PromoBanner/StoreInfo.
- Service: lib/services/homepage.ts. Editing konten lewat CMS di Fase 11.
- Verifikasi: tsc bersih, lint bersih, build sukses.

## Fase 9 — Cart & Ordering (done 2026-09-29)
- Cart /cart (client, localStorage): qty +/-, hapus, ganti varian (via GET /api/products/[id]/variants), subtotal, empty state. Harga final selalu dihitung server.
- Checkout guest (nama/WA/alamat/catatan) → Server Action placeOrder → transaksi: validasi varian published → cek stok → harga DB → ref BJF-YYYYMMDD-XXXX (retry unik) → upsert customer by WA (+totals) → create order+items → decrement stok. Rollback on failure.
- Sukses /order-success?ref=: ringkasan + lanjut WA (pesan ref+items+total).
- Admin: orders list (search ref/nama/WA + filter status) + detail (customer/items/total/riwayat) + update status & notes; CANCEL kembalikan stok, order batal tak bisa dibuka. Customers list read-only (otomatis dari order).
- Verifikasi: tsc bersih, lint bersih, build sukses (29 routes + Proxy).

## Fase 10 — Testimonials (done 2026-09-29)
- CRUD admin: rating bintang, foto profil (folder testimonials), verified, published, urutan. Filter published/draft. Revalidate /testimonials + /.
- Publik: grid TestimonialCard (hanya published, tanpa carousel paksa) + empty state jujur. Tanpa ulasan fake.
- Verifikasi: tsc bersih, lint bersih, build sukses.

## Fase 11 — Homepage CMS + Settings (done 2026-09-29)
- CMS: list 8 section + edit per-section (judul/deskripsi/gambar folder homepage/CTA/visibility). Tanpa page builder. Revalidate / otomatis.
- Settings (OWNER only): brand, WA (sumber semua tombol order), kontak, sosmed, logo, SEO. Revalidate layout-wide.
- Promotions: ditunda sesuai PRD (setelah MVP stabil) — halaman placeholder tetap ada.
- Verifikasi: tsc bersih, lint bersih, build sukses.

## Fase 12 — SEO (done 2026-09-29)
- app/sitemap.ts (statis + produk published) & app/robots.ts (tutup /admin /api /cart /order-success).
- Metadata dinamis dari settings (title/desc/OG) di (storefront)/layout; OG collection; canonical+OG produk.
- Structured data: Product (detail) + ClothingStore kondisional (homepage, hanya field terisi).
- Verifikasi: tsc bersih, lint bersih, build sukses (/sitemap.xml, /robots.txt).

## Fase 13 — Responsive Refinement (done 2026-09-29)
- Audit semua halaman: grid mobile-first (produk 2/3/4 — fix desktop dari xl ke lg), tabel admin scroll horizontal, form stack, hero 40/64px, padding 20/32px, spacing 64/96px. Sesuai design.md.
- Tidak ada layout rusak di 375–1440 (verifikasi level kode; uji perangkat fisik saat deploy).

## Fase 14 — Security Review (done 2026-09-29)
- Authz server-side di semuaAdmin route + upload API + actions; harga/stok dari DB; error login generik (anti enumerasi); secret server-only; upload MIME+ext+size+traversal; raw DB error tak bocor (dev-only di error.tsx).
- Baru: security headers + poweredByHeader false (next.config.ts); rate limit in-memory (order 10/menit/IP, upload 30/menit) — catat: ganti Redis bila scale horizontal.

## Fase 15 — Performance Review (done 2026-09-29)
- next/image + sizes di semua foto; Server Components default; pagination di semua list; Promise.all utk query paralel; lucide per-icon; skeleton loading collection + product detail + admin.
- nginx/nginx.conf contoh production (proxy :3000, max body 6m, cache _next/static).
- Verifikasi akhir: tsc bersih, lint bersih, build sukses.

## Migrasi SQLite (done 2026-09-30)
- Alasan: jalan tanpa Docker/PostgreSQL. Menyimpang dari PRD (PostgreSQL) atas permintaan user.
- schema provider sqlite; 7x `mode: insensitive` dihapus (search jadi case-sensitive); .env + .env.example → file:./dev.db; compose tanpa postgres (volume ./data utk uploads+prod.db).
- Berhasil: migrate init_sqlite + seed OK (settings + 8 sections). tsc/lint/build bersih.
- Batasan: file tunggal (backup = copy dev.db), tulis konkuren terbatas, search case-sensitive.
