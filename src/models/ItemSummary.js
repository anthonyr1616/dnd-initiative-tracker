class ItemSummary {
  constructor({ index, name, url }) {
    this.id = index;
    this.name = name;
    this.url = url;
  }

  toString() {
    return `${this.name}`;
  }
}
