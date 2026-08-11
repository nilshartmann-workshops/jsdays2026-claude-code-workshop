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
