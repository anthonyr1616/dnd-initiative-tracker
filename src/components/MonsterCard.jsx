import { calculateModifier } from "../helpers/helperMethods";
import StatLine from "./StatLine";

export default function MonsterCard({ monster }) {
  const armorClassStrings = monster.armorClass.map((ac) => {
    const value = ac.value ?? ac.ac ?? ac;
    const details = [];

    if (ac.type && ac.type !== "natural") {
      details.push(ac.type);
    }

    if (ac.from) {
      if (Array.isArray(ac.from)) {
        details.push(ac.from.join(", "));
      } else {
        details.push(ac.from);
      }
    }

    if (ac.armor) {
      if (Array.isArray(ac.armor)) {
        details.push(ac.armor.map((item) => item.name || item).join(", "));
      } else {
        details.push(ac.armor.name ?? ac.armor);
      }
    }

    if (ac.condition) {
      details.push(ac.condition);
    }

    if (details.length > 0) {
      return `${value} (${details.join(", ")})`;
    }

    return `${value}`;
  });

  const statArray = Object.entries(monster.stats).map(([name, value]) => ({
    name,
    value,
    mod: calculateModifier(value),
  }));

  const speedArray = Object.entries(monster.speed).map(([key, value]) => {
    if (key === "walk") return `${value} ft.`;
    if (key === "fly") return `fly ${value.number || value} ft.${value.condition ? ` ${value.condition}` : ''}`;
    if (key === "swim") return `swim ${value} ft.`;
    if (key === "climb") return `climb ${value} ft.`;
    return `${key} ${value}`;
  });

  return (
    <div className="rounded-lg border border-[#4a2800] p-4 shadow-sm bg-[#faefd1]">
      <h2 className="text-2xl font-bold uppercase text-[#4a2800]">
        {monster.name}
      </h2>
      <p className="italic text-xs">
        {monster.size} {monster.type}, {monster.alignment}
      </p>
      <hr className="border-2 border-[#8d2e1e] my-2" />
      <StatLine label="Armor Class">{armorClassStrings.join(", ")}</StatLine>
      <StatLine label="Hit Points">
        {monster.hitPoints} {monster.hitDice && `(${monster.hitDice})`}
      </StatLine>
      <StatLine label="Speed">{speedArray.join(", ")}</StatLine>
      <hr className="border-2 border-[#8d2e1e] my-2" />
      <ul className="flex justify-between text-[#4a2800]">
        {statArray.map((stat) => (
          <li key={stat.name} className="flex flex-col items-center justify-start">
            <span className="font-bold">{stat.name.slice(0, 3).toUpperCase()}</span>
            {stat.value} ({stat.mod >= 0 ? `+${stat.mod}` : stat.mod})
          </li>
        ))}
      </ul>
      <hr className="border-2 border-[#8d2e1e] my-2" />
      {monster.damageImmunities.length > 0 && (
        <StatLine label="Damage Immunities">{monster.damageImmunities.join(", ")}</StatLine>
      )}
      {monster.conditionImmunities.length > 0 && (
        <StatLine label="Condition Immunities">{monster.conditionImmunities.join(", ")}</StatLine>
      )}
      <StatLine label="Senses">{monster.senses.join(", ")}</StatLine>
      <StatLine label="Languages">{monster.languages}</StatLine>
      <StatLine label="Challenge">{monster.challengeRating}</StatLine>
      {monster.source && <StatLine label="Source">{monster.getFormattedSource()}</StatLine>}
      {monster.traits.length > 0 && (
        <div className="mb-3">
          <h3 className="text-[#8d2e1e] font-semibold">Traits</h3>
          <hr className="border-1 border-[#8d2e1e] mb-1" />
          {monster.traits.map((trait, index) => (
            <div key={index}>
              <strong>{trait.name}.</strong> {trait.description}
            </div>
          ))}
        </div>
      )}
      {monster.actions.length > 0 && (
        <div className="mb-3">
          <h3 className="text-[#8d2e1e] font-semibold">Actions</h3>
          <hr className="border-1 border-[#8d2e1e] mb-1" />
          {monster.actions.map((action, index) => (
            <div key={index}>
              <strong>{action.name}.</strong> {action.description}
            </div>
          ))}
        </div>
      )}
      {monster.legendaryActions.length > 0 && (
        <div className="mb-3">
          <h3 className="text-[#8d2e1e] font-semibold">Legendary Actions</h3>
          <hr className="border-1 border-[#8d2e1e] mb-1" />
          {monster.legendaryActions.map((action, index) => (
            <div key={index}>
              <strong>{action.name}.</strong> {action.description}
            </div>
          ))}
        </div>
      )}
      {monster.reactions.length > 0 && (
        <div className="mb-3">
          <h3 className="text-[#8d2e1e] font-semibold">Reactions</h3>
          <hr className="border-1 border-[#8d2e1e] mb-1" />
          {monster.reactions.map((reaction, index) => (
            <div key={index}>
              <strong>{reaction.name}.</strong> {reaction.description}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


