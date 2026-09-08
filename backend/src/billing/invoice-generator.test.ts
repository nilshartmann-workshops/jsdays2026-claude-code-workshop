import { beforeEach, expect, it } from "vitest";

import { ownerRepository } from "../owner/index.ts";
import { generateInvoices } from "./invoice-generator.ts";
import { invoiceRepository } from "./invoice-repository.ts";
import { type UsageRecord, usageRepository } from "./usage-repository.ts";

const ANNA = "owner-anna";
const TORE = "owner-tore";

function usage(
  ownerId: string,
  recordedAt: string,
  costCents: number,
): UsageRecord {
  return {
    id: `${ownerId}-${recordedAt}`,
    ownerId,
    usageType: "CARE_TASK_COMPLETED",
    recordedAt,
    costCents,
  };
}

beforeEach(() => {
  ownerRepository.deleteAll();
  usageRepository.deleteAll();
  invoiceRepository.deleteAll();

  ownerRepository.save({ id: ANNA, name: "Anna Schmidt" });
  ownerRepository.save({ id: TORE, name: "Tore Larson" });

  // Die Nutzungen am Rand des Monats zeigen, dass nur der August zählt.
  usageRepository.save(usage(ANNA, "2026-07-31T23:59:59.000Z", 999));
  usageRepository.save(usage(ANNA, "2026-08-01T00:00:00.000Z", 1000));
  usageRepository.save(usage(ANNA, "2026-08-20T10:00:00.000Z", 50));
  usageRepository.save(usage(TORE, "2026-08-31T23:59:59.000Z", 400));
  usageRepository.save(usage(TORE, "2026-09-01T00:00:00.000Z", 999));
});

it("creates one invoice per owner with the usages of the billing period", () => {
  const invoices = generateInvoices("2026-08");

  expect(
    invoices.map((invoice) => ({
      ownerName: invoice.ownerName,
      amountCents: invoice.amountCents,
      itemCount: invoice.items.length,
    })),
  ).toEqual([
    { ownerName: "Anna Schmidt", amountCents: 1050, itemCount: 2 },
    { ownerName: "Tore Larson", amountCents: 400, itemCount: 1 },
  ]);
});

it("creates no invoice for a billing period without usages", () => {
  expect(generateInvoices("2026-06")).toEqual([]);
});
