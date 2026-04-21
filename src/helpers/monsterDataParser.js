const SIZE_MAP = {
  T: "Tiny",
  S: "Small",
  M: "Medium",
  L: "Large",
  H: "Huge",
  G: "Gargantuan",
};

const ALIGNMENT_MAP = {
  L: "Lawful",
  N: "Neutral",
  NX: "Neutral",
  NY: "Neutral",
  C: "Chaotic",
  G: "Good",
  E: "Evil",
  A: "Any Alignment",
  U: "Unaligned",
};

export function formatSize(size = "") {
  return SIZE_MAP[size] || size;
}

export function formatAlignment(alignment = []) {
  if (!alignment.length) return "";
  const mapped = alignment.map((a) => ALIGNMENT_MAP[a] || a);
  // Deduplicate (e.g. ["N","N"] → "Neutral")
  const deduped = mapped.filter((v, i, arr) => arr.indexOf(v) === i);
  return deduped.join(" ");
}

const SOURCE_FORMAT_MAP = {
  MM: "Monster Manual (2014)",
  XMM: "Monster Manual (2024)",
};

const ABILITY_MAP = {
  str: "Strength",
  dex: "Dexterity",
  con: "Constitution",
  int: "Intelligence",
  wis: "Wisdom",
  cha: "Charisma",
};

const ORDINAL_MAP = { 1: "First", 2: "Second", 3: "Third" };

export function formatMonsterSource(source = "") {
  if (!source) return "";
  return SOURCE_FORMAT_MAP[source] || source;
}

export function parseMonsterTaggedText(text = "") {
  if (typeof text !== "string") return String(text || "");

  return text.replace(/\{@([^\s}]+)\s*([^}]*)\}/g, (_, type, rawContent) => {
    const first = rawContent.trim().split("|")[0]?.trim() || "";

    switch (type) {
      case "hit":
        return `+${first}`;
      case "h":
        return "Hit:";
      case "damage":
      case "dice":
      case "scaledice":
        return first;
      case "dc":
        return `DC ${first}`;
      case "actSave": {
        const ability = ABILITY_MAP[first.toLowerCase()] || first;
        return `${ability} Saving Throw:`;
      }
      case "actSaveFail":
        return first ? `${ORDINAL_MAP[Number(first)] || first} Failure:` : "Failure:";
      case "actSaveSuccess":
        return "Success:";
      case "actSaveSuccessOrFail":
        return "Failure or Success:";
      case "atkr":
        return first === "r" ? "Ranged Attack Roll:" : "Melee Attack Roll:";
      case "atk":
        return first.includes("r") ? "Ranged Weapon Attack:" : "Melee Weapon Attack:";
      case "recharge":
        return first ? `(Recharge ${first}-6)` : "(Recharge)";
      case "condition":
      case "variantrule":
      case "status":
      case "skill":
      case "sense":
        return first;
      default:
        return first || type;
    }
  });
}

function flattenMonsterEntry(entry, output) {
  if (!entry) return;

  if (typeof entry === "string") {
    const parsed = parseMonsterTaggedText(entry).trim();
    if (parsed) output.push(parsed);
    return;
  }

  if (Array.isArray(entry)) {
    entry.forEach((item) => flattenMonsterEntry(item, output));
    return;
  }

  // Named list item (list-hang-notitle) — stored as object so the name can be bolded
  if (entry.type === "item" && entry.name) {
    const itemName = parseMonsterTaggedText(entry.name);
    const descParts = [];
    if (entry.entries) flattenMonsterEntry(entry.entries, descParts);
    else if (entry.entry) flattenMonsterEntry(entry.entry, descParts);
    output.push({ itemName, text: descParts.join(" ") });
    return;
  }

  if (entry.type === "entries" && entry.name) {
    output.push(`**${parseMonsterTaggedText(entry.name)}**`);
  }

  if (entry.entries) {
    flattenMonsterEntry(entry.entries, output);
    return;
  }

  if (entry.items) {
    entry.items.forEach((item) => {
      if (typeof item === "string") {
        output.push(parseMonsterTaggedText(item));
      } else {
        flattenMonsterEntry(item, output);
      }
    });
    return;
  }

  if (entry.type === "table") {
    const title = entry.caption || entry.name || "Table";
    output.push(`**${parseMonsterTaggedText(title)}**`);
    if (entry.colLabels && entry.rows) {
      output.push(`| ${entry.colLabels.join(" | ")} |`);
      output.push(`| ${entry.colLabels.map(() => "---").join(" | ")} |`);
      entry.rows.forEach((row) => {
        const values = Object.values(row).map((v) =>
          parseMonsterTaggedText(String(v))
        );
        output.push(`| ${values.join(" | ")} |`);
      });
    }
    return;
  }

  if (entry.name) {
    output.push(`**${parseMonsterTaggedText(entry.name)}**`);
  }

  if (entry.entry) {
    flattenMonsterEntry(entry.entry, output);
  }
}

export function parseMonsterEntries(entries = []) {
  const paragraphs = [];
  flattenMonsterEntry(entries, paragraphs);
  return paragraphs;
}
