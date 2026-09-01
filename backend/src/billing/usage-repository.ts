export type UsageType = "SETUP_FEE" | "CARE_TASK_COMPLETED";

export type UsageRecord = {
  id: string;
  ownerId: string;
  usageType: UsageType;
  /** Zeitpunkt in UTC, zum Beispiel "2026-09-15T08:30:00.000Z" */
  recordedAt: string;
  costCents: number;
};

const usageRecords = new Map<string, UsageRecord>();

export const usageRepository = {
  save(usageRecord: UsageRecord): UsageRecord {
    usageRecords.set(usageRecord.id, usageRecord);
    return usageRecord;
  },

  /** Liefert die Nutzungen eines Monats, zum Beispiel "2026-09". */
  findAllRecordedIn(billingPeriod: string): UsageRecord[] {
    return [...usageRecords.values()].filter((usageRecord) =>
      usageRecord.recordedAt.startsWith(billingPeriod),
    );
  },

  deleteAll() {
    usageRecords.clear();
  },
};
