import ReactMarkdown from "react-markdown";
import StatLine from "./StatLine";

export default function SpellCard({ spell }) {
  return (
    <div className="rounded-lg border p-4 shadow-sm bg-[#faefd1] border-[#4a2800]">
      <h2 className="text-2xl font-bold uppercase text-[#4a2800]">
        {spell.name}
      </h2>
      <p>
        <span className="italic text-md">
          {spell.level > 0 && `Level ${spell.level} `}
          {spell.school}
          {spell.level === 0 && " cantrip"}
        </span>
      </p>
      <hr className="border-2  border-[#8d2e1e] my-2" />
      <StatLine label="Casting Time:">{spell.castingTime}</StatLine>
      <StatLine label="Range:">{spell.range}</StatLine>
      <StatLine label="Components:">
        {spell.components.join(", ")}
        {spell.material ? ` (${spell.material})` : ""}
      </StatLine>
      <StatLine label="Duration:">{spell.duration}</StatLine>
      {spell.source && <StatLine label="Source:">{spell.getFormattedSource()}</StatLine>}
      {spell.description.map((paragraph, index) => (
        <ReactMarkdown key={`description-${index}`}>{paragraph}</ReactMarkdown>
      ))}
      {spell.higherLevel && spell.higherLevel.length > 0 && (
        <div className="mt-4">
          <h3 className="font-semibold text-lg">At Higher Levels</h3>
          {spell.higherLevel.map((paragraph, index) => (
            <ReactMarkdown key={`higher-${index}`}>{paragraph}</ReactMarkdown>
          ))}
        </div>
      )}
    </div>
  );
}
