// ──────────────────────────────────────────────────────────────
// db.ts
// ──────────────────────────────────────────────────────────────
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";

dotenv.config();

// ──────────────────────────────────────────────────────────────
// Ensure DATABASE_URL is set
// ──────────────────────────────────────────────────────────────
if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL must be set in environment variables.");
}

// ──────────────────────────────────────────────────────────────
// Prisma client options
// ──────────────────────────────────────────────────────────────
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
  log: [
    { level: "info", emit: "stdout" },
    { level: "warn", emit: "stdout" },
    { level: "error", emit: "stdout" },
    { level: "query", emit: "stdout" }, // optional: logs every query
  ],
});

// ──────────────────────────────────────────────────────────────
// Test connection immediately
// ──────────────────────────────────────────────────────────────
async function testConnection() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    console.log("✅ Database connection successful!");
  } catch (error) {
    console.error("❌ Database connection failed:", error);
  }
}

testConnection();

// ──────────────────────────────────────────────────────────────
// Graceful shutdown
// ──────────────────────────────────────────────────────────────
process.on("SIGINT", async () => {
  console.log("🛑 SIGINT received. Closing database connection...");
  await prisma.$disconnect();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  console.log("🛑 SIGTERM received. Closing database connection...");
  await prisma.$disconnect();
  process.exit(0);
});

// ──────────────────────────────────────────────────────────────
export default prisma;



