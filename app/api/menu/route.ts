import { NextResponse } from "next/server";
import { kvGet, kvSet } from "../../lib/kv";
import type { Cycle, Dish } from "../../lib/types";
import { SEED_CYCLE, SEED_DISHES } from "../../data/seedMenu";

const DISHES_KEY = "menu:dishes";
const CYCLE_KEY = "menu:cycle";

export async function GET() {
  let dishes = await kvGet<Dish[]>(DISHES_KEY);
  let cycle = await kvGet<Cycle>(CYCLE_KEY);

  if (!dishes) {
    dishes = SEED_DISHES;
    await kvSet(DISHES_KEY, dishes);
  }
  if (!cycle) {
    cycle = SEED_CYCLE;
    await kvSet(CYCLE_KEY, cycle);
  }

  return NextResponse.json({ dishes, cycle });
}

export async function PUT(req: Request) {
  const body = (await req.json()) as { dishes?: Dish[]; cycle?: Cycle };
  if (body.dishes) await kvSet(DISHES_KEY, body.dishes);
  if (body.cycle) await kvSet(CYCLE_KEY, body.cycle);
  return NextResponse.json({ ok: true });
}
