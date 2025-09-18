import { Router } from "express";

const router = Router();

router.get("/", (_req, res) => res.send("List all projects"));
router.post("/", (_req, res) => res.send("Create a project"));

export default router;



