# Casa

App personal con dos secciones para uso diario:

1. **Menú** — ciclo rotativo de 14 días con desayuno/comida/cena. Marca lo que cocinaste, lo que sustituiste (salimos a comer = "extra"), y genera lista de súper agrupada por pasillo.
2. **Gastos** — pagos fijos del hogar (renta, servicios, tarjetas, suscripciones) con fechas de vencimiento, alertas, e histórico mensual.

Estado compartido entre dispositivos vía Vercel KV.

## Stack

- Next.js 14 (App Router) + TypeScript
- Vercel KV (Redis serverless) para persistencia
- Vanilla CSS con variables custom

## Setup local

```bash
npm install
cp .env.example .env.local
# (opcional) llena KV_REST_API_URL y KV_REST_API_TOKEN
npm run dev
```

Si no configuras KV, los datos viven en memoria del dev server y se pierden al reiniciar. Es suficiente para iterar UI.

## Deploy en Vercel

1. Push a un repo nuevo en GitHub
2. Import en [vercel.com](https://vercel.com) → New Project
3. En la pestaña **Storage**, crear un **KV** y conectarlo al proyecto (Vercel inyecta las env vars automáticamente)
4. Redeploy

El sitio será semi-público; compártelo con tu pareja por link.

## Estructura

```
app/
  components/
    Tabs.tsx              Toggle Menú/Gastos
    MenuView.tsx          Vista principal de menú
    DishModal.tsx         Modal de edición de un slot (día+tiempo)
    DishEditor.tsx        Crear/editar un platillo
    ShoppingList.tsx      Lista de súper agregada
    ExpensesView.tsx      Vista principal de gastos
    ExpenseEditor.tsx     Crear/editar un pago recurrente
    Toast.tsx
  data/
    seedMenu.ts           Platillos y ciclo iniciales
    seedExpenses.ts       Pagos fijos iniciales (renta, internet, tarjetas...)
  lib/
    types.ts              Tipos compartidos
    kv.ts                 Wrapper con fallback a memoria local
    dates.ts              Utilidades de fechas
  api/
    menu/route.ts         GET/PUT dishes + cycle
    menu/state/route.ts   GET/PUT marks por ciclo
    expenses/route.ts     GET/PUT templates
    expenses/payments/route.ts  GET/PUT pagos por mes
  menu/page.tsx
  gastos/page.tsx
  globals.css
  layout.tsx
  page.tsx                Redirect → /menu
```

## Personalización inicial

Los datos seed en `app/data/seedMenu.ts` y `app/data/seedExpenses.ts` son placeholders. Después del primer deploy:

1. Entra a **Menú → Platillos** y edita/agrega los platillos reales que tienes en WhatsApp.
2. Entra a **Menú → Plan** y asigna platillos a cada día del ciclo.
3. Entra a **Gastos → Configurar** y ajusta los montos/fechas reales.

Si cambias `seedMenu.ts` / `seedExpenses.ts` antes del primer GET, esos serán los iniciales en KV.

## Comandos

```bash
npm run dev      # localhost:3000
npm run build    # verificar build
npm run start    # producción local
```
