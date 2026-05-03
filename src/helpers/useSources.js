import { createContext, useContext } from "react";

export const SourcesContext = createContext(null);

export function useSources() {
  return useContext(SourcesContext);
}
