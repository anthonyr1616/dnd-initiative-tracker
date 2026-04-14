import { formatSource, parseTaggedText, parseSpellEntries } from "../helpers/spellDataParser.js";

class MonsterDetails {
  constructor(monsterRecord = {}) {
    const {
      name,
      source,
      size = [],
      type,
      alignment = [],
      ac = [],
      hp,
      speed = {},
      str,
      dex,
      con,
      int,
      wis,
      cha,
      senses = [],
      passive,
      immune = [],
      conditionImmune = [],
      languages = [],
      trait = [],
      action = [],
      legendary = [],
      reaction = [],
      cr,
      xp,
    } = monsterRecord;

    this.id = monsterRecord.id || createMonsterId(name, source);
    this.name = name;
    this.source = source;
    this.size = Array.isArray(size) ? size[0] : size; // e.g., "M"
    this.type = typeof type === "object" ? type.type : type; // Handle both string and object types
    this.alignment = alignment.join(", ");
    this.armorClass = ac.map((acItem) => {
      if (typeof acItem === "number") {
        return { value: acItem };
      }

      if (typeof acItem === "object") {
        return {
          value: acItem.value ?? acItem.ac,
          type: acItem.type,
          condition: acItem.condition,
          armor: acItem.armor,
          from: acItem.from,
        };
      }

      return { value: String(acItem) };
    });
    this.hitPoints = hp?.average || hp?.special || hp;
    this.hitDice = hp?.formula;
    this.speed = speed;
    this.stats = {
      strength: str,
      dexterity: dex,
      constitution: con,
      intelligence: int,
      wisdom: wis,
      charisma: cha,
    };
    this.senses = senses;
    this.passivePerception = passive;
    this.damageImmunities = immune;
    this.conditionImmunities = conditionImmune;
    this.languages = languages.join(", ");
    this.traits = (trait || []).map((t) => ({
      name: t.name,
      description: parseSpellEntries(t.entries || []).join(" "),
    }));
    this.actions = (action || []).map((a) => ({
      name: a.name,
      description: parseSpellEntries(a.entries || []).join(" "),
    }));
    this.legendaryActions = (legendary || []).map((l) => ({
      name: l.name,
      description: parseSpellEntries(l.entries || []).join(" "),
    }));
    this.reactions = (reaction || []).map((r) => ({
      name: r.name,
      description: parseSpellEntries(r.entries || []).join(" "),
    }));
    this.challengeRating = cr;
    this.xp = xp;
  }

  toString() {
    return `${this.name}`;
  }

  getFormattedSource() {
    return formatSource(this.source);
  }
}

function createMonsterId(name, source = "unknown") {
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  return `${source.toLowerCase()}-${slug}`;
}

export { MonsterDetails };
