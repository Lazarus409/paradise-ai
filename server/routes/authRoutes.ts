import express from "express";
import bcrypt from "bcrypt";
import { db } from "../db";
import { authMiddleware } from "../middleware/authMiddleware";
import { generateToken } from "../utils/jwt";

const router = express.Router();

async function getPrimaryWorkspace(userId: string) {
  const ownedWorkspace = await db.workspace.findFirst({
    where: { ownerId: userId },
    orderBy: { createdAt: "asc" },
  });

  if (ownedWorkspace) {
    return ownedWorkspace;
  }

  const membership = await db.teamMember.findFirst({
    where: { userId },
    include: { workspace: true },
    orderBy: { workspace: { createdAt: "asc" } },
  });

  if (membership?.workspace) {
    return membership.workspace;
  }

  const workspace = await db.workspace.create({
    data: {
      name: "My Workspace",
      ownerId: userId,
      members: {
        create: {
          userId,
          role: "OWNER",
        },
      },
    },
  });

  return workspace;
}

function safeUser(user: {
  id: string;
  email: string;
  theme: string | null;
  createdAt: Date;
}) {
  return {
    id: user.id,
    email: user.email,
    theme: user.theme,
    createdAt: user.createdAt,
  };
}

/* ======================
   REGISTER
====================== */

router.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: "Email and password are required",
      });
    }

    const existing = await db.user.findUnique({
      where: { email },
    });

    if (existing) {
      return res.status(400).json({
        error: "User already exists",
      });
    }

    const hashed = await bcrypt.hash(password, 10);

    const { user, workspace } = await db.$transaction(async tx => {
      const user = await tx.user.create({
        data: {
          email,
          password: hashed,
        },
      });

      const workspace = await tx.workspace.create({
        data: {
          name: "My Workspace",
          ownerId: user.id,
        },
      });

      await tx.teamMember.create({
        data: {
          userId: user.id,
          workspaceId: workspace.id,
          role: "OWNER",
        },
      });

      await tx.subscription.create({
        data: {
          userId: user.id,
          plan: "FREE",
          status: "ACTIVE",
        },
      });

      return { user, workspace };
    });

    const token = generateToken(user.id);

    res.json({
      token,
      user: safeUser(user),
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

    if (!email || !password) {
      return res.status(400).json({
        error: "Email and password are required",
      });
    }

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
    const { password: _password, ...publicUser } = user;

    res.json({
      token,
      user: publicUser,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: "Login failed",
    });
  }
});

/* ======================
   ME
====================== */

router.get("/me", authMiddleware, async (req: any, res) => {
  try {
    const user = await db.user.findUnique({
      where: { id: req.user.id },
    });

    if (!user) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    const workspace = await getPrimaryWorkspace(user.id);

    const { password: _password, ...publicUser } = user;

    res.json({
      user: publicUser,
      workspace,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: "Failed to load current user",
    });
  }
});

export default router;
