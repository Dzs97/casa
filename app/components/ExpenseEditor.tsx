"use client";

import { useState } from "react";
import type { ExpenseCategory, ExpenseTemplate } from "../lib/types";
import { CATEGORY_LABELS } from "../lib/types";

const CATEGORIES: ExpenseCategory[] = [
  "vivienda",
  "servicios",
  "tarjetas",
  "suscripciones",
  "transporte",
  "otros",
];

interface Props {
  template: ExpenseTemplate | null;
  onClose: () => void;
  onSave: (t: ExpenseTemplate) => void;
}

function newId() {
  return `e-${Math.random().toString(36).slice(2, 9)}`;
}

export function ExpenseEditor({ template, onClose, onSave }: Props) {
  const [name, setName] = useState(template?.name ?? "");
  const [amount, setAmount] = useState(String(template?.amount ?? ""));
  const [category, setCategory] = useState<ExpenseCategory>(
    template?.category ?? "servicios"
  );
  const [dueDay, setDueDay] = useState(String(template?.dueDay ?? 1));
  const [notes, setNotes] = useState(template?.notes ?? "");
  const [active, setActive] = useState(template?.active ?? true);

  const handleSave = () => {
    const amt = Number(amount);
    const day = Number(dueDay);
    if (!name.trim()) return alert("Pon un nombre al pago");
    if (isNaN(amt) || amt <= 0) return alert("Monto inválido");
    if (isNaN(day) || day < 1 || day > 31) return alert("Día inválido (1-31)");
    onSave({
      id: template?.id ?? newId(),
      name: name.trim(),
      amount: amt,
      category,
      dueDay: day,
      notes: notes.trim() || undefined,
      active,
    });
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h3>{template ? "Editar pago" : "Nuevo pago"}</h3>

        <div className="field">
          <label>Nombre</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ej. Renta, Internet, Tarjeta AMEX"
          />
        </div>

        <div className="field-row">
          <div className="field">
            <label>Monto (MXN)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0"
            />
          </div>
          <div className="field">
            <label>Día del mes</label>
            <input
              type="number"
              min={1}
              max={31}
              value={dueDay}
              onChange={(e) => setDueDay(e.target.value)}
            />
          </div>
        </div>

        <div className="field">
          <label>Categoría</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {CATEGORY_LABELS[c]}
              </option>
            ))}
          </select>
        </div>

        <div className="field">
          <label>Notas (opcional)</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
            placeholder="Ej. Pago no domiciliado, bimestral, etc."
          />
        </div>

        <div className="field">
          <label
            className="flex gap-2"
            style={{ alignItems: "center", cursor: "pointer" }}
          >
            <input
              type="checkbox"
              checked={active}
              onChange={(e) => setActive(e.target.checked)}
            />
            Pago activo
          </label>
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
