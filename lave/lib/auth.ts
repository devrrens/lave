import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { loginSchema } from "@/lib/validations/auth";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(db),
  trustHost: true,
  session: { strategy: "jwt" },
  pages: { signIn: "/admin/login" },
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (creds) => {
        const parsed = loginSchema.safeParse(creds);
        if (!parsed.success) return null;
        const user = await db.user.findUnique({
          where: { email: parsed.data.email.toLowerCase() },
        });
        if (!user?.passwordHash) return null;
        const ok = await bcrypt.compare(parsed.data.password, user.passwordHash);
        if (!ok) return null;
        return { id: user.id, name: user.name, email: user.email, role: user.role };
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as { role?: string }).role;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        (session.user as { id?: string }).id = token.id as string;
        (session.user as { role?: string }).role = token.role as string;
      }
      return session;
    },
  },
});

// ---------- Authorization helpers (enforced server-side) ----------

// ADMIN boleh: dashboard, products (+categories utk form produk), inventory,
// orders, testimonials, homepage. Di luar itu (customers, promotions,
// settings) hanya OWNER. Lihat agent.md:15.
const ADMIN_ALLOWED = [
  "/admin",
  "/admin/products",
  "/admin/categories",
  "/admin/inventory",
  "/admin/orders",
  "/admin/testimonials",
  "/admin/homepage",
];

export function canAccess(pathname: string, role?: string): boolean {
  if (role === "OWNER") return true;
  if (role !== "ADMIN") return false;
  return ADMIN_ALLOWED.some((p) => pathname === p || pathname.startsWith(p + "/"));
}

export async function requireAdmin(pathname = "/admin") {
  const { redirect } = await import("next/navigation");
  const session = await auth();
  const role = (session?.user as { role?: string } | undefined)?.role;
  if (!session?.user) redirect("/admin/login");
  if (!canAccess(pathname, role)) redirect("/admin");
  return session;
}
