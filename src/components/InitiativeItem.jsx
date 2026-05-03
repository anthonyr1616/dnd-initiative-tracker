import { useState } from "react";
import {
  Trash2,
  Edit,
  Heart,
  Shield,
  Zap,
  ChevronUp,
  ChevronDown,
  HeartPlus,
  Sword,
  Eye,
  EyeOff,
} from "lucide-react";
import styles from "./InitiativeItem.module.css";
import HpBar from "./HpBar";
import { getHpStatus } from "../helpers/helperMethods";

function PrivacyToggle({ field, privateFields, onToggle, sessionActive }) {
  if (!sessionActive) return null;
  const isHidden = !!privateFields[field];
  return (
    <button
      type="button"
      onClick={() => onToggle(field)}
      className={`${styles.privacyBtn} ${isHidden ? styles.privacyBtnHidden : ""}`}
      title={
        isHidden
          ? `${field} hidden from viewers - click to reveal`
          : `${field} visible to viewers - click to hide`
      }
    >
      {isHidden ? (
        <EyeOff className="w-3.5 h-3.5" />
      ) : (
        <Eye className="w-3.5 h-3.5" />
      )}
    </button>
  );
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
  privateFields,
  sessionActive = false,
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

  const pf = { name: false, hp: false, ac: false, ...privateFields };

  const togglePrivacy = (field) => {
    onUpdate(id, { privateFields: { ...pf, [field]: !pf[field] } });
  };

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

  const { key: status } = getHpStatus(currentHp, maxHp);

  return (
    <div
      className={`rounded-xl p-3 transition-all ${styles.card} ${isCurrentTurn ? styles.cardActive : ""}`}
    >
      {/* Main row */}
      <div className="flex items-center gap-3">
        <div className="flex flex-col gap-0.5 w-5">
          {canMoveUp ? (
            <button
              onClick={() => onMoveUp(id)}
              className={`cursor-pointer ${styles.reorderBtn}`}
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
              className={`cursor-pointer ${styles.reorderBtn}`}
              title="Move down"
            >
              <ChevronDown className="w-5 h-5" />
            </button>
          ) : (
            <span className="w-5 h-5" />
          )}
        </div>

        {/* Name + privacy toggle */}
        <div className="flex items-center gap-1.5 flex-1 min-w-0">
          <p
            className={`text-2xl font-bold truncate ${styles.name} ${isCurrentTurn ? styles.nameActive : ""}`}
          >
            {name}
          </p>
          <PrivacyToggle
            field="name"
            privateFields={pf}
            onToggle={togglePrivacy}
            sessionActive={sessionActive}
          />
        </div>

        <div className="flex items-center gap-4 shrink-0">
          {/* HP group */}
          <div className="flex flex-col items-center gap-0.5">
            <PrivacyToggle
              field="hp"
              privateFields={pf}
              onToggle={togglePrivacy}
              sessionActive={sessionActive}
            />
            <div
              className="flex items-center gap-1"
              title={`HP`}
            >
              <Heart
                className={`w-5 h-5 ${styles.heartIcon}`}
                strokeWidth={1}
              />
              <span
                className={`text-xl font-semibold ${styles.hpValue}`}
                data-status={status}
              >
                {currentHp}
                {temporaryHp > 0 && (
                  <span className={`text-base ${styles.tempBonus}`}>
                    +{temporaryHp}
                  </span>
                )}
              </span>
              <span className={`text-base ${styles.hpMax}`}>/{maxHp}</span>
            </div>
          </div>

          {/* AC group */}
          <div className="flex flex-col items-center gap-0.5">
            <PrivacyToggle
              field="ac"
              privateFields={pf}
              onToggle={togglePrivacy}
              sessionActive={sessionActive}
            />
            <div
              className="flex items-center gap-1"
              title={`Armor Class`}
            >
              <Shield
                className={`w-5 h-5 ${styles.shieldIcon}`}
                strokeWidth={1}
              />
              <span className="text-xl font-semibold">{ac + bonusAc}</span>
              {bonusAc > 0 && (
                <span className={`text-sm ${styles.bonusAc}`}>+{bonusAc}</span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1" title="Initiative">
            <Zap className={`w-5 h-5 ${styles.zapIcon}`} strokeWidth={1} />
            <span className="text-xl font-semibold">{initiative}</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={() => onEdit(id)}
            className={`w-9 h-9 flex items-center justify-center rounded-full transition-colors cursor-pointer ${styles.editBtn}`}
            title="Edit"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(id)}
            className={`w-9 h-9 flex items-center justify-center rounded-full transition-colors cursor-pointer ${styles.deleteBtn}`}
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* HP bar */}
      <div className="mt-2">
        <HpBar currentHp={currentHp} maxHp={maxHp} />
      </div>

      {/* Action row */}
      <div className="mt-2 flex items-center gap-2 flex-wrap">
        <input
          type="number"
          min="1"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Amount"
          className={`w-24 rounded border px-2 py-1 text-sm ${styles.amountInput}`}
        />
        <button
          onClick={handleDamage}
          className={`px-3 py-1 text-sm rounded font-medium cursor-pointer  flex items-center gap-1  ${styles.damageBtn}`}
          title="Apply damage"
        >
          <Sword className="w-4 h-4" />
          Damage
        </button>
        <button
          onClick={handleHeal}
          className={`px-3 py-1 text-sm rounded font-medium cursor-pointer flex items-center gap-1 ${styles.healBtn}`}
        >
          <Heart className="w-4 h-4" />
          Heal
        </button>
        <button
          onClick={handleSetTempHp}
          className={`px-3 py-1 text-sm rounded font-medium cursor-pointer flex items-center gap-1 ${styles.tempHpBtn}`}
          title="Set temp HP"
        >
          <HeartPlus className="w-4 h-4" />
          Temp HP
        </button>
      </div>
    </div>
  );
}

export default InitiativeItem;
