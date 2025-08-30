import {
  Trash2,
  Edit,
  Heart,
  Shield,
  Zap,
  HeartPlus,
  ShieldPlus,
} from "lucide-react";

// TODO: Add edit functionality and damage/heal functionality and edit bonus health/AC
// Edit button should allow you to any of the stats shown
// Heal - Add hp to current HP, but not above max HP
// Damage - Subtract hp from current HP (starting with temp HP)
// Add temp HP - Add to bonus health

function InitiativeItem({
  id,
  name,
  maxHp,
  currentHp,
  temporaryHp,
  ac,
  bonusAc,
  initiative,
  onDelete,
  onEdit,
}) {
  return (
    <div
      className="bg-slate-400 rounded-xl flex justify-between items-center p-3 gap-6 shadow-md shadow-slate-800 hover:shadow-lg transition-shadow"
      key={id}
    >
      <p className="text-4xl font-bold flex-1">{name}</p>
      <div className="flex items-center gap-6 text-xl font-semibold">
        <div className="flex flex-col items-start gap-2">
          <p className="flex items-center gap-2" title="Total HP">
            <Heart className="w-8 h-8 fill-red-600 text-3xl" strokeWidth={1} />
            <span className="text-3xl">
              <span className={temporaryHp > 0 ? "text-green-300" : ""}>
                {currentHp + temporaryHp}
              </span>
              /{maxHp}
            </span>
          </p>
          <p className="flex items-center gap-2" title="Temporary HP">
            <HeartPlus
              className="w-8 h-8 fill-green-300 text-3xl"
              strokeWidth={1}
            />
            <span className="text-3xl">{temporaryHp}</span>
          </p>
        </div>
        <div className="flex flex-col items-start gap-2">
          <p className="flex items-center gap-2" title="Total AC">
            <Shield className="w-8 h-8 fill-gray-300" strokeWidth={1} />
            <span className={`text-3xl ${bonusAc > 0 ? "text-green-300" : ""}`}>
              {ac + bonusAc}
            </span>
          </p>
          <p className="flex items-center gap-2" title="Bonus AC">
            <ShieldPlus className="w-8 h-8 fill-green-300" strokeWidth={1} />
            <span className="text-3xl">{bonusAc}</span>
          </p>
        </div>
        <p className="flex items-center gap-2" title="Initiative">
          <Zap className="w-8 h-8 fill-yellow-100" strokeWidth={1} />
          <span className="text-3xl">{initiative}</span>
        </p>
      </div>
      <div className="flex flex-col items-center gap-2 ml-3">
        <button
          onClick={() => onDelete(id)}
          className="w-12 h-12 flex items-center justify-center text-red-600 bg-red-100 hover:text-red-800  hover:bg-red-200 rounded-full focus:outline-none focus:ring-2 focus:ring-red-400 transition-colors cursor-pointer"
          title="Delete"
        >
          <Trash2 className="w-6 h-6" />
        </button>
        <button
          onClick={() => onEdit(id)}
          className="w-12 h-12 flex items-center justify-center text-blue-600 bg-blue-100 hover:text-blue-800  hover:bg-blue-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors cursor-pointer"
          title="Edit"
        >
          <Edit className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}

export default InitiativeItem;
