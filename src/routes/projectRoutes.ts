// src/routes/projectRoutes.ts
import express from "express";
import prisma from "../db";

const router = express.Router();

// ✅ Create a new project
router.post("/", async (req, res) => {
  try {
    const { name, description, budget, startDate, endDate, ownerId } = req.body;

    // 🔹 Basic validation
    if (!name || !ownerId) {
      return res.status(400).json({ error: "Name and ownerId are required" });
    }

    // 🔹 Validate dates if provided
    let start: Date | undefined;
    let end: Date | undefined;
    if (startDate) {
      start = new Date(startDate);
      if (isNaN(start.getTime())) {
        return res.status(400).json({ error: "Invalid startDate format" });
      }
    }
    if (endDate) {
      end = new Date(endDate);
      if (isNaN(end.getTime())) {
        return res.status(400).json({ error: "Invalid endDate format" });
      }
    }

    // 🔹 Check owner exists
    const owner = await prisma.user.findUnique({ where: { id: ownerId } });
    if (!owner) {
      return res.status(400).json({ error: "Owner not found" });
    }

    // 🔹 Create project
    const project = await prisma.project.create({
      data: {
        name,
        description,
        budget: budget ?? undefined,
        startDate: start,
        endDate: end,
        ownerId,
      },
    });

    res.status(201).json({ message: "Project created", project });
  } catch (error) {
    console.error("Project creation error:", error);
    res.status(500).json({ 
      message: "Server error", 
      error: error instanceof Error ? error.message : String(error) 
    });
  }
});

// ✅ Get all projects (optional)
router.get("/", async (req, res) => {
  try {
    const projects = await prisma.project.findMany({
      include: { owner: true, tasks: true, documents: true, payments: true },
    });
    res.json(projects);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;






