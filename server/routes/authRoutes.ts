import express from "express";
import bcrypt from "bcrypt";
import { db } from "../db";
import { generateToken } from "../utils/jwt";

const router = express.Router();

/* ======================
   REGISTER
====================== */

router.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;

    const existing = await db.user.findUnique({
      where: { email },
    });

    if (existing) {
      return res.status(400).json({
        error: "User already exists",
      });
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await db.user.create({
      data: {
        email,
        password: hashed,
      },
    });

    /* Create default workspace */

    const workspace = await db.workspace.create({
      data: {
        name: "My Workspace",
        ownerId: user.id,
      },
    });

    /* Add user as OWNER */

    await db.teamMember.create({
      data: {
        userId: user.id,
        workspaceId: workspace.id,
        role: "OWNER",
      },
    });

    /* Create free subscription */

    await db.subscription.create({
      data: {
        userId: user.id,
        plan: "FREE",
        status: "ACTIVE",
      },
    });

    const token = generateToken(user.id);

    res.json({
      token,
      user,
      workspace,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: "Registration failed",
    });
  }
});

/* ======================
   LOGIN
====================== */

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await db.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(400).json({
        error: "Invalid credentials",
      });
    }

    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
      return res.status(400).json({
        error: "Invalid credentials",
      });
    }

    const token = generateToken(user.id);

    res.json({
      token,
      user,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: "Login failed",
    });
  }
});

export default router;
