import type { Express, Request, Response } from "express";
import { z } from "zod";
import {
  hashPassword,
  verifyPassword,
  signToken,
  verifyToken,
  findUserByEmail,
  createUser,
} from "./auth";

// Request interface with user info
declare global {
  namespace Express {
    interface Request {
      user?: { userId: number; role: string };
    }
  }
}

// Middleware to check authentication
export function authMiddleware(
  req: Request,
  res: Response,
  next: Function
) {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(401).json({ message: "Invalid token" });
  }

  req.user = decoded;
  next();
}

// Middleware to check admin role
export function adminMiddleware(
  req: Request,
  res: Response,
  next: Function
) {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ message: "Forbidden - Admin only" });
  }
  next();
}

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(2),
});

export function setupAuthRoutes(app: Express) {
  // Register
  app.post("/api/auth/register", async (req: Request, res: Response) => {
    try {
      const data = registerSchema.parse(req.body);

      // Check if user exists
      const existing = await findUserByEmail(data.email);
      if (existing) {
        return res.status(400).json({ message: "User already exists" });
      }

      // Create user
      const user = await createUser(
        data.email,
        data.password,
        data.name,
        "viewer"
      );

      // Generate token
      const token = signToken(user.id, user.role);

      res.json({
        message: "User created successfully",
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
        token,
      });
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400).json({ message: err.errors[0].message });
      } else {
        throw err;
      }
    }
  });

  // Login
  app.post("/api/auth/login", async (req: Request, res: Response) => {
    try {
      const data = loginSchema.parse(req.body);

      // Find user
      const user = await findUserByEmail(data.email);
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Verify password
      const passwordMatch = await verifyPassword(
        data.password,
        user.password
      );
      if (!passwordMatch) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Generate token
      const token = signToken(user.id, user.role);

      res.json({
        message: "Login successful",
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
        token,
      });
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400).json({ message: err.errors[0].message });
      } else {
        throw err;
      }
    }
  });

  // Get current user
  app.get("/api/auth/me", authMiddleware, async (req: Request, res: Response) => {
    res.json({ userId: req.user?.userId, role: req.user?.role });
  });

  // Logout (client-side handled, but endpoint for completeness)
  app.post("/api/auth/logout", authMiddleware, (req: Request, res: Response) => {
    res.json({ message: "Logout successful" });
  });
}
