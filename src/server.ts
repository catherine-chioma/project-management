import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import projectRoutes from "./routes/projectRoutes";
import taskRoutes from "./routes/taskRoutes";
import documentRoutes from "./routes/documentRoutes";
import paymentRoutes from "./routes/paymentRoutes";
import authRoutes from "./routes/auth"; // ✅ import auth route
import prisma from "./db"; // ✅ centralized Prisma

dotenv.config();

const app = express();

// Set default environment if not provided
const NODE_ENV = process.env.NODE_ENV || "development";
const PORT = process.env.PORT || 5000;

console.log(`⚡ Running in ${NODE_ENV} mode`);

// ✅ Middleware
app.use(cors());
app.use(express.json());

// ✅ Root route
app.get("/", (req, res) => {
  res.send("Backend is running! Project Management API is live.");
});

// ✅ Health check (DB + API)
app.get("/health", async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: "ok", db: "connected" });
  } catch (error) {
    console.error("Database connection error:", error);
    res.status(500).json({ status: "error", db: "not connected" });
  }
});

// ✅ New temporary DB check route
app.get("/db-check", async (req, res) => {
  try {
    const result = await prisma.$queryRaw`SELECT NOW()`;
    res.json({ status: "ok", time: result });
  } catch (error: any) {
    console.error("DB connection failed:", error);
    res.status(500).json({ status: "error", message: error.message });
  }
});

// ✅ Auth routes
app.use("/api/auth", authRoutes); // e.g. POST /api/auth/login

// ✅ Project routes
app.use("/api/projects", projectRoutes);

// ✅ Task routes
app.use("/api/tasks", taskRoutes);

// ✅ Document routes
app.use("/api/documents", documentRoutes);

// ✅ Payment routes
app.use("/api/payments", paymentRoutes);

// ✅ Start server
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
