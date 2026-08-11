import type { ErrorRequestHandler } from "express";
import { ZodError } from "zod";

export class NotFoundError extends Error {
  constructor(resourceType: string, resourceId: string) {
    super(`${resourceType} with id '${resourceId}' not found`);
  }
}

/** Antwortet auf einen Fehler aus einer Route mit Status und Meldung als JSON. */
export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  if (error instanceof NotFoundError) {
    res.status(404).json({ message: error.message });
    return;
  }

  if (error instanceof ZodError) {
    res.status(400).json({ message: "Invalid request", issues: error.issues });
    return;
  }

  console.error(error);
  res.status(500).json({ message: "Internal server error" });
};
