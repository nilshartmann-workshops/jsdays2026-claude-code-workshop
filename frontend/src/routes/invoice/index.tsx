import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";

import {
  invoiceQueries,
  useGenerateInvoicesMutation,
} from "../../invoice-queries.ts";

export const Route = createFileRoute("/invoice/")({
  component: InvoiceComponent,
});

/** Der Vormonat im Format von `<input type="month">`, zum Beispiel "2026-08" */
function previousMonth() {
  const date = new Date();
  date.setDate(1);
  date.setMonth(date.getMonth() - 1);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function InvoiceComponent() {
  const [billingPeriod, setBillingPeriod] = useState(previousMonth);
  const mutation = useGenerateInvoicesMutation();

  const invoicesQuery = useQuery(invoiceQueries.list());

  return (
    <div className="p-4">
      <h1 className="mb-6 text-2xl font-bold">Rechnungen</h1>

      <div className="max-w-md space-y-4">
        <div>
          <label
            htmlFor="billingPeriod"
            className="block text-sm font-medium text-gray-700"
          >
            Abrechnungszeitraum
          </label>
          <input
            id="billingPeriod"
            type="month"
            value={billingPeriod}
            onChange={(e) => setBillingPeriod(e.target.value)}
            className="mt-1 block w-full rounded border border-gray-300 p-2 shadow-sm focus:border-green-500 focus:ring-green-500"
          />
        </div>
        <button
          onClick={() => mutation.mutate(billingPeriod)}
          disabled={mutation.isPending || !billingPeriod}
          className="rounded-lg bg-green-600 px-4 py-2 font-semibold text-white shadow-md transition-colors duration-200 hover:bg-green-700 hover:shadow-lg disabled:cursor-default disabled:hover:bg-green-600 disabled:hover:shadow-none"
        >
          {mutation.isPending ? "Erzeuge Rechnungen..." : "Rechnungen erzeugen"}
        </button>
        {mutation.isSuccess && (
          <div>✅ {mutation.data.length} Rechnung(en) erzeugt</div>
        )}
        {mutation.isError && (
          <div className="rounded border border-red-200 bg-red-50 p-4 text-red-700">
            Fehler: {mutation.error.message}
          </div>
        )}
      </div>

      <div className="mt-8">
        {invoicesQuery.isLoading && (
          <p className="text-gray-500">Lade Rechnungen...</p>
        )}
        {invoicesQuery.isError && (
          <p className="text-red-600">Fehler beim Laden der Rechnungen.</p>
        )}
        {invoicesQuery.data && invoicesQuery.data.length === 0 && (
          <p className="text-gray-500">Noch keine Rechnungen vorhanden.</p>
        )}
        {invoicesQuery.data && invoicesQuery.data.length > 0 && (
          <table className="w-full max-w-lg border-collapse text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-left text-gray-600">
                <th className="py-2 pr-4 font-medium">Owner</th>
                <th className="py-2 pr-4 font-medium">Abrechnungszeitraum</th>
                <th className="py-2 text-right font-medium">Betrag</th>
              </tr>
            </thead>
            <tbody>
              {invoicesQuery.data.map((invoice) => (
                <tr
                  key={invoice.id}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <td className="py-2 pr-4 text-gray-700">
                    {invoice.ownerName}
                  </td>
                  <td className="py-2 pr-4">
                    <Link
                      to="/invoice/$invoiceId"
                      params={{ invoiceId: invoice.id }}
                      className="text-green-700 hover:underline"
                    >
                      {invoice.billingPeriod}
                    </Link>
                  </td>
                  <td className="py-2 text-right">
                    {invoice.amount.toFixed(2)} €
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
