import { pgTable, text, serial, doublePrecision } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// === TABLE DEFINITIONS ===

// Regional Aggregates (e.g., Maharashtra, Gujarat)
export const regions = pgTable("regions", {
  id: serial("id").primaryKey(),
  key: text("key").notNull().unique(), // e.g., 'maharashtra'
  name: text("name").notNull(),        // e.g., 'Maharashtra'
  totalOrder: doublePrecision("total_order").notNull().default(0),
  lumps: doublePrecision("lumps").notNull().default(0),
  pellet: doublePrecision("pellet").notNull().default(0),
  fines: doublePrecision("fines").notNull().default(0),
  pellet76: doublePrecision("pellet76").notNull().default(0),
});

// Specific Locations/Depots within Regions
export const locations = pgTable("locations", {
  id: serial("id").primaryKey(),
  regionKey: text("region_key").notNull(), // references regions.key
  name: text("name").notNull(),
  distance: doublePrecision("distance").notNull().default(0),
  freight: doublePrecision("freight").notNull().default(0),
  freightRate: doublePrecision("freight_rate").notNull().default(0),
  capacity: doublePrecision("capacity").notNull().default(0),
  balExw: doublePrecision("bal_exw").notNull().default(0),
  balFor: doublePrecision("bal_for").notNull().default(0),
  pellet76: doublePrecision("pellet76").notNull().default(0),
});

// KPI Summaries (EXW, FOR, Grand Total)
export const modeSummaries = pgTable("mode_summaries", {
  id: serial("id").primaryKey(),
  category: text("category").notNull().unique(), // 'exw', 'for', 'grand'
  under21: doublePrecision("under21").notNull().default(0),
  over21: doublePrecision("over21").notNull().default(0),
  shortClose: doublePrecision("short_close").notNull().default(0),
  total: doublePrecision("total").notNull().default(0),
});

// === SCHEMAS ===
export const insertRegionSchema = createInsertSchema(regions).omit({ id: true });
export const insertLocationSchema = createInsertSchema(locations).omit({ id: true });
export const insertModeSummarySchema = createInsertSchema(modeSummaries).omit({ id: true });

// === TYPES ===
export type Region = typeof regions.$inferSelect;
export type InsertRegion = z.infer<typeof insertRegionSchema>;

export type Location = typeof locations.$inferSelect;
export type InsertLocation = z.infer<typeof insertLocationSchema>;

export type ModeSummary = typeof modeSummaries.$inferSelect;
export type InsertModeSummary = z.infer<typeof insertModeSummarySchema>;

export type DashboardData = {
  regions: Region[];
  locations: Location[];
  modeSummaries: ModeSummary[];
};
