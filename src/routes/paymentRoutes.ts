import express from "express";
import prisma from "../db";

const router = express.Router();

// Get all payments
router.get("/", async (req, res) => {
  try {
    const payments = await prisma.payment.findMany({ include: { project: true } });
    res.json(payments);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch payments" });
  }
});

// Get payment by ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const payment = await prisma.payment.findUnique({
      where: { id: Number(id) },
      include: { project: true },
    });
    if (!payment) return res.status(404).json({ error: "Payment not found" });
    res.json(payment);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch payment" });
  }
});

// Create payment
router.post("/", async (req, res) => {
  const { amount, method, projectId } = req.body;
  try {
    const newPayment = await prisma.payment.create({
      data: { amount, method, projectId },
    });
    res.status(201).json(newPayment);
  } catch (error) {
    res.status(500).json({ error: "Failed to create payment" });
  }
});

// Update payment
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { amount, method } = req.body;
  try {
    const updatedPayment = await prisma.payment.update({
      where: { id: Number(id) },
      data: { amount, method },
    });
    res.json(updatedPayment);
  } catch (error) {
    res.status(500).json({ error: "Failed to update payment" });
  }
});

// Delete payment
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.payment.delete({ where: { id: Number(id) } });
    res.json({ message: "Payment deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete payment" });
  }
});

export default router;
