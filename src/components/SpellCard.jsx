import ReactMarkdown from "react-markdown";
import StatLine from "./StatLine";

export default function SpellCard({ spell }) {
  return (
    <div className="rounded-lg border p-4 shadow-sm bg-gray-50">
      <h2 className="text-2xl font-bold uppercase text-[#4a2800]">{spell.name}</h2>
      <p>
        <span className="italic text-md">
          {spell.level > 0 && `Level ${spell.level} `}
          {spell.school}
          {spell.level === 0 && " cantrip"}
        </span>
      </p>
      <StatLine label="Casting Time:">{spell.castingTime}</StatLine>
      <p>
        <span className="font-medium">Range: {spell.range}</span>
      </p>
      <p>
        <span className="font-medium">
          Components: {spell.components.join(", ")}
          {spell.material ? ` (${spell.material})` : ""}
        </span>
      </p>
      <p>
        <span className="font-medium">Duration: {spell.duration}</span>
      </p>
      {spell.description.map((paragraph, index) => (
        <ReactMarkdown key={index}>{paragraph}</ReactMarkdown>
      ))}
    </div>
  );
}
