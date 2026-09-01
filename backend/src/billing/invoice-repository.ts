export type InvoiceItemRecord = {
  id: string;
  description: string;
  amountCents: number;
};

export type InvoiceRecord = {
  id: string;
  ownerId: string;
  ownerName: string;
  billingPeriod: string;
  amountCents: number;
  createdAt: string;
  items: InvoiceItemRecord[];
};

const invoices = new Map<string, InvoiceRecord>();

export const invoiceRepository = {
  save(invoice: InvoiceRecord): InvoiceRecord {
    invoices.set(invoice.id, invoice);
    return invoice;
  },

  findById(id: string): InvoiceRecord | undefined {
    return invoices.get(id);
  },

  findAllOrderedByCreatedAtDesc(): InvoiceRecord[] {
    return [...invoices.values()].sort((a, b) =>
      b.createdAt.localeCompare(a.createdAt),
    );
  },

  deleteAll() {
    invoices.clear();
  },
};
