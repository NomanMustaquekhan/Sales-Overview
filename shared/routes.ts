import { z } from 'zod';
import { insertRegionSchema, insertLocationSchema, insertModeSummarySchema, regions, locations, modeSummaries } from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  dashboard: {
    get: {
      method: 'GET' as const,
      path: '/api/dashboard',
      responses: {
        200: z.object({
          regions: z.array(z.custom<typeof regions.$inferSelect>()),
          locations: z.array(z.custom<typeof locations.$inferSelect>()),
          modeSummaries: z.array(z.custom<typeof modeSummaries.$inferSelect>()),
        }),
      },
    },
  },
  regions: {
    update: {
      method: 'PUT' as const,
      path: '/api/regions/:key',
      input: insertRegionSchema.partial(),
      responses: {
        200: z.custom<typeof regions.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
  },
  locations: {
    update: {
      method: 'PUT' as const,
      path: '/api/locations/:id',
      input: insertLocationSchema.partial(),
      responses: {
        200: z.custom<typeof locations.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
  },
  modeSummaries: {
    update: {
      method: 'PUT' as const,
      path: '/api/mode-summaries/:category',
      input: insertModeSummarySchema.partial(),
      responses: {
        200: z.custom<typeof modeSummaries.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
