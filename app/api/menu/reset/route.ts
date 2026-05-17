import { NextResponse } from "next/server";
import { kvSet } from "../../../lib/kv";
import { SEED_CYCLE, SEED_DISHES } from "../../../data/seedMenu";

/**
 * Sobreescribe dishes y cycle con los seeds actuales del repo.
 * Útil para re-cargar el menú base sin tener que borrar KV manualmente.
 * No toca el estado de marks de ciclos previos.
 */
export async function POST() {
  await kvSet("menu:dishes", SEED_DISHES);
  await kvSet("menu:cycle", SEED_CYCLE);
  return NextResponse.json({ ok: true, dishes: SEED_DISHES.length });
}
