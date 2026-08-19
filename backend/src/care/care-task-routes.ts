import type { CareTask } from "@plantify/contracts";
import { Router } from "express";

import type { CareTaskRecord } from "./care-task-repository.ts";
import { completeCareTask, getAllCareTasks } from "./care-task-service.ts";

export const careTaskRoutes = Router();

careTaskRoutes.get("/", (_req, res) => {
  res.json(getAllCareTasks().map(toCareTask));
});

careTaskRoutes.post("/:careTaskId/complete", (req, res) => {
  res.json(toCareTask(completeCareTask(req.params.careTaskId)));
});

function toCareTask(careTask: CareTaskRecord): CareTask {
  return {
    id: careTask.id,
    plantId: careTask.plantId,
    type: careTask.type,
    source: careTask.source,
    nextDueDate: careTask.nextDueDate,
    interval: careTask.interval,
    recurring: careTask.interval !== null,
    active: careTask.active,
  };
}
