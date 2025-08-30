class SpellDetails {
  constructor({
    index,
    name,
    desc = [],
    higher_level = [],
    range,
    components = [],
    material,
    ritual = false,
    duration,
    concentration = false,
    casting_time,
    level,
    school,
    classes = [],
    subclasses = [],
    url,
  }) {
    this.id = index;
    this.name = name;
    this.description = desc;
    this.higherLevel = higher_level;
    this.range = range;
    this.components = components;
    this.material = material;
    this.ritual = ritual;
    this.duration = duration;
    this.concentration = concentration;
    this.castingTime = casting_time;
    this.level = level;
    this.school = school?.name || null;
    this.classes = classes.map((c) => c.name);
    this.subclasses = subclasses.map((sc) => sc.name);
    this.apiUrl = url;
  }

  isCantrip() {
    return this.level === 0;
  }

  toString() {
    return `${this.name} (Level ${this.level})`;
  }
}
export { SpellDetails };
