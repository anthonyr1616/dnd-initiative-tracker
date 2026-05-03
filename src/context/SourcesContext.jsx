import { useState } from "react";
import { SourcesContext } from "../helpers/useSources";

const DEFAULT_SOURCES = ["XPHB", "XDMG", "XMM"];
const STORAGE_KEY = "dnd-initiative-tracker-sources";

export function SourcesProvider({ children }) {
  const [selectedSources, setSelectedSources] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      console.error("Failed to load selected sources from localStorage");
    }
    return DEFAULT_SOURCES;
  });

  function updateSources(sources) {
    setSelectedSources(sources);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sources));
    } catch {
      console.error("Failed to save selected sources to localStorage");
    }
  }

  return (
    <SourcesContext.Provider
      value={{ selectedSources, setSelectedSources: updateSources }}
    >
      {children}
    </SourcesContext.Provider>
  );
}
