import type { Owner } from "@plantify/contracts";
import { Router } from "express";

import { NotFoundError } from "../shared/http.ts";
import { type OwnerRecord, ownerRepository } from "./owner-repository.ts";

export const ownerRoutes = Router();

ownerRoutes.get("/", (_req, res) => {
  res.json(ownerRepository.findAllOrderedByName().map(toOwner));
});

ownerRoutes.get("/:ownerId", (req, res) => {
  const owner = ownerRepository.findById(req.params.ownerId);
  if (!owner) {
    throw new NotFoundError("Owner", req.params.ownerId);
  }

  res.json(toOwner(owner));
});

function toOwner(owner: OwnerRecord): Owner {
  return { id: owner.id, name: owner.name };
}
