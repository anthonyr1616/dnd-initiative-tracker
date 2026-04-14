import { createSpellId } from "../helpers/spellDataParser.js";

class SpellSummary {
  constructor({ id, name, level = 0, source = null, apiUrl = null }) {
    this.id = id;
    this.name = name;
    this.level = level;
    this.source = source;
    this.apiUrl = apiUrl;
  }

  static fromRecord(record) {
    return new SpellSummary({
      id: createSpellId(record.name, record.source),
      name: record.name,
      level: record.level ?? 0,
      source: record.source,
      apiUrl: record.url || null,
    });
  }

  isCantrip() {
    return this.level === 0;
  }

  toString() {
    const sourcePart = this.source ? ` - ${this.source}` : "";
    return `${this.name}${sourcePart}`;
  }
}

export { SpellSummary };
