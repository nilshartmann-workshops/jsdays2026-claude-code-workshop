import type { Plant } from "@plantify/contracts";
import { QueryClient } from "@tanstack/react-query";
import { afterEach, expect, it, vi } from "vitest";
import { ZodError } from "zod";

import { HttpError } from "./http.ts";
import { plantQueries } from "./plant-queries.ts";

const plant: Plant = {
  id: "plant-1",
  ownerId: "owner-1",
  name: "Basilikum",
  plantType: "HERBS",
  location: "Küche",
};

function respondWith(response: Response) {
  const fetchMock = vi.fn(async () => response);
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

afterEach(() => {
  vi.unstubAllGlobals();
});

it("loads a plant by its id", async () => {
  const fetchMock = respondWith(Response.json(plant));

  const result = await new QueryClient().fetchQuery(
    plantQueries.detail("plant-1"),
  );

  expect(result).toEqual(plant);
  expect(fetchMock).toHaveBeenCalledWith("/api/plants/plant-1", undefined);
});

it("rejects a plant that does not match the contract", async () => {
  respondWith(Response.json({ ...plant, plantType: "TREE" }));

  await expect(
    new QueryClient().fetchQuery(plantQueries.detail("plant-1")),
  ).rejects.toBeInstanceOf(ZodError);
});

it("reports an unknown plant with its HTTP status", async () => {
  respondWith(new Response(null, { status: 404, statusText: "Not Found" }));

  const error = await new QueryClient()
    .fetchQuery(plantQueries.detail("unknown"))
    .catch((e: unknown) => e);

  expect(error).toBeInstanceOf(HttpError);
  expect(error).toMatchObject({ status: 404 });
});
