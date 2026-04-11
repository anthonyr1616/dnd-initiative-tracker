import InitiativeItem from "./InitiativeItem";

function InitiativeList({
  initiativeItems,
  currentTurnId,
  onDelete,
  onEdit,
  onUpdate,
  onMoveUp,
  onMoveDown,
}) {
  return (
    <div className="flex flex-col gap-3">
      {initiativeItems.map((item, index) => (
        <InitiativeItem
          key={item.id}
          {...item}
          isCurrentTurn={item.id === currentTurnId || (currentTurnId === null && index === 0)}
          canMoveUp={index > 0 && initiativeItems[index - 1].initiative === item.initiative}
          canMoveDown={index < initiativeItems.length - 1 && initiativeItems[index + 1].initiative === item.initiative}
          onDelete={onDelete}
          onEdit={onEdit}
          onUpdate={onUpdate}
          onMoveUp={onMoveUp}
          onMoveDown={onMoveDown}
        />
      ))}
    </div>
  );
}

export default InitiativeList;
