function InitiativeItem({ id, name, hp, ac, initiative, onDelete }) {
  return (
    <div className="initiative-item" key={id}>
      <p>{name}</p>
      <p>{hp}</p>
      <p>{ac}</p>
      <p>{initiative}</p>
      <button onClick={() => onDelete(id)}>❌</button>
    </div>
  );
}

export default InitiativeItem;
