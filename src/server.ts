import dotenv from "dotenv";
dotenv.config(); // Must be first

import express from "express";
import cors from "cors";
import projectRoutes from "./routes/projectRoutes";
import taskRoutes from "./routes/taskRoutes";
import documentRoutes from "./routes/documentRoutes";
import paymentRoutes from "./routes/paymentRoutes";
import authRoutes from "./routes/auth";
import prisma, { testConnection } from "./db";

// ──────────────────────────────────────────────────────────────
// Environment variables
// ──────────────────────────────────────────────────────────────
const NODE_ENV = process.env.NODE_ENV || "development";
const PORT = process.env.PORT || 5000;

console.log(`⚡ Running in ${NODE_ENV} mode`);

// ──────────────────────────────────────────────────────────────
// Express app setup
// ──────────────────────────────────────────────────────────────
const app = express();

app.use(cors());
app.use(express.json());

// ──────────────────────────────────────────────────────────────
// Root route
// ──────────────────────────────────────────────────────────────
app.get("/", (req, res) => {
  res.send("Backend is running! Project Management API is live.");
});

// ──────────────────────────────────────────────────────────────
// Health check route (DB + API)
// ──────────────────────────────────────────────────────────────
app.get("/health", async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: "ok", db: "connected" });
  } catch (error) {
    console.error("Database connection error:", error);
    res.status(500).json({ status: "error", db: "not connected" });
  }
});

// ──────────────────────────────────────────────────────────────
// Temporary DB check route (for testing timestamps)
// ──────────────────────────────────────────────────────────────
app.get("/db-check", async (req, res) => {
  try {
    const result = await prisma.$queryRaw`SELECT NOW()`;
    res.json({ status: "ok", time: result });
  } catch (error: any) {
    console.error("DB connection failed:", error);
    res.status(500).json({ status: "error", message: error.message });
  }
});

// ──────────────────────────────────────────────────────────────
// API routes
// ──────────────────────────────────────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/documents", documentRoutes);
app.use("/api/payments", paymentRoutes);

// ──────────────────────────────────────────────────────────────
// Error handler (catch-all for unhandled routes)
// ──────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ status: "error", message: "Route not found" });
});

// ──────────────────────────────────────────────────────────────
// Start server
// ──────────────────────────────────────────────────────────────
app.listen(PORT, async () => {
  console.log(`🚀 Server running on port ${PORT}`);

  // Test database connection on startup
  await testConnection();
});

