import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash("admin123", 10);

  const owner = await prisma.user.upsert({
    where: { email: "owner@barokahjaya.com" },
    update: {},
    create: {
      email: "owner@barokahjaya.com",
      name: "Owner Barokah",
      password: hashedPassword,
      role: "OWNER",
    },
  });

  console.log("Seeded default owner:", owner.email);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
