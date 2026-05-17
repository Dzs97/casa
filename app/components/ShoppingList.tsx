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
  onChecksChange: (checks: string[]) => void;
}

interface AggIngredient {
  key: string;
  name: string;
  aisle: Aisle;
  store: Store;
  quantities: string[];
  /** ¿Aparece SOLO en platillos marcados como hechos? Entonces ya se consumió. */
  consumido: boolean;
  fromDishes: Set<string>;
}

type GroupBy = "pasillo" | "super";

function aggregate(
  cycle: Cycle,
  state: CycleState,
  dishById: Map<string, Dish>
): AggIngredient[] {
  type Internal = AggIngredient & { totalUses: number; consumedUses: number };
  const acc = new Map<string, Internal>();

  cycle.days.forEach((day, idx) => {
    MEAL_SLOTS.forEach((slot) => {
      const mark = state.marks[`${idx}-${slot}`];
      // Saltado = ignorar completamente (ya no aplica)
      if (mark === "saltado") return;
      const dishId = day[slot];
      if (!dishId) return;
      const dish = dishById.get(dishId);
      if (!dish) return;
      const isConsumedMeal = mark === "hecho" || mark === "extra";
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
            consumido: false,
            fromDishes: new Set(),
            totalUses: 0,
            consumedUses: 0,
          });
        }
        const entry = acc.get(key)!;
        if (ing.quantity) {
          entry.quantities.push(
            `${ing.quantity}${ing.unit ? ` ${ing.unit}` : ""}`
          );
        }
        entry.fromDishes.add(dish.name);
        entry.totalUses += 1;
        if (isConsumedMeal) entry.consumedUses += 1;
      });
    });
  });

  return Array.from(acc.values())
    .map((e) => ({
      ...e,
      // Si todos los usos están consumidos → ingrediente consumido
      consumido: e.totalUses > 0 && e.consumedUses === e.totalUses,
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

const STORE_ACCENT: Record<Store, string> = {
  "wild-fork": "var(--accent)",
  "sumesa-walmart": "var(--accent-2)",
  otros: "var(--ink-faded)",
};

export function ShoppingList({ cycle, state, dishById, onChecksChange }: Props) {
  const [groupBy, setGroupBy] = useState<GroupBy>("super");
  const [showConsumed, setShowConsumed] = useState(false);

  const checks = useMemo(
    () => new Set(state.shoppingChecks ?? []),
    [state.shoppingChecks]
  );

  const items = useMemo(
    () => aggregate(cycle, state, dishById),
    [cycle, state, dishById]
  );

  const toggle = (key: string) => {
    const next = new Set(checks);
    if (next.has(key)) next.delete(key);
    else next.add(key);
    onChecksChange(Array.from(next));
  };

  const clearChecks = () => {
    if (checks.size === 0) return;
    if (!confirm("¿Desmarcar todos los ingredientes de la lista?")) return;
    onChecksChange([]);
  };

  // Particionar: por consumir vs ya consumido (todos sus platillos hechos)
  const porComprar = items.filter((i) => !i.consumido);
  const consumidos = items.filter((i) => i.consumido);

  // Por comprar: separar adicional entre "marcados como ya tengo" y "pendientes"
  const pendientes = porComprar.filter((i) => !checks.has(i.key));
  const yaTengo = porComprar.filter((i) => checks.has(i.key));

  const renderGroups = (list: AggIngredient[]) => {
    if (list.length === 0) return null;
    const groups =
      groupBy === "super"
        ? STORE_ORDER.map((s) => ({
            key: s,
            label: STORE_LABELS[s],
            accent: STORE_ACCENT[s],
            items: list.filter((i) => i.store === s),
          })).filter((g) => g.items.length > 0)
        : AISLE_ORDER.map((a) => ({
            key: a,
            label: AISLE_LABELS[a],
            accent: undefined,
            items: list.filter((i) => i.aisle === a),
          })).filter((g) => g.items.length > 0);

    return groups.map((group) => {
      const inner =
        groupBy === "super"
          ? AISLE_ORDER.map((a) => ({
              aisle: a,
              items: group.items.filter((i) => i.aisle === a),
            })).filter((s) => s.items.length > 0)
          : [{ aisle: null as Aisle | null, items: group.items }];

      return (
        <div key={group.key} className="shopping-aisle">
          <h3
            style={{
              color: group.accent ?? undefined,
              borderColor: group.accent ? `${group.accent}33` : undefined,
              fontSize: groupBy === "super" ? 13 : 11,
              letterSpacing: groupBy === "super" ? "0.04em" : "0.1em",
              fontFamily:
                groupBy === "super" ? "var(--font-serif)" : "var(--font-mono)",
              textTransform: groupBy === "super" ? "none" : "uppercase",
              fontWeight: 600,
              paddingBottom: 8,
              borderBottomWidth: 1.5,
              borderBottomStyle: "solid",
            }}
          >
            {group.label}{" "}
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                color: "var(--ink-faded)",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                fontWeight: 400,
              }}
            >
              ({group.items.length})
            </span>
          </h3>

          {inner.map((sub) => (
            <div
              key={sub.aisle ?? "all"}
              style={{ marginBottom: groupBy === "super" ? 14 : 0 }}
            >
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
                const isChecked = checks.has(ing.key);
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
    });
  };

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
        <div style={{ flex: "1 1 auto", minWidth: 180 }}>
          <div style={{ fontWeight: 500 }}>
            {pendientes.length} pendientes · {yaTengo.length} ya en casa ·{" "}
            {consumidos.length} consumidos
          </div>
          <div className="muted" style={{ fontSize: 13 }}>
            Marca lo que ya tienes en casa o pones al carrito. Se sincroniza.
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
        {checks.size > 0 && (
          <button className="btn btn-sm btn-ghost" onClick={clearChecks}>
            Desmarcar todo
          </button>
        )}
      </div>

      {items.length === 0 && (
        <div className="empty-state">No hay ingredientes en el ciclo.</div>
      )}

      {/* PENDIENTES */}
      {pendientes.length > 0 && (
        <div style={{ marginBottom: 28 }}>
          <div
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: 18,
              fontWeight: 600,
              marginBottom: 10,
            }}
          >
            🛒 Por comprar
            <span
              className="muted"
              style={{ fontSize: 13, marginLeft: 8, fontFamily: "var(--font-mono)" }}
            >
              {pendientes.length}
            </span>
          </div>
          {renderGroups(pendientes)}
        </div>
      )}

      {/* YA TENGO */}
      {yaTengo.length > 0 && (
        <details open={pendientes.length === 0} style={{ marginBottom: 28 }}>
          <summary
            style={{
              cursor: "pointer",
              fontFamily: "var(--font-serif)",
              fontSize: 17,
              fontWeight: 600,
              marginBottom: 10,
              color: "var(--ink-muted)",
            }}
          >
            ✓ Ya en casa / en el carrito
            <span
              className="muted"
              style={{ fontSize: 13, marginLeft: 8, fontFamily: "var(--font-mono)" }}
            >
              {yaTengo.length}
            </span>
          </summary>
          <div style={{ marginTop: 10, opacity: 0.85 }}>{renderGroups(yaTengo)}</div>
        </details>
      )}

      {/* CONSUMIDOS */}
      {consumidos.length > 0 && (
        <details
          open={showConsumed}
          onToggle={(e) => setShowConsumed((e.target as HTMLDetailsElement).open)}
          style={{ marginTop: 12 }}
        >
          <summary
            style={{
              cursor: "pointer",
              fontFamily: "var(--font-serif)",
              fontSize: 17,
              fontWeight: 600,
              color: "var(--ink-faded)",
            }}
          >
            🍽 Consumidos
            <span
              className="muted"
              style={{ fontSize: 13, marginLeft: 8, fontFamily: "var(--font-mono)" }}
            >
              {consumidos.length}
            </span>
          </summary>
          <div
            style={{
              marginTop: 14,
              opacity: 0.55,
              fontSize: 14,
            }}
          >
            <p className="muted" style={{ fontSize: 13, marginBottom: 10 }}>
              Ingredientes de platillos que ya marcaste como hechos.
            </p>
            {renderGroups(consumidos)}
          </div>
        </details>
      )}
    </div>
  );
}
