"use client";

import { useMemo, useState } from "react";
import type { Aisle, Cycle, CycleState, Dish, Store } from "../lib/types";
import {
  AISLE_LABELS,
  AISLE_ORDER,
  MEAL_SLOTS,
  STORE_LABELS,
  STORE_ORDER,
  defaultStoreForAisle,
} from "../lib/types";

interface Props {
  cycle: Cycle;
  state: CycleState;
  dishById: Map<string, Dish>;
}

interface AggIngredient {
  key: string;
  name: string;
  aisle: Aisle;
  store: Store;
  quantities: string[];
  fromDishes: Set<string>;
}

type GroupBy = "pasillo" | "super";

function aggregate(
  cycle: Cycle,
  state: CycleState,
  dishById: Map<string, Dish>,
  excludeDone: boolean
): AggIngredient[] {
  const acc = new Map<string, AggIngredient>();

  cycle.days.forEach((day, idx) => {
    MEAL_SLOTS.forEach((slot) => {
      const mark = state.marks[`${idx}-${slot}`];
      if (excludeDone && (mark === "hecho" || mark === "saltado")) return;
      const dishId = day[slot];
      if (!dishId) return;
      const dish = dishById.get(dishId);
      if (!dish) return;
      dish.ingredients.forEach((ing) => {
        const store = ing.store ?? defaultStoreForAisle(ing.aisle);
        const key = `${ing.name.toLowerCase().trim()}|${store}`;
        if (!acc.has(key)) {
          acc.set(key, {
            key,
            name: ing.name,
            aisle: ing.aisle,
            store,
            quantities: [],
            fromDishes: new Set(),
          });
        }
        const entry = acc.get(key)!;
        if (ing.quantity) {
          entry.quantities.push(
            `${ing.quantity}${ing.unit ? ` ${ing.unit}` : ""}`
          );
        }
        entry.fromDishes.add(dish.name);
      });
    });
  });

  return Array.from(acc.values()).sort((a, b) =>
    a.name.localeCompare(b.name)
  );
}

const STORE_ACCENT: Record<Store, string> = {
  "wild-fork": "var(--accent)",
  "sumesa-walmart": "var(--accent-2)",
  otros: "var(--ink-faded)",
};

export function ShoppingList({ cycle, state, dishById }: Props) {
  const [checked, setChecked] = useState<Set<string>>(new Set());
  const [excludeDone, setExcludeDone] = useState(true);
  const [groupBy, setGroupBy] = useState<GroupBy>("super");

  const items = useMemo(
    () => aggregate(cycle, state, dishById, excludeDone),
    [cycle, state, dishById, excludeDone]
  );

  const toggle = (key: string) => {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const totalItems = items.length;

  // Group
  const groups: Array<{ key: string; label: string; accent?: string; items: AggIngredient[] }> =
    groupBy === "super"
      ? STORE_ORDER.map((s) => ({
          key: s,
          label: STORE_LABELS[s],
          accent: STORE_ACCENT[s],
          items: items.filter((i) => i.store === s),
        })).filter((g) => g.items.length > 0)
      : AISLE_ORDER.map((a) => ({
          key: a,
          label: AISLE_LABELS[a],
          items: items.filter((i) => i.aisle === a),
        })).filter((g) => g.items.length > 0);

  return (
    <div>
      <div
        className="card"
        style={{
          marginBottom: 16,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <div>
          <div style={{ fontWeight: 500 }}>
            {totalItems} ingredientes · {checked.size} marcados
          </div>
          <div className="muted" style={{ fontSize: 13 }}>
            Cantidades sumadas como referencia (revísalas).
          </div>
        </div>
        <div className="view-switcher">
          <button
            className={groupBy === "super" ? "active" : ""}
            onClick={() => setGroupBy("super")}
          >
            Por súper
          </button>
          <button
            className={groupBy === "pasillo" ? "active" : ""}
            onClick={() => setGroupBy("pasillo")}
          >
            Por pasillo
          </button>
        </div>
        <label
          className="flex gap-2"
          style={{
            alignItems: "center",
            fontSize: 13,
            cursor: "pointer",
            width: "100%",
          }}
        >
          <input
            type="checkbox"
            checked={excludeDone}
            onChange={(e) => setExcludeDone(e.target.checked)}
          />
          Excluir platillos ya hechos
        </label>
      </div>

      {totalItems === 0 && (
        <div className="empty-state">No hay ingredientes que comprar.</div>
      )}

      {groups.map((group) => {
        // Subagrupar por pasillo dentro del súper (solo en vista por súper)
        const inner =
          groupBy === "super"
            ? AISLE_ORDER.map((a) => ({
                aisle: a,
                items: group.items.filter((i) => i.aisle === a),
              })).filter((s) => s.items.length > 0)
            : [{ aisle: null as Aisle | null, items: group.items }];

        const groupCheckedCount = group.items.filter((i) => checked.has(i.key)).length;

        return (
          <div key={group.key} className="shopping-aisle">
            <h3
              style={{
                color: group.accent ?? undefined,
                borderColor: group.accent
                  ? `${group.accent}33`
                  : undefined,
                fontSize: groupBy === "super" ? 13 : 11,
                letterSpacing: groupBy === "super" ? "0.04em" : "0.1em",
                fontFamily: groupBy === "super" ? "var(--font-serif)" : "var(--font-mono)",
                textTransform: groupBy === "super" ? "none" : "uppercase",
                fontWeight: 600,
                paddingBottom: 8,
                borderBottomWidth: 1.5,
                borderBottomStyle: "solid",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
              }}
            >
              <span>{group.label}</span>
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 11,
                  color: "var(--ink-faded)",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                {groupCheckedCount}/{group.items.length}
              </span>
            </h3>

            {inner.map((sub) => (
              <div key={sub.aisle ?? "all"} style={{ marginBottom: groupBy === "super" ? 14 : 0 }}>
                {groupBy === "super" && sub.aisle && (
                  <div
                    className="muted"
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 10,
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                      marginTop: 8,
                      marginBottom: 4,
                    }}
                  >
                    {AISLE_LABELS[sub.aisle]}
                  </div>
                )}
                {sub.items.map((ing) => {
                  const isChecked = checked.has(ing.key);
                  return (
                    <label
                      key={ing.key}
                      className={`shopping-item ${isChecked ? "done" : ""}`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggle(ing.key)}
                      />
                      <span>{ing.name}</span>
                      {ing.quantities.length > 0 && (
                        <span className="shopping-qty">
                          ({ing.quantities.join(" + ")})
                        </span>
                      )}
                    </label>
                  );
                })}
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}
