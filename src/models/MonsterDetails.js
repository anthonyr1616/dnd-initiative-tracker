import { formatMonsterSource, parseMonsterEntries, formatSize, formatAlignment, formatChallengeRating } from "../helpers/monsterDataParser.js";

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
      legendaryActions = 3,
      legendaryActionsLair,
      reaction = [],
      cr,
      xp,
    } = monsterRecord;

    this.id = monsterRecord.id || createMonsterId(name, source);
    this.name = name;
    this.source = source;
    this.size = formatSize(Array.isArray(size) ? size[0] : size);
    this.type = typeof type === "object" ? type.type : type;
    this.alignment = formatAlignment(alignment);
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
      description: parseMonsterEntries(t.entries || []),
    }));
    this.actions = (action || []).map((a) => ({
      name: a.name,
      description: parseMonsterEntries(a.entries || []),
    }));
    this.legendaryActions = (legendary || []).map((l) => ({
      name: l.name,
      description: parseMonsterEntries(l.entries || []),
    }));
    this.legendaryActionsCount = legendaryActions;
    this.legendaryActionsLair = legendaryActionsLair ?? null;
    this.reactions = (reaction || []).map((r) => ({
      name: r.name,
      description: parseMonsterEntries(r.entries || []),
    }));
    this.challengeRating = typeof cr === "object" ? cr.cr : cr;
    this.xp = xp;
    this.xpLair = typeof cr === "object" ? cr.xpLair ?? null : null;
  }

  toString() {
    return `${this.name}`;
  }

  getFormattedSource() {
    return formatMonsterSource(this.source);
  }

  getFormattedChallenge() {
    return formatChallengeRating(this.challengeRating, this.xp, this.xpLair);
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
