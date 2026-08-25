import {
  CareTask,
  type NewPlantRequest,
  Owner,
  Plant,
} from "@plantify/contracts";
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
  detail: (id: string) =>
    queryOptions({
      queryKey: [...ownerQueries.all(), id] as const,
      queryFn: () => fetchJson(`/api/owners/${id}`, Owner),
    }),
};

export const plantQueries = {
  all: () => ["plants"] as const,
  detail: (id: string) =>
    queryOptions({
      queryKey: [...plantQueries.all(), id] as const,
      queryFn: () => fetchJson(`/api/plants/${id}`, Plant),
    }),
};

export const careTaskQueries = {
  all: () => ["care-tasks"] as const,
  list: () =>
    queryOptions({
      queryKey: careTaskQueries.all(),
      queryFn: () => fetchJson("/api/care-tasks", CareTask.array()),
    }),
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

export function useCompleteCareTaskMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      postJson(`/api/care-tasks/${id}/complete`, CareTask),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: careTaskQueries.all() });
    },
  });
}
