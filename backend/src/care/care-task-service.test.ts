import { beforeEach, expect, it } from "vitest";

import { usageRepository } from "../billing/index.ts";
import { plantRepository } from "../plant/index.ts";
import {
  type CareTaskRecord,
  careTaskRepository,
} from "./care-task-repository.ts";
import { completeCareTask } from "./care-task-service.ts";

const PLANT = "plant-1";

function careTask(id: string, interval: number | null): CareTaskRecord {
  return careTaskRepository.save({
    id,
    plantId: PLANT,
    type: "WATERING",
    source: "SYSTEM",
    nextDueDate: "2026-09-28",
    interval,
    active: true,
  });
}

beforeEach(() => {
  plantRepository.deleteAll();
  careTaskRepository.deleteAll();
  usageRepository.deleteAll();

  plantRepository.save({
    id: PLANT,
    ownerId: "owner-1",
    name: "Basilikum",
    plantType: "HERBS",
    location: "Küche",
  });
});

it("moves a recurring care task by its interval", () => {
  careTask("recurring", 5);

  expect(completeCareTask("recurring")).toMatchObject({
    nextDueDate: "2026-10-03",
    active: true,
  });
});

it("deactivates a one-time care task", () => {
  careTask("one-time", null);

  expect(completeCareTask("one-time")).toMatchObject({
    nextDueDate: "2026-09-28",
    active: false,
  });
});

it("rejects a care task that is no longer active", () => {
  careTask("one-time", null);
  completeCareTask("one-time");

  expect(() => completeCareTask("one-time")).toThrow("is not active");
});
