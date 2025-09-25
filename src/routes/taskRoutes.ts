import express from "express";
import prisma from "../db";

const router = express.Router();

// Get all tasks
router.get("/", async (req, res) => {
  try {
    const tasks = await prisma.task.findMany({
      include: { user: true, project: true },
    });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
});

// Get single task by ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const task = await prisma.task.findUnique({
      where: { id: Number(id) },
      include: { user: true, project: true },
    });
    if (!task) return res.status(404).json({ error: "Task not found" });
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch task" });
  }
});

// Create task
router.post("/", async (req, res) => {
  const { title, description, status, dueDate, userId, projectId } = req.body;
  try {
    const newTask = await prisma.task.create({
      data: {
        title,
        description,
        status,
        dueDate: dueDate ? new Date(dueDate) : null,
        userId,
        projectId,
      },
    });
    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ error: "Failed to create task" });
  }
});

// Update task
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { title, description, status, dueDate } = req.body;
  try {
    const updatedTask = await prisma.task.update({
      where: { id: Number(id) },
      data: {
        title,
        description,
        status,
        dueDate: dueDate ? new Date(dueDate) : null,
      },
    });
    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ error: "Failed to update task" });
  }
});

// Delete task
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.task.delete({ where: { id: Number(id) } });
    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete task" });
  }
});

export default router;
