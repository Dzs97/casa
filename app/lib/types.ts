export type Aisle =
  | "frutas-verduras"
  | "carnes"
  | "lacteos"
  | "panaderia"
  | "despensa"
  | "congelados"
  | "bebidas"
  | "otros";

export const AISLE_LABELS: Record<Aisle, string> = {
  "frutas-verduras": "Frutas y verduras",
  carnes: "Carnes y pescados",
  lacteos: "Lácteos y huevo",
  panaderia: "Panadería",
  despensa: "Despensa",
  congelados: "Congelados",
  bebidas: "Bebidas",
  otros: "Otros",
};

export const AISLE_ORDER: Aisle[] = [
  "frutas-verduras",
  "carnes",
  "lacteos",
  "panaderia",
  "despensa",
  "congelados",
  "bebidas",
  "otros",
];

export type MealSlot = "desayuno" | "comida" | "cena";

export const MEAL_SLOTS: MealSlot[] = ["desayuno", "comida", "cena"];

export const MEAL_LABELS: Record<MealSlot, string> = {
  desayuno: "Desayuno",
  comida: "Comida",
  cena: "Cena",
};

export type Store = "wild-fork" | "sumesa-walmart" | "otros";

export const STORE_LABELS: Record<Store, string> = {
  "wild-fork": "Wild Fork",
  "sumesa-walmart": "SuMesa / Walmart",
  otros: "Otros",
};

export const STORE_ORDER: Store[] = ["wild-fork", "sumesa-walmart", "otros"];

/** Inferir tienda probable según el pasillo. Wild Fork = carnes/congelados. */
export function defaultStoreForAisle(aisle: Aisle): Store {
  if (aisle === "carnes" || aisle === "congelados") return "wild-fork";
  return "sumesa-walmart";
}

export interface Ingredient {
  name: string;
  quantity?: string; // "200", "1/2", "al gusto"
  unit?: string; // "g", "kg", "pza", "tza"
  aisle: Aisle;
  store?: Store; // si no se define, se infiere del pasillo
}

export interface Dish {
  id: string;
  name: string;
  slot: MealSlot; // sugerencia de horario (no rígido)
  ingredients: Ingredient[];
  notes?: string;
}

/** El ciclo es 14 días con 3 tiempos cada uno. */
export interface Cycle {
  startDate: string; // YYYY-MM-DD, lunes ideal
  days: Array<{
    desayuno: string | null; // dishId
    comida: string | null;
    cena: string | null;
  }>;
}

export type MealStatus = "pendiente" | "hecho" | "saltado" | "extra";

/** Estado por ciclo. Key: `${dayIndex}-${slot}` */
export interface CycleState {
  startDate: string;
  marks: Record<string, MealStatus>; // "0-desayuno" -> "hecho"
}

// ============ Gastos ============

export type ExpenseCategory =
  | "vivienda"
  | "servicios"
  | "tarjetas"
  | "suscripciones"
  | "transporte"
  | "otros";

export const CATEGORY_LABELS: Record<ExpenseCategory, string> = {
  vivienda: "Vivienda",
  servicios: "Servicios",
  tarjetas: "Tarjetas",
  suscripciones: "Suscripciones",
  transporte: "Transporte",
  otros: "Otros",
};

export interface ExpenseTemplate {
  id: string;
  name: string;
  amount: number; // MXN
  category: ExpenseCategory;
  dueDay: number; // día del mes 1..31
  notes?: string;
  active: boolean;
}

export interface MonthlyPayment {
  templateId: string;
  paid: boolean;
  paidDate?: string; // YYYY-MM-DD
  actualAmount?: number;
}

/** Pagos por mes. Key en KV: `expenses:payments:YYYY-MM` */
export type MonthPayments = Record<string, MonthlyPayment>; // templateId -> payment
