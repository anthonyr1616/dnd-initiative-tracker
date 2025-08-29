import InitiativeItem from "./InitiativeItem";

function InitiativeList({ initiativeItems, onDelete }) {
  return (
    <div className="initiative-list">
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
