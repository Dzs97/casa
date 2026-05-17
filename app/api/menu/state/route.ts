import { NextResponse } from "next/server";
import { kvGet, kvSet } from "../../../lib/kv";
import type { CycleState } from "../../../lib/types";

function stateKey(startDate: string) {
  return `menu:state:${startDate}`;
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const startDate = url.searchParams.get("startDate");
  if (!startDate) {
    return NextResponse.json({ error: "missing startDate" }, { status: 400 });
  }
  const state =
    (await kvGet<CycleState>(stateKey(startDate))) ??
    ({ startDate, marks: {} } as CycleState);
  return NextResponse.json(state);
}

export async function PUT(req: Request) {
  const state = (await req.json()) as CycleState;
  await kvSet(stateKey(state.startDate), state);
  return NextResponse.json({ ok: true });
}
