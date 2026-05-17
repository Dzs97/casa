import type { ExpenseTemplate } from "../lib/types";

/**
 * Seed inicial de gastos fijos. Edita los montos y días reales desde la app.
 * Montos en MXN.
 */
export const SEED_EXPENSES: ExpenseTemplate[] = [
  {
    id: "e-renta",
    name: "Renta",
    amount: 18000,
    category: "vivienda",
    dueDay: 1,
    active: true,
  },
  {
    id: "e-internet",
    name: "Internet (Totalplay)",
    amount: 700,
    category: "servicios",
    dueDay: 10,
    active: true,
  },
  {
    id: "e-luz",
    name: "Luz (CFE)",
    amount: 900,
    category: "servicios",
    dueDay: 15,
    notes: "Llega bimestral; partir entre 2",
    active: true,
  },
  {
    id: "e-agua",
    name: "Agua",
    amount: 350,
    category: "servicios",
    dueDay: 20,
    active: true,
  },
  {
    id: "e-tel-diego",
    name: "Teléfono Diego",
    amount: 499,
    category: "servicios",
    dueDay: 5,
    active: true,
  },
  {
    id: "e-tel-pareja",
    name: "Teléfono pareja",
    amount: 499,
    category: "servicios",
    dueDay: 5,
    active: true,
  },
  {
    id: "e-tdc-amex",
    name: "Tarjeta AMEX",
    amount: 12000,
    category: "tarjetas",
    dueDay: 18,
    notes: "Pago no domiciliado",
    active: true,
  },
  {
    id: "e-tdc-bbva",
    name: "Tarjeta BBVA",
    amount: 8000,
    category: "tarjetas",
    dueDay: 25,
    active: true,
  },
  {
    id: "e-netflix",
    name: "Netflix",
    amount: 269,
    category: "suscripciones",
    dueDay: 12,
    active: true,
  },
  {
    id: "e-spotify",
    name: "Spotify Familiar",
    amount: 209,
    category: "suscripciones",
    dueDay: 8,
    active: true,
  },
];
