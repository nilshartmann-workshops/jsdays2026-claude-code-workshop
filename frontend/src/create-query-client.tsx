import { QueryClient } from "@tanstack/react-query";

export const createQueryClient = () => {
  // Fragt weder nach einem Fehler noch beim Wechsel ins Fenster erneut an.
  // Ein Fehler erscheint so sofort, und das Backend bekommt nur die Anfragen,
  // die eine Seite beim Rendern auslöst.
  return new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnMount: true,
        refetchIntervalInBackground: false,
        refetchOnWindowFocus: false,
        retry: false,
      },
    },
  });
};
