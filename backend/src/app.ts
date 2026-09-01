import express from "express";

import { invoiceRoutes } from "./billing/index.ts";
import { careTaskRoutes } from "./care/index.ts";
import { ownerRoutes } from "./owner/index.ts";
import { plantRoutes } from "./plant/index.ts";
import { errorHandler } from "./shared/http.ts";

export function createApp() {
  const app = express();

  app.use(express.json());

  app.use("/api/owners", ownerRoutes);
  app.use("/api/plants", plantRoutes);
  app.use("/api/care-tasks", careTaskRoutes);
  app.use("/api/invoices", invoiceRoutes);

  app.use(errorHandler);

  return app;
}
