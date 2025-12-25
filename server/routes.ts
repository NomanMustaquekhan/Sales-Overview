import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { setupAuthRoutes } from "./auth-routes";
import { api } from "@shared/routes";
import { z } from "zod";

export async function registerRoutes(httpServer: Server, app: Express): Promise<Server> {
  // Setup auth routes
  setupAuthRoutes(app);

  // GET Dashboard Data
  app.get(api.dashboard.get.path, async (req, res) => {
    const data = await storage.getDashboardData();
    res.json(data);
  });

  // Update Region
  app.put(api.regions.update.path, async (req, res) => {
    try {
      const input = api.regions.update.input.parse(req.body);
      const updated = await storage.updateRegion(req.params.key, input);
      if (!updated) return res.status(404).json({ message: "Region not found" });
      res.json(updated);
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400).json({ message: err.errors[0].message });
      } else {
        throw err;
      }
    }
  });

  // Update Location
  app.put(api.locations.update.path, async (req, res) => {
    try {
      const input = api.locations.update.input.parse(req.body);
      const updated = await storage.updateLocation(Number(req.params.id), input);
      if (!updated) return res.status(404).json({ message: "Location not found" });
      res.json(updated);
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400).json({ message: err.errors[0].message });
      } else {
        throw err;
      }
    }
  });

  // Update Summary
  app.put(api.modeSummaries.update.path, async (req, res) => {
    try {
      const input = api.modeSummaries.update.input.parse(req.body);
      const updated = await storage.updateModeSummary(req.params.category, input);
      if (!updated) return res.status(404).json({ message: "Summary not found" });
      res.json(updated);
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400).json({ message: err.errors[0].message });
      } else {
        throw err;
      }
    }
  });

  // Seed DB asynchronously on startup
  storage.seedDatabase().catch((err) => {
    console.error("Failed to seed database:", err);
  });

  return httpServer;
}
