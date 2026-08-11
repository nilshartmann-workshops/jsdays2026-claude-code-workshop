import { NewPlantRequest, type Plant } from "@plantify/contracts";
import { Router } from "express";

import { NotFoundError } from "../shared/http.ts";
import { type PlantRecord, plantRepository } from "./plant-repository.ts";
import { registerPlant } from "./plant-service.ts";

export const plantRoutes = Router();

plantRoutes.get("/:plantId", (req, res) => {
  const plant = plantRepository.findById(req.params.plantId);
  if (!plant) {
    throw new NotFoundError("Plant", req.params.plantId);
  }

  res.json(toPlant(plant));
});

plantRoutes.post("/", (req, res) => {
  const plant = registerPlant(NewPlantRequest.parse(req.body));

  res.status(201).json(toPlant(plant));
});

function toPlant(plant: PlantRecord): Plant {
  return {
    id: plant.id,
    ownerId: plant.ownerId,
    name: plant.name,
    plantType: plant.plantType,
    location: plant.location,
  };
}
