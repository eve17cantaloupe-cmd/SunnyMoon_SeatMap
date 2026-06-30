import { NextResponse } from "next/server";
import { getEntries, saveEntry } from "../../../lib/kv";
import { SHOW_DATES } from "../../../lib/sections";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get("date");
  if (!date || !SHOW_DATES.includes(date)) {
    return NextResponse.json({ error: "Invalid date" }, { status: 400 });
  }
  const entries = await getEntries(date);
  return NextResponse.json({ entries });
}

export async function POST(request) {
  const body = await request.json();
  const { date, sectionId, username, emoji, photo } = body;

  if (!date || !SHOW_DATES.includes(date)) {
    return NextResponse.json({ error: "Invalid date" }, { status: 400 });
  }
  if (!sectionId || typeof sectionId !== "string") {
    return NextResponse.json({ error: "Missing section" }, { status: 400 });
  }
  if (!username || typeof username !== "string" || username.trim().length === 0) {
    return NextResponse.json({ error: "Missing username" }, { status: 400 });
  }
  if (username.length > 30) {
    return NextResponse.json({ error: "Username too long" }, { status: 400 });
  }
  // Photo is a small base64 thumbnail already resized client-side. Cap size as a safety net.
  if (photo && photo.length > 300000) {
    return NextResponse.json({ error: "Photo too large" }, { status: 400 });
  }

  const entry = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    username: username.trim().slice(0, 30),
    emoji: emoji || null,
    photo: photo || null,
    createdAt: Date.now(),
  };

  const all = await saveEntry(date, sectionId, entry);
  return NextResponse.json({ ok: true, entry, entries: all });
}
