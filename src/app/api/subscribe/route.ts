import { NextResponse } from "next/server";

/**
 * Newsletter / WhatsApp opt-in. Integration boundary: until the email and WhatsApp providers are connected,
 * this validates and acknowledges the request but does NOT store or message anyone, and says so.
 */
export async function POST(req: Request) {
  let body: { email?: string; phone?: string; consent?: boolean };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  if (!body.consent) return NextResponse.json({ error: "Consent required" }, { status: 422 });
  if (!body.email && !body.phone) return NextResponse.json({ error: "Email or phone required" }, { status: 422 });
  return NextResponse.json({ ok: true, stored: false, note: "Messaging providers not connected yet (demo)." });
}
