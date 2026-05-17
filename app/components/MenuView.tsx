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
import { addDays, daysBetween, formatShortDate, todayISO } from "../lib/dates";
import { DishModal } from "./DishModal";
import { ShoppingList } from "./ShoppingList";
import { DishEditor } from "./DishEditor";
import { Toast } from "./Toast";

type View = "plan" | "lista" | "platillos";

export function MenuView() {
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [cycle, setCycle] = useState<Cycle | null>(null);
  const [state, setState] = useState<CycleState | null>(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<View>("plan");
  const [editing, setEditing] = useState<{ dayIdx: number; slot: MealSlot } | null>(
    null
  );
  const [editingDish, setEditingDish] = useState<Dish | "new" | null>(null);
  const [toast, setToast] = useState<string>("");

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 1800);
  }, []);

  // Fetch inicial
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
    if (!confirm("¿Reiniciar el ciclo? Los marcados del ciclo actual se conservan en el historial.")) {
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
      // refetch state for new key
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
            Ciclo del {formatShortDate(cycle.startDate)} al {formatShortDate(cycleEnd)} ·{" "}
            <span className="mono">
              {doneCount}/{totalMeals} hechos
            </span>
            {extraCount > 0 && (
              <>
                {" "}
                · <span className="mono">{extraCount} extras</span>
              </>
            )}
          </p>
        </div>
        <div className="view-switcher">
          <button
            className={view === "plan" ? "active" : ""}
            onClick={() => setView("plan")}
          >
            Plan
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

      {view === "plan" && (
        <div className="card">
          <div
            className="flex gap-2"
            style={{ marginBottom: 12, flexWrap: "wrap", justifyContent: "space-between" }}
          >
            <div className="flex gap-2">
              <button className="btn btn-sm" onClick={() => moveCycleStart(-1)}>
                ← inicio
              </button>
              <button className="btn btn-sm" onClick={() => moveCycleStart(1)}>
                inicio →
              </button>
            </div>
            <button className="btn btn-sm" onClick={restartCycle}>
              Reiniciar ciclo en hoy
            </button>
          </div>
          {cycle.days.map((day, idx) => {
            const date = addDays(cycle.startDate, idx);
            const isToday = idx === todayIdx && todayInCycle;
            return (
              <div key={idx} className={`day-row ${isToday ? "today" : ""}`}>
                <div className="day-label">
                  <span className="day-num">D{idx + 1}</span>
                  {formatShortDate(date)}
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
        <ShoppingList cycle={cycle} state={state} dishById={dishById} />
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
                <h3 style={{ textTransform: "uppercase", letterSpacing: "0.08em", fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--ink-faded)" }}>
                  {MEAL_LABELS[slot]} ({list.length})
                </h3>
                {list.map((d) => (
                  <div
                    key={d.id}
                    className="card"
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: 8,
                      padding: "10px 14px",
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 500 }}>{d.name}</div>
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
