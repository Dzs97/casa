"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import type {
  Cycle,
  CycleState,
  Dish,
  MealSlot,
  MealStatus,
} from "../lib/types";
import { MEAL_SLOTS, MEAL_LABELS } from "../lib/types";
import {
  addDays,
  daysBetween,
  formatLongDate,
  formatShortDate,
  todayISO,
} from "../lib/dates";
import { DishModal } from "./DishModal";
import { ShoppingList } from "./ShoppingList";
import { DishEditor } from "./DishEditor";
import { Toast } from "./Toast";

type View = "hoy" | "semana" | "lista" | "platillos";

const SLOT_EMOJI: Record<MealSlot, string> = {
  desayuno: "🌅",
  comida: "🍽",
  cena: "🌙",
};

const STATUS_PILL: Record<MealStatus, { label: string; color: string }> = {
  pendiente: { label: "Pendiente", color: "var(--ink-faded)" },
  hecho: { label: "Hecho ✓", color: "var(--accent-2)" },
  extra: { label: "Sustituido", color: "var(--warn)" },
  saltado: { label: "Saltado", color: "var(--ink-faded)" },
};

export function MenuView() {
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [cycle, setCycle] = useState<Cycle | null>(null);
  const [state, setState] = useState<CycleState | null>(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<View>("hoy");
  const [editing, setEditing] = useState<{ dayIdx: number; slot: MealSlot } | null>(
    null
  );
  const [editingDish, setEditingDish] = useState<Dish | "new" | null>(null);
  const [toast, setToast] = useState<string>("");
  const [showAdmin, setShowAdmin] = useState(false);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 1800);
  }, []);

  useEffect(() => {
    (async () => {
      const r = await fetch("/api/menu");
      const data = await r.json();
      setDishes(data.dishes);
      setCycle(data.cycle);

      const s = await fetch(
        `/api/menu/state?startDate=${data.cycle.startDate}`
      );
      const stateData = await s.json();
      setState(stateData);
      setLoading(false);
    })();
  }, []);

  const dishById = useMemo(() => {
    const m = new Map<string, Dish>();
    dishes.forEach((d) => m.set(d.id, d));
    return m;
  }, [dishes]);

  const saveCycle = useCallback(
    async (newCycle: Cycle, newDishes?: Dish[]) => {
      setCycle(newCycle);
      if (newDishes) setDishes(newDishes);
      await fetch("/api/menu", {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          cycle: newCycle,
          dishes: newDishes ?? dishes,
        }),
      });
    },
    [dishes]
  );

  const saveState = useCallback(async (newState: CycleState) => {
    setState(newState);
    await fetch("/api/menu/state", {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(newState),
    });
  }, []);

  const setMark = useCallback(
    (dayIdx: number, slot: MealSlot, status: MealStatus) => {
      if (!state) return;
      const key = `${dayIdx}-${slot}`;
      const marks = { ...state.marks };
      if (status === "pendiente") delete marks[key];
      else marks[key] = status;
      saveState({ ...state, marks });
    },
    [state, saveState]
  );

  /** Toggle: si ya está en ese status, vuelve a pendiente. */
  const toggleMark = useCallback(
    (dayIdx: number, slot: MealSlot, status: MealStatus) => {
      if (!state) return;
      const current = state.marks[`${dayIdx}-${slot}`] ?? "pendiente";
      setMark(dayIdx, slot, current === status ? "pendiente" : status);
    },
    [state, setMark]
  );

  const swapDish = useCallback(
    (dayIdx: number, slot: MealSlot, newDishId: string | null) => {
      if (!cycle) return;
      const newDays = cycle.days.map((d, i) =>
        i === dayIdx ? { ...d, [slot]: newDishId } : d
      );
      saveCycle({ ...cycle, days: newDays });
      showToast("Platillo actualizado");
    },
    [cycle, saveCycle, showToast]
  );

  const restartCycle = useCallback(async () => {
    if (!cycle) return;
    if (
      !confirm(
        "¿Reiniciar el ciclo? El ciclo empezará hoy. Los marcados de ciclos previos quedan guardados en el histórico."
      )
    ) {
      return;
    }
    const newCycle = { ...cycle, startDate: todayISO() };
    await saveCycle(newCycle);
    const newState: CycleState = { startDate: newCycle.startDate, marks: {} };
    await saveState(newState);
    showToast("Ciclo reiniciado");
  }, [cycle, saveCycle, saveState, showToast]);

  const moveCycleStart = useCallback(
    async (offsetDays: number) => {
      if (!cycle) return;
      const newStart = addDays(cycle.startDate, offsetDays);
      const newCycle = { ...cycle, startDate: newStart };
      await saveCycle(newCycle);
      const s = await fetch(`/api/menu/state?startDate=${newStart}`);
      const stateData = await s.json();
      setState(stateData);
    },
    [cycle, saveCycle]
  );

  const saveDish = useCallback(
    async (dish: Dish, isNew: boolean) => {
      const newDishes = isNew
        ? [...dishes, dish]
        : dishes.map((d) => (d.id === dish.id ? dish : d));
      setDishes(newDishes);
      await fetch("/api/menu", {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ dishes: newDishes }),
      });
      showToast(isNew ? "Platillo agregado" : "Platillo guardado");
    },
    [dishes, showToast]
  );

  const resetFromSeed = useCallback(async () => {
    if (
      !confirm(
        "¿Recargar el menú base desde el repositorio? Esto sobreescribirá los platillos y el ciclo actuales."
      )
    ) {
      return;
    }
    const r = await fetch("/api/menu/reset", { method: "POST" });
    if (!r.ok) {
      alert("Error al recargar el menú");
      return;
    }
    const m = await fetch("/api/menu").then((x) => x.json());
    setDishes(m.dishes);
    setCycle(m.cycle);
    const s = await fetch(`/api/menu/state?startDate=${m.cycle.startDate}`).then(
      (x) => x.json()
    );
    setState(s);
    showToast("Menú base recargado");
  }, [showToast]);

  const deleteDish = useCallback(
    async (id: string) => {
      if (!cycle) return;
      if (!confirm("¿Eliminar este platillo? Se quitará de los días donde esté asignado.")) {
        return;
      }
      const newDishes = dishes.filter((d) => d.id !== id);
      const newDays = cycle.days.map((d) => ({
        desayuno: d.desayuno === id ? null : d.desayuno,
        comida: d.comida === id ? null : d.comida,
        cena: d.cena === id ? null : d.cena,
      }));
      const newCycle = { ...cycle, days: newDays };
      setDishes(newDishes);
      setCycle(newCycle);
      await fetch("/api/menu", {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ dishes: newDishes, cycle: newCycle }),
      });
      showToast("Platillo eliminado");
    },
    [dishes, cycle, showToast]
  );

  if (loading || !cycle || !state) {
    return <div className="loader">Cargando menú…</div>;
  }

  const today = todayISO();
  const cycleEnd = addDays(cycle.startDate, 13);
  const todayIdx = daysBetween(cycle.startDate, today);
  const todayInCycle = todayIdx >= 0 && todayIdx < 14;

  // Stats
  const totalMeals = 14 * 3;
  const doneCount = Object.values(state.marks).filter((s) => s === "hecho").length;
  const extraCount = Object.values(state.marks).filter((s) => s === "extra").length;

  return (
    <>
      <div className="section-head">
        <div>
          <h1>Menú</h1>
          <p className="subtitle">
            Ciclo {formatShortDate(cycle.startDate)} → {formatShortDate(cycleEnd)} ·{" "}
            <span className="mono">
              {doneCount}/{totalMeals} hechos
            </span>
            {extraCount > 0 && (
              <span className="mono"> · {extraCount} sustituidos</span>
            )}
          </p>
        </div>
        <div className="view-switcher">
          <button
            className={view === "hoy" ? "active" : ""}
            onClick={() => setView("hoy")}
          >
            Hoy
          </button>
          <button
            className={view === "semana" ? "active" : ""}
            onClick={() => setView("semana")}
          >
            Ciclo
          </button>
          <button
            className={view === "lista" ? "active" : ""}
            onClick={() => setView("lista")}
          >
            Súper
          </button>
          <button
            className={view === "platillos" ? "active" : ""}
            onClick={() => setView("platillos")}
          >
            Platillos
          </button>
        </div>
      </div>

      {view === "hoy" && (
        <TodayView
          cycle={cycle}
          state={state}
          dishById={dishById}
          todayIdx={todayIdx}
          todayInCycle={todayInCycle}
          today={today}
          onOpenDetails={(dayIdx, slot) => setEditing({ dayIdx, slot })}
          onToggleStatus={toggleMark}
          onRestartCycle={restartCycle}
        />
      )}

      {view === "semana" && (
        <div className="card">
          {cycle.days.map((day, idx) => {
            const date = addDays(cycle.startDate, idx);
            const isToday = idx === todayIdx && todayInCycle;
            return (
              <div key={idx} className={`day-row ${isToday ? "today" : ""}`}>
                <div className="day-label">
                  <span className="day-num">D{idx + 1}</span>
                  {formatShortDate(date)}
                  {isToday && <span className="today-pill">hoy</span>}
                </div>
                <div className="meals">
                  {MEAL_SLOTS.map((slot) => {
                    const dishId = day[slot];
                    const dish = dishId ? dishById.get(dishId) : null;
                    const status =
                      (state.marks[`${idx}-${slot}`] as MealStatus) ?? "pendiente";
                    return (
                      <button
                        key={slot}
                        className="meal"
                        data-status={status}
                        onClick={() => setEditing({ dayIdx: idx, slot })}
                      >
                        <span className="meal-slot">{MEAL_LABELS[slot]}</span>
                        <span className="meal-name">
                          {dish ? dish.name : <em className="muted">— sin asignar —</em>}
                        </span>
                        {status !== "pendiente" && (
                          <span className={`status-badge ${status}`} />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {view === "lista" && (
        <ShoppingList
          cycle={cycle}
          state={state}
          dishById={dishById}
          onChecksChange={(checks) => saveState({ ...state, shoppingChecks: checks })}
        />
      )}

      {view === "platillos" && (
        <div>
          <div className="section-head" style={{ marginBottom: 14 }}>
            <h2>Platillos guardados</h2>
            <button
              className="btn btn-accent"
              onClick={() => setEditingDish("new")}
            >
              + Nuevo platillo
            </button>
          </div>
          {(["desayuno", "comida", "cena"] as MealSlot[]).map((slot) => {
            const list = dishes.filter((d) => d.slot === slot);
            return (
              <div key={slot} className="section">
                <h3 className="slot-header">
                  {SLOT_EMOJI[slot]} {MEAL_LABELS[slot]} ({list.length})
                </h3>
                {list.map((d) => (
                  <div key={d.id} className="dish-row">
                    <div>
                      <div className="dish-name">{d.name}</div>
                      <div className="muted" style={{ fontSize: 12 }}>
                        {d.ingredients.length} ingredientes
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        className="btn btn-sm"
                        onClick={() => setEditingDish(d)}
                      >
                        Editar
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => deleteDish(d.id)}
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                ))}
                {list.length === 0 && (
                  <p className="muted" style={{ fontSize: 13 }}>
                    Sin platillos en esta categoría.
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Sección de admin colapsable, fuera de las vistas principales */}
      {(view === "semana" || view === "platillos") && (
        <details
          className="admin-section"
          open={showAdmin}
          onToggle={(e) => setShowAdmin((e.target as HTMLDetailsElement).open)}
        >
          <summary>⚙️ Ajustes del ciclo</summary>
          <div className="admin-actions">
            <button className="btn btn-sm" onClick={() => moveCycleStart(-1)}>
              ← Mover inicio 1 día atrás
            </button>
            <button className="btn btn-sm" onClick={() => moveCycleStart(1)}>
              Mover inicio 1 día adelante →
            </button>
            <button className="btn btn-sm" onClick={restartCycle}>
              Reiniciar ciclo en hoy
            </button>
            <button className="btn btn-sm" onClick={resetFromSeed}>
              ↻ Cargar menú base desde repo
            </button>
          </div>
        </details>
      )}

      {editing && (
        <DishModal
          dayIdx={editing.dayIdx}
          slot={editing.slot}
          cycle={cycle}
          state={state}
          dishes={dishes}
          dishById={dishById}
          onClose={() => setEditing(null)}
          onSetStatus={(s) => setMark(editing.dayIdx, editing.slot, s)}
          onSwap={(id) => swapDish(editing.dayIdx, editing.slot, id)}
        />
      )}

      {editingDish && (
        <DishEditor
          dish={editingDish === "new" ? null : editingDish}
          onClose={() => setEditingDish(null)}
          onSave={(dish) => {
            saveDish(dish, editingDish === "new");
            setEditingDish(null);
          }}
        />
      )}

      <Toast message={toast} />
    </>
  );
}

// ============ Subcomponente: vista de hoy ============

interface TodayViewProps {
  cycle: Cycle;
  state: CycleState;
  dishById: Map<string, Dish>;
  todayIdx: number;
  todayInCycle: boolean;
  today: string;
  onOpenDetails: (dayIdx: number, slot: MealSlot) => void;
  onToggleStatus: (dayIdx: number, slot: MealSlot, status: MealStatus) => void;
  onRestartCycle: () => void;
}

function TodayView({
  cycle,
  state,
  dishById,
  todayIdx,
  todayInCycle,
  today,
  onOpenDetails,
  onToggleStatus,
  onRestartCycle,
}: TodayViewProps) {
  if (!todayInCycle) {
    const beforeStart = todayIdx < 0;
    return (
      <div className="empty-state-card">
        <h2 style={{ fontFamily: "var(--font-serif)" }}>
          {beforeStart
            ? `El ciclo empieza ${formatLongDate(cycle.startDate)}`
            : "El ciclo actual ya terminó"}
        </h2>
        <p className="muted">
          {beforeStart
            ? "Cuando llegue el día, aquí aparecerán las comidas planeadas."
            : "Reinicia el ciclo o muévelo desde Ajustes para empezar uno nuevo."}
        </p>
        <button className="btn btn-accent" onClick={onRestartCycle}>
          Empezar nuevo ciclo hoy
        </button>
      </div>
    );
  }

  const day = cycle.days[todayIdx];
  const tomorrowIdx = todayIdx + 1;
  const tomorrow = tomorrowIdx < 14 ? cycle.days[tomorrowIdx] : null;

  return (
    <>
      <div className="today-hero">
        <span className="today-eyebrow">HOY · D{todayIdx + 1}</span>
        <h2 className="today-date">{formatLongDate(today)}</h2>
      </div>

      {MEAL_SLOTS.map((slot) => {
        const dishId = day[slot];
        const dish = dishId ? dishById.get(dishId) : null;
        const status =
          (state.marks[`${todayIdx}-${slot}`] as MealStatus) ?? "pendiente";
        return (
          <MealCardBig
            key={slot}
            slot={slot}
            dish={dish}
            status={status}
            onDetails={() => onOpenDetails(todayIdx, slot)}
            onToggle={(s) => onToggleStatus(todayIdx, slot, s)}
          />
        );
      })}

      {tomorrow && (
        <aside className="tomorrow-preview">
          <h3>
            Mañana ·{" "}
            <span className="muted">
              {formatLongDate(addDays(cycle.startDate, tomorrowIdx))}
            </span>
          </h3>
          <ul>
            {MEAL_SLOTS.map((slot) => {
              const tDish = tomorrow[slot] ? dishById.get(tomorrow[slot]!) : null;
              return (
                <li key={slot}>
                  <span className="tomorrow-slot">{SLOT_EMOJI[slot]} {MEAL_LABELS[slot]}</span>
                  <span>{tDish?.name ?? "— sin asignar —"}</span>
                </li>
              );
            })}
          </ul>
        </aside>
      )}
    </>
  );
}

// ============ Subcomponente: tarjeta grande de comida ============

interface MealCardBigProps {
  slot: MealSlot;
  dish: Dish | undefined | null;
  status: MealStatus;
  onDetails: () => void;
  onToggle: (status: MealStatus) => void;
}

function MealCardBig({ slot, dish, status, onDetails, onToggle }: MealCardBigProps) {
  const pill = STATUS_PILL[status];
  return (
    <article className="meal-card-big" data-status={status}>
      <header className="meal-card-head">
        <span className="meal-card-slot">
          <span className="slot-emoji">{SLOT_EMOJI[slot]}</span>
          {MEAL_LABELS[slot]}
        </span>
        <span
          className="meal-card-pill"
          style={{ color: pill.color, borderColor: pill.color }}
        >
          {pill.label}
        </span>
      </header>

      <button className="meal-card-body" onClick={onDetails}>
        <h3 className="meal-card-title">
          {dish ? dish.name : <em className="muted">— sin asignar —</em>}
        </h3>
        {dish?.notes && <p className="meal-card-notes">{dish.notes}</p>}
        {dish && (
          <span className="meal-card-cta muted">
            Ver ingredientes / cambiar →
          </span>
        )}
      </button>

      <div className="meal-card-actions">
        <button
          className={`action-btn ${status === "hecho" ? "active hecho" : ""}`}
          onClick={() => onToggle("hecho")}
        >
          ✓ Hecho
        </button>
        <button
          className={`action-btn ${status === "extra" ? "active extra" : ""}`}
          onClick={() => onToggle("extra")}
        >
          ⤵ Sustituí
        </button>
        <button
          className={`action-btn ${status === "saltado" ? "active saltado" : ""}`}
          onClick={() => onToggle("saltado")}
        >
          ⏭ Saltar
        </button>
      </div>
    </article>
  );
}
