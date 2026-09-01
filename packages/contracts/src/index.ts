import { z } from "zod";

export const PlantType = z.enum([
  "SUMMER_FLOWERS",
  "PERENNIALS",
  "ROSES",
  "HERBS",
  "ORCHIDS",
  "INDOOR",
]);
export type PlantType = z.infer<typeof PlantType>;

export const Plant = z.object({
  id: z.string(),
  ownerId: z.string(),
  name: z.string().min(1),
  plantType: PlantType,
  location: z.string().min(1),
});
export type Plant = z.infer<typeof Plant>;

export const NewPlantRequest = z.object({
  ownerId: z.string().min(1),
  name: z.string().min(1),
  plantType: PlantType,
  location: z.string().min(1),
});
export type NewPlantRequest = z.infer<typeof NewPlantRequest>;

export const Owner = z.object({
  id: z.string(),
  name: z.string().min(1),
});
export type Owner = z.infer<typeof Owner>;

export const CareTaskType = z.enum([
  "WATERING",
  "FERTILIZING",
  "PRUNING",
  "REPOTTING",
  "PEST_CONTROL",
]);
export type CareTaskType = z.infer<typeof CareTaskType>;

export const CareTaskSource = z.enum(["SYSTEM", "EXPERT"]);
export type CareTaskSource = z.infer<typeof CareTaskSource>;

export const CareTask = z.object({
  id: z.string(),
  plantId: z.string(),
  type: CareTaskType,
  source: CareTaskSource,
  nextDueDate: z.iso.date(),
  // Abstand in Tagen; null bei einer einmaligen Aufgabe
  interval: z.number().int().positive().nullable(),
  recurring: z.boolean(),
  active: z.boolean(),
});
export type CareTask = z.infer<typeof CareTask>;

/** Monat im Format "2026-09" */
export const BillingPeriod = z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/);
export type BillingPeriod = z.infer<typeof BillingPeriod>;

export const Invoice = z.object({
  id: z.string(),
  ownerId: z.string(),
  ownerName: z.string(),
  billingPeriod: BillingPeriod,
  amount: z.number(),
  createdAt: z.iso.datetime(),
});
export type Invoice = z.infer<typeof Invoice>;

export const InvoiceItem = z.object({
  id: z.string(),
  description: z.string(),
  amount: z.number(),
});
export type InvoiceItem = z.infer<typeof InvoiceItem>;

export const InvoiceDetails = Invoice.extend({
  items: z.array(InvoiceItem),
});
export type InvoiceDetails = z.infer<typeof InvoiceDetails>;

export const GenerateInvoicesRequest = z.object({
  billingPeriod: BillingPeriod,
});
export type GenerateInvoicesRequest = z.infer<typeof GenerateInvoicesRequest>;
