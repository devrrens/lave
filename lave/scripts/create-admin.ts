import bcrypt from "bcryptjs";
import { db } from "../lib/db";

// Usage: npx tsx scripts/create-admin.ts <email> <password> [--owner] [--name "Nama"]
const [email, password, ...rest] = process.argv.slice(2);

if (!email || !password || password.length < 8) {
  console.error('Usage: npx tsx scripts/create-admin.ts <email> <password> [--owner] [--name "Nama"]');
  process.exit(1);
}

const role = rest.includes("--owner") ? "OWNER" : "ADMIN";
const nameFlag = rest.indexOf("--name");
const name = nameFlag >= 0 ? rest[nameFlag + 1] : undefined;

const passwordHash = await bcrypt.hash(password, 12);

const user = await db.user.upsert({
  where: { email: email.toLowerCase() },
  update: { passwordHash, role, ...(name ? { name } : {}) },
  create: { email: email.toLowerCase(), passwordHash, role, name },
});

console.log(`OK: ${user.email} (${user.role})`);
await db.$disconnect();
