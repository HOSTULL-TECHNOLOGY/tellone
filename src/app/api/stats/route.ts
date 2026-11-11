import { NextResponse } from "next/server";
import { getStats } from "@/lib/stats";

export const dynamic = "force-dynamic";

/** WEB-2: live member count, joins today, funds raised and the opt-in "just joined" feed. */
export async function GET() {
  const stats = await getStats();
  if (!stats) return NextResponse.json({ error: "Live statistics are not connected yet." }, { status: 503 });
  return NextResponse.json(stats, { headers: { "Cache-Control": "public, max-age=30, stale-while-revalidate=60" } });
}
