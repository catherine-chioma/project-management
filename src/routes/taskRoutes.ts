import express from "express";
import prisma from "../db";

const router = express.Router();

// ✅ Create a task
router.post("/", async (req, res) => {
  try {
    const { title, description, status, dueDate, userId, projectId } = req.body;

    if (!title || !userId || !projectId) {
      return res.status(400).json({ error: "Title, userId, and projectId are required" });
    }

    // Validate status
    const allowedStatus = ["pending", "in-progress", "completed"];
    const taskStatus = status?.toLowerCase();
    if (taskStatus && !allowedStatus.includes(taskStatus)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    // Validate dueDate
    let due: Date | undefined;
    if (dueDate) {
      due = new Date(dueDate);
      if (isNaN(due.getTime())) {
        return res.status(400).json({ error: "Invalid dueDate format" });
      }
    }

    // Check user and project exist
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return res.status(400).json({ error: "User not found" });

    const project = await prisma.project.findUnique({ where: { id: projectId } });
    if (!project) return res.status(400).json({ error: "Project not found" });

    const task = await prisma.task.create({
      data: {
        title,
        description,
        status: taskStatus ?? "pending",
        dueDate: due,
        userId,
        projectId,
      },
    });

    res.status(201).json({ message: "Task created", task });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: (error instanceof Error ? error.message : String(error)) });
  }
});

// ✅ Get all tasks
router.get("/", async (req, res) => {
  try {
    const tasks = await prisma.task.findMany({
      include: { user: true, project: true },
    });
    res.json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;

