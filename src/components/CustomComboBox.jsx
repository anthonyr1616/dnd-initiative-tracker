import {
  Combobox,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
} from "@headlessui/react";
import { useState, useDeferredValue, useMemo } from "react";

function CustomComboBox({
  items,
  value,
  onChange,
  ariaLabel = "",
  placeholder = "",
  displayFunction = (item) => item?.name ?? "",
}) {
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);

  const MAX_RESULTS = 50;

  const { visibleItems, totalMatches } = useMemo(() => {
    if (deferredQuery === "") return { visibleItems: [], totalMatches: 0 };
    const matches = items.filter((item) =>
      item.name.toLowerCase().includes(deferredQuery.toLowerCase()),
    );
    return {
      visibleItems: matches.slice(0, MAX_RESULTS),
      totalMatches: matches.length,
    };
  }, [items, deferredQuery]);

  const displayText = value ? displayFunction(value) : "";
  const [_, source] = displayText.split(" - ", 2);

  return (
    <Combobox value={value} onChange={onChange} onClose={() => setQuery("")}>
      <div className="relative">
        <div className="flex w-full border rounded-lg px-3 py-2 shadow-sm bg-white focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-500">
          <ComboboxInput
            aria-label={ariaLabel}
            displayValue={(item) => item?.name ?? ""}
            onChange={(event) => setQuery(event.target.value)}
            className="flex-1 outline-none bg-transparent"
            placeholder={placeholder}
            autoComplete="off"
            autoFocus
          />
          {value && source && (
            <span className="text-gray-500 ml-1">- {source}</span>
          )}
        </div>
        <ComboboxOptions className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md border bg-white shadow-lg empty:invisible">
          {visibleItems.map((item) => (
            <ComboboxOption
              key={item.id}
              value={item}
              className="cursor-pointer px-3 py-2 data-[focus]:bg-blue-100"
            >
              {displayFunction(item)}
            </ComboboxOption>
          ))}
          {totalMatches > MAX_RESULTS && (
            <p className="px-3 py-2 text-xs text-gray-400 border-t">
              Showing {MAX_RESULTS} of {totalMatches} — keep typing to narrow
              results
            </p>
          )}
        </ComboboxOptions>
      </div>
    </Combobox>
  );
}

export default CustomComboBox;
