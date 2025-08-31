import {
  decimalToFraction,
  makeUrl,
  formatKeyValueArray,
  calculateModifier,
} from "../helpers/helperMethods";
import StatLine from "./StatLine";
import ActionList from "./ActionList";
// TODO: Still need to fix skills/saving throws display and hit die to hit points. Also need to awdd usage per day for actions

export default function MonsterCard({ monster }) {
  const armorClassStrings = monster.armorClass.map((ac) => {
    if (ac.type === "natural") return `${ac.value} (natural armor)`;
    if (ac.type === "condition" && ac.condition)
      return `${ac.value} while ${ac.condition.name.toLowerCase()}`;
    if (ac.type === "armor" && ac.armor?.length)
      return `${ac.value} with ${ac.armor.map((a) => a.name).join(", ")}`;
    return `${ac.value}`;
  });

  const statArray = Object.entries(monster.stats).map(([name, value]) => ({
    name,
    value,
    mod: calculateModifier(value),
  }));

  const sensesArray = formatKeyValueArray(monster.senses);
  const speedArray = Object.entries(monster.speed).map(([key, value]) =>
    key === "hover" && value
      ? "(hover)"
      : `${key
          .replace(/_/g, " ")
          .replace(/\b\w/g, (c) => c.toUpperCase())} ${value}`
  );

  const skillsArray = monster.proficiencies
    .filter((p) => p.name.startsWith("Skill: "))
    .map(
      (p) =>
        `${p.name.replace("Skill: ", "")} ${p.value >= 0 ? `+${p.value}` : `-${p.value}`}`
    );

  const savingThrowsArray = monster.proficiencies
    .filter((p) => p.name.startsWith("Saving Throw: "))
    .map(
      (p) =>
        `${p.name.replace("Saving Throw: ", "")} ${
          p.value >= 0 ? `+${p.value}` : `-${p.value}`
        }`
    );

  return (
    <div className="rounded-lg border p-4 shadow-sm bg-[#faefd1]">
      <h2 className="text-2xl font-bold uppercase text-[#4a2800]">
        {monster.name}
      </h2>
      <p className="italic text-xs">
        {monster.size} {monster.type}
        {monster.subtype ? ` (${monster.subtype})` : ""}, {monster.alignment}
      </p>
      <hr className="border-2  border-[#8d2e1e] my-2" />
      {monster.image && (
        <img
          src={makeUrl(monster.image)}
          alt={monster.name}
          className="mx-auto my-2 border-1 border-[#8d2e1e] rounded-2xl"
        />
      )}
      <StatLine label="Armor Class">{armorClassStrings.join(", ")}</StatLine>
      <StatLine label="Hit Points">
        {monster.hitPoints} ({monster.hitPointsRoll})
      </StatLine>
      <StatLine label="Speed">{speedArray.join(", ")}</StatLine>
      <hr className="border-2 border-[#8d2e1e] my-2" />
      <ul className="flex justify-between text-[#4a2800]">
        {statArray.map((stat) => (
          <li
            key={stat.name}
            className="flex flex-col items-center justify-start"
          >
            <span className="font-bold">
              {stat.name.slice(0, 3).toUpperCase()}
            </span>
            {stat.value} ({stat.mod >= 0 ? `+${stat.mod}` : stat.mod})
          </li>
        ))}
      </ul>
      <hr className="border-2  border-[#8d2e1e] my-2" />
      <StatLine label="Saving Throws">
        {savingThrowsArray?.join(", ")}
      </StatLine>
      <StatLine label="Skills">
        {skillsArray?.join(", ")}
      </StatLine>
      <StatLine label="Damage Vulnerabilities">
        {monster.damageVulnerabilities.join(", ")}
      </StatLine>
      <StatLine label="Damage Resistances">
        {monster.damageResistances.join(", ")}
      </StatLine>
      <StatLine label="Damage Immunities">
        {monster.damageImmunities.join(", ")}
      </StatLine>
      <StatLine label="Condition Immunities">
        {monster.conditionImmunities.join(", ")}
      </StatLine>
      <StatLine label="Senses">{sensesArray.join(", ")}</StatLine>
      <StatLine label="Languages">{monster.languages || "—"}</StatLine>
      <StatLine label="Challenge">
        {decimalToFraction(Number(monster.challengeRating))} ({monster.xp} XP)
      </StatLine>
      <hr className="border-2  border-[#8d2e1e] my-2" />
      {monster.specialAbilities.length > 0 && (
        <ActionList items={monster.specialAbilities} />
      )}
      {monster.actions.length > 0 && (
        <ActionList title="ACTIONS" items={monster.actions} />
      )}
      {monster.reactions.length > 0 && (
        <ActionList title="REACTIONS" items={monster.reactions} />
      )}
      {monster.legendaryActions.length > 0 && (
        <ActionList
          title="LEGENDARY ACTIONS"
          items={monster.legendaryActions}
        />
      )}
    </div>
  );
}
