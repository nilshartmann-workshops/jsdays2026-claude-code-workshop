import { once } from "node:events";
import type { Server } from "node:http";
import type { AddressInfo } from "node:net";

import { CareTask, Plant } from "@plantify/contracts";
import { afterAll, beforeAll, beforeEach, expect, it } from "vitest";

import { createApp } from "../app.ts";
import { usageRepository } from "../billing/index.ts";
import { seedTestData } from "../seed.ts";

const CLARA = "85483586-044c-9778-73b1-6327133cf030";

let server: Server;
let baseUrl: string;

beforeAll(async () => {
  server = createApp().listen(0);
  await once(server, "listening");
  baseUrl = `http://localhost:${(server.address() as AddressInfo).port}`;
});

afterAll(() => {
  server.close();
});

beforeEach(() => {
  seedTestData();
});

function postPlant(body: unknown) {
  return fetch(`${baseUrl}/api/plants`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

it("registers a plant with its initial care tasks and a setup fee", async () => {
  const response = await postPlant({
    ownerId: CLARA,
    name: "Basilikum",
    plantType: "HERBS",
    location: "Küche",
  });

  expect(response.status).toBe(201);
  const plant = Plant.parse(await response.json());

  const careTasksResponse = await fetch(`${baseUrl}/api/care-tasks`);
  const careTasks = CareTask.array().parse(await careTasksResponse.json());
  expect(
    careTasks
      .filter((careTask) => careTask.plantId === plant.id)
      .map((careTask) => careTask.type)
      .sort(),
  ).toEqual(["REPOTTING", "WATERING"]);

  const currentMonth = new Date().toISOString().slice(0, 7);
  expect(
    usageRepository
      .findAllRecordedIn(currentMonth)
      .filter((usage) => usage.ownerId === CLARA)
      .map((usage) => usage.usageType),
  ).toEqual(["SETUP_FEE"]);
});

it("rejects a plant without a name", async () => {
  const response = await postPlant({
    ownerId: CLARA,
    name: "",
    plantType: "HERBS",
    location: "Küche",
  });

  expect(response.status).toBe(400);
});
