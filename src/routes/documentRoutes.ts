import express from "express";
import prisma from "../db";

const router = express.Router();

// ✅ Create a document
router.post("/", async (req, res) => {
  try {
    const { title, text, projectId } = req.body;

    if (!title || !text || !projectId) {
      return res.status(400).json({ error: "Title, text, and projectId are required" });
    }

    // Check if project exists
    const project = await prisma.project.findUnique({ where: { id: projectId } });
    if (!project) return res.status(400).json({ error: "Project not found" });

    const document = await prisma.document.create({
      data: { title, text, projectId },
    });

    res.status(201).json({ message: "Document created", document });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: (error as Error).toString() });
  }
});

// ✅ Get all documents
router.get("/", async (req, res) => {
  try {
    const documents = await prisma.document.findMany({
      include: { project: true },
    });
    res.json(documents);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Get a document by ID
router.get("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    const document = await prisma.document.findUnique({
      where: { id },
      include: { project: true },
    });

    if (!document) return res.status(404).json({ error: "Document not found" });

    res.json(document);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Update a document
router.put("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { title, text } = req.body;

    const document = await prisma.document.update({
      where: { id },
      data: { title, text },
    });

    res.json({ message: "Document updated", document });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Delete a document
router.delete("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    await prisma.document.delete({ where: { id } });
    res.json({ message: "Document deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;

