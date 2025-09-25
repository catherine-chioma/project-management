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
    res.status(500).json({ status: "error", db: "not connected" });
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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));