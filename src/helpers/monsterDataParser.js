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

const CR_XP_MAP = {
  "0": 10, "1/8": 25, "1/4": 50, "1/2": 100,
  "1": 200, "2": 450, "3": 700, "4": 1100,
  "5": 1800, "6": 2300, "7": 2900, "8": 3900,
  "9": 5000, "10": 5900, "11": 7200, "12": 8400,
  "13": 10000, "14": 11500, "15": 13000, "16": 15000,
  "17": 18000, "18": 20000, "19": 22000, "20": 25000,
  "21": 33000, "22": 41000, "23": 50000, "24": 62000,
  "25": 75000, "26": 90000, "27": 105000, "28": 120000,
  "29": 135000, "30": 155000,
};

function crToNumber(cr = "") {
  if (cr === "1/8") return 0.125;
  if (cr === "1/4") return 0.25;
  if (cr === "1/2") return 0.5;
  return Number(cr) || 0;
}

function crToPb(cr = "") {
  const n = crToNumber(cr);
  if (n <= 4) return 2;
  if (n <= 8) return 3;
  if (n <= 12) return 4;
  if (n <= 16) return 5;
  if (n <= 20) return 6;
  if (n <= 24) return 7;
  if (n <= 28) return 8;
  return 9;
}

export function formatChallengeRating(cr, xp, xpLair) {
  if (!cr && cr !== "0") return "";
  const crStr = String(cr);
  const baseXp = xp ?? CR_XP_MAP[crStr];
  const pb = crToPb(crStr);
  const fmt = (n) => n?.toLocaleString();

  const xpPart = baseXp != null
    ? xpLair != null
      ? `XP ${fmt(baseXp)}, or ${fmt(xpLair)} in lair`
      : `XP ${fmt(baseXp)}`
    : null;

  const parts = [xpPart, `PB +${pb}`].filter(Boolean);
  return parts.length ? `${crStr} (${parts.join("; ")})` : crStr;
}

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

import { formatSource } from "./sourceMap.js";

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
  return formatSource(source);
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

function parseSpellRefs(refs = []) {
  return refs.map((r) => parseMonsterTaggedText(r)).join(", ");
}

export function parseSpellcasting(spellcastingArray = []) {
  return spellcastingArray.map((entry) => {
    const paragraphs = [];

    if (entry.headerEntries) {
      flattenMonsterEntry(entry.headerEntries, paragraphs);
    }

    if (entry.will?.length) {
      paragraphs.push(`At will: ${parseSpellRefs(entry.will)}`);
    }

    if (entry.daily) {
      for (const [key, spells] of Object.entries(entry.daily)) {
        const count = key.replace("e", "");
        const each = key.endsWith("e") || spells.length > 1 ? " each" : "";
        paragraphs.push(`${count}/day${each}: ${parseSpellRefs(spells)}`);
      }
    }

    if (entry.rest) {
      for (const [key, spells] of Object.entries(entry.rest)) {
        const count = key.replace("e", "");
        const each = key.endsWith("e") || spells.length > 1 ? " each" : "";
        paragraphs.push(`${count}/rest${each}: ${parseSpellRefs(spells)}`);
      }
    }

    if (entry.footerEntries) {
      flattenMonsterEntry(entry.footerEntries, paragraphs);
    }

    return { name: entry.name, description: paragraphs };
  });
}
