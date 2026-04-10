import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret";

export const authMiddleware = (req: any, res: any, next: any) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      error: "Unauthorized",
    });
  }

  try {
    const token = authHeader.split(" ")[1];

    const decoded: any = jwt.verify(token, JWT_SECRET);

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
