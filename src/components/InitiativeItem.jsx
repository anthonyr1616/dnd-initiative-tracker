import { useState } from "react";
import { Trash2, Edit, Heart, Shield, Zap, ChevronUp, ChevronDown } from "lucide-react";

function hpBarColor(current, max) {
  if (max === 0) return "bg-gray-400";
  const pct = current / max;
  if (pct >= 0.75) return "bg-green-500";
  if (pct >= 0.5) return "bg-yellow-400";
  if (pct >= 0.25) return "bg-orange-500";
  if (pct > 0) return "bg-red-600";
  return "bg-gray-700";
}

function hpTextColor(current, max) {
  if (max === 0) return "text-gray-500";
  const pct = current / max;
  if (pct >= 0.75) return "text-green-600";
  if (pct >= 0.5) return "text-yellow-600";
  if (pct >= 0.25) return "text-orange-500";
  if (pct > 0) return "text-red-600";
  return "text-gray-600";
}

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
  onUpdate,
  onMoveUp,
  onMoveDown,
  isCurrentTurn,
  canMoveUp,
  canMoveDown,
}) {
  const [amount, setAmount] = useState("");

  const parseAmount = () => {
    const n = parseInt(amount, 10);
    return isNaN(n) || n <= 0 ? null : n;
  };

  const handleDamage = () => {
    const dmg = parseAmount();
    if (dmg === null) return;
    let remainingDmg = dmg;
    let newTempHp = temporaryHp;
    let newCurrentHp = currentHp;
    if (newTempHp > 0) {
      const absorbed = Math.min(newTempHp, remainingDmg);
      newTempHp -= absorbed;
      remainingDmg -= absorbed;
    }
    newCurrentHp = Math.max(0, newCurrentHp - remainingDmg);
    onUpdate(id, { currentHp: newCurrentHp, temporaryHp: newTempHp });
    setAmount("");
  };

  const handleHeal = () => {
    const heal = parseAmount();
    if (heal === null) return;
    onUpdate(id, { currentHp: Math.min(maxHp, currentHp + heal) });
    setAmount("");
  };

  const handleSetTempHp = () => {
    const temp = parseAmount();
    if (temp === null) return;
    onUpdate(id, { temporaryHp: Math.max(temporaryHp, temp) });
    setAmount("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleDamage();
  };

  const hpPct = maxHp > 0 ? Math.max(0, Math.min(1, currentHp / maxHp)) : 0;

  return (
    <div
      className={`rounded-xl p-3 shadow-md transition-all ${
        isCurrentTurn
          ? "bg-yellow-50 border-l-4 border-yellow-400 shadow-yellow-200"
          : "bg-[#edf1f2] border-l-4 border-transparent shadow-[#b6ad90]"
      }`}
    >
      {/* Main row */}
      <div className="flex items-center gap-3">
        <div className="flex flex-col gap-0.5 w-5">
          {canMoveUp ? (
            <button
              onClick={() => onMoveUp(id)}
              className="text-gray-400 hover:text-gray-700 cursor-pointer"
              title="Move up"
            >
              <ChevronUp className="w-5 h-5" />
            </button>
          ) : (
            <span className="w-5 h-5" />
          )}
          {canMoveDown ? (
            <button
              onClick={() => onMoveDown(id)}
              className="text-gray-400 hover:text-gray-700 cursor-pointer"
              title="Move down"
            >
              <ChevronDown className="w-5 h-5" />
            </button>
          ) : (
            <span className="w-5 h-5" />
          )}
        </div>
        <p
          className={`text-2xl font-bold flex-1 truncate ${
            isCurrentTurn ? "text-yellow-800" : "text-[#3a1c04]"
          }`}
        >
          {name}
        </p>
        <div className="flex items-center gap-4 shrink-0">
          <div className="flex items-center gap-1" title={`HP: ${currentHp}${temporaryHp > 0 ? `+${temporaryHp} temp` : ""} / ${maxHp}`}>
            <Heart className="w-5 h-5 fill-red-500 text-red-500" strokeWidth={1} />
            <span className={`text-xl font-semibold ${hpTextColor(currentHp, maxHp)}`}>
              {currentHp}
              {temporaryHp > 0 && (
                <span className="text-green-600 text-base">+{temporaryHp}</span>
              )}
            </span>
            <span className="text-gray-400 text-base">/{maxHp}</span>
          </div>

          <div className="flex items-center gap-1" title={`AC: ${ac + bonusAc}${bonusAc > 0 ? ` (${ac}+${bonusAc})` : ""}`}>
            <Shield className="w-5 h-5 fill-slate-300" strokeWidth={1} />
            <span className="text-xl font-semibold">{ac + bonusAc}</span>
            {bonusAc > 0 && (
              <span className="text-green-600 text-sm">+{bonusAc}</span>
            )}
          </div>

          <div className="flex items-center gap-1" title="Initiative">
            <Zap className="w-5 h-5 fill-yellow-200" strokeWidth={1} />
            <span className="text-xl font-semibold">{initiative}</span>
          </div>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={() => onEdit(id)}
            className="w-9 h-9 flex items-center justify-center text-blue-600 bg-blue-100 hover:bg-blue-200 rounded-full transition-colors cursor-pointer"
            title="Edit"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(id)}
            className="w-9 h-9 flex items-center justify-center text-red-600 bg-red-100 hover:bg-red-200 rounded-full transition-colors cursor-pointer"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
      <div className="mt-2 h-2 rounded-full bg-gray-200 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-300 ${hpBarColor(currentHp, maxHp)}`}
          style={{ width: `${hpPct * 100}%` }}
        />
      </div>
      <div className="mt-2 flex items-center gap-2 flex-wrap">
        <input
          type="number"
          min="1"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Amount"
          className="w-24 rounded border border-gray-300 px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-[#806c39]"
        />
        <button
          onClick={handleDamage}
          className="px-3 py-1 text-sm rounded bg-red-100 text-red-700 hover:bg-red-200 font-medium cursor-pointer"
          title="Apply damage (temp HP absorbs first)"
        >
          Damage
        </button>
        <button
          onClick={handleHeal}
          className="px-3 py-1 text-sm rounded bg-green-100 text-green-700 hover:bg-green-200 font-medium cursor-pointer"
        >
          Heal
        </button>
        <button
          onClick={handleSetTempHp}
          className="px-3 py-1 text-sm rounded bg-teal-100 text-teal-700 hover:bg-teal-200 font-medium cursor-pointer"
          title="Set temp HP (uses highest value per D&D rules)"
        >
          +Temp HP
        </button>
        {temporaryHp > 0 && (
          <span className="text-sm text-teal-600 font-medium">Temp: {temporaryHp}</span>
        )}
      </div>
    </div>
  );
}

export default InitiativeItem;
