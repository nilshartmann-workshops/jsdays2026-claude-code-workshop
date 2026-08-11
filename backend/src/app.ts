import express from "express";

import { ownerRoutes } from "./owner/index.ts";
import { plantRoutes } from "./plant/index.ts";
import { errorHandler } from "./shared/http.ts";

export function createApp() {
  const app = express();

  app.use(express.json());

  app.use("/api/owners", ownerRoutes);
  app.use("/api/plants", plantRoutes);

  app.use(errorHandler);

  return app;
}
