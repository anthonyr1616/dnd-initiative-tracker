import InitiativeItem from "./InitiativeItem";

function InitiativeList({
  initiativeItems,
  currentTurn,
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
          isCurrentTurn={index === currentTurn}
          isFirst={index === 0}
          isLast={index === initiativeItems.length - 1}
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
