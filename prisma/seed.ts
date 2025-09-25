// prisma/seed.ts
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  // 🔐 Hash the password before storing
  const hashedPassword = await bcrypt.hash("password123", 10);

  // ✅ Create a default admin user
  const user = await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      name: "Admin User",
      email: "admin@example.com",
      password: hashedPassword, // store the bcrypt hash instead of plain text
    },
  });

  console.log("✅ Seeded user:", user);
}

main()
  .then(() => {
    console.log("🌱 Seeding finished!");
  })
  .catch((e) => {
    console.error("❌ Seeding error:", e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });



