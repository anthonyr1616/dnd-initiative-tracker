import { SpellSummary } from "../models/SpellSummary.js";
import { SpellDetails } from "../models/SpellDetails.js";
import { createSpellId } from "../helpers/spellDataParser.js";

const SPELL_INDEX_URL = `${import.meta.env.BASE_URL}5etools/data/spells/index.json`;
const SPELL_BASE_PATH = `${import.meta.env.BASE_URL}5etools/data/spells/`;

const cache = {
  index: null,
  spellRecords: null,
  summaries: null,
  details: {},
};

async function loadSpellIndex() {
  if (cache.index) {
    return cache.index;
  }

  const response = await fetch(SPELL_INDEX_URL);
  if (!response.ok) {
    throw new Error(`Failed to load spell index: ${response.status}`);
  }

  cache.index = await response.json();
  return cache.index;
}

async function loadSpellRecords() {
  if (cache.spellRecords) {
    return cache.spellRecords;
  }

  const index = await loadSpellIndex();
  const fileNames = Object.values(index);
  const results = await Promise.all(
    fileNames.map(async (fileName) => {
      const response = await fetch(`${SPELL_BASE_PATH}${fileName}`);
      if (!response.ok) {
        throw new Error(`Failed to load spell file ${fileName}: ${response.status}`);
      }
      const data = await response.json();
      return data.spell || [];
    })
  );

  cache.spellRecords = results.flat();
  return cache.spellRecords;
}

async function getAllSpells() {
  if (cache.summaries) {
    return cache.summaries;
  }

  const spellRecords = await loadSpellRecords();
  const summaries = spellRecords.map((spell) => {
    const id = createSpellId(spell.name, spell.source);
    return new SpellSummary({
      id,
      name: spell.name,
      level: spell.level ?? 0,
      source: spell.source,
      apiUrl: null,
    });
  });

  cache.summaries = summaries.sort((a, b) => a.name.localeCompare(b.name));
  return cache.summaries;
}

async function getSpell(spellId) {
  if (cache.details[spellId]) {
    return cache.details[spellId];
  }

  const spellRecords = await loadSpellRecords();
  const rawSpell = spellRecords.find(
    (spell) => createSpellId(spell.name, spell.source) === spellId
  );

  if (!rawSpell) {
    console.error(`Spell not found: ${spellId}`);
    return null;
  }

  const details = new SpellDetails(rawSpell);
  cache.details[spellId] = details;
  return details;
}

export { getAllSpells, getSpell };
