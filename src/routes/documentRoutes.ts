import express from "express";
import prisma from "../db";

const router = express.Router();

// Get all documents
router.get("/", async (req, res) => {
  try {
    const documents = await prisma.document.findMany({ include: { project: true } });
    res.json(documents);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch documents" });
  }
});

// Get document by ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const document = await prisma.document.findUnique({
      where: { id: Number(id) },
      include: { project: true },
    });
    if (!document) return res.status(404).json({ error: "Document not found" });
    res.json(document);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch document" });
  }
});

// Create document
router.post("/", async (req, res) => {
  const { title, text, projectId } = req.body;
  try {
    const newDocument = await prisma.document.create({
      data: { title, text, projectId },
    });
    res.status(201).json(newDocument);
  } catch (error) {
    res.status(500).json({ error: "Failed to create document" });
  }
});

// Update document
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { title, text } = req.body;
  try {
    const updatedDocument = await prisma.document.update({
      where: { id: Number(id) },
      data: { title, text },
    });
    res.json(updatedDocument);
  } catch (error) {
    res.status(500).json({ error: "Failed to update document" });
  }
});

// Delete document
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.document.delete({ where: { id: Number(id) } });
    res.json({ message: "Document deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete document" });
  }
});

export default router;
