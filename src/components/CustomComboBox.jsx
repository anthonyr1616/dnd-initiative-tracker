import {
  Combobox,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
} from "@headlessui/react";
import { useState } from "react";

function CustomComboBox({
  items,
  value,
  onChange,
  ariaLabel = "",
  placeholder = "",
}) {
  const [query, setQuery] = useState("");

  const filteredItems =
    query === ""
      ? items
      : items.filter((item) =>
          item.name.toLowerCase().includes(query.toLowerCase())
        );

  return (
    <Combobox value={value} onChange={onChange} onClose={() => setQuery("")}>
      <div className="relative">
        <ComboboxInput
          aria-label={ariaLabel}
          displayValue={(item) => item?.name ?? ""}
          onChange={(event) => setQuery(event.target.value)}
          className="w-full border rounded-lg px-3 py-2 shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder={placeholder}
          autoComplete="off"
        />
        <ComboboxOptions className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md border bg-white shadow-lg empty:invisible">
          {filteredItems.map((item) => (
            <ComboboxOption
              key={item.id}
              value={item}
              className="cursor-pointer px-3 py-2 data-[focus]:bg-blue-100"
            >
              {item.name}
            </ComboboxOption>
          ))}
        </ComboboxOptions>
      </div>
    </Combobox>
  );
}

export default CustomComboBox;
