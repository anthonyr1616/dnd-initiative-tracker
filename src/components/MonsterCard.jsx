import { decimalToFraction, makeUrl } from "../helpers/helperMethods";

// TODO: Make closer to official stat block, missing usage per day for special abilties, hitdice next to hit points, Saving throws, skills, image, and hiding things not present
export default function MonsterCard({ monster }) {
  const armorCLassStrings = monster.armorClass.map((ac) => {
    if (ac.type === "natural") {
      return `${ac.value} (natural armor)`;
    }

    if (ac.type === "condition" && ac.condition) {
      return `${ac.value} while ${ac.condition.name.toLowerCase()}`;
    }

    if (ac.type === "armor" && ac.armor?.length > 0) {
      const armorNames = ac.armor.map((a) => a.name).join(", ");
      return `${ac.value} with ${armorNames}`;
    }

    return `${ac.value}`;
  });

  // Make special abilites array

  const statArray = Object.entries(monster.stats).map(([key, value]) => ({
    name: key,
    value: value,
  }));

  const sensesArray = Object.entries(monster.senses).map(([key, value]) => {
    const formattedKey = key
      .replace(/_/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
    return `${formattedKey} ${value}`;
  });

  const speedArray = Object.entries(monster.speed).map(([key, value]) => {
    if (key === "hover" && value === true) {
      return "(hover)";
    }

    const formattedKey = key
      .replace(/_/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
    return `${formattedKey} ${value}`;
  });

  const calculateModifier = (score) => {
    return Math.floor((score - 10) / 2);
  };

  return (
    <div className="rounded-lg border p-4 shadow-sm bg-gray-50">
      <h2 className="text-2xl font-bold uppercase">{monster.name}</h2>
      <p>
        <span className="italic text-xs">
          {monster.size} {monster.type}
          {monster.subtype ? ` (${monster.subtype})` : ""}, {monster.alignment}
        </span>
      </p>
      <img src={makeUrl(monster.image)} alt="" />
      <p>
        <span className="font-bold">Hit Points</span>{" "}
        <span>{monster.hitPoints}</span>
      </p>
      <p>
        <span className="font-bold">Armor Class</span>{" "}
        {armorCLassStrings.join(", ")}
      </p>
      <p>
        <span className="font-bold">Speed</span> {speedArray.join(", ")}
      </p>
      <hr />
      <ul className="flex justify-between">
        {statArray.map((stat) => (
          <li
            key={stat.name}
            className="flex flex-col items-center justify-start"
          >
            <span className="font-bold">
              {stat.name.slice(0, 3).toUpperCase()}
            </span>
            {stat.value} (
            {calculateModifier(stat.value) >= 0
              ? `+${calculateModifier(stat.value)}`
              : `-${calculateModifier(stat.value)}`}
            )
          </li>
        ))}
      </ul>
      <hr />
      <p>
        <span className="font-bold">Saving Throws</span>
      </p>{" "}
      <p>
        <span className="font-bold">Damage Vulnerabilities</span>{" "}
        {monster.damageVulnerabilities.join(", ")}
      </p>{" "}
      <p>
        <span className="font-bold">Damage Resistances</span>{" "}
        {monster.damageResistances.join(", ")}
      </p>
      <p>
        <span className="font-bold">Damage Immunities</span>{" "}
        {monster.damageImmunities.join(", ")}
      </p>
      <p>
        <span className="font-bold">Condition Immunities</span>{" "}
        {monster.conditionImmunities.join(", ")}
      </p>
      <p>
        <span className="font-bold">Senses</span> {sensesArray.join(", ")}
      </p>
      <p>
        <span className="font-bold">Languages</span> {monster.languages ? monster.languages : "—"}
      </p>
      <p>
        <span className="font-bold">Challenge</span>{" "}
        {decimalToFraction(Number(monster.challengeRating))}{" "}
        {`(${monster.xp} XP)`}
      </p>
      <hr />
      <ul className="flex flex-col">
        {monster.specialAbilities.map((ability) => (
          <li>
            <span className="font-bold">{`${ability.name}`}.</span>{" "}
            <span>{ability.desc}</span>
          </li>
        ))}
      </ul>
      <p className="font-bold text-lg">ACTIONS</p>
      <hr />
      <ul className="flex flex-col">
        {monster.actions.map((action) => (
          <li key={action.name} className="mb-2">
            <span className="font-bold">{action.name}.</span>{" "}
            <span>{action.desc}</span>
          </li>
        ))}
      </ul>
      <p className="font-bold text-lg">REACTIONS</p>
      <hr />
      <ul className="flex flex-col">
        {monster.reactions.map((reaction) => (
          <li key={reaction.name} className="mb-2">
            <span className="font-bold">{reaction.name}.</span>{" "}
            <span>{reaction.desc}</span>
          </li>
        ))}{" "}
        <p className="font-bold text-lg">LEGENDARY ACTIONS</p>
        <hr />
      </ul>
      <ul className="flex flex-col">
        {monster.legendaryActions.map((la) => (
          <li key={la.name} className="mb-2">
            <span className="font-bold">{la.name}.</span> <span>{la.desc}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
