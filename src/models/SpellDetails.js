import {
  createSpellId,
  formatSpellComponents,
  formatSpellDuration,
  formatSpellRange,
  formatSpellTime,
  mapSchoolCode,
  parseSpellEntries,
  formatSource,
} from "../helpers/spellDataParser.js";

class SpellDetails {
  constructor(spellRecord = {}) {
    const {
      name,
      level = 0,
      school,
      time = [],
      range,
      components = {},
      duration = [],
      meta = {},
      entries = [],
      entriesHigherLevel = [],
      classes = [],
      subclasses = [],
      source = null,
      url = null,
    } = spellRecord;

    this.id = spellRecord.id || createSpellId(name, source);
    this.name = name;
    this.description = parseSpellEntries(entries);
    this.higherLevel = parseSpellEntries(entriesHigherLevel);
    this.range = formatSpellRange(range);
    const formattedComponents = formatSpellComponents(components);
    this.components = formattedComponents.components;
    this.material = formattedComponents.material;
    this.ritual = Boolean(meta.ritual);
    this.duration = formatSpellDuration(duration);
    this.concentration = Boolean(meta.concentration || spellRecord.concentration);
    this.castingTime = formatSpellTime(time);
    this.level = level;
    this.school = mapSchoolCode(school);
    this.classes = (classes || []).map((c) => (typeof c === "string" ? c : c.name || ""));
    this.subclasses = (subclasses || []).map((sc) => (typeof sc === "string" ? sc : sc.name || ""));
    this.source = source;
    this.apiUrl = url;
  }

  isCantrip() {
    return this.level === 0;
  }

  toString() {
    return `${this.name} (Level ${this.level})`;
  }

  getFormattedSource() {
    return formatSource(this.source);
  }
}
export { SpellDetails };
