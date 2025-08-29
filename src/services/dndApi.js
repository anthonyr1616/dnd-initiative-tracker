import { MonsterDetails } from "../models/MonsterDetails";
import { MonsterSummary } from "../models/MonsterSummary";
import { SpellDetails } from "../models/SpellDetails";
import { SpellSummary } from "../models/SpellSummary";

const baseUrl = "https://www.dnd5eapi.co/";
// TODO: Use GraphQL and optionally Apollo 

async function getAllSpells() {
  const url = new URL("/api/2014/spells/", baseUrl);
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed with status ${response.status}`);
    }
    const spellsData = await response.json();
    return spellsData.results.map(s => new SpellSummary(s));
  } catch (err) {
    console.error("Failed to get spells: ", err);
    return null;
  }
}

async function getSpell(spell) {
  const url = new URL(`/api/2014/spells/${spell}`, baseUrl);
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed with status ${response.status}`);
    }
    const spellData = await response.json();
    return new SpellDetails(spellData);
  } catch (err) {
    console.error("Failed to get spell: ", err);
    return null;
  }
}

async function getAllMonsters() {
  const url = new URL(`/api/2014/monsters/`, baseUrl);
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed with status ${response.status}`);
    }
    const monstersData = await response.json();
    return monstersData.results.map(s => new MonsterSummary(s));
  } catch (err) {
    console.error("Failed to get monsters: ", err);
    return null;
  }
}

async function getMonster(monster) {
  const url = new URL(`/api/2014/monsters/${monster}`, baseUrl);
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed with status ${response.status}`);
    }
    const monsterData = await response.json();
    return new MonsterDetails(monsterData);
  } catch (err) {
    console.error("Failed to get monster: ", err);
    return null;
  }
}

async function getAllItems() {
  const url = new URL(`/api/2014/equipment/`, baseUrl);
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed with status ${response.status}`);
    }
    return await response.json();
  } catch (err) {
    console.error("Failed to get items: ", err);
    return null;
  }
}

async function getItem(item) {
  const url = new URL(`/api/2014/equipment/${item}`, baseUrl);
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed with status ${response.status}`);
    }
    return await response.json();
  } catch (err) {
    console.error("Failed to get item: ", err);
    return null;
  }
}


export { getAllSpells, getSpell, getAllMonsters, getMonster, getAllItems, getItem };
