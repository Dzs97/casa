"use client";

import { useMemo, useState } from "react";
import type { Aisle, Cycle, CycleState, Dish, Ingredient } from "../lib/types";
import { AISLE_LABELS, AISLE_ORDER, MEAL_SLOTS } from "../lib/types";

interface Props {
  cycle: Cycle;
  state: CycleState;
  dishById: Map<string, Dish>;
}

interface AggIngredient {
  key: string;
  name: string;
  aisle: Aisle;
  quantities: string[]; // "200 g", "1 pza", etc.
  fromDishes: Set<string>;
}

/** Agrega ingredientes de todos los días que no estén "hechos" ni "saltados". */
function aggregate(
  cycle: Cycle,
  state: CycleState,
  dishById: Map<string, Dish>,
  excludeDone: boolean
): Map<Aisle, AggIngredient[]> {
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
        const key = ing.name.toLowerCase().trim();
        if (!acc.has(key)) {
          acc.set(key, {
            key,
            name: ing.name,
            aisle: ing.aisle,
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

  // Agrupar por pasillo
  const byAisle = new Map<Aisle, AggIngredient[]>();
  AISLE_ORDER.forEach((a) => byAisle.set(a, []));
  acc.forEach((ing) => byAisle.get(ing.aisle)?.push(ing));
  byAisle.forEach((list) => list.sort((a, b) => a.name.localeCompare(b.name)));
  return byAisle;
}

export function ShoppingList({ cycle, state, dishById }: Props) {
  const [checked, setChecked] = useState<Set<string>>(new Set());
  const [excludeDone, setExcludeDone] = useState(true);

  const byAisle = useMemo(
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

  const totalItems = Array.from(byAisle.values()).reduce(
    (sum, l) => sum + l.length,
    0
  );

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
          gap: 10,
        }}
      >
        <div>
          <div style={{ fontWeight: 500 }}>
            {totalItems} ingredientes · {checked.size} marcados
          </div>
          <div className="muted" style={{ fontSize: 13 }}>
            Agrupado por pasillo. Cantidades sumadas como referencia (revísalas).
          </div>
        </div>
        <label
          className="flex gap-2"
          style={{ alignItems: "center", fontSize: 13, cursor: "pointer" }}
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

      {AISLE_ORDER.map((aisle) => {
        const list = byAisle.get(aisle) ?? [];
        if (list.length === 0) return null;
        return (
          <div key={aisle} className="shopping-aisle">
            <h3>{AISLE_LABELS[aisle]}</h3>
            {list.map((ing) => {
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
        );
      })}
    </div>
  );
}
