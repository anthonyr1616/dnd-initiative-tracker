const BESTIARY_INDEX_URL = "/5etools/data/bestiary/index.json";
const BESTIARY_BASE_PATH = "/5etools/data/bestiary/";

const cache = {
  index: null,
  monsterRecords: null,
  resolvedRecords: null,
  summaries: null,
  details: {},
};

import { MonsterSummary } from "../models/MonsterSummary.js";
import { MonsterDetails } from "../models/MonsterDetails.js";

async function loadBestiaryIndex() {
  if (cache.index) return cache.index;
  const response = await fetch(BESTIARY_INDEX_URL);
  if (!response.ok) throw new Error(`Failed to load bestiary index: ${response.status}`);
  cache.index = await response.json();
  return cache.index;
}

async function loadMonsterRecords() {
  if (cache.monsterRecords) return cache.monsterRecords;
  const index = await loadBestiaryIndex();
  const fileNames = Object.values(index);
  const results = await Promise.all(
    fileNames.map(async (fileName) => {
      const response = await fetch(`${BESTIARY_BASE_PATH}${fileName}`);
      if (!response.ok) throw new Error(`Failed to load bestiary file ${fileName}: ${response.status}`);
      const data = await response.json();
      return data.monster || [];
    })
  );
  cache.monsterRecords = results.flat();
  return cache.monsterRecords;
}

function normalizeApostrophes(str) {
  return str.replace(/[\u2018\u2019\u02BC]/g, "'");
}

function applyReplaceTxt(value, regex, replacement) {
  if (typeof value === "string") return normalizeApostrophes(value).replace(regex, replacement);
  if (Array.isArray(value)) return value.map((v) => applyReplaceTxt(v, regex, replacement));
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([k, v]) => [k, applyReplaceTxt(v, regex, replacement)])
    );
  }
  return value;
}

function applyMod(obj, mod) {
  for (const [field, modEntry] of Object.entries(mod)) {
    const entries = Array.isArray(modEntry) ? modEntry : [modEntry];
    for (const entry of entries) {
      if (entry.mode !== "replaceTxt") continue;
      const flags = entry.flags || "";
      const regex = new RegExp(entry.replace, flags.includes("g") ? flags : `${flags}g`);
      if (field === "*") {
        for (const key of Object.keys(obj)) {
          obj[key] = applyReplaceTxt(obj[key], regex, entry.with);
        }
      } else if (field in obj) {
        obj[field] = applyReplaceTxt(obj[field], regex, entry.with);
      }
    }
  }
}

function resolveRecords(records) {
  const baseMap = new Map();
  for (const r of records) {
    if (!r._copy) baseMap.set(`${r.name}|${r.source}`, r);
  }

  return records.map((monster) => {
    if (!monster._copy) return monster;

    const base = baseMap.get(`${monster._copy.name}|${monster._copy.source}`);
    if (!base) return monster;

    const merged = JSON.parse(JSON.stringify(base));

    if (monster._copy._mod) {
      applyMod(merged, monster._copy._mod);
    }

    const { _copy, ...ownFields } = monster;
    Object.assign(merged, ownFields);

    return merged;
  });
}

async function getResolvedRecords() {
  if (cache.resolvedRecords) return cache.resolvedRecords;
  const raw = await loadMonsterRecords();
  cache.resolvedRecords = resolveRecords(raw);
  return cache.resolvedRecords;
}

async function getAllMonsters() {
  if (cache.summaries) return cache.summaries;

  const records = await getResolvedRecords();
  const summaries = records.map((monster) => {
    const id = createMonsterId(monster.name, monster.source);
    return new MonsterSummary({ id, name: monster.name, source: monster.source, apiUrl: null });
  });

  cache.summaries = summaries.sort((a, b) => a.name.localeCompare(b.name));
  return cache.summaries;
}

async function getMonster(monsterId) {
  if (cache.details[monsterId]) return cache.details[monsterId];

  const records = await getResolvedRecords();
  const rawMonster = records.find(
    (monster) => createMonsterId(monster.name, monster.source) === monsterId
  );

  if (!rawMonster) {
    console.error(`Monster not found: ${monsterId}`);
    return null;
  }

  const details = new MonsterDetails(rawMonster);
  cache.details[monsterId] = details;
  return details;
}

function createMonsterId(name, source = "unknown") {
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  return `${source.toLowerCase()}-${slug}`;
}

export { getAllMonsters, getMonster };
