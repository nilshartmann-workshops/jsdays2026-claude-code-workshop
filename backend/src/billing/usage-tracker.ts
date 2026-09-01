import { randomUUID } from "node:crypto";

import type { CareTaskType } from "@plantify/contracts";

import { findOwnerIdForPlant } from "../plant/index.ts";
import { type UsageType, usageRepository } from "./usage-repository.ts";

const SETUP_FEE_CENTS = 1000;

const CARE_TASK_COST_CENTS: Record<CareTaskType, number> = {
  WATERING: 50,
  FERTILIZING: 100,
  PEST_CONTROL: 300,
  PRUNING: 400,
  REPOTTING: 500,
};

export function trackInitialCareTasksCreated(plantId: string) {
  track(plantId, "SETUP_FEE", SETUP_FEE_CENTS);
}

export function trackCareTaskCompleted(
  plantId: string,
  careTaskType: CareTaskType,
) {
  track(plantId, "CARE_TASK_COMPLETED", CARE_TASK_COST_CENTS[careTaskType]);
}

function track(plantId: string, usageType: UsageType, costCents: number) {
  const ownerId = findOwnerIdForPlant(plantId);
  if (!ownerId) {
    throw new Error(`No owner for plant '${plantId}'`);
  }

  usageRepository.save({
    id: randomUUID(),
    ownerId,
    usageType,
    recordedAt: new Date().toISOString(),
    costCents,
  });
}
