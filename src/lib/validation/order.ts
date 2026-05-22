import { z } from "zod";

export const orderSchema = z.object({
  serviceId: z.string().min(1),
  targetUrl: z.string().url(),
  quantity: z.coerce.number().int().positive(),
  comments: z.string().max(5000).optional(),
  usernames: z.string().max(5000).optional(),
  hashtags: z.string().max(2000).optional(),
  runs: z.coerce.number().int().positive().optional(),
  interval: z.coerce.number().int().nonnegative().optional(),
  gender: z.enum(["all", "male", "female"]).optional(),
  perDay: z.coerce.number().int().positive().optional(),
  include: z.string().max(2000).optional(),
  exclude: z.string().max(2000).optional(),
  notificationEnabled: z.boolean().optional(),
  moderatorNote: z.string().max(2000).optional(),
  cities: z.array(z.string().min(2).max(40)).max(81).optional(),
  username: z.string().max(160).optional(),
  answerNumber: z.coerce.number().int().positive().optional(),
  mediaUrl: z.string().url().optional().or(z.literal(""))
});

export const walletTopupSchema = z.object({
  amount: z.coerce.number().min(50),
  provider: z.enum(["IYZICO", "BANK_TRANSFER"])
});
