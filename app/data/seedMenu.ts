import type { Cycle, Dish } from "../lib/types";

/**
 * Menú real de Diego + pareja.
 * Ciclo arranca lunes 11 may 2026. Semana 2 repite la semana 1 hasta que la editen.
 */

export const SEED_DISHES: Dish[] = [
  // ============ Desayuno ============
  {
    id: "d-rotativo",
    name: "Desayuno (waffles/pan/yogurt/huevos)",
    slot: "desayuno",
    notes: "Elegir entre waffles, pan tostado, yogurt o huevos. Acompañar con jugo o café.",
    ingredients: [
      { name: "Waffles", quantity: "1", unit: "caja", aisle: "congelados" },
      { name: "Pan de caja", quantity: "1", unit: "pza", aisle: "panaderia" },
      { name: "Yogurt natural", quantity: "1", unit: "L", aisle: "lacteos" },
      { name: "Huevo", quantity: "12", unit: "pza", aisle: "lacteos" },
      { name: "Jugo de naranja", quantity: "1", unit: "L", aisle: "bebidas" },
      { name: "Café", aisle: "despensa" },
      { name: "Mermelada o miel", aisle: "despensa" },
      { name: "Mantequilla", quantity: "1", unit: "barra", aisle: "lacteos" },
    ],
  },

  // ============ Comidas ============
  {
    id: "c-pollo-plancha",
    name: "Pollo a la plancha con ensalada y arroz",
    slot: "comida",
    notes: "Ensalada: lechuga, manzana y nuez.",
    ingredients: [
      { name: "Pechuga de pollo", quantity: "600", unit: "g", aisle: "carnes" },
      { name: "Lechuga", quantity: "1", unit: "pza", aisle: "frutas-verduras" },
      { name: "Manzana", quantity: "2", unit: "pza", aisle: "frutas-verduras" },
      { name: "Nuez", quantity: "100", unit: "g", aisle: "despensa" },
      { name: "Arroz", quantity: "1", unit: "tza", aisle: "despensa" },
      { name: "Aderezo", aisle: "despensa" },
    ],
  },
  {
    id: "c-salmon",
    name: "Salmón con arroz y espárragos",
    slot: "comida",
    ingredients: [
      { name: "Salmón", quantity: "500", unit: "g", aisle: "carnes" },
      { name: "Arroz", quantity: "1", unit: "tza", aisle: "despensa" },
      { name: "Espárragos", quantity: "1", unit: "manojo", aisle: "frutas-verduras" },
      { name: "Limón", quantity: "2", unit: "pza", aisle: "frutas-verduras" },
    ],
  },
  {
    id: "c-camarones-guarn",
    name: "Camarones con guarnición",
    slot: "comida",
    notes: "Acompañar con verduras, papas, pan de queso o arroz.",
    ingredients: [
      { name: "Camarones", quantity: "500", unit: "g", aisle: "carnes" },
      { name: "Papa", quantity: "4", unit: "pza", aisle: "frutas-verduras" },
      { name: "Verduras mixtas", quantity: "1", unit: "bolsa", aisle: "congelados" },
      { name: "Pan de queso (chipá)", quantity: "1", unit: "paquete", aisle: "congelados" },
      { name: "Ajo", quantity: "1", unit: "cabeza", aisle: "frutas-verduras" },
      { name: "Mantequilla", aisle: "lacteos" },
    ],
  },
  {
    id: "c-atun-pepino",
    name: "Ensalada de atún con pepino",
    slot: "comida",
    ingredients: [
      { name: "Atún en agua", quantity: "2", unit: "lata", aisle: "despensa" },
      { name: "Pepino", quantity: "2", unit: "pza", aisle: "frutas-verduras" },
      { name: "Lechuga", quantity: "1", unit: "pza", aisle: "frutas-verduras" },
      { name: "Limón", quantity: "2", unit: "pza", aisle: "frutas-verduras" },
      { name: "Mayonesa", aisle: "despensa" },
    ],
  },
  {
    id: "c-pasta-camarones",
    name: "Pasta con camarones",
    slot: "comida",
    ingredients: [
      { name: "Pasta", quantity: "500", unit: "g", aisle: "despensa" },
      { name: "Camarones", quantity: "400", unit: "g", aisle: "carnes" },
      { name: "Ajo", quantity: "1", unit: "cabeza", aisle: "frutas-verduras" },
      { name: "Crema para cocinar", quantity: "1", unit: "envase", aisle: "lacteos" },
      { name: "Perejil", aisle: "frutas-verduras" },
    ],
  },
  {
    id: "c-carne-guarn",
    name: "Carne con guarnición",
    slot: "comida",
    ingredients: [
      { name: "Carne para asar", quantity: "600", unit: "g", aisle: "carnes" },
      { name: "Guarnición a elegir", aisle: "frutas-verduras" },
    ],
  },

  // ============ Cenas ============
  {
    id: "n-sandwich-frias",
    name: "Sándwich de carnes frías",
    slot: "cena",
    ingredients: [
      { name: "Pan de caja", quantity: "1", unit: "pza", aisle: "panaderia" },
      { name: "Jamón", quantity: "300", unit: "g", aisle: "carnes" },
      { name: "Pavo", quantity: "300", unit: "g", aisle: "carnes" },
      { name: "Queso manchego rebanado", quantity: "300", unit: "g", aisle: "lacteos" },
      { name: "Jitomate", quantity: "3", unit: "pza", aisle: "frutas-verduras" },
      { name: "Lechuga", aisle: "frutas-verduras" },
      { name: "Mayonesa / mostaza", aisle: "despensa" },
    ],
  },
  {
    id: "n-quesadillas",
    name: "Quesadillas",
    slot: "cena",
    ingredients: [
      { name: "Tortillas", quantity: "10", unit: "pza", aisle: "panaderia" },
      { name: "Queso Oaxaca", quantity: "300", unit: "g", aisle: "lacteos" },
    ],
  },
  {
    id: "n-grilled-cheese",
    name: "Grilled cheese",
    slot: "cena",
    ingredients: [
      { name: "Pan de caja", quantity: "1", unit: "pza", aisle: "panaderia" },
      { name: "Queso amarillo / manchego", quantity: "200", unit: "g", aisle: "lacteos" },
      { name: "Mantequilla", aisle: "lacteos" },
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
