import { NextResponse } from "next/server";
import { deleteEntry } from "../../../lib/kv";
import { SHOW_DATES } from "../../../lib/sections";

export async function DELETE(request) {
  const body = await request.json();
  const { date, sectionId, entryId, password } = body;

  if (password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!date || !SHOW_DATES.includes(date) || !sectionId || !entryId) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const all = await deleteEntry(date, sectionId, entryId);
  return NextResponse.json({ ok: true, entries: all });
}
