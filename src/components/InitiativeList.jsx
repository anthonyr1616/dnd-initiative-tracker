import InitiativeItem from "./InitiativeItem";
import styles from "./InitiativeList.module.css";

function InitiativeList({
  initiativeItems,
  currentTurnId,
  sessionActive,
  onDelete,
  onEdit,
  onUpdate,
  onMoveUp,
  onMoveDown,
}) {
  return (
    <div className={styles.list}>
      {initiativeItems.map((item, index) => (
        <InitiativeItem
          key={item.id}
          {...item}
          isCurrentTurn={
            item.id === currentTurnId || (currentTurnId === null && index === 0)
          }
          canMoveUp={
            index > 0 &&
            initiativeItems[index - 1].initiative === item.initiative
          }
          canMoveDown={
            index < initiativeItems.length - 1 &&
            initiativeItems[index + 1].initiative === item.initiative
          }
          sessionActive={sessionActive}
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
