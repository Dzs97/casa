import type { Cycle, Dish } from "../lib/types";

/**
 * Menú real de Diego + pareja.
 * Ciclo arranca lunes 11 may 2026. Semana 2 repite la semana 1 hasta que la editen.
 *
 * Reglas que sigue este seed:
 *  - Ingredientes = solo los que aparecen en el menú escrito o en la lista
 *    real de súper que el owner compartió. Nada inventado.
 *  - Cantidades = totales para el ciclo completo (se deduplican al agregar).
 *
 * Reparto a súpers:
 *   Wild Fork: carnes frescas, camarones, pan de queso, verduras congeladas.
 *   SuMesa/Walmart: frutas/verduras frescas, lácteos, pan, despensa.
 */

export const SEED_DISHES: Dish[] = [
  // ============ Desayuno ============
  {
    id: "d-rotativo",
    name: "Desayuno (waffles/pan/yogurt/huevos)",
    slot: "desayuno",
    notes: "Rotativo: waffles, pan tostado, yogurt o huevos. Acompañar con jugo o café.",
    ingredients: [
      { name: "Waffles", quantity: "1", unit: "caja", aisle: "congelados", store: "sumesa-walmart" },
      { name: "Pan / Sourdough", quantity: "1", unit: "pza", aisle: "panaderia", store: "sumesa-walmart" },
      { name: "Yogurt", quantity: "3", unit: "pza", aisle: "lacteos", store: "sumesa-walmart" },
      { name: "Huevo", quantity: "1", unit: "cartón 6", aisle: "lacteos", store: "sumesa-walmart" },
      { name: "Jugo", aisle: "bebidas", store: "sumesa-walmart" },
      { name: "Café", aisle: "despensa", store: "sumesa-walmart" },
      { name: "Filtros para café", aisle: "otros", store: "sumesa-walmart" },
    ],
  },

  // ============ Comidas ============
  {
    id: "c-pollo-plancha",
    name: "Pollo a la plancha con ensalada y arroz",
    slot: "comida",
    notes: "Ensalada: lechuga, manzana y nuez.",
    ingredients: [
      { name: "Pechuga de pollo", quantity: "1.6", unit: "kg", aisle: "carnes", store: "wild-fork" },
      { name: "Lechuga mezcla", quantity: "1", unit: "bolsa", aisle: "frutas-verduras", store: "sumesa-walmart" },
      { name: "Manzana", quantity: "2", unit: "pza", aisle: "frutas-verduras", store: "sumesa-walmart" },
      { name: "Nuez", aisle: "despensa", store: "sumesa-walmart" },
      { name: "Arroz", aisle: "despensa", store: "sumesa-walmart" },
    ],
  },
  {
    id: "c-salmon",
    name: "Salmón con arroz y espárragos",
    slot: "comida",
    ingredients: [
      { name: "Salmón", quantity: "700", unit: "g (4 filetes)", aisle: "carnes", store: "wild-fork" },
      { name: "Arroz", aisle: "despensa", store: "sumesa-walmart" },
      { name: "Espárragos", quantity: "2", unit: "manojos", aisle: "frutas-verduras", store: "sumesa-walmart" },
      { name: "Limón", quantity: "3", unit: "pza", aisle: "frutas-verduras", store: "sumesa-walmart" },
    ],
  },
  {
    id: "c-camarones-guarn",
    name: "Camarones con guarnición",
    slot: "comida",
    notes: "Acompañar con verduras, papas, pan de queso o arroz.",
    ingredients: [
      { name: "Camarones pelados", quantity: "600", unit: "g", aisle: "carnes", store: "wild-fork" },
      { name: "Camarones empanizados", quantity: "600", unit: "g", aisle: "congelados", store: "wild-fork" },
      { name: "Verduras congeladas", quantity: "1", unit: "bolsa", aisle: "congelados", store: "wild-fork" },
      { name: "Pan de queso", quantity: "1", unit: "bolsa", aisle: "congelados", store: "wild-fork" },
      { name: "Papas", aisle: "frutas-verduras", store: "sumesa-walmart" },
      { name: "Arroz", aisle: "despensa", store: "sumesa-walmart" },
      { name: "Panko", quantity: "1", unit: "paquete", aisle: "despensa", store: "sumesa-walmart" },
      { name: "Ajo fresco", quantity: "1-2", unit: "cabezas", aisle: "frutas-verduras", store: "sumesa-walmart" },
      { name: "Ajo picado en frasco", quantity: "1", aisle: "despensa", store: "sumesa-walmart" },
    ],
  },
  {
    id: "c-atun-pepino",
    name: "Ensalada de atún con pepino",
    slot: "comida",
    ingredients: [
      { name: "Atún", quantity: "2", unit: "latas", aisle: "despensa", store: "sumesa-walmart" },
      { name: "Pepino", quantity: "2", unit: "pza", aisle: "frutas-verduras", store: "sumesa-walmart" },
      { name: "Lechuga mezcla", quantity: "1", unit: "bolsa", aisle: "frutas-verduras", store: "sumesa-walmart" },
    ],
  },
  {
    id: "c-pasta-camarones",
    name: "Pasta con camarones",
    slot: "comida",
    ingredients: [
      { name: "Pasta fettuccini", quantity: "500", unit: "g", aisle: "despensa", store: "sumesa-walmart" },
      { name: "Camarones pelados", quantity: "600", unit: "g", aisle: "carnes", store: "wild-fork" },
      { name: "Ajo fresco", aisle: "frutas-verduras", store: "sumesa-walmart" },
    ],
  },
  {
    id: "c-carne-guarn",
    name: "Carne con guarnición",
    slot: "comida",
    ingredients: [
      { name: "Carne", quantity: "500", unit: "g", aisle: "carnes", store: "wild-fork" },
      { name: "Aguacate", quantity: "1", unit: "pza", aisle: "frutas-verduras", store: "sumesa-walmart" },
      { name: "Col", quantity: "1/2", unit: "pza", aisle: "frutas-verduras", store: "sumesa-walmart" },
      { name: "Zanahoria", quantity: "2", unit: "pza", aisle: "frutas-verduras", store: "sumesa-walmart" },
    ],
  },

  // ============ Cenas ============
  {
    id: "n-sandwich-frias",
    name: "Sándwich de carnes frías",
    slot: "cena",
    notes: "Las carnes frías y el queso normalmente ya están en casa.",
    ingredients: [
      { name: "Pan / Sourdough", quantity: "1", unit: "pza", aisle: "panaderia", store: "sumesa-walmart" },
    ],
  },
  {
    id: "n-quesadillas",
    name: "Quesadillas",
    slot: "cena",
    notes: "Tortillas y queso suelen estar en casa.",
    ingredients: [],
  },
  {
    id: "n-grilled-cheese",
    name: "Grilled cheese",
    slot: "cena",
    notes: "Pan, queso y mantequilla suelen estar en casa.",
    ingredients: [
      { name: "Pan / Sourdough", quantity: "1", unit: "pza", aisle: "panaderia", store: "sumesa-walmart" },
    ],
  },
  {
    id: "n-libre",
    name: "Cena libre (sobras / algo light)",
    slot: "cena",
    notes: "Variable: sobras de la comida, fruta, yogurt, lo que haya.",
    ingredients: [],
  },
];

/**
 * Lunes 11 may 2026 → domingo 24 may 2026 (2 semanas).
 * Semana 2 repite semana 1; editar desde la UI cuando definan el nuevo menú.
 */
export const SEED_CYCLE: Cycle = {
  startDate: "2026-05-11",
  days: [
    // Semana 1
    { desayuno: "d-rotativo", comida: "c-pollo-plancha", cena: "n-sandwich-frias" }, // L
    { desayuno: "d-rotativo", comida: "c-salmon", cena: "n-quesadillas" }, // M
    { desayuno: "d-rotativo", comida: "c-camarones-guarn", cena: "n-sandwich-frias" }, // X
    { desayuno: "d-rotativo", comida: "c-atun-pepino", cena: "n-grilled-cheese" }, // J
    { desayuno: "d-rotativo", comida: "c-pollo-plancha", cena: "n-sandwich-frias" }, // V
    { desayuno: "d-rotativo", comida: "c-pasta-camarones", cena: "n-libre" }, // S
    { desayuno: "d-rotativo", comida: "c-carne-guarn", cena: "n-libre" }, // D
    // Semana 2 (repite — editar desde UI)
    { desayuno: "d-rotativo", comida: "c-pollo-plancha", cena: "n-sandwich-frias" },
    { desayuno: "d-rotativo", comida: "c-salmon", cena: "n-quesadillas" },
    { desayuno: "d-rotativo", comida: "c-camarones-guarn", cena: "n-sandwich-frias" },
    { desayuno: "d-rotativo", comida: "c-atun-pepino", cena: "n-grilled-cheese" },
    { desayuno: "d-rotativo", comida: "c-pollo-plancha", cena: "n-sandwich-frias" },
    { desayuno: "d-rotativo", comida: "c-pasta-camarones", cena: "n-libre" },
    { desayuno: "d-rotativo", comida: "c-carne-guarn", cena: "n-libre" },
  ],
};
