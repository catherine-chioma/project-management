// src/routes/projectRoutes.ts
import express from "express";
import { body, validationResult } from "express-validator";
import prisma from "../db";

const router = express.Router();

// ✅ Validation middleware
const validate = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// ==================== PROJECT ROUTES ====================

// ✅ CREATE Project
router.post(
  "/",
  [
    body("name").notEmpty().withMessage("Project name is required"),
    body("budget").optional().isNumeric().withMessage("Budget must be a number"),
    body("startDate").optional().isISO8601().toDate().withMessage("Invalid startDate"),
    body("endDate")
      .optional()
      .isISO8601()
      .toDate()
      .withMessage("Invalid endDate")
      .custom((value, { req }) => {
        if (req.body.startDate && new Date(value) < new Date(req.body.startDate)) {
          throw new Error("End date must be after start date");
        }
        return true;
      }),
    body("ownerId").isInt().withMessage("Owner ID is required"),
  ],
  validate,
  async (req: express.Request, res: express.Response) => {
    try {
      const { name, description, budget, startDate, endDate, ownerId } = req.body;

      const owner = await prisma.user.findUnique({ where: { id: ownerId } });
      if (!owner) return res.status(400).json({ error: "Owner not found" });

      const project = await prisma.project.create({
        data: { name, description, budget: budget ?? undefined, startDate, endDate, ownerId },
      });

      res.status(201).json({ message: "Project created", project });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error", error: error instanceof Error ? error.message : String(error) });
    }
  }
);

// ✅ READ all projects
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

// ✅ READ single project by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const project = await prisma.project.findUnique({
      where: { id: Number(id) },
      include: { owner: true, tasks: true, documents: true, payments: true },
    });
    if (!project) return res.status(404).json({ message: "Project not found" });
    res.json(project);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ UPDATE project
router.put(
  "/:id",
  [
    body("name").optional().notEmpty().withMessage("Name cannot be empty"),
    body("budget").optional().isNumeric().withMessage("Budget must be a number"),
    body("endDate").optional().isISO8601().toDate().withMessage("Invalid endDate"),
  ],
  validate,
  async (req: express.Request, res: express.Response) => {
    try {
      const { id } = req.params;
      const updated = await prisma.project.update({ where: { id: Number(id) }, data: req.body });
      res.json({ message: "Project updated", updated });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error", error: error instanceof Error ? error.message : String(error) });
    }
  }
);

// ✅ DELETE project
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.project.delete({ where: { id: Number(id) } });
    res.json({ message: `Project ${id} deleted` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error instanceof Error ? error.message : String(error) });
  }
});

// ==================== NESTED POST ROUTES ====================

// ✅ CREATE Task for a project
router.post("/:id/tasks", async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, userId, dueDate } = req.body;

    const project = await prisma.project.findUnique({ where: { id: Number(id) } });
    if (!project) return res.status(404).json({ error: "Project not found" });

    const task = await prisma.task.create({
      data: { title, description, userId, projectId: Number(id), dueDate: dueDate ? new Date(dueDate) : undefined },
    });

    res.status(201).json({ message: "Task created", task });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ CREATE Document for a project
router.post("/:id/documents", async (req, res) => {
  try {
    const { id } = req.params;
    const { title, text } = req.body;

    const project = await prisma.project.findUnique({ where: { id: Number(id) } });
    if (!project) return res.status(404).json({ error: "Project not found" });

    const document = await prisma.document.create({
      data: { title, text, projectId: Number(id) },
    });

    res.status(201).json({ message: "Document created", document });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ CREATE Payment for a project
router.post("/:id/payments", async (req, res) => {
  try {
    const { id } = req.params;
    const { amount, method, date } = req.body;

    const project = await prisma.project.findUnique({ where: { id: Number(id) } });
    if (!project) return res.status(404).json({ error: "Project not found" });

    const payment = await prisma.payment.create({
      data: { amount, method, date: date ? new Date(date) : undefined, projectId: Number(id) },
    });

    res.status(201).json({ message: "Payment created", payment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;








