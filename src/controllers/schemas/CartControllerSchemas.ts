import { z } from "zod";

export const AddItemSchema = z.object({
  productName: z.string().min(1),
  quantity: z.number().int().positive().default(1),
  userType: z.enum(["COMMON", "VIP"]),
});

export const RemoveItemSchema = z.object({
  productName: z.string().min(1),
  userType: z.enum(["COMMON", "VIP"]),
});

export const GetTotalSchema = z.object({
  userType: z.enum(["COMMON", "VIP"]),
});
