class Spell {
  constructor({
    index,
    name,
    desc = [],
    higher_level = [],
    range,
    components = [],
    ritual = false,
    duration,
    concentration = false,
    casting_time,
    level,
    school,
    classes = [],
    subclasses = [],
    url
  }) {
    this.id = index;
    this.name = name;
    this.description = desc.join(" "); // merge array into single string
    this.higherLevel = higher_level.join(" ");
    this.range = range;
    this.components = components;
    this.ritual = ritual;
    this.duration = duration;
    this.concentration = concentration;
    this.castingTime = casting_time;
    this.level = level;
    this.school = school?.name || null; // just store the name
    this.classes = classes.map(c => c.name); // array of class names
    this.subclasses = subclasses.map(sc => sc.name); // array of subclass names
    this.apiUrl = url;
  }
}
export { Spell }