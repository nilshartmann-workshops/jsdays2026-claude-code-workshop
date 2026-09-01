import { randomUUID } from "node:crypto";

import type { BillingPeriod } from "@plantify/contracts";

import { ownerRepository } from "../owner/index.ts";
import { type InvoiceRecord, invoiceRepository } from "./invoice-repository.ts";
import { usageRepository } from "./usage-repository.ts";

/**
 * Erzeugt für jeden Owner mit Nutzungen im Monat eine Rechnung. Jede Nutzung
 * wird zu einem Posten.
 */
export function generateInvoices(billingPeriod: BillingPeriod): InvoiceRecord[] {
  const usageRecords = usageRepository.findAllRecordedIn(billingPeriod);
  const ownerIds = new Set(usageRecords.map((usage) => usage.ownerId));
  const createdAt = new Date().toISOString();

  return [...ownerIds].map((ownerId) => {
    const owner = ownerRepository.findById(ownerId);
    if (!owner) {
      throw new Error(`No owner with id '${ownerId}'`);
    }

    const items = usageRecords
      .filter((usage) => usage.ownerId === ownerId)
      .map((usage) => ({
        id: randomUUID(),
        description: usage.usageType,
        amountCents: usage.costCents,
      }));

    const invoice = invoiceRepository.save({
      id: randomUUID(),
      ownerId,
      ownerName: owner.name,
      billingPeriod,
      amountCents: items.reduce((sum, item) => sum + item.amountCents, 0),
      createdAt,
      items,
    });

    console.log(
      `Invoice created for owner '${owner.name}', period ${billingPeriod}, amount ${invoice.amountCents} cents`,
    );

    return invoice;
  });
}
