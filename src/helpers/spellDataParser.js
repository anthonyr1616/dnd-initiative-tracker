const SCHOOL_CODE_MAP = {
  A: "Abjuration",
  C: "Conjuration",
  D: "Divination",
  E: "Enchantment",
  V: "Evocation",
  I: "Illusion",
  N: "Necromancy",
  T: "Transmutation",
};

const SOURCE_FORMAT_MAP = {
  PHB: "PHB (2014)",
  XPHB: "PHB (2024)",
};

export function formatSource(source = "") {
  if (!source) return "";
  return SOURCE_FORMAT_MAP[source] || source;
}

export function createSpellId(name, source = "unknown") {
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  return `${source.toLowerCase()}-${slug}`;
}

export function parseTaggedText(text = "") {
  if (typeof text !== "string") {
    return String(text || "");
  }

  return text.replace(/\{@([^\s}]+)\s*([^}]*)\}/g, (_, _type, content) => {
    const textValue = content.split("|")[0]?.trim();
    return textValue || _type;
  });
}

function flattenEntry(entry, output) {
  if (!entry) {
    return;
  }

  if (typeof entry === "string") {
    const parsed = parseTaggedText(entry).trim();
    if (parsed) {
      output.push(parsed);
    }
    return;
  }

  if (Array.isArray(entry)) {
    entry.forEach((item) => flattenEntry(item, output));
    return;
  }

  if (entry.type === "entries" && entry.name) {
    output.push(`**${parseTaggedText(entry.name)}**`);
  }

  if (entry.entries) {
    flattenEntry(entry.entries, output);
    return;
  }

  if (entry.items) {
    entry.items.forEach((item) => {
      if (typeof item === "string") {
        output.push(`- ${parseTaggedText(item)}`);
      } else {
        flattenEntry(item, output);
      }
    });
    return;
  }

  if (entry.type === "table") {
    const title = entry.caption || entry.name || "Table";
    output.push(`**${parseTaggedText(title)}**`);

    if (entry.colLabels && entry.rows) {
      output.push(`| ${entry.colLabels.join(" | ")} |`);
      output.push(`| ${entry.colLabels.map(() => "---").join(" | ")} |`);
      entry.rows.forEach((row) => {
        const values = Object.values(row).map((value) =>
          parseTaggedText(String(value)),
        );
        output.push(`| ${values.join(" | ")} |`);
      });
    } else if (entry.rows) {
      entry.rows.forEach((row) => {
        const values = Object.values(row).map((value) =>
          parseTaggedText(String(value)),
        );
        output.push(values.join(" | "));
      });
    }
    return;
  }

  if (entry.name) {
    output.push(`**${parseTaggedText(entry.name)}**`);
  }

  if (entry.entry) {
    flattenEntry(entry.entry, output);
  }
}

export function parseSpellEntries(entries = []) {
  const paragraphs = [];
  flattenEntry(entries, paragraphs);
  return paragraphs;
}

export function formatSpellTime(time = []) {
  if (!Array.isArray(time) || time.length === 0) {
    return "";
  }

  return time
    .map((segment) => {
      const amount = segment.number ?? segment.amount ?? "";
      const unit = segment.unit || segment.type || "";
      return `${amount} ${unit}`.trim();
    })
    .filter(Boolean)
    .join(", ");
}

export function formatSpellRange(range) {
  if (!range || typeof range !== "object") {
    return "";
  }

  if (range.type === "self") {
    return "Self";
  }

  if (range.type === "special") {
    return range.special || "Special";
  }

  if (range.distance) {
    const amount = range.distance.amount;
    const unit = range.distance.type;
    const distance = [amount, unit].filter(Boolean).join(" ");
    if (range.type === "point") {
      return distance || "Point";
    }
    if (range.type === "radius") {
      return `${distance} radius`.trim();
    }
    return `${distance} ${range.type}`.trim();
  }

  return range.type || "";
}

export function formatSpellComponents(components = {}) {
  const list = [];
  if (components.v) list.push("V");
  if (components.s) list.push("S");
  if (components.m) list.push("M");

  const material = typeof components.m === "string" ? components.m : null;
  return { components: list, material };
}

export function formatSpellDuration(duration = []) {
  if (!Array.isArray(duration) || duration.length === 0) {
    return "";
  }

  return duration
    .map((segment) => {
      switch (segment.type) {
        case "instant":
          return "Instantaneous";
        case "timed": {
          const amount = segment.duration?.amount;
          const unit = segment.duration?.type;
          return [amount, unit].filter(Boolean).join(" ");
        }
        case "permanent":
          return "Permanent";
        case "special":
          return segment.special || "Special";
        default:
          return segment.type || "";
      }
    })
    .filter(Boolean)
    .join(", ");
}

export function mapSchoolCode(code = "") {
  if (!code) return "";
  return SCHOOL_CODE_MAP[code] || code;
}
