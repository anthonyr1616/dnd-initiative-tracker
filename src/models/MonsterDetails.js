class MonsterDetails {
  constructor({
    index,
    name,
    size,
    type,
    subtype,
    alignment,
    armor_class = [],
    hit_points,
    hit_dice,
    hit_points_roll,
    speed = {},
    strength,
    dexterity,
    constitution,
    intelligence,
    wisdom,
    charisma,
    proficiencies = [],
    damage_vulnerabilities = [],
    damage_resistances = [],
    damage_immunities = [],
    condition_immunities = [],
    senses = {},
    languages = "",
    challenge_rating,
    proficiency_bonus,
    xp,
    special_abilities = [],
    actions = [],
    legendary_actions = [],
    updated_at,
    image,
    forms = [],
    reactions = [],
    url,
  }) {
    this.id = index;
    this.name = name;
    this.size = size;
    this.type = type;
    this.subtype = subtype;
    this.alignment = alignment;
    this.armorClass = armor_class.map((ac) => ({
      type: ac.type,
      value: ac.value,
      condition: ac.condition
        ? {
            id: ac.condition.index,
            name: ac.condition.name,
          }
        : null,

      armor: ac.armor
        ? ac.armor.map((a) => ({
            id: a.index,
            name: a.name,
          }))
        : null,
    }));
    this.hitPoints = hit_points;
    this.hitDice = hit_dice;
    this.hitPointsRoll = hit_points_roll;
    this.speed = speed;
    this.stats = {
      strength,
      dexterity,
      constitution,
      intelligence,
      wisdom,
      charisma,
    };
    this.proficiencies = proficiencies.map((p) => ({
      name: p.proficiency.name,
      value: p.value,
    }));
    this.damageVulnerabilities = damage_vulnerabilities;
    this.damageResistances = damage_resistances;
    this.damageImmunities = damage_immunities;
    this.conditionImmunities = condition_immunities.map((c) => c.name);
    this.senses = senses;
    this.languages = languages;
    this.challengeRating = challenge_rating;
    this.proficiencyBonus = proficiency_bonus;
    this.xp = xp;
    this.specialAbilities = special_abilities.map((a) => ({
      name: a.name,
      desc: a.desc,
      usage: a.usage,
      damage: a.damage,
    }));
    this.actions = actions.map((a) => ({
      name: a.name,
      desc: a.desc,
      attackBonus: a.attack_bonus,
      damage: a.damage,
      actionOptions: a.action_options,
    }));
    this.legendaryActions = legendary_actions.map((a) => ({
      name: a.name,
      desc: a.desc,
      damage: a.damage,
    }));
    this.apiUrl = url;
    this.updatedAt = updated_at ? new Date(updated_at) : null;
    this.image = image;
    this.forms = forms;
    this.reactions = reactions;
  }
}

export { MonsterDetails };
