import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";

import { invoiceQueries } from "../../invoice-queries.ts";

export const Route = createFileRoute("/invoice/$invoiceId")({
  component: InvoiceDetailComponent,
});

function InvoiceDetailComponent() {
  const { invoiceId } = Route.useParams();
  const {
    data: invoice,
    isLoading,
    isError,
  } = useQuery(invoiceQueries.detail(invoiceId));

  if (isLoading) {
    return <div className="p-4 text-gray-500">Lade Rechnung...</div>;
  }

  if (isError || !invoice) {
    return <div className="p-4 text-red-600">Rechnung nicht gefunden.</div>;
  }

  const createdDate = new Date(invoice.createdAt).toLocaleDateString("de-DE", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="p-4">
      <Link
        to="/invoice"
        className="mb-4 inline-block text-sm text-green-700 hover:underline"
      >
        ← Zurück zur Übersicht
      </Link>

      <h1 className="mt-2 mb-1 text-2xl font-bold">
        Rechnung {invoice.ownerName}
      </h1>
      <p className="mb-1 text-gray-600">
        Abrechnungszeitraum:{" "}
        <span className="font-medium">{invoice.billingPeriod}</span>
      </p>
      <p className="mb-6 text-sm text-gray-500">Erstellt am: {createdDate}</p>

      <table className="mb-4 w-full max-w-lg border-collapse text-sm">
        <thead>
          <tr className="border-b border-gray-200 text-left text-gray-600">
            <th className="py-2 pr-4 font-medium">Beschreibung</th>
            <th className="py-2 text-right font-medium">Betrag</th>
          </tr>
        </thead>
        <tbody>
          {invoice.items.map((item) => (
            <tr key={item.id} className="border-b border-gray-100">
              <td className="py-2 pr-4">{item.description}</td>
              <td className="py-2 text-right">{item.amount.toFixed(2)} €</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="font-semibold">
            <td className="pt-3 pr-4">Gesamt</td>
            <td className="pt-3 text-right">{invoice.amount.toFixed(2)} €</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
