import InitiativeItem from "./InitiativeItem";

function InitiativeList({ initiativeItems, onDelete }) {
  return (
    <div className="flex flex-col gap-3 p-3">
      {initiativeItems.map((item) => (
        <InitiativeItem
          key={item.id}
          id={item.id}
          name={item.name}
          hp={item.hp}
          ac={item.ac}
          initiative={item.initiative}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}

export default InitiativeList;
