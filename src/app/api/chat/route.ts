import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";
import { knowledge, scriptedAnswer } from "@/data/knowledge";
import { href, isLocale } from "@/lib/i18n";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Frozen system prompt (no dates or per-request values) so the prefix caches.
const SYSTEM = `You are the TBH One AI assistant on the TBH One website. You are an automated program, not a person.

TBH One (Tell One, Bring One, Help One) is a community-powered initiative supporting Peter Obi and Rabiu Musa Kwankwaso, working with the Nigeria Democratic Congress (NDC).

Rules:
- Answer ONLY from the APPROVED FACTS below. If the facts do not cover a question, say you don't have that information and suggest the Contact page or a relevant page path. Never guess.
- Never invent election dates, candidate statements or quotes, project figures, prices, payment instructions, bank details, phone numbers or official accounts.
- Never ask for or accept passwords, card details, PINs, voter's card (PVC) numbers or how someone intends to vote. If a user offers them, tell them not to share them.
- For anything about voting logistics, refer people to INEC as the official source.
- Do not attack or make allegations against named individuals.
- Be brief: 2–4 short sentences in plain language. Reply in the user's language when they write in Nigerian Pidgin, Yoruba, Hausa or Igbo.
- When useful, mention one or two site paths from the facts (e.g. /join).

APPROVED FACTS:
${knowledge.map((k) => `- ${k.answer} (pages: ${k.links.map((l) => l.path).join(", ")})`).join("\n")}`;

type InMsg = { role: "user" | "assistant"; content: string };

function linksFor(text: string, locale: "en" | "pcm" | "yo" | "ha" | "ig") {
  const hit = scriptedAnswer(text);
  return (hit?.links ?? []).map((l) => ({ label: l.label, href: href(locale, l.path) }));
}

export async function POST(req: Request) {
  let body: { messages?: InMsg[]; locale?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  const locale = body.locale && isLocale(body.locale) ? body.locale : "en";
  const messages = (body.messages ?? [])
    .filter((m) => (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
    .slice(-12)
    .map((m) => ({ role: m.role, content: m.content.slice(0, 1000) }));
  const last = messages[messages.length - 1];
  if (!last || last.role !== "user") return NextResponse.json({ error: "No question" }, { status: 400 });

  // No API key configured: scripted answers from the same approved facts, clearly labelled in the UI.
  if (!process.env.ANTHROPIC_API_KEY && !process.env.ANTHROPIC_AUTH_TOKEN) {
    const hit = scriptedAnswer(last.content);
    return NextResponse.json({
      role: "assistant",
      mode: "scripted",
      content:
        hit?.answer ??
        "I don't have an approved answer for that yet. Please use the Contact page and the TBH One team will help, or try one of the suggested questions.",
      links: hit ? hit.links.map((l) => ({ label: l.label, href: href(locale, l.path) })) : [{ label: "Contact", href: href(locale, "/contact") }],
    });
  }

  try {
    const client = new Anthropic();
    const response = await client.beta.messages.create({
      model: process.env.ANTHROPIC_MODEL ?? "claude-opus-5-5",
      max_tokens: 1024,
      output_config: { effort: "low" },
      betas: ["server-side-fallback-2026-07-01"],
      fallbacks: "default",
      system: [{ type: "text", text: SYSTEM, cache_control: { type: "ephemeral" } }],
      messages,
    });

    if (response.stop_reason === "refusal") {
      return NextResponse.json({
        role: "assistant",
        mode: "ai",
        content: "I can't help with that here. Please contact the TBH One team through the Contact page.",
        links: [{ label: "Contact", href: href(locale, "/contact") }],
      });
    }
    const text = response.content
      .filter((b): b is Anthropic.Beta.BetaTextBlock => b.type === "text")
      .map((b) => b.text)
      .join("\n")
      .trim();
    return NextResponse.json({ role: "assistant", mode: "ai", content: text, links: linksFor(last.content + " " + text, locale) });
  } catch (error) {
    if (error instanceof Anthropic.RateLimitError) {
      return NextResponse.json({ error: "busy" }, { status: 429 });
    }
    if (error instanceof Anthropic.APIError) {
      console.error("chat api error", error.status, error.message);
      return NextResponse.json({ error: "upstream" }, { status: 502 });
    }
    console.error("chat error", error);
    return NextResponse.json({ error: "unavailable" }, { status: 503 });
  }
}
