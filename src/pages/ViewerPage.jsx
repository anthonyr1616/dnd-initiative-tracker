import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { subscribeToSession } from "../services/sessionService";
import HpBar from "../components/HpBar";
import { getHpStatus } from "../helpers/helperMethods";

function PrivateHpBar() {
  return (
    <div className="flex items-center gap-2">
      <div
        style={{
          flex: 1,
          height: "8px",
          borderRadius: "9999px",
          overflow: "hidden",
          background: "var(--color-hp-bar-track)",
        }}
      >
        <div
          style={{
            height: "100%",
            width: "100%",
            borderRadius: "9999px",
            background:
              "repeating-linear-gradient(45deg, var(--color-text-faint) 0px, var(--color-text-faint) 4px, transparent 4px, transparent 8px)",
          }}
        />
      </div>
    </div>
  );
}

function ViewerPage() {
  const { id } = useParams();
  const [session, setSession] = useState(undefined);

  useEffect(() => {
    const unsub = subscribeToSession(id, setSession);
    return unsub;
  }, [id]);

  const pageStyle = {
    minHeight: "100vh",
    background: "var(--color-bg)",
    padding: "1.5rem",
  };

  if (session === undefined) {
    return (
      <div
        style={{
          ...pageStyle,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <p style={{ color: "var(--color-text-primary)" }}>Loading session…</p>
      </div>
    );
  }

  if (session === null) {
    return (
      <div
        style={{
          ...pageStyle,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <p style={{ color: "var(--color-text-primary)" }}>Session not found.</p>
      </div>
    );
  }

  const { items = [], currentTurnId, round } = session;
  const currentItem = items.find((i) => i.id === currentTurnId);
  const currentItemNameHidden = currentItem?.privateFields?.name;

  return (
    <div style={pageStyle}>
      <div className="max-w-2xl mx-auto space-y-4">
        <h1
          className="text-3xl font-bold text-center"
          style={{
            color: "white",
            textShadow:
              "2px 2px 0 black, -2px 2px 0 black, 2px -2px 0 black, -2px -2px 0 black",
          }}
        >
          Initiative Tracker
        </h1>

        <div
          className="rounded-xl px-4 py-3 flex items-center justify-between"
          style={{
            background: "var(--color-surface)",
            boxShadow: "0 4px 6px -1px var(--color-brand-shadow)",
          }}
        >
          <span
            className="font-bold text-lg"
            style={{ color: "var(--color-brand-dark)" }}
          >
            Round {round}
          </span>
          {currentItem ? (
            <span
              className="font-medium"
              style={{
                color: "var(--color-text-primary)",
                fontStyle: currentItemNameHidden ? "italic" : "normal",
              }}
            >
              {currentItemNameHidden ? "???" : currentItem.name}&apos;s turn
            </span>
          ) : (
            <span
              className="text-sm"
              style={{ color: "var(--color-text-muted)" }}
            >
              Combat not started
            </span>
          )}
        </div>

        <div className="space-y-2">
          {items.length === 0 && (
            <p
              className="text-center py-8 text-sm"
              style={{ color: "var(--color-text-muted)" }}
            >
              Waiting for combatants…
            </p>
          )}
          {items.map((item) => {
            const isActive = item.id === currentTurnId;
            const { pct } = getHpStatus(item.currentHp, item.maxHp);
            const pf = item.privateFields ?? {};
            const nameHidden = !!pf.name;
            const hpHidden = !!pf.hp;
            const acHidden = !!pf.ac;

            return (
              <div
                key={item.id}
                className="rounded-xl px-4 py-3"
                style={{
                  background: "var(--color-surface)",
                  boxShadow: isActive
                    ? "0 0 0 2px var(--color-brand-dark), 0 4px 6px -1px var(--color-brand-shadow)"
                    : "0 1px 3px 0 var(--color-brand-shadow)",
                  opacity: pct === 0 ? 0.5 : 1,
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span
                    className="font-semibold"
                    style={{
                      color: nameHidden
                        ? "var(--color-text-faint)"
                        : "var(--color-text-primary)",
                      textDecoration: pct === 0 ? "line-through" : "none",
                      fontStyle: nameHidden ? "italic" : "normal",
                    }}
                  >
                    {nameHidden ? "???" : item.name}
                  </span>
                  <div
                    className="flex items-center gap-4 text-sm"
                    style={{ color: "var(--color-text-muted)" }}
                  >
                    <span>Initiative {item.initiative}</span>
                    <span>
                      AC{" "}
                      {acHidden ? (
                        <span
                          style={{
                            color: "var(--color-text-faint)",
                            fontStyle: "italic",
                          }}
                        >
                          ??
                        </span>
                      ) : (
                        item.ac + (item.bonusAc || 0)
                      )}
                    </span>
                  </div>
                </div>

                {item.maxHp > 0 &&
                  (hpHidden ? (
                    <PrivateHpBar />
                  ) : (
                    <HpBar
                      currentHp={item.currentHp}
                      maxHp={item.maxHp}
                      showLabel
                    />
                  ))}
                {item.maxHp > 0 && hpHidden && (
                  <div
                    className="mt-1 text-right text-xs font-medium"
                    style={{
                      color: "var(--color-text-muted)",
                      minWidth: "6.5rem",
                    }}
                  >
                    {getHpStatus(item.currentHp, item.maxHp).label}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <p
          className="text-center text-xs"
          style={{ color: "var(--color-text-faint)" }}
        >
          Live view
        </p>
      </div>
    </div>
  );
}

export default ViewerPage;
