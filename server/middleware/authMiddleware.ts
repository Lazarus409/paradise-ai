import { verifyToken } from "../utils/jwt";

export const authMiddleware = (req: any, res: any, next: any) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      error: "Unauthorized",
    });
  }

  try {
    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token);

    req.user = {
      id: decoded.userId,
    };

    next();
  } catch {
    return res.status(401).json({
      error: "Invalid token",
    });
  }
};
