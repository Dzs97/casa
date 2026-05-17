"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type {
  ExpenseTemplate,
  MonthPayments,
  MonthlyPayment,
} from "../lib/types";
import { CATEGORY_LABELS } from "../lib/types";
import {
  currentMonthKey,
  daysUntil,
  dueDateForMonth,
  formatMonth,
  formatShortDate,
  todayISO,
} from "../lib/dates";
import { ExpenseEditor } from "./ExpenseEditor";
import { Toast } from "./Toast";

function shiftMonth(month: string, delta: number): string {
  const [y, m] = month.split("-").map(Number);
  const d = new Date(y, m - 1 + delta, 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

function fmtMoney(n: number): string {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    maximumFractionDigits: 0,
  }).format(n);
}

type View = "mes" | "historico" | "configurar";

export function ExpensesView() {
  const [templates, setTemplates] = useState<ExpenseTemplate[]>([]);
  const [month, setMonth] = useState<string>(currentMonthKey());
  const [payments, setPayments] = useState<MonthPayments>({});
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<View>("mes");
  const [editing, setEditing] = useState<ExpenseTemplate | "new" | null>(null);
  const [toast, setToast] = useState("");
  const [history, setHistory] = useState<Record<string, MonthPayments>>({});

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 1800);
  }, []);

  useEffect(() => {
    (async () => {
      const r = await fetch("/api/expenses");
      const d = await r.json();
      setTemplates(d.templates);
      setLoading(false);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      const r = await fetch(`/api/expenses/payments?month=${month}`);
      const d = await r.json();
      setPayments(d.payments);
    })();
  }, [month]);

  // Cargar histórico (últimos 6 meses) cuando se entra a esa vista
  useEffect(() => {
    if (view !== "historico") return;
    (async () => {
      const months: string[] = [];
      for (let i = 0; i < 6; i++) months.push(shiftMonth(currentMonthKey(), -i));
      const results = await Promise.all(
        months.map((m) =>
          fetch(`/api/expenses/payments?month=${m}`)
            .then((r) => r.json())
            .then((d) => [m, d.payments as MonthPayments] as const)
        )
      );
      setHistory(Object.fromEntries(results));
    })();
  }, [view]);

  const savePayments = useCallback(
    async (next: MonthPayments) => {
      setPayments(next);
      await fetch("/api/expenses/payments", {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ month, payments: next }),
      });
    },
    [month]
  );

  const togglePaid = useCallback(
    (templateId: string) => {
      const current = payments[templateId];
      const next: MonthPayments = { ...payments };
      if (current?.paid) {
        next[templateId] = { templateId, paid: false };
      } else {
        next[templateId] = {
          templateId,
          paid: true,
          paidDate: todayISO(),
        };
      }
      savePayments(next);
    },
    [payments, savePayments]
  );

  const setActualAmount = useCallback(
    (templateId: string, amount: number) => {
      const current = payments[templateId] ?? { templateId, paid: false };
      savePayments({ ...payments, [templateId]: { ...current, actualAmount: amount } });
    },
    [payments, savePayments]
  );

  const saveTemplate = useCallback(
    async (t: ExpenseTemplate, isNew: boolean) => {
      const next = isNew
        ? [...templates, t]
        : templates.map((x) => (x.id === t.id ? t : x));
      setTemplates(next);
      await fetch("/api/expenses", {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ templates: next }),
      });
      showToast(isNew ? "Pago agregado" : "Pago actualizado");
    },
    [templates, showToast]
  );

  const deleteTemplate = useCallback(
    async (id: string) => {
      if (!confirm("¿Eliminar este pago? Los registros históricos se conservan.")) {
        return;
      }
      const next = templates.filter((t) => t.id !== id);
      setTemplates(next);
      await fetch("/api/expenses", {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ templates: next }),
      });
      showToast("Pago eliminado");
    },
    [templates, showToast]
  );

  const activeTemplates = useMemo(
    () => templates.filter((t) => t.active),
    [templates]
  );

  // Calculate summary for current month
  const summary = useMemo(() => {
    const total = activeTemplates.reduce((s, t) => {
      const actual = payments[t.id]?.actualAmount;
      return s + (actual ?? t.amount);
    }, 0);
    const paidAmount = activeTemplates.reduce((s, t) => {
      const p = payments[t.id];
      if (!p?.paid) return s;
      return s + (p.actualAmount ?? t.amount);
    }, 0);
    const overdueCount = activeTemplates.filter((t) => {
      const p = payments[t.id];
      if (p?.paid) return false;
      const d = daysUntil(dueDateForMonth(month, t.dueDay));
      return d < 0;
    }).length;
    const upcomingCount = activeTemplates.filter((t) => {
      const p = payments[t.id];
      if (p?.paid) return false;
      const d = daysUntil(dueDateForMonth(month, t.dueDay));
      return d >= 0 && d <= 5;
    }).length;
    return { total, paidAmount, pending: total - paidAmount, overdueCount, upcomingCount };
  }, [activeTemplates, payments, month]);

  if (loading) return <div className="loader">Cargando gastos…</div>;

  // Ordenar por urgencia (vencidos primero, luego por días hasta vencimiento)
  const isCurrentMonth = month === currentMonthKey();
  const sortedTemplates = [...activeTemplates].sort((a, b) => {
    const pa = payments[a.id]?.paid ? 1 : 0;
    const pb = payments[b.id]?.paid ? 1 : 0;
    if (pa !== pb) return pa - pb; // pendientes primero
    return a.dueDay - b.dueDay;
  });

  return (
    <>
      <div className="section-head">
        <div>
          <h1>Gastos</h1>
          <p className="subtitle">Pagos fijos del hogar</p>
        </div>
        <div className="view-switcher">
          <button
            className={view === "mes" ? "active" : ""}
            onClick={() => setView("mes")}
          >
            Mes
          </button>
          <button
            className={view === "historico" ? "active" : ""}
            onClick={() => setView("historico")}
          >
            Histórico
          </button>
          <button
            className={view === "configurar" ? "active" : ""}
            onClick={() => setView("configurar")}
          >
            Configurar
          </button>
        </div>
      </div>

      {view === "mes" && (
        <>
          <div
            className="month-nav"
            style={{ marginBottom: 16, justifyContent: "center" }}
          >
            <button
              className="btn btn-sm"
              onClick={() => setMonth(shiftMonth(month, -1))}
            >
              ←
            </button>
            <span className="month-label">{formatMonth(month)}</span>
            <button
              className="btn btn-sm"
              onClick={() => setMonth(shiftMonth(month, 1))}
            >
              →
            </button>
            {!isCurrentMonth && (
              <button
                className="btn btn-sm btn-ghost"
                onClick={() => setMonth(currentMonthKey())}
              >
                Hoy
              </button>
            )}
          </div>

          <div className="summary">
            <div className="summary-card">
              <div className="label">Total del mes</div>
              <div className="value">{fmtMoney(summary.total)}</div>
            </div>
            <div className="summary-card">
              <div className="label">Pagado</div>
              <div className="value success">{fmtMoney(summary.paidAmount)}</div>
            </div>
            <div className="summary-card">
              <div className="label">Pendiente</div>
              <div className={`value ${summary.overdueCount > 0 ? "danger" : ""}`}>
                {fmtMoney(summary.pending)}
              </div>
            </div>
            <div className="summary-card">
              <div className="label">Alertas</div>
              <div className={`value ${summary.overdueCount > 0 ? "danger" : ""}`}>
                {summary.overdueCount > 0
                  ? `${summary.overdueCount} venc.`
                  : summary.upcomingCount > 0
                  ? `${summary.upcomingCount} pronto`
                  : "Al día"}
              </div>
            </div>
          </div>

          {sortedTemplates.length === 0 && (
            <div className="empty-state">
              No hay pagos configurados.{" "}
              <button
                className="btn btn-sm btn-accent"
                onClick={() => setView("configurar")}
              >
                Configurar pagos
              </button>
            </div>
          )}

          {sortedTemplates.map((t) => {
            const p = payments[t.id];
            const dueDate = dueDateForMonth(month, t.dueDay);
            const days = isCurrentMonth ? daysUntil(dueDate) : null;
            const paid = !!p?.paid;
            const overdue = !paid && days !== null && days < 0;
            const soon = !paid && days !== null && days >= 0 && days <= 5;
            const actualAmount = p?.actualAmount;

            let dueLabel = `Vence ${formatShortDate(dueDate)}`;
            if (isCurrentMonth && days !== null) {
              if (paid) dueLabel = `Pagado ${p.paidDate ? formatShortDate(p.paidDate) : ""}`;
              else if (days < 0) dueLabel = `Venció hace ${-days}d`;
              else if (days === 0) dueLabel = "Vence hoy";
              else if (days === 1) dueLabel = "Vence mañana";
              else if (days <= 5) dueLabel = `Vence en ${days}d`;
            }

            return (
              <div
                key={t.id}
                className={`expense-row ${paid ? "paid" : ""} ${
                  overdue ? "overdue" : soon ? "soon" : ""
                }`}
              >
                <button
                  className={`expense-check ${paid ? "checked" : ""}`}
                  onClick={() => togglePaid(t.id)}
                  aria-label={paid ? "Marcar como no pagado" : "Marcar como pagado"}
                >
                  {paid ? "✓" : ""}
                </button>
                <div>
                  <div className="expense-name">{t.name}</div>
                  <div className="expense-meta">
                    <span className="category-pill">
                      {CATEGORY_LABELS[t.category]}
                    </span>
                    {t.notes && <span>{t.notes}</span>}
                  </div>
                </div>
                <div>
                  <div className="expense-amount">
                    {fmtMoney(actualAmount ?? t.amount)}
                  </div>
                  {actualAmount !== undefined && actualAmount !== t.amount && (
                    <div
                      className="muted"
                      style={{ fontSize: 11, textAlign: "right" }}
                    >
                      est. {fmtMoney(t.amount)}
                    </div>
                  )}
                </div>
                <div
                  className={`expense-due ${overdue ? "overdue" : soon ? "soon" : ""}`}
                >
                  {dueLabel}
                  {paid && (
                    <div>
                      <button
                        className="btn btn-ghost btn-sm"
                        style={{ padding: "2px 6px", fontSize: 11 }}
                        onClick={() => {
                          const v = prompt(
                            "Monto real pagado (MXN):",
                            String(actualAmount ?? t.amount)
                          );
                          if (v !== null) {
                            const n = Number(v);
                            if (!isNaN(n)) setActualAmount(t.id, n);
                          }
                        }}
                      >
                        Ajustar monto
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </>
      )}

      {view === "historico" && (
        <div>
          <h2>Últimos 6 meses</h2>
          {Object.keys(history).length === 0 && (
            <div className="loader">Cargando histórico…</div>
          )}
          {Object.entries(history)
            .sort((a, b) => (a[0] < b[0] ? 1 : -1))
            .map(([m, mPayments]) => {
              const total = activeTemplates.reduce((s, t) => {
                const p = mPayments[t.id];
                if (!p?.paid) return s;
                return s + (p.actualAmount ?? t.amount);
              }, 0);
              const paidCount = Object.values(mPayments).filter((p) => p.paid).length;
              return (
                <div
                  key={m}
                  className="card"
                  style={{
                    marginBottom: 10,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <div style={{ fontFamily: "var(--font-serif)", fontSize: 17, fontWeight: 600 }}>
                      {formatMonth(m)}
                    </div>
                    <div className="muted" style={{ fontSize: 12 }}>
                      {paidCount} pagos registrados
                    </div>
                  </div>
                  <div
                    className="mono"
                    style={{ fontSize: 18, fontWeight: 600 }}
                  >
                    {fmtMoney(total)}
                  </div>
                </div>
              );
            })}
        </div>
      )}

      {view === "configurar" && (
        <div>
          <div className="section-head">
            <h2>Pagos recurrentes</h2>
            <button
              className="btn btn-accent"
              onClick={() => setEditing("new")}
            >
              + Nuevo pago
            </button>
          </div>
          {templates.map((t) => (
            <div
              key={t.id}
              className="card"
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 8,
                padding: "12px 14px",
                opacity: t.active ? 1 : 0.55,
              }}
            >
              <div>
                <div style={{ fontWeight: 500 }}>
                  {t.name}{" "}
                  {!t.active && (
                    <span className="muted" style={{ fontSize: 12 }}>
                      (inactivo)
                    </span>
                  )}
                </div>
                <div
                  className="muted"
                  style={{ fontSize: 12, display: "flex", gap: 8, marginTop: 2 }}
                >
                  <span className="category-pill">
                    {CATEGORY_LABELS[t.category]}
                  </span>
                  <span>Día {t.dueDay} · {fmtMoney(t.amount)}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="btn btn-sm" onClick={() => setEditing(t)}>
                  Editar
                </button>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => deleteTemplate(t.id)}
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {editing && (
        <ExpenseEditor
          template={editing === "new" ? null : editing}
          onClose={() => setEditing(null)}
          onSave={(t) => {
            saveTemplate(t, editing === "new");
            setEditing(null);
          }}
        />
      )}

      <Toast message={toast} />
    </>
  );
}
