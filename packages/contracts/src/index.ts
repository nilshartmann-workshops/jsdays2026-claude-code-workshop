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
