// prisma/seed.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // ✅ Create a default admin user
  const user = await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      name: "Admin User",
      email: "admin@example.com",
      password: "password123", // ⚠️ hash this in real apps
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


