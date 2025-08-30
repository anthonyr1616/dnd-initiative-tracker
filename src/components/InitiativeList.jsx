import InitiativeItem from "./InitiativeItem";

function InitiativeList({ initiativeItems, onDelete, onEdit }) {
  return (
    <div className="flex flex-col gap-3 p-3">
      {initiativeItems.map((item) => (
        <InitiativeItem
          key={item.id}
          id={item.id}
          name={item.name}
          maxHp={item.maxHp}
          currentHp={item.currentHp}
          temporaryHp={item.temporaryHp}
          ac={item.ac}
          bonusAc={item.bonusAc}
          initiative={item.initiative}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      ))}
    </div>
  );
}

export default InitiativeList;
