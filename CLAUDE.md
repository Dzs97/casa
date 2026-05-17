# CLAUDE.md

> Contexto del proyecto para Claude Code. Lee este archivo primero antes de hacer cualquier cambio.

## Qué es esto

Web app personal del owner (Diego) y su pareja. Dos features que conviven en el mismo deploy con tabs:

1. **Menú** (`/menu`): ciclo rotativo de 14 días × 3 tiempos (desayuno/comida/cena). Sustituye al menú que comparten por WhatsApp. Permite marcar platillos hechos, "extra" (sustituido por salir a comer/sobras), saltados. Genera lista de súper agregada por pasillo.
2. **Gastos** (`/gastos`): pagos fijos del hogar (renta, servicios, tarjetas, suscripciones). No registra gastos hormiga; el foco son los pagos grandes recurrentes. Alertas por fecha de vencimiento, histórico por mes.

Audiencia: el owner y su pareja únicamente. Sin auth — link semi-público en Vercel.

## Stack

- **Next.js 14** (App Router, TypeScript)
- **Vercel KV** (Redis serverless) para estado compartido. Wrapper en `app/lib/kv.ts` con fallback a memoria local si las env vars no están definidas.
- **Vanilla CSS** con custom properties en `app/globals.css` — sin Tailwind, sin styled-components.
- Deploy: Vercel.

## Estructura

```
app/
  components/   UI (todos client components excepto Tabs que requiere usePathname)
  data/         Seeds estáticos (platillos, pagos) — son fallback si KV está vacío
  lib/          types, kv wrapper, date utils
  api/          API routes (GET/PUT por recurso)
  menu/         Página /menu → renderiza <MenuView />
  gastos/       Página /gastos → renderiza <ExpensesView />
```

## Convenciones

1. **El contenido editable vive en KV, no en `data/`.** Los archivos en `data/` son solo seeds iniciales. Después del primer GET, KV tiene la versión "verdadera". No edites `data/` para cambiar el menú actual del owner — usa la UI o el dashboard de Vercel KV.
2. **API design:** cada recurso tiene `GET` (lee, seed si vacío) y `PUT` (sobreescribe con el body completo). Sin PATCH, sin POST. Los componentes siempre mandan el estado completo.
3. **Persistencia:** todos los writes son optimistic (set local + fire-and-forget al backend). Si falla la red, el cambio queda en memoria del cliente hasta el siguiente refresh. Aceptable para este caso de uso.
4. **Vanilla CSS:** mantén todo en `globals.css`. Está organizado por secciones con comentarios `/* ============ NOMBRE ============ */`.
5. **Modales:** patrón `<div className="modal-backdrop" onClick={onClose}>` con `e.stopPropagation()` en el child. No usar librerías de portals.

## Modelo de datos (KV keys)

- `menu:dishes` → `Dish[]`
- `menu:cycle` → `Cycle` (startDate + 14 días × { desayuno, comida, cena })
- `menu:state:{startDate}` → `CycleState` (marks por `${dayIdx}-${slot}`)
- `expenses:templates` → `ExpenseTemplate[]` (pagos recurrentes)
- `expenses:payments:{YYYY-MM}` → `Record<templateId, MonthlyPayment>`

Tipos en `app/lib/types.ts`.

## Decisiones tomadas (no revertir sin razón)

1. **KV en vez de Postgres:** sin schema, sin migraciones, suficiente para JSON de pocos KB. El tier gratuito es generoso.
2. **Sin auth:** link compartido manualmente. Si esto crece, considerar Vercel password protection (incluida en Pro).
3. **Cycle de 14 días fijo:** el owner mencionó explícitamente 2 semanas. No parametrizar la duración salvo que lo pida.
4. **El "extra" no auto-mueve platillos:** si marcas un slot como "extra", el platillo original simplemente queda pendiente en su día. El usuario decide manualmente si quiere reasignarlo a otro día (via "Cambiar platillo" en el modal). El modal sugiere platillos pendientes del mismo slot.
5. **Lista de súper agrupa por nombre de ingrediente case-insensitive y suma cantidades como strings (`"200 g + 1 pza"`).** No intenta sumar matemáticamente porque las unidades varían (un huevo en "pza" + uno en "g" no se puede sumar). Es una guía para el súper, no un cálculo exacto.
6. **Monto real en gastos:** cada pago tiene un `amount` (estimado) y un `actualAmount` opcional por mes. Útil para servicios que varían (luz, agua).

## Comunicación

El owner habla **español**. Es directo, le gustan explicaciones concisas con justificación cuando es útil. Cómodo con git/terminal/Vercel pero no es dev profesional. Commits en inglés (convención estándar).

## Cómo agregar features

- **Nuevo tipo de comida (snack, brunch):** agregar a `MealSlot` en `types.ts`, a `MEAL_SLOTS` y `MEAL_LABELS`, ajustar `Cycle.days` para incluir el slot, migrar KV manualmente si ya hay data.
- **Nueva categoría de gasto:** agregar a `ExpenseCategory` y `CATEGORY_LABELS` en `types.ts`.
- **Compartir cuotas (split):** no implementado. Requeriría agregar campo `paidBy` o `splitWith` a `ExpenseTemplate` y vista de balance.

## Comandos

```bash
npm run dev       # localhost:3000
npm run build     # antes de push
npm run start
```

Verifica `npm run build` antes de commitear cambios estructurales.
