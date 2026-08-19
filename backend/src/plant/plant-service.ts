import { randomUUID } from "node:crypto";

import type { NewPlantRequest } from "@plantify/contracts";

import { createInitialCareTasks } from "../care/index.ts";
import { type PlantRecord, plantRepository } from "./plant-repository.ts";

export function registerPlant(request: NewPlantRequest): PlantRecord {
  if (plantRepository.existsByOwnerIdAndName(request.ownerId, request.name)) {
    throw new Error(
      `Plant with name '${request.name}' already exists for this owner`,
    );
  }

  const plant = plantRepository.save({ id: randomUUID(), ...request });

  createInitialCareTasks(plant);

  return plant;
}

export function findOwnerIdForPlant(plantId: string): string | undefined {
  return plantRepository.findById(plantId)?.ownerId;
}
