import { z } from "zod";

export const credentialSchema = z.object({
  providerName: z.enum(["wesosyal", "iyzico", "openai"]),
  apiKey: z.string().min(6),
  secretKey: z.string().optional(),
  baseUrl: z.string().url().optional().or(z.literal(""))
});

export const serviceUpdateSchema = z.object({
  id: z.string().min(1),
  sosyofoxServiceName: z.string().min(2).max(180),
  sosyofoxCategoryName: z.string().max(160).optional().or(z.literal("")),
  customDescription: z.string().max(6000).optional().or(z.literal("")),
  icon: z.string().min(2).max(80),
  finalPrice: z.coerce.number().min(0),
  profitValue: z.coerce.number().min(-100).max(100000),
  isVisible: z.boolean(),
  isFeatured: z.boolean()
});

export const categoryUpdateSchema = z.object({
  id: z.string().min(1),
  sosyofoxCategoryName: z.string().min(2).max(160),
  description: z.string().max(1000).optional().or(z.literal("")),
  icon: z.string().min(2).max(80),
  isVisible: z.boolean(),
  isFeatured: z.boolean()
});

export const bulkVisibilitySchema = z.object({
  ids: z.array(z.string().min(1)).min(1).max(500),
  entity: z.enum(["service", "category"]),
  isVisible: z.boolean()
});

export const bulkPricingSchema = z.object({
  ids: z.array(z.string().min(1)).min(1).max(500),
  operation: z.enum(["match_original", "increase_percent", "decrease_percent"]),
  percent: z.coerce.number().min(0).max(100000).optional()
});

export const aiDescriptionSchema = z.object({
  id: z.string().min(1)
});
