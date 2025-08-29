class SpellSummary {
  constructor({ index, name, level, url }) {
    this.id = index;
    this.name = name;
    this.level = level;
    this.apiUrl = url;
  }

  isCantrip() {
    return this.level === 0;
  }

  toString() {
    return `${this.name} (Level ${this.level})`;
  }
}

export { SpellSummary };
