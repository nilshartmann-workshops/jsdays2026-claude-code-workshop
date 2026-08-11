import type { PlantType } from "@plantify/contracts";

export type PlantRecord = {
  id: string;
  ownerId: string;
  name: string;
  plantType: PlantType;
  location: string;
};

const plants = new Map<string, PlantRecord>();

export const plantRepository = {
  save(plant: PlantRecord): PlantRecord {
    plants.set(plant.id, plant);
    return plant;
  },

  findById(id: string): PlantRecord | undefined {
    return plants.get(id);
  },

  existsByOwnerIdAndName(ownerId: string, name: string): boolean {
    return [...plants.values()].some(
      (plant) => plant.ownerId === ownerId && plant.name === name,
    );
  },

  deleteAll() {
    plants.clear();
  },
};
