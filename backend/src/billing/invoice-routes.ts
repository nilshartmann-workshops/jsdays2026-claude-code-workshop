import {
  GenerateInvoicesRequest,
  type Invoice,
  type InvoiceDetails,
} from "@plantify/contracts";
import { Router } from "express";

import { NotFoundError } from "../shared/http.ts";
import { generateInvoices } from "./invoice-generator.ts";
import { type InvoiceRecord, invoiceRepository } from "./invoice-repository.ts";

export const invoiceRoutes = Router();

invoiceRoutes.get("/", (_req, res) => {
  res.json(invoiceRepository.findAllOrderedByCreatedAtDesc().map(toInvoice));
});

invoiceRoutes.get("/:invoiceId", (req, res) => {
  const invoice = invoiceRepository.findById(req.params.invoiceId);
  if (!invoice) {
    throw new NotFoundError("Invoice", req.params.invoiceId);
  }

  res.json(toInvoiceDetails(invoice));
});

invoiceRoutes.post("/", (req, res) => {
  const { billingPeriod } = GenerateInvoicesRequest.parse(req.body);

  res.status(201).json(generateInvoices(billingPeriod).map(toInvoice));
});

function toInvoice(invoice: InvoiceRecord): Invoice {
  return {
    id: invoice.id,
    ownerId: invoice.ownerId,
    ownerName: invoice.ownerName,
    billingPeriod: invoice.billingPeriod,
    amount: invoice.amountCents / 100,
    createdAt: invoice.createdAt,
  };
}

function toInvoiceDetails(invoice: InvoiceRecord): InvoiceDetails {
  return {
    ...toInvoice(invoice),
    items: invoice.items.map((item) => ({
      id: item.id,
      description: item.description,
      amount: item.amountCents / 100,
    })),
  };
}
