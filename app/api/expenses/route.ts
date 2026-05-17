import { NextResponse } from "next/server";
import { kvGet, kvSet } from "../../lib/kv";
import type { ExpenseTemplate } from "../../lib/types";
import { SEED_EXPENSES } from "../../data/seedExpenses";

const KEY = "expenses:templates";

export async function GET() {
  let templates = await kvGet<ExpenseTemplate[]>(KEY);
  if (!templates) {
    templates = SEED_EXPENSES;
    await kvSet(KEY, templates);
  }
  return NextResponse.json({ templates });
}

export async function PUT(req: Request) {
  const body = (await req.json()) as { templates: ExpenseTemplate[] };
  await kvSet(KEY, body.templates);
  return NextResponse.json({ ok: true });
}
