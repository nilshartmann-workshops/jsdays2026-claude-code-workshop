import type { CareTaskSource, CareTaskType } from "@plantify/contracts";

export type CareTaskRecord = {
  id: string;
  plantId: string;
  type: CareTaskType;
  source: CareTaskSource;
  nextDueDate: string;
  /** Abstand in Tagen; null bei einer einmaligen Aufgabe */
  interval: number | null;
  active: boolean;
};

const careTasks = new Map<string, CareTaskRecord>();

export const careTaskRepository = {
  save(careTask: CareTaskRecord): CareTaskRecord {
    careTasks.set(careTask.id, careTask);
    return careTask;
  },

  findById(id: string): CareTaskRecord | undefined {
    return careTasks.get(id);
  },

  findAllOrderedByNextDueDate(): CareTaskRecord[] {
    return [...careTasks.values()].sort((a, b) =>
      a.nextDueDate.localeCompare(b.nextDueDate),
    );
  },

  deleteAll() {
    careTasks.clear();
  },
};
