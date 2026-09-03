import {
  type BillingPeriod,
  Invoice,
  InvoiceDetails,
} from "@plantify/contracts";
import {
  queryOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { fetchJson, postJson } from "./http.ts";

export const invoiceQueries = {
  all: () => ["invoices"] as const,
  list: () =>
    queryOptions({
      queryKey: invoiceQueries.all(),
      queryFn: () => fetchJson("/api/invoices", Invoice.array()),
    }),
  detail: (id: string) =>
    queryOptions({
      queryKey: [...invoiceQueries.all(), id] as const,
      queryFn: () => fetchJson(`/api/invoices/${id}`, InvoiceDetails),
    }),
};

export function useGenerateInvoicesMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (billingPeriod: BillingPeriod) =>
      postJson("/api/invoices", Invoice.array(), { billingPeriod }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: invoiceQueries.all() });
    },
  });
}
