import { type NewPlantRequest, Owner, Plant } from "@plantify/contracts";
import {
  queryOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { fetchJson, postJson } from "./http.ts";

export const ownerQueries = {
  all: () => ["owners"] as const,
  list: () =>
    queryOptions({
      queryKey: ownerQueries.all(),
      queryFn: () => fetchJson("/api/owners", Owner.array()),
    }),
};

export const plantQueries = {
  all: () => ["plants"] as const,
};

export function useAddPlantMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newPlant: NewPlantRequest) =>
      postJson("/api/plants", Plant, newPlant),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: plantQueries.all() });
    },
  });
}
