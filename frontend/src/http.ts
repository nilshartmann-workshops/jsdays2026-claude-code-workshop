export class HttpError extends Error {
  readonly status: number;

  constructor(status: number, statusText: string) {
    super(`Request failed with HTTP ${status} ${statusText}`);
    this.name = "HttpError";
    this.status = status;
  }
}

type Schema<T> = { parse(data: unknown): T };

/**
 * Sendet die Anfrage und prüft die Antwort gegen das Schema. Ein Status
 * außerhalb von 2xx löst einen `HttpError` aus, weil `fetch` ihn als normale
 * Antwort liefert und der Fehler sonst erst beim Prüfen gegen das Schema
 * auffiele.
 */
export async function fetchJson<T>(
  url: string,
  schema: Schema<T>,
  init?: RequestInit,
): Promise<T> {
  const response = await fetch(url, init);

  if (!response.ok) {
    throw new HttpError(response.status, response.statusText);
  }

  return schema.parse(await response.json());
}

export function postJson<T>(
  url: string,
  schema: Schema<T>,
  body?: unknown,
): Promise<T> {
  return fetchJson(url, schema, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
}
