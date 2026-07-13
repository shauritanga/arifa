import { createContactMessage } from "../../../lib/submissions";
import { clientIp, isRateLimited } from "../../../lib/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request) {
  if (isRateLimited(`contact:${clientIp(request)}`, 5)) {
    return Response.json(
      { error: "Too many messages sent. Please try again later." },
      { status: 429 },
    );
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }

  try {
    const result = await createContactMessage(body);
    if (!result.ok) {
      return Response.json({ error: result.error }, { status: 400 });
    }
    return Response.json({ ok: true });
  } catch (err) {
    console.error("[contact] failed to save message", err);
    return Response.json(
      { error: "Could not send your message. Please try again." },
      { status: 500 },
    );
  }
}
