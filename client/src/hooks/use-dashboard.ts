import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { type InsertRegion, type InsertLocation, type InsertModeSummary } from "@shared/schema";

// Types for the dashboard data structure
export type DashboardResponse = {
  regions: any[];
  locations: any[];
  modeSummaries: any[];
};

export function useDashboardData() {
  return useQuery({
    queryKey: [api.dashboard.get.path],
    queryFn: async () => {
      const res = await fetch(api.dashboard.get.path);
      if (!res.ok) throw new Error("Failed to fetch dashboard data");
      return await res.json() as DashboardResponse;
    },
  });
}

export function useUpdateRegion() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ key, updates }: { key: string, updates: Partial<InsertRegion> }) => {
      const url = buildUrl(api.regions.update.path, { key });
      const res = await fetch(url, {
        method: api.regions.update.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      if (!res.ok) throw new Error("Failed to update region");
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.dashboard.get.path] });
    },
  });
}

export function useUpdateLocation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, updates }: { id: number, updates: Partial<InsertLocation> }) => {
      const url = buildUrl(api.locations.update.path, { id });
      const res = await fetch(url, {
        method: api.locations.update.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      if (!res.ok) throw new Error("Failed to update location");
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.dashboard.get.path] });
    },
  });
}

export function useUpdateModeSummary() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ category, updates }: { category: string, updates: Partial<InsertModeSummary> }) => {
      const url = buildUrl(api.modeSummaries.update.path, { category });
      const res = await fetch(url, {
        method: api.modeSummaries.update.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      if (!res.ok) throw new Error("Failed to update mode summary");
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.dashboard.get.path] });
    },
  });
}
