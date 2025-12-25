import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// === TABLE DEFINITIONS ===

// Regional Aggregates (e.g., Maharashtra, Gujarat)
export const regions = sqliteTable("regions", {
  id: integer("id").primaryKey(),
  key: text("key").notNull().unique(), // e.g., 'maharashtra'
  name: text("name").notNull(),        // e.g., 'Maharashtra'
  totalOrder: real("total_order").notNull().default(0),
  lumps: real("lumps").notNull().default(0),
  pellet: real("pellet").notNull().default(0),
  fines: real("fines").notNull().default(0),
  pellet76: real("pellet76").notNull().default(0),
});

// Specific Locations/Depots within Regions
export const locations = sqliteTable("locations", {
  id: integer("id").primaryKey(),
  regionKey: text("region_key").notNull(), // references regions.key
  name: text("name").notNull(),
  distance: real("distance").notNull().default(0),
  freight: real("freight").notNull().default(0),
  freightRate: real("freight_rate").notNull().default(0),
  capacity: real("capacity").notNull().default(0),
  balExw: real("bal_exw").notNull().default(0),
  balFor: real("bal_for").notNull().default(0),
  pellet76: real("pellet76").notNull().default(0),
});

// KPI Summaries (EXW, FOR, Grand Total)
export const modeSummaries = sqliteTable("mode_summaries", {
  id: integer("id").primaryKey(),
  category: text("category").notNull().unique(), // 'exw', 'for', 'grand'
  under21: real("under21").notNull().default(0),
  over21: real("over21").notNull().default(0),
  shortClose: real("short_close").notNull().default(0),
  total: real("total").notNull().default(0),
});

// User Management
export const users = sqliteTable("users", {
  id: integer("id").primaryKey(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  role: text("role").notNull().default("viewer"), // admin, editor, viewer
  createdAt: integer("created_at", { mode: "timestamp" }).default(new Date()),
});

// Alerts & Notifications
export const alerts = sqliteTable("alerts", {
  id: integer("id").primaryKey(),
  userId: integer("user_id").notNull(),
  title: text("title").notNull(),
  message: text("message").notNull(),
  type: text("type").notNull(), // info, warning, error
  isRead: integer("is_read", { mode: "boolean" }).default(false),
  createdAt: integer("created_at", { mode: "timestamp" }).default(new Date()),
});

// === SCHEMAS ===
export const insertRegionSchema = createInsertSchema(regions).omit({ id: true });
export const insertLocationSchema = createInsertSchema(locations).omit({ id: true });
export const insertModeSummarySchema = createInsertSchema(modeSummaries).omit({ id: true });
export const insertUserSchema = createInsertSchema(users).omit({ id: true });
export const insertAlertSchema = createInsertSchema(alerts).omit({ id: true });

// === TYPES ===
export type Region = typeof regions.$inferSelect;
export type InsertRegion = z.infer<typeof insertRegionSchema>;

export type Location = typeof locations.$inferSelect;
export type InsertLocation = z.infer<typeof insertLocationSchema>;

export type ModeSummary = typeof modeSummaries.$inferSelect;
export type InsertModeSummary = z.infer<typeof insertModeSummarySchema>;

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Alert = typeof alerts.$inferSelect;
export type InsertAlert = z.infer<typeof insertAlertSchema>;

export type DashboardData = {
  regions: Region[];
  locations: Location[];
  modeSummaries: ModeSummary[];
};
