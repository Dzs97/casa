"use client";

import { useState } from "react";
import type {
  Cycle,
  CycleState,
  Dish,
  MealSlot,
  MealStatus,
} from "../lib/types";
import { MEAL_LABELS } from "../lib/types";
import { addDays, formatShortDate } from "../lib/dates";

interface Props {
  dayIdx: number;
  slot: MealSlot;
  cycle: Cycle;
  state: CycleState;
  dishes: Dish[];
  dishById: Map<string, Dish>;
  onClose: () => void;
  onSetStatus: (s: MealStatus) => void;
  onSwap: (dishId: string | null) => void;
}

const STATUS_OPTIONS: { value: MealStatus; label: string; desc: string }[] = [
  { value: "pendiente", label: "Pendiente", desc: "Aún por hacer" },
  { value: "hecho", label: "Hecho", desc: "Lo cocinamos / comimos" },
  {
    value: "extra",
    label: "Extra",
    desc: "Sustituido (salimos a comer, sobras, etc.)",
  },
  { value: "saltado", label: "Saltado", desc: "Ya no aplica" },
];

export function DishModal({
  dayIdx,
  slot,
  cycle,
  state,
  dishes,
  dishById,
  onClose,
  onSetStatus,
  onSwap,
}: Props) {
  const dishId = cycle.days[dayIdx][slot];
  const dish = dishId ? dishById.get(dishId) : null;
  const status = (state.marks[`${dayIdx}-${slot}`] as MealStatus) ?? "pendiente";
  const date = addDays(cycle.startDate, dayIdx);

  const [swapping, setSwapping] = useState(false);
  const slotDishes = dishes.filter((d) => d.slot === slot);

  // Sugerencias para "extra": platillos no usados aún en otros días "hecho"
  const pendingSameSlotIdxs: number[] = [];
  cycle.days.forEach((d, i) => {
    if (i === dayIdx) return;
    const s = state.marks[`${i}-${slot}`];
    if (!s || s === "pendiente") {
      if (d[slot]) pendingSameSlotIdxs.push(i);
    }
  });

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h3>
          {MEAL_LABELS[slot]} · D{dayIdx + 1} · {formatShortDate(date)}
        </h3>

        <div className="card" style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 13, color: "var(--ink-faded)", marginBottom: 4 }}>
            Platillo
          </div>
          <div style={{ fontSize: 16, fontWeight: 500 }}>
            {dish ? dish.name : <em className="muted">Sin asignar</em>}
          </div>
          {dish && dish.ingredients.length > 0 && (
            <details style={{ marginTop: 10 }}>
              <summary className="muted" style={{ fontSize: 13, cursor: "pointer" }}>
                Ver ingredientes
              </summary>
              <ul style={{ marginTop: 8, paddingLeft: 18, fontSize: 13 }}>
                {dish.ingredients.map((ing, i) => (
                  <li key={i}>
                    {ing.name}
                    {ing.quantity && (
                      <span className="muted">
                        {" "}
                        — {ing.quantity}
                        {ing.unit ? ` ${ing.unit}` : ""}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </details>
          )}
          <button
            className="btn btn-sm"
            style={{ marginTop: 10 }}
            onClick={() => setSwapping((v) => !v)}
          >
            {swapping ? "Cancelar" : "Cambiar platillo"}
          </button>
        </div>

        {swapping && (
          <div className="card" style={{ marginBottom: 16 }}>
            <div className="field">
              <label>Reemplazar por</label>
              <select
                value={dishId ?? ""}
                onChange={(e) => onSwap(e.target.value || null)}
              >
                <option value="">— sin asignar —</option>
                {slotDishes.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>
            {pendingSameSlotIdxs.length > 0 && (
              <div style={{ fontSize: 12, color: "var(--ink-muted)" }}>
                💡 Tip: platillos pendientes en otros días que podrías mover aquí:{" "}
                {pendingSameSlotIdxs
                  .slice(0, 5)
                  .map((i) => {
                    const did = cycle.days[i][slot];
                    return did ? dishById.get(did)?.name : null;
                  })
                  .filter(Boolean)
                  .join(", ")}
              </div>
            )}
          </div>
        )}

        <div className="field">
          <label>Estado</label>
          <div style={{ display: "grid", gap: 6 }}>
            {STATUS_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                className="btn"
                style={{
                  justifyContent: "flex-start",
                  background:
                    status === opt.value ? "var(--ink)" : "var(--bg-card)",
                  color: status === opt.value ? "var(--bg-elevated)" : "var(--ink)",
                  borderColor:
                    status === opt.value ? "var(--ink)" : "var(--border)",
                }}
                onClick={() => onSetStatus(opt.value)}
              >
                <span style={{ fontWeight: 500 }}>{opt.label}</span>
                <span
                  className="muted"
                  style={{
                    fontSize: 12,
                    marginLeft: "auto",
                    color: status === opt.value ? "var(--bg)" : "var(--ink-faded)",
                  }}
                >
                  {opt.desc}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="modal-actions">
          <button className="btn" onClick={onClose}>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
