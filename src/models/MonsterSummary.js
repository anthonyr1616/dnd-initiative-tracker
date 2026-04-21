import { formatMonsterSource as formatSource } from "../helpers/monsterDataParser.js";

class MonsterSummary {
  constructor({ id, name, source = null, apiUrl = null }) {
    this.id = id;
    this.name = name;
    this.source = source;
    this.apiUrl = apiUrl;
  }

  toString() {
    const sourcePart = this.source ? ` - ${this.getFormattedSource()}` : "";
    return `${this.name}${sourcePart}`;
  }

  getFormattedSource() {
    return formatSource(this.source);
  }
}

export { MonsterSummary };
