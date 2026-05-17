"use client";

import { useState } from "react";
import type { Aisle, Dish, Ingredient, MealSlot } from "../lib/types";
import { AISLE_LABELS, AISLE_ORDER, MEAL_LABELS, MEAL_SLOTS } from "../lib/types";

interface Props {
  dish: Dish | null; // null = nuevo
  onClose: () => void;
  onSave: (dish: Dish) => void;
}

function newId() {
  return `d-${Math.random().toString(36).slice(2, 9)}`;
}

export function DishEditor({ dish, onClose, onSave }: Props) {
  const [name, setName] = useState(dish?.name ?? "");
  const [slot, setSlot] = useState<MealSlot>(dish?.slot ?? "comida");
  const [notes, setNotes] = useState(dish?.notes ?? "");
  const [ingredients, setIngredients] = useState<Ingredient[]>(
    dish?.ingredients ?? [{ name: "", aisle: "despensa" }]
  );

  const updateIng = (idx: number, patch: Partial<Ingredient>) => {
    setIngredients((prev) =>
      prev.map((ing, i) => (i === idx ? { ...ing, ...patch } : ing))
    );
  };

  const removeIng = (idx: number) => {
    setIngredients((prev) => prev.filter((_, i) => i !== idx));
  };

  const addIng = () => {
    setIngredients((prev) => [...prev, { name: "", aisle: "despensa" }]);
  };

  const handleSave = () => {
    if (!name.trim()) {
      alert("Pon un nombre al platillo");
      return;
    }
    const cleaned = ingredients
      .map((i) => ({ ...i, name: i.name.trim() }))
      .filter((i) => i.name);
    onSave({
      id: dish?.id ?? newId(),
      name: name.trim(),
      slot,
      ingredients: cleaned,
      notes: notes.trim() || undefined,
    });
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h3>{dish ? "Editar platillo" : "Nuevo platillo"}</h3>

        <div className="field">
          <label>Nombre</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ej. Tinga de pollo"
          />
        </div>

        <div className="field">
          <label>Tiempo de comida</label>
          <select value={slot} onChange={(e) => setSlot(e.target.value as MealSlot)}>
            {MEAL_SLOTS.map((s) => (
              <option key={s} value={s}>
                {MEAL_LABELS[s]}
              </option>
            ))}
          </select>
        </div>

        <div className="field">
          <label>Ingredientes</label>
          {ingredients.map((ing, i) => (
            <div
              key={i}
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 60px 60px 1fr 28px",
                gap: 6,
                marginBottom: 6,
              }}
            >
              <input
                value={ing.name}
                onChange={(e) => updateIng(i, { name: e.target.value })}
                placeholder="Ingrediente"
              />
              <input
                value={ing.quantity ?? ""}
                onChange={(e) => updateIng(i, { quantity: e.target.value })}
                placeholder="Cant."
              />
              <input
                value={ing.unit ?? ""}
                onChange={(e) => updateIng(i, { unit: e.target.value })}
                placeholder="Unidad"
              />
              <select
                value={ing.aisle}
                onChange={(e) => updateIng(i, { aisle: e.target.value as Aisle })}
              >
                {AISLE_ORDER.map((a) => (
                  <option key={a} value={a}>
                    {AISLE_LABELS[a]}
                  </option>
                ))}
              </select>
              <button
                className="btn btn-sm btn-ghost"
                onClick={() => removeIng(i)}
                aria-label="Eliminar ingrediente"
                style={{ padding: 0 }}
              >
                ✕
              </button>
            </div>
          ))}
          <button className="btn btn-sm" onClick={addIng}>
            + Agregar ingrediente
          </button>
        </div>

        <div className="field">
          <label>Notas (opcional)</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
          />
        </div>

        <div className="modal-actions">
          <button className="btn" onClick={onClose}>
            Cancelar
          </button>
          <button className="btn btn-primary" onClick={handleSave}>
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}
