import express from "express";
import bcrypt from "bcrypt";
import prisma from "../db";  // adjust path

const router = express.Router();

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(401).json({ error: "Invalid password" });
    }

    res.json({ message: "✅ Login successful", user });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
});

export default router;
