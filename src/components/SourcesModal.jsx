import { useState, useMemo, useRef } from "react";
import { X } from "lucide-react";
import { SOURCE_FORMAT_MAP } from "../helpers/sourceMap";
import styles from "./SourcesModal.module.css";

const SOURCE_GROUPS = [
  {
    id: "core2024",
    label: "2024 Core Rules",
    sources: ["XPHB", "XDMG", "XMM"],
  },
  {
    id: "core2014",
    label: "2014 Core Rules",
    sources: ["PHB", "DMG", "MM"],
  },
  {
    id: "supplements",
    label: "Supplements",
    sources: [
      "XGE",
      "TCE",
      "SCAG",
      "VGM",
      "MTF",
      "MPMM",
      "FTD",
      "SCC",
      "SAiS",
      "BAM",
      "MOT",
      "GGR",
      "ERLW",
      "EGW",
      "AI",
      "MaBJoV",
      "BGG",
      "BMT",
      "MCV4EC",
      "LR",
      "MCV1SC",
      "VRGR",
      "ESK",
      "FRAiF",
      "SADS",
    ],
  },
  {
    id: "adventures",
    label: "Adventures",
    sources: [
      "LMoP",
      "HotDQ",
      "RoT",
      "PotA",
      "OotA",
      "CoS",
      "SKT",
      "TftYP",
      "ToA",
      "WDH",
      "WDotMM",
      "GoS",
      "BGDIA",
      "IDRotF",
      "KftGV",
      "PaBTSO",
      "QftIS",
      "VEoR",
      "WDMM",
      "IMR",
      "LoX",
      "CoA",
      "CRCotN",
      "JttRC",
      "WBtW",
      "GotSF",
      "DSotDQ",
      "KKW",
      "OoW",
      "ToFW",
      "LLK",
      "DC",
      "SDW",
      "SLW",
      "DoSI",
    ],
  },
  {
    id: "planeshifts",
    label: "Plane Shifts",
    sources: ["PSI", "PSZ", "PSA", "PSK", "PSX", "PSD"],
  },
];

const ALL_SOURCES = SOURCE_GROUPS.flatMap((g) => g.sources);

export default function SourcesModal({
  selectedSources,
  onSourcesChange,
  onClose,
}) {
  const [search, setSearch] = useState("");
  const selectedSet = new Set(selectedSources);

  const filteredGroups = useMemo(() => {
    if (!search.trim()) return SOURCE_GROUPS;
    const q = search.toLowerCase();
    return SOURCE_GROUPS.map((group) => ({
      ...group,
      sources: group.sources.filter((code) => {
        const fullName = SOURCE_FORMAT_MAP[code] || code;
        return (
          code.toLowerCase().includes(q) || fullName.toLowerCase().includes(q)
        );
      }),
    })).filter((group) => group.sources.length > 0);
  }, [search]);

  const allSelected = ALL_SOURCES.every((s) => selectedSet.has(s));
  const noneSelected = selectedSources.length === 0;

  function toggleSource(code) {
    if (selectedSet.has(code)) {
      onSourcesChange(selectedSources.filter((s) => s !== code));
    } else {
      onSourcesChange([...selectedSources, code]);
    }
  }

  function toggleGroup(group) {
    const allGroupSelected = group.sources.every((s) => selectedSet.has(s));
    if (allGroupSelected) {
      const groupSet = new Set(group.sources);
      onSourcesChange(selectedSources.filter((s) => !groupSet.has(s)));
    } else {
      const combined = new Set([...selectedSources, ...group.sources]);
      onSourcesChange([...combined]);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className={`rounded-xl p-6 w-full max-w-lg mx-4 flex flex-col max-h-[80vh] ${styles.modal}`}
      >
        <div className="flex items-center justify-between mb-3">
          <h2 className={`text-lg font-semibold ${styles.title}`}>
            Source Settings
          </h2>
          <button
            type="button"
            onClick={onClose}
            className={styles.closeBtn}
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className={`text-sm mb-3 ${styles.description}`}>
          Select which sourcebooks appear in monster and spell searches.
        </p>

        <input
          type="text"
          placeholder="Filter sources..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={`rounded-md border px-3 py-2 text-sm mb-3 w-full ${styles.searchInput}`}
        />

        <div
          className={`flex items-center gap-2 mb-3 pb-3 ${styles.controlsRow}`}
        >
          <button
            type="button"
            onClick={() => onSourcesChange([...ALL_SOURCES])}
            disabled={allSelected}
            className={`text-xs px-3 py-1.5 rounded-md font-medium ${styles.selectAllBtn}`}
          >
            Select All
          </button>
          <button
            type="button"
            onClick={() => onSourcesChange([])}
            disabled={noneSelected}
            className={`text-xs px-3 py-1.5 rounded-md font-medium ${styles.clearAllBtn}`}
          >
            Clear All
          </button>
          <span className={`text-xs ml-auto ${styles.countText}`}>
            {selectedSources.length} / {ALL_SOURCES.length} selected
          </span>
        </div>

        <div className="overflow-y-auto flex-1 pr-1">
          {filteredGroups.map((group) => {
            const allGroupSelected = group.sources.every((s) =>
              selectedSet.has(s),
            );
            const someGroupSelected = group.sources.some((s) =>
              selectedSet.has(s),
            );
            return (
              <div key={group.id} className="mb-5">
                <GroupHeader
                  group={group}
                  allGroupSelected={allGroupSelected}
                  someGroupSelected={someGroupSelected}
                  onToggle={() => toggleGroup(group)}
                />
                <div className="grid grid-cols-1 gap-0.5 pl-6 mt-1">
                  {group.sources.map((code) => (
                    <label
                      key={code}
                      className={`flex items-center gap-2 py-1 px-1 rounded cursor-pointer ${styles.sourceRow}`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedSet.has(code)}
                        onChange={() => toggleSource(code)}
                        className={styles.checkbox}
                      />
                      <span
                        className={`text-xs font-mono flex-shrink-0 w-16 ${styles.sourceCode}`}
                      >
                        {code}
                      </span>
                      <span className={`text-xs truncate ${styles.sourceName}`}>
                        {SOURCE_FORMAT_MAP[code] || code}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function GroupHeader({ group, allGroupSelected, someGroupSelected, onToggle }) {
  const ref = useRef(null);

  const setRef = (el) => {
    if (el) {
      el.indeterminate = someGroupSelected && !allGroupSelected;
      ref.current = el;
    }
  };

  return (
    <div className={`flex items-center gap-2 pb-1 ${styles.groupHeader}`}>
      <input
        type="checkbox"
        id={`group-${group.id}`}
        ref={setRef}
        checked={allGroupSelected}
        onChange={onToggle}
        className={styles.checkbox}
      />
      <label
        htmlFor={`group-${group.id}`}
        className={`text-xs font-semibold uppercase tracking-wide cursor-pointer ${styles.groupLabel}`}
      >
        {group.label}
      </label>
    </div>
  );
}
