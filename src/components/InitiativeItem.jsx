function InitiativeItem({ id, name, hp, ac, initiative, onDelete }) {
  return (
    <div
      className="bg-slate-400 rounded-xl flex flex-wrap p-4 gap-2 items-center shadow-slate-800 shadow-md"
      key={id}
    >
      <p className="flex-1">{name}</p>
      <p>❤️ {hp}</p>
      <p>🛡️ {ac}</p>
      <p>🗲 {initiative}</p>

      {/* Delete button */}
      <button
        onClick={() => onDelete(id)}
        className="ml-4 text-red-600 hover:text-red-800 font-bold rounded-full p-1 focus:outline-none focus:ring-2 focus:ring-red-400"
      >
        ❌
      </button>
    </div>
  );
}

export default InitiativeItem;
