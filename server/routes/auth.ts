import express from "express";
import bcrypt from "bcrypt";
import { db } from "../db";
import { generateToken } from "../auth";

const router = express.Router();

const SALT_ROUNDS = 10;

/* =========================
   REGISTER
========================= */

router.post("/register", async (req, res) => {
  const { email, password } = req.body;

  const existing = await db.user.findUnique({
    where: { email },
  });

  if (existing) {
    return res.status(400).json({
      error: "User already exists",
    });
  }

  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  const user = await db.user.create({
    data: {
      email,
      password: hashedPassword,
      workspaces: {
        create: {
          name: "Default Workspace",
        },
      },
    },
  });

  const token = generateToken(user.id);

  res.json({
    token,
    user: {
      id: user.id,
      email: user.email,
    },
  });
});

/* =========================
   LOGIN
========================= */

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await db.user.findUnique({
    where: { email },
  });

  if (!user) {
    return res.status(401).json({
      error: "Invalid credentials",
    });
  }

  const valid = await bcrypt.compare(password, user.password);

  if (!valid) {
    return res.status(401).json({
      error: "Invalid credentials",
    });
  }

  const token = generateToken(user.id);

  res.json({
    token,
    user: {
      id: user.id,
      email: user.email,
    },
  });
});

export default router;
