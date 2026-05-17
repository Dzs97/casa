import { NextResponse } from "next/server";
import { kvGet, kvSet } from "../../../lib/kv";
import type { MonthPayments } from "../../../lib/types";

function paymentsKey(month: string) {
  return `expenses:payments:${month}`;
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const month = url.searchParams.get("month");
  if (!month) {
    return NextResponse.json({ error: "missing month" }, { status: 400 });
  }
  const payments = (await kvGet<MonthPayments>(paymentsKey(month))) ?? {};
  return NextResponse.json({ month, payments });
}

export async function PUT(req: Request) {
  const body = (await req.json()) as { month: string; payments: MonthPayments };
  await kvSet(paymentsKey(body.month), body.payments);
  return NextResponse.json({ ok: true });
}
