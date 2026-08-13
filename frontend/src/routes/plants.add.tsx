import { zodResolver } from "@hookform/resolvers/zod";
import { NewPlantRequest, PlantType } from "@plantify/contracts";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";

import { ownerQueries, useAddPlantMutation } from "../plant-queries";

export const Route = createFileRoute("/plants/add")({
  component: AddPlantComponent,
});

function AddPlantComponent() {
  const navigate = useNavigate();
  const {
    data: owners,
    isLoading: isLoadingOwners,
    error,
  } = useQuery(ownerQueries.list());

  console.log("Could not load owner", error);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<NewPlantRequest>({
    resolver: zodResolver(NewPlantRequest),
    defaultValues: {
      ownerId: "",
      plantType: "INDOOR",
    },
  });

  const mutation = useAddPlantMutation();

  const onSubmit = (data: NewPlantRequest) => {
    mutation.mutate(data, {
      onSuccess: () => {
        navigate({ to: "/" });
      },
    });
  };

  return (
    <div className="p-4">
      <h1 className="mb-4 text-2xl font-bold">Neue Pflanze anlegen</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="max-w-md space-y-4">
        <div>
          <label
            htmlFor="ownerId"
            className="block text-sm font-medium text-gray-700"
          >
            Owner
          </label>
          <select
            id="ownerId"
            {...register("ownerId")}
            disabled={isLoadingOwners}
            className="mt-1 block w-full rounded border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:bg-gray-100"
          >
            <option value="">
              {isLoadingOwners ? "Lade Owner..." : "Owner auswählen..."}
            </option>
            {owners?.map((owner) => (
              <option key={owner.id} value={owner.id}>
                {owner.name}
              </option>
            ))}
          </select>
          {errors.ownerId && (
            <p className="mt-1 text-sm text-red-600">
              {errors.ownerId.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Name
          </label>
          <input
            id="name"
            {...register("name")}
            className="mt-1 block w-full rounded border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="z.B. Monstera"
          />
          <div
            className={
              "mt-2 flex items-center justify-end gap-x-2 text-sm text-gray-500 [&>button]:cursor-pointer [&>button]:hover:text-blue-500"
            }
          >
            <button
              type={"button"}
              onClick={() => {
                setValue("name", "Tulpe");
              }}
            >
              Tulpe
            </button>
            <button
              type={"button"}
              onClick={() => {
                setValue("name", "Sonnenblume");
              }}
            >
              Sonnenblume
            </button>
            <button
              type={"button"}
              onClick={() => {
                setValue("name", "Rose");
              }}
            >
              Rose
            </button>
          </div>
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="plantType"
            className="block text-sm font-medium text-gray-700"
          >
            Pflanzentyp
          </label>
          <select
            id="plantType"
            {...register("plantType")}
            className="mt-1 block w-full rounded border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            {PlantType.options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          {errors.plantType && (
            <p className="mt-1 text-sm text-red-600">
              {errors.plantType.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="location"
            className="block text-sm font-medium text-gray-700"
          >
            Standort
          </label>
          <input
            id="location"
            {...register("location")}
            className="mt-1 block w-full rounded border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="z.B. Wohnzimmer"
          />
          <div
            className={
              "mt-2 flex items-center justify-end gap-x-2 text-sm text-gray-500 [&>button]:cursor-pointer [&>button]:hover:text-blue-500"
            }
          >
            <button
              type={"button"}
              onClick={() => {
                setValue("location", "Küche");
              }}
            >
              Küche
            </button>
            <button
              type={"button"}
              onClick={() => {
                setValue("location", "Schlafzimmer");
              }}
            >
              Schlafzimmer
            </button>
            <button
              type={"button"}
              onClick={() => {
                setValue("location", "Wohnzimmer");
              }}
            >
              Wohnzimmer
            </button>
          </div>
          {errors.location && (
            <p className="mt-1 text-sm text-red-600">
              {errors.location.message}
            </p>
          )}
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={mutation.isPending}
            className="w-full rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 disabled:opacity-50"
          >
            {mutation.isPending ? "Speichert..." : "Pflanze anlegen"}
          </button>
        </div>
        {mutation.isError && (
          <p className="mt-2 text-sm text-red-600">
            Fehler beim Speichern: {mutation.error.message}
          </p>
        )}
      </form>
    </div>
  );
}
