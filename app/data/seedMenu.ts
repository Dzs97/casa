import type { Cycle, Dish } from "../lib/types";

/**
 * Menú real de Diego + pareja.
 * Ciclo arranca lunes 11 may 2026. Semana 2 repite la semana 1 hasta que la editen.
 *
 * Reparto a súpers:
 *   Wild Fork: carnes frescas (pollo, salmón, camarones, carne), pan de queso,
 *              verduras congeladas, postres.
 *   SuMesa/Walmart: todo lo demás (frutas, verduras frescas, lácteos, pan, despensa).
 */

export const SEED_DISHES: Dish[] = [
  // ============ Desayuno ============
  {
    id: "d-rotativo",
    name: "Desayuno (waffles/pan/yogurt/huevos)",
    slot: "desayuno",
    notes: "Elegir entre waffles, pan tostado, yogurt o huevos. Acompañar con jugo o café.",
    ingredients: [
      { name: "Waffles", quantity: "1", unit: "caja", aisle: "congelados", store: "sumesa-walmart" },
      { name: "Pan de caja / Sourdough", quantity: "1", unit: "pza", aisle: "panaderia", store: "sumesa-walmart" },
      { name: "Yogurt", quantity: "3", unit: "pza", aisle: "lacteos", store: "sumesa-walmart" },
      { name: "Huevo", quantity: "1", unit: "cartón 6 pza", aisle: "lacteos", store: "sumesa-walmart" },
      { name: "Jugo", quantity: "1", unit: "L", aisle: "bebidas", store: "sumesa-walmart" },
      { name: "Café (filtros)", aisle: "despensa", store: "sumesa-walmart" },
      { name: "Mermelada o miel", aisle: "despensa", store: "sumesa-walmart" },
      { name: "Mantequilla", quantity: "1", unit: "barra", aisle: "lacteos", store: "sumesa-walmart" },
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
      { name: "Nuez", quantity: "100", unit: "g", aisle: "despensa", store: "sumesa-walmart" },
      { name: "Arroz", quantity: "1", unit: "tza", aisle: "despensa", store: "sumesa-walmart" },
      { name: "Aderezo", aisle: "despensa", store: "sumesa-walmart" },
    ],
  },
  {
    id: "c-salmon",
    name: "Salmón con arroz y espárragos",
    slot: "comida",
    ingredients: [
      { name: "Salmón", quantity: "700", unit: "g (4 filetes)", aisle: "carnes", store: "wild-fork" },
      { name: "Arroz", quantity: "1", unit: "tza", aisle: "despensa", store: "sumesa-walmart" },
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
      { name: "Papa", quantity: "4", unit: "pza", aisle: "frutas-verduras", store: "sumesa-walmart" },
      { name: "Ajo", quantity: "1-2", unit: "cabezas", aisle: "frutas-verduras", store: "sumesa-walmart" },
      { name: "Ajo picado en frasco", quantity: "1", aisle: "despensa", store: "sumesa-walmart" },
      { name: "Mantequilla", aisle: "lacteos", store: "sumesa-walmart" },
    ],
  },
  {
    id: "c-atun-pepino",
    name: "Ensalada de atún con pepino",
    slot: "comida",
    ingredients: [
      { name: "Atún en agua", quantity: "2", unit: "lata", aisle: "despensa", store: "sumesa-walmart" },
      { name: "Pepino", quantity: "2", unit: "pza", aisle: "frutas-verduras", store: "sumesa-walmart" },
      { name: "Lechuga mezcla", quantity: "1", unit: "bolsa", aisle: "frutas-verduras", store: "sumesa-walmart" },
      { name: "Limón", quantity: "2", unit: "pza", aisle: "frutas-verduras", store: "sumesa-walmart" },
      { name: "Mayonesa", aisle: "despensa", store: "sumesa-walmart" },
    ],
  },
  {
    id: "c-pasta-camarones",
    name: "Pasta con camarones",
    slot: "comida",
    ingredients: [
      { name: "Pasta fettuccini", quantity: "500", unit: "g", aisle: "despensa", store: "sumesa-walmart" },
      { name: "Camarones pelados", quantity: "400", unit: "g", aisle: "carnes", store: "wild-fork" },
      { name: "Ajo", quantity: "1", unit: "cabeza", aisle: "frutas-verduras", store: "sumesa-walmart" },
      { name: "Crema para cocinar", quantity: "1", unit: "envase", aisle: "lacteos", store: "sumesa-walmart" },
      { name: "Perejil", aisle: "frutas-verduras", store: "sumesa-walmart" },
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
    ingredients: [
      { name: "Pan / Sourdough", quantity: "1", unit: "pza", aisle: "panaderia", store: "sumesa-walmart" },
      { name: "Jamón", quantity: "300", unit: "g", aisle: "carnes", store: "sumesa-walmart" },
      { name: "Pavo", quantity: "300", unit: "g", aisle: "carnes", store: "sumesa-walmart" },
      { name: "Queso manchego rebanado", quantity: "300", unit: "g", aisle: "lacteos", store: "sumesa-walmart" },
      { name: "Jitomate", quantity: "3", unit: "pza", aisle: "frutas-verduras", store: "sumesa-walmart" },
      { name: "Lechuga", aisle: "frutas-verduras", store: "sumesa-walmart" },
      { name: "Mayonesa / mostaza", aisle: "despensa", store: "sumesa-walmart" },
    ],
  },
  {
    id: "n-quesadillas",
    name: "Quesadillas",
    slot: "cena",
    ingredients: [
      { name: "Tortillas", quantity: "10", unit: "pza", aisle: "panaderia", store: "sumesa-walmart" },
      { name: "Queso Oaxaca", quantity: "300", unit: "g", aisle: "lacteos", store: "sumesa-walmart" },
    ],
  },
  {
    id: "n-grilled-cheese",
    name: "Grilled cheese",
    slot: "cena",
    ingredients: [
      { name: "Pan / Sourdough", quantity: "1", unit: "pza", aisle: "panaderia", store: "sumesa-walmart" },
      { name: "Queso amarillo / manchego", quantity: "200", unit: "g", aisle: "lacteos", store: "sumesa-walmart" },
      { name: "Mantequilla", aisle: "lacteos", store: "sumesa-walmart" },
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
