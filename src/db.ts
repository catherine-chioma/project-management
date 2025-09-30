import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";

dotenv.config();

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL must be set in environment variables.");
}

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL, // explicitly use your production database URL
    },
  },
});

export default prisma;
