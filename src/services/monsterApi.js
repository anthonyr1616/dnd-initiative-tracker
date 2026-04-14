const BESTIARY_INDEX_URL = "/5etools/data/bestiary/index.json";
const BESTIARY_BASE_PATH = "/5etools/data/bestiary/";

const cache = {
  index: null,
  monsterRecords: null,
  summaries: null,
  details: {},
};

import { MonsterSummary } from "../models/MonsterSummary.js";
import { MonsterDetails } from "../models/MonsterDetails.js";

async function loadBestiaryIndex() {
  if (cache.index) {
    return cache.index;
  }

  const response = await fetch(BESTIARY_INDEX_URL);
  if (!response.ok) {
    throw new Error(`Failed to load bestiary index: ${response.status}`);
  }

  cache.index = await response.json();
  return cache.index;
}

async function loadMonsterRecords() {
  if (cache.monsterRecords) {
    return cache.monsterRecords;
  }

  const index = await loadBestiaryIndex();
  const fileNames = Object.values(index);
  const results = await Promise.all(
    fileNames.map(async (fileName) => {
      const response = await fetch(`${BESTIARY_BASE_PATH}${fileName}`);
      if (!response.ok) {
        throw new Error(`Failed to load bestiary file ${fileName}: ${response.status}`);
      }
      const data = await response.json();
      return data.monster || [];
    })
  );

  cache.monsterRecords = results.flat();
  return cache.monsterRecords;
}

async function getAllMonsters() {
  if (cache.summaries) {
    return cache.summaries;
  }

  const monsterRecords = await loadMonsterRecords();
  const summaries = monsterRecords.map((monster) => {
    const id = createMonsterId(monster.name, monster.source);
    return new MonsterSummary({
      id,
      name: monster.name,
      source: monster.source,
      apiUrl: null,
    });
  });

  cache.summaries = summaries.sort((a, b) => a.name.localeCompare(b.name));
  return cache.summaries;
}

async function getMonster(monsterId) {
  if (cache.details[monsterId]) {
    return cache.details[monsterId];
  }

  const monsterRecords = await loadMonsterRecords();
  const rawMonster = monsterRecords.find(
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