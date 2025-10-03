// src/db.ts
import { PrismaClient } from "@prisma/client";

// Initialize Prisma Client
// Supabase requires SSL, which is handled via the DATABASE_URL query param (sslmode=require)
const prisma = new PrismaClient({
  log: ["info", "warn", "error"],
});

// ──────────────────────────────────────────────────────────────
// Function to test database connection
// Call this from server.ts after server starts
// ──────────────────────────────────────────────────────────────
export async function testConnection() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    console.log("✅ Database connection successful!");
  } catch (error) {
    console.error("❌ Database connection failed:", error);
  }
}

// ──────────────────────────────────────────────────────────────
// Graceful shutdown
// ──────────────────────────────────────────────────────────────
async function disconnectPrisma() {
  try {
    console.log("🛑 Closing database connection...");
    await prisma.$disconnect();
  } catch (err) {
    console.error("Error disconnecting Prisma:", err);
  }
}

process.on("SIGINT", disconnectPrisma);
process.on("SIGTERM", disconnectPrisma);

export default prisma;

