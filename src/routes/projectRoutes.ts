// src/routes/projectRoutes.ts
import { Router, Request, Response, NextFunction } from "express";
import { body, validationResult } from "express-validator";
import prisma from "../db"; // ✅ centralized Prisma import

const router = Router();

// ✅ Validation middleware
const validate = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// ✅ CREATE Project
router.post(
  "/",
  [
    body("name").notEmpty().withMessage("Project name is required"),
    body("description").notEmpty().withMessage("Description is required"),
    body("budget")
      .isNumeric()
      .withMessage("Budget must be a number")
      .custom((value) => value > 0)
      .withMessage("Budget must be greater than 0"),
    body("startDate").isISO8601().toDate().withMessage("Start date is invalid"),
    body("endDate")
      .isISO8601()
      .toDate()
      .withMessage("End date is invalid")
      .custom((value, { req }) => {
        if (new Date(value) < new Date(req.body.startDate)) {
          throw new Error("End date must be after start date");
        }
        return true;
      }),
    body("ownerId").isInt().withMessage("Owner ID is required"), // ✅ Prisma requires relation
  ],
  validate,
  async (req: Request, res: Response) => {
    try {
      const { name, description, budget, startDate, endDate, ownerId } = req.body;

      const project = await prisma.project.create({
        data: {
          name,
          description,
          budget,
          startDate,
          endDate,
          owner: { connect: { id: ownerId } }, // ✅ relation to User
        },
      });

      res.status(201).json({ message: "Project created", project });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      res.status(500).json({ message: "Server error", error: errorMessage });
    }
  }
);

// ✅ READ all projects
router.get("/", async (req: Request, res: Response) => {
  try {
    const projects = await prisma.project.findMany({
      include: { documents: true, tasks: true, payments: true, owner: true },
    });
    res.json(projects);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    res.status(500).json({ message: "Server error", error: errorMessage });
  }
});

// ✅ READ single project
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const project = await prisma.project.findUnique({
      where: { id: Number(id) },
      include: { documents: true, tasks: true, payments: true, owner: true },
    });

    if (!project) return res.status(404).json({ message: "Project not found" });

    res.json(project);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    res.status(500).json({ message: "Server error", error: errorMessage });
  }
});

// ✅ UPDATE project
router.put(
  "/:id",
  [
    body("name").optional().notEmpty().withMessage("Project name cannot be empty"),
    body("budget")
      .optional()
      .isNumeric()
      .withMessage("Budget must be a number")
      .custom((value) => value > 0)
      .withMessage("Budget must be greater than 0"),
    body("endDate")
      .optional()
      .isISO8601()
      .toDate()
      .withMessage("End date is invalid"),
  ],
  validate,
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const updated = await prisma.project.update({
        where: { id: Number(id) },
        data: req.body,
      });
      res.json({ message: "Project updated", updated });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      res.status(500).json({ message: "Server error", error: errorMessage });
    }
  }
);

// ✅ DELETE project
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.project.delete({ where: { id: Number(id) } });
    res.json({ message: `Project ${id} deleted` });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    res.status(500).json({ message: "Server error", error: errorMessage });
  }
});

export default router;






