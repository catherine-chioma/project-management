import express from "express";
import prisma from "../db";

const router = express.Router();

// ✅ Create a payment
router.post("/", async (req, res) => {
  try {
    const { amount, method, projectId } = req.body;

    if (!amount || !method || !projectId) {
      return res.status(400).json({ error: "Amount, method, and projectId are required" });
    }

    // Check if project exists
    const project = await prisma.project.findUnique({ where: { id: projectId } });
    if (!project) return res.status(400).json({ error: "Project not found" });

    const payment = await prisma.payment.create({
      data: { amount, method, projectId },
    });

    res.status(201).json({ message: "Payment created", payment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: (error instanceof Error ? error.message : String(error)) });
  }
});

// ✅ Get all payments
router.get("/", async (req, res) => {
  try {
    const payments = await prisma.payment.findMany({
      include: { project: true },
    });
    res.json(payments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Get a payment by ID
router.get("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    const payment = await prisma.payment.findUnique({
      where: { id },
      include: { project: true },
    });

    if (!payment) return res.status(404).json({ error: "Payment not found" });

    res.json(payment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Update a payment
router.put("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { amount, method } = req.body;

    const payment = await prisma.payment.update({
      where: { id },
      data: { amount, method },
    });

    res.json({ message: "Payment updated", payment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Delete a payment
router.delete("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    await prisma.payment.delete({ where: { id } });
    res.json({ message: "Payment deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;

