import { db } from "./db";
import { regions, locations, modeSummaries, type Region, type InsertRegion, type Location, type InsertLocation, type ModeSummary, type InsertModeSummary } from "@shared/schema";
import { eq } from "drizzle-orm";

export interface IStorage {
  getDashboardData(): Promise<{ regions: Region[], locations: Location[], modeSummaries: ModeSummary[] }>;
  updateRegion(key: string, updates: Partial<InsertRegion>): Promise<Region | undefined>;
  updateLocation(id: number, updates: Partial<InsertLocation>): Promise<Location | undefined>;
  updateModeSummary(category: string, updates: Partial<InsertModeSummary>): Promise<ModeSummary | undefined>;
  seedDatabase(): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getDashboardData() {
    const [regionsData, locationsData, modeSummariesData] = await Promise.all([
      db.select().from(regions),
      db.select().from(locations),
      db.select().from(modeSummaries),
    ]);
    return {
      regions: regionsData,
      locations: locationsData,
      modeSummaries: modeSummariesData,
    };
  }

  async updateRegion(key: string, updates: Partial<InsertRegion>) {
    const [updated] = await db.update(regions)
      .set(updates)
      .where(eq(regions.key, key))
      .returning();
    return updated;
  }

  async updateLocation(id: number, updates: Partial<InsertLocation>) {
    const [updated] = await db.update(locations)
      .set(updates)
      .where(eq(locations.id, id))
      .returning();
    return updated;
  }

  async updateModeSummary(category: string, updates: Partial<InsertModeSummary>) {
    const [updated] = await db.update(modeSummaries)
      .set(updates)
      .where(eq(modeSummaries.category, category))
      .returning();
    return updated;
  }

  async seedDatabase() {
    const existingRegions = await db.select().from(regions);
    if (existingRegions.length > 0) return;

    // Seed Regions
    const regionsData = [
      { key: 'maharashtra', name: 'Maharashtra', totalOrder: 17714.32, lumps: 3355.75, pellet: 13385.67, fines: 0, pellet76: 972.9 },
      { key: 'gujarat', name: 'Gujarat', totalOrder: 1877.08, lumps: 347.74, pellet: 1529.34, fines: 0 },
      { key: 'madhyaPradesh', name: 'Madhya Pradesh', totalOrder: 5829.49, lumps: 1336.61, pellet: 4492.88, fines: 0 },
      { key: 'chhattisgarh', name: 'Chhattisgarh', totalOrder: 297.56, lumps: 0, pellet: 0, fines: 297.56 },
      { key: 'rajasthan', name: 'Rajasthan', totalOrder: 126.43, lumps: 0, pellet: 126.43, fines: 0 },
      { key: 'telangana', name: 'Telangana', totalOrder: 12.11, lumps: 0, pellet: 12.11, fines: 0 },
      { key: 'tamilNadu', name: 'Tamil Nadu', totalOrder: 26.62, lumps: 0, pellet: 0, fines: 26.62 },
    ];
    await db.insert(regions).values(regionsData);

    // Seed Locations
    const locationsData = [
      // Maharashtra
      { regionKey: 'maharashtra', name: 'Padoli', distance: 20, freight: 300, freightRate: 15, capacity: 500, balFor: 447.72 },
      { regionKey: 'maharashtra', name: 'Tadali', distance: 17, freight: 300, freightRate: 17.6, capacity: 450, balExw: 699.75 },
      { regionKey: 'maharashtra', name: 'Umred', distance: 22, freight: 300, freightRate: 13.6, capacity: 400, balFor: 81.96 },
      { regionKey: 'maharashtra', name: 'Wardha', distance: 136, freight: 650, freightRate: 4.7, capacity: 800, balFor: 890.99 },
      { regionKey: 'maharashtra', name: 'Nagpur (Buti buri)', distance: 131, freight: 625, freightRate: 4.8, capacity: 400, balExw: 1289.52 },
      { regionKey: 'maharashtra', name: 'Nagpur (Hingna)', distance: 156, freight: 700, freightRate: 4.5, capacity: 450, balFor: 12.77 },
      { regionKey: 'maharashtra', name: 'Bajargaon', distance: 175, freight: 750, freightRate: 4.2, capacity: 450, balFor: 290.42 },
      { regionKey: 'maharashtra', name: 'Mouda', distance: 192, freight: 775, freightRate: 4.0, capacity: 450, balFor: 110.08 },
      { regionKey: 'maharashtra', name: 'Jalna', distance: 464, freight: 1450, freightRate: 3.1, capacity: 1000, balExw: 2852.93, balFor: 6907.58, pellet76: 972.9 },
      { regionKey: 'maharashtra', name: 'Nashik', distance: 691, freight: 1900, freightRate: 2.7, capacity: 200, balFor: 512.76 },
      { regionKey: 'maharashtra', name: 'Wada', distance: 827, freight: 2300, freightRate: 2.8, capacity: 250, balExw: 1682.12 },
      { regionKey: 'maharashtra', name: 'Ahilyanagar', distance: 0, freight: 0, freightRate: 0, capacity: 0, balExw: 200 },
      // Gujarat
      { regionKey: 'gujarat', name: 'Silvassa', distance: 848, freight: 2100, freightRate: 2.4, capacity: 225, balExw: 1336.61, balFor: 1381.78 },
      { regionKey: 'gujarat', name: 'Ahmedabad', distance: 1138, freight: 2400, freightRate: 2.1, capacity: 85, balExw: 779.83 },
      { regionKey: 'gujarat', name: 'Bhavnagar', distance: 1237, freight: 2600, freightRate: 2.1, capacity: 85, balExw: 1913.43 },
      // MP
      { regionKey: 'madhyaPradesh', name: 'Pithampur', distance: 623, freight: 1850, freightRate: 2.9, capacity: 90, balExw: 347.74, balFor: 147.56 },
      { regionKey: 'madhyaPradesh', name: 'Mandsour', distance: 821, freight: 2100, freightRate: 2.5, capacity: 90, balExw: 1184.17, balFor: 615.45 },
      { regionKey: 'madhyaPradesh', name: 'Sitamau', distance: 891, freight: 2200, freightRate: 2.4, capacity: 90, balExw: 17.11 },
      // CG
      { regionKey: 'chhattisgarh', name: 'Raipur', distance: 386, freight: 1050, freightRate: 2.7, capacity: 400, balFor: 297.56 },
      // Rajasthan
      { regionKey: 'rajasthan', name: 'Bilwara', distance: 997, freight: 0, freightRate: 0, capacity: 0, balExw: 126.43 },
      // Telangana
      { regionKey: 'telangana', name: 'Hyderabad (Medchal)', distance: 384, freight: 1500, freightRate: 3.9, capacity: 400, balFor: 12.11 },
      // Tamil Nadu
      { regionKey: 'tamilNadu', name: 'Chennai (Gummarpudi)', distance: 937, freight: 2600, freightRate: 2.7, capacity: 90, balFor: 26.62 },
    ];
    await db.insert(locations).values(locationsData);

    // Seed Summaries
    const summaryData = [
      { category: 'exw', under21: 9757.79, over21: 1762.37, shortClose: 98.16, total: 11618.32 },
      { category: 'for', under21: 13590.95, over21: 582.83, shortClose: 108.62, total: 14282.4 },
      { category: 'grand', under21: 23348.74, over21: 2345.2, shortClose: 206.78, total: 25900.72 },
    ];
    await db.insert(modeSummaries).values(summaryData);
  }
}

export const storage = new DatabaseStorage();
