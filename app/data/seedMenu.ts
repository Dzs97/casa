import type { Cycle, Dish } from "../lib/types";

/**
 * Seed inicial del menú. Reemplaza estos platillos con los reales que tú y tu pareja
 * comparten en WhatsApp. La app permite editar todo desde la UI una vez deployed.
 */

export const SEED_DISHES: Dish[] = [
  // ============ Desayunos ============
  {
    id: "d-avena",
    name: "Avena con fruta",
    slot: "desayuno",
    ingredients: [
      { name: "Avena", quantity: "1", unit: "tza", aisle: "despensa" },
      { name: "Plátano", quantity: "2", unit: "pza", aisle: "frutas-verduras" },
      { name: "Leche", quantity: "500", unit: "ml", aisle: "lacteos" },
      { name: "Miel", aisle: "despensa" },
    ],
  },
  {
    id: "d-huevos",
    name: "Huevos a la mexicana",
    slot: "desayuno",
    ingredients: [
      { name: "Huevo", quantity: "6", unit: "pza", aisle: "lacteos" },
      { name: "Jitomate", quantity: "3", unit: "pza", aisle: "frutas-verduras" },
      { name: "Cebolla", quantity: "1", unit: "pza", aisle: "frutas-verduras" },
      { name: "Chile serrano", quantity: "2", unit: "pza", aisle: "frutas-verduras" },
      { name: "Tortillas", quantity: "8", unit: "pza", aisle: "panaderia" },
    ],
  },
  {
    id: "d-yogurt",
    name: "Yogurt con granola y fruta",
    slot: "desayuno",
    ingredients: [
      { name: "Yogurt natural", quantity: "500", unit: "g", aisle: "lacteos" },
      { name: "Granola", quantity: "200", unit: "g", aisle: "despensa" },
      { name: "Fresas", quantity: "250", unit: "g", aisle: "frutas-verduras" },
    ],
  },
  {
    id: "d-chilaquiles",
    name: "Chilaquiles verdes",
    slot: "desayuno",
    ingredients: [
      { name: "Totopos", quantity: "1", unit: "bolsa", aisle: "despensa" },
      { name: "Salsa verde", quantity: "1", unit: "frasco", aisle: "despensa" },
      { name: "Crema", quantity: "1", unit: "bote", aisle: "lacteos" },
      { name: "Queso fresco", quantity: "200", unit: "g", aisle: "lacteos" },
      { name: "Huevo", quantity: "4", unit: "pza", aisle: "lacteos" },
    ],
  },
  {
    id: "d-pantostado",
    name: "Pan tostado con aguacate",
    slot: "desayuno",
    ingredients: [
      { name: "Pan de caja", quantity: "1", unit: "pza", aisle: "panaderia" },
      { name: "Aguacate", quantity: "4", unit: "pza", aisle: "frutas-verduras" },
      { name: "Limón", quantity: "3", unit: "pza", aisle: "frutas-verduras" },
    ],
  },

  // ============ Comidas ============
  {
    id: "c-pollo-asado",
    name: "Pollo asado con verduras",
    slot: "comida",
    ingredients: [
      { name: "Pechuga de pollo", quantity: "600", unit: "g", aisle: "carnes" },
      { name: "Calabaza", quantity: "3", unit: "pza", aisle: "frutas-verduras" },
      { name: "Zanahoria", quantity: "3", unit: "pza", aisle: "frutas-verduras" },
      { name: "Arroz", quantity: "1", unit: "tza", aisle: "despensa" },
    ],
  },
  {
    id: "c-tinga",
    name: "Tinga de pollo",
    slot: "comida",
    ingredients: [
      { name: "Pollo deshebrado", quantity: "500", unit: "g", aisle: "carnes" },
      { name: "Jitomate", quantity: "4", unit: "pza", aisle: "frutas-verduras" },
      { name: "Cebolla", quantity: "1", unit: "pza", aisle: "frutas-verduras" },
      { name: "Chipotle adobado", quantity: "1", unit: "lata", aisle: "despensa" },
      { name: "Tortillas", quantity: "12", unit: "pza", aisle: "panaderia" },
    ],
  },
  {
    id: "c-pasta",
    name: "Pasta con salsa de jitomate",
    slot: "comida",
    ingredients: [
      { name: "Pasta", quantity: "500", unit: "g", aisle: "despensa" },
      { name: "Salsa de jitomate", quantity: "1", unit: "frasco", aisle: "despensa" },
      { name: "Queso parmesano", quantity: "100", unit: "g", aisle: "lacteos" },
      { name: "Albahaca", aisle: "frutas-verduras" },
    ],
  },
  {
    id: "c-salmon",
    name: "Salmón al horno con ensalada",
    slot: "comida",
    ingredients: [
      { name: "Salmón", quantity: "500", unit: "g", aisle: "carnes" },
      { name: "Mezcla de hojas verdes", quantity: "1", unit: "bolsa", aisle: "frutas-verduras" },
      { name: "Aguacate", quantity: "2", unit: "pza", aisle: "frutas-verduras" },
      { name: "Limón", quantity: "2", unit: "pza", aisle: "frutas-verduras" },
    ],
  },
  {
    id: "c-tacos",
    name: "Tacos de bistec",
    slot: "comida",
    ingredients: [
      { name: "Bistec de res", quantity: "500", unit: "g", aisle: "carnes" },
      { name: "Tortillas", quantity: "16", unit: "pza", aisle: "panaderia" },
      { name: "Cebolla", quantity: "1", unit: "pza", aisle: "frutas-verduras" },
      { name: "Cilantro", quantity: "1", unit: "manojo", aisle: "frutas-verduras" },
      { name: "Salsa", aisle: "despensa" },
    ],
  },
  {
    id: "c-ensalada",
    name: "Ensalada con atún",
    slot: "comida",
    ingredients: [
      { name: "Lechuga", quantity: "1", unit: "pza", aisle: "frutas-verduras" },
      { name: "Atún en agua", quantity: "2", unit: "lata", aisle: "despensa" },
      { name: "Pepino", quantity: "1", unit: "pza", aisle: "frutas-verduras" },
      { name: "Jitomate cherry", quantity: "250", unit: "g", aisle: "frutas-verduras" },
    ],
  },
  {
    id: "c-arroz-frito",
    name: "Arroz frito con verduras",
    slot: "comida",
    ingredients: [
      { name: "Arroz", quantity: "2", unit: "tza", aisle: "despensa" },
      { name: "Huevo", quantity: "4", unit: "pza", aisle: "lacteos" },
      { name: "Chícharos", quantity: "1", unit: "bolsa", aisle: "congelados" },
      { name: "Salsa de soya", aisle: "despensa" },
      { name: "Zanahoria", quantity: "2", unit: "pza", aisle: "frutas-verduras" },
    ],
  },

  // ============ Cenas ============
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
    id: "n-sandwich",
    name: "Sándwich de pavo",
    slot: "cena",
    ingredients: [
      { name: "Pan integral", quantity: "1", unit: "pza", aisle: "panaderia" },
      { name: "Pavo en rebanadas", quantity: "200", unit: "g", aisle: "carnes" },
      { name: "Queso manchego", quantity: "200", unit: "g", aisle: "lacteos" },
      { name: "Jitomate", quantity: "2", unit: "pza", aisle: "frutas-verduras" },
    ],
  },
  {
    id: "n-sopa",
    name: "Sopa de verduras",
    slot: "cena",
    ingredients: [
      { name: "Caldo de pollo", quantity: "1", unit: "lt", aisle: "despensa" },
      { name: "Verduras mixtas", quantity: "1", unit: "bolsa", aisle: "congelados" },
      { name: "Pasta para sopa", quantity: "200", unit: "g", aisle: "despensa" },
    ],
  },
  {
    id: "n-omelette",
    name: "Omelette con espinacas",
    slot: "cena",
    ingredients: [
      { name: "Huevo", quantity: "6", unit: "pza", aisle: "lacteos" },
      { name: "Espinacas", quantity: "1", unit: "bolsa", aisle: "frutas-verduras" },
      { name: "Queso", quantity: "150", unit: "g", aisle: "lacteos" },
    ],
  },
  {
    id: "n-hotdogs",
    name: "Hot dogs",
    slot: "cena",
    ingredients: [
      { name: "Salchichas", quantity: "1", unit: "paquete", aisle: "carnes" },
      { name: "Pan para hot dog", quantity: "8", unit: "pza", aisle: "panaderia" },
      { name: "Mostaza y catsup", aisle: "despensa" },
    ],
  },
  {
    id: "n-fruta",
    name: "Cena ligera (fruta + yogurt)",
    slot: "cena",
    ingredients: [
      { name: "Fruta de temporada", aisle: "frutas-verduras" },
      { name: "Yogurt natural", quantity: "500", unit: "g", aisle: "lacteos" },
    ],
  },
];

/** Plan de 14 días por defecto. Lunes a domingo, x2. */
export const SEED_CYCLE: Cycle = {
  startDate: "2026-05-18", // lunes; ajustable desde UI
  days: [
    // Semana 1
    { desayuno: "d-avena", comida: "c-pollo-asado", cena: "n-quesadillas" },
    { desayuno: "d-huevos", comida: "c-pasta", cena: "n-sandwich" },
    { desayuno: "d-yogurt", comida: "c-tinga", cena: "n-sopa" },
    { desayuno: "d-pantostado", comida: "c-ensalada", cena: "n-omelette" },
    { desayuno: "d-avena", comida: "c-tacos", cena: "n-fruta" },
    { desayuno: "d-chilaquiles", comida: "c-arroz-frito", cena: "n-hotdogs" },
    { desayuno: "d-huevos", comida: "c-salmon", cena: "n-quesadillas" },
    // Semana 2
    { desayuno: "d-yogurt", comida: "c-pasta", cena: "n-sandwich" },
    { desayuno: "d-pantostado", comida: "c-pollo-asado", cena: "n-sopa" },
    { desayuno: "d-avena", comida: "c-tinga", cena: "n-omelette" },
    { desayuno: "d-huevos", comida: "c-arroz-frito", cena: "n-fruta" },
    { desayuno: "d-yogurt", comida: "c-tacos", cena: "n-quesadillas" },
    { desayuno: "d-chilaquiles", comida: "c-ensalada", cena: "n-hotdogs" },
    { desayuno: "d-pantostado", comida: "c-salmon", cena: "n-sandwich" },
  ],
};
