import { randomUUID } from "node:crypto";

import type { CareTaskType, PlantType } from "@plantify/contracts";

import { addDays, today } from "../shared/dates.ts";
import { NotFoundError } from "../shared/http.ts";
import { type CareTaskRecord, careTaskRepository } from "./care-task-repository.ts";

type CareTaskTemplate = {
  type: CareTaskType;
  /** Abstand in Tagen; null bei einer einmaligen Aufgabe */
  intervalDays: number | null;
};

const REPOT_ONCE: CareTaskTemplate = { type: "REPOTTING", intervalDays: null };

/** Die Pflegeaufgaben, die eine neu registrierte Pflanze je Pflanzentyp bekommt */
const CARE_PLANS: Record<PlantType, CareTaskTemplate[]> = {
  SUMMER_FLOWERS: [REPOT_ONCE, { type: "WATERING", intervalDays: 4 }],
  PERENNIALS: [REPOT_ONCE, { type: "WATERING", intervalDays: 4 }],
  ROSES: [REPOT_ONCE, { type: "WATERING", intervalDays: 2 }],
  HERBS: [REPOT_ONCE, { type: "WATERING", intervalDays: 4 }],
  ORCHIDS: [REPOT_ONCE, { type: "WATERING", intervalDays: 4 }],
  INDOOR: [REPOT_ONCE, { type: "WATERING", intervalDays: 4 }],
};

export function createInitialCareTasks(plant: {
  id: string;
  plantType: PlantType;
}): CareTaskRecord[] {
  const careTasks = CARE_PLANS[plant.plantType].map((template) =>
    careTaskRepository.save({
      id: randomUUID(),
      plantId: plant.id,
      type: template.type,
      source: "SYSTEM",
      // Eine einmalige Aufgabe ist am Folgetag fällig, die erste Ausführung
      // einer wiederkehrenden liegt dahinter.
      nextDueDate: addDays(today(), template.intervalDays === null ? 1 : 2),
      interval: template.intervalDays,
      active: true,
    }),
  );

  console.log(`Created ${careTasks.length} care tasks for plant '${plant.id}'`);

  return careTasks;
}

/**
 * Protokolliert eine Ausführung. Eine wiederkehrende Aufgabe wird um ihr
 * Intervall verschoben, eine einmalige wird deaktiviert.
 */
export function completeCareTask(careTaskId: string): CareTaskRecord {
  const careTask = careTaskRepository.findById(careTaskId);
  if (!careTask) {
    throw new NotFoundError("CareTask", careTaskId);
  }

  if (!careTask.active) {
    throw new Error(`Care task '${careTaskId}' is not active`);
  }

  const completed: CareTaskRecord =
    careTask.interval === null
      ? { ...careTask, active: false }
      : {
          ...careTask,
          nextDueDate: addDays(careTask.nextDueDate, careTask.interval),
        };

  return careTaskRepository.save(completed);
}

export function getAllCareTasks(): CareTaskRecord[] {
  return careTaskRepository.findAllOrderedByNextDueDate();
}
