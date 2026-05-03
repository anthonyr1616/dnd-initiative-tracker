import styles from "./HpBar.module.css";
import { getHpStatus } from "../helpers/helperMethods";

function HpBar({ currentHp, maxHp, showLabel = false, isPrivate = false }) {
  const { key, label, pct } = getHpStatus(currentHp, maxHp);
  return (
    <div className="flex items-center gap-2">
      <div
        className={`flex-1 rounded-full h-2 overflow-hidden ${styles.track}`}
      >
        <div
          className={`h-full rounded-full transition-all duration-300 ${isPrivate ? styles.barPrivate : styles.bar}`}
          data-status={isPrivate ? undefined : key}
          style={isPrivate ? undefined : { width: `${pct * 100}%` }}
        />
      </div>
      {showLabel && (
        <span
          className={`text-xs font-medium shrink-0 text-right ${isPrivate ? "" : styles.label}`}
          style={{ minWidth: "6.5rem", color: isPrivate ? "var(--color-text-faint)" : undefined }}
          data-status={isPrivate ? undefined : key}
        >
          {isPrivate ? "???" : label}
        </span>
      )}
    </div>
  );
}

export default HpBar;
