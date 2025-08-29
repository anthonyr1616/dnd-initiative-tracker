function InitiativeItem({ id, name, hp, ac, initiative, onDelete }) {
  return (
    <div className="initiative-item" key={id}>
      <p>{name}</p>
      <p>HP: {hp}</p>
      <p>AC: {ac}</p>
      <p>Initiative: {initiative}</p>
      <button onClick={() => onDelete(id)}>❌</button>
    </div>
  );
}

export default InitiativeItem;
