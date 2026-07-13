import { createApplication } from "../../../lib/submissions";
import { clientIp, isRateLimited } from "../../../lib/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Course / certification applications. Sent as multipart so the optional CV can
 * ride along with the fields.
 */
export async function POST(request) {
  if (isRateLimited(`apply:${clientIp(request)}`, 5)) {
    return Response.json(
      { error: "Too many applications sent. Please try again later." },
      { status: 429 },
    );
  }

  let form;
  try {
    form = await request.formData();
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }

  const body = Object.fromEntries(
    [...form.entries()].filter(([, v]) => typeof v === "string"),
  );
  const cv = form.get("cv");

  try {
    const result = await createApplication(
      body,
      cv && typeof cv !== "string" ? cv : null,
    );
    if (!result.ok) {
      return Response.json({ error: result.error }, { status: 400 });
    }
    return Response.json({ ok: true });
  } catch (err) {
    console.error("[applications] failed to save application", err);
    return Response.json(
      { error: "Could not submit your application. Please try again." },
      { status: 500 },
    );
  }
}
