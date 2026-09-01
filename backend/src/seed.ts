import { randomUUID } from "node:crypto";

import { invoiceRepository, usageRepository } from "./billing/index.ts";
import { careTaskRepository } from "./care/index.ts";
import { ownerRepository } from "./owner/index.ts";
import { plantRepository } from "./plant/index.ts";
import { addDays, today } from "./shared/dates.ts";

const ANNA = "1bb1c2c1-5927-ba26-701a-7b2ff9bf0e82";
const CLARA = "85483586-044c-9778-73b1-6327133cf030";
const TORE = "259ca287-08d0-50b0-3999-183b93e2e5bc";

const ROSE = "d1683726-2937-a842-3c94-2db853718890";
const CANNABIS = "da25dc26-b511-145b-8053-57befe00d56c";

/**
 * Ersetzt alle Daten durch die Testdaten. Fälligkeiten und Nutzungen liegen
 * relativ zum heutigen Tag, damit Kalender und Rechnungen immer etwas zeigen.
 */
export function seedTestData() {
  ownerRepository.deleteAll();
  plantRepository.deleteAll();
  careTaskRepository.deleteAll();
  usageRepository.deleteAll();
  invoiceRepository.deleteAll();

  ownerRepository.save({ id: ANNA, name: "Anna Schmidt" });
  ownerRepository.save({ id: CLARA, name: "Clara Jung" });
  ownerRepository.save({ id: TORE, name: "Tore Larson" });

  plantRepository.save({
    id: ROSE,
    ownerId: CLARA,
    name: "Meine Rose",
    plantType: "ROSES",
    location: "Garten, Südseite",
  });
  plantRepository.save({
    id: CANNABIS,
    ownerId: TORE,
    name: "Cannabis (nur für medizinische Zwecke)",
    plantType: "INDOOR",
    location: "Wohnzimmer, Fensterbank",
  });

  const careTask = (
    plantId: string,
    type: "WATERING" | "PRUNING" | "REPOTTING",
    dueInDays: number,
    interval: number | null,
  ) =>
    careTaskRepository.save({
      id: randomUUID(),
      plantId,
      type,
      source: "SYSTEM",
      nextDueDate: addDays(today(), dueInDays),
      interval,
      active: true,
    });

  careTask(ROSE, "WATERING", 8, 5);
  careTask(ROSE, "PRUNING", 7, null);
  careTask(CANNABIS, "WATERING", 10, 2);
  careTask(CANNABIS, "REPOTTING", 11, null);

  const usage = (
    ownerId: string,
    usageType: "SETUP_FEE" | "CARE_TASK_COMPLETED",
    costCents: number,
    monthsAgo: number,
    day: number,
  ) => {
    const now = new Date();
    const recordedAt = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - monthsAgo, day, 9),
    );
    usageRepository.save({
      id: randomUUID(),
      ownerId,
      usageType,
      recordedAt: recordedAt.toISOString(),
      costCents,
    });
  };

  usage(CLARA, "SETUP_FEE", 1000, 2, 3);
  usage(TORE, "SETUP_FEE", 1000, 2, 12);
  usage(CLARA, "CARE_TASK_COMPLETED", 50, 1, 5);
  usage(CLARA, "CARE_TASK_COMPLETED", 400, 1, 9);
  usage(TORE, "CARE_TASK_COMPLETED", 50, 1, 20);
}
