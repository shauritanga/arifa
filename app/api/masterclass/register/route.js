import { initiateDonation } from "../../../../lib/donations";
import { feeInShillings, getSession, sessionLabel } from "../../../../lib/masterclass";
import { clientIp, isRateLimited } from "../../../../lib/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Airpay caps buyer_email at 50 chars and rejects the transaction if longer. */
const MAX_EMAIL = 50;

/**
 * Register (and pay) for a Master Class seat.
 *
 * The price is NOT taken from the request: the browser only says which city, and
 * the fee is read from that session's record. A registrant therefore cannot pick
 * what they pay, which is the one thing the donation route must allow and this
 * one must not.
 *
 * Returns the Airpay checkout form for the browser to POST, exactly like
 * /api/airpay/initiate — settlement, retries and the status page are then the
 * shared donation lifecycle.
 */
export async function POST(request) {
  if (isRateLimited(`masterclass:${clientIp(request)}`, 5)) {
    return Response.json(
      { error: "Too many attempts. Please try again in a few minutes." },
      { status: 429 },
    );
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }

  const session = await getSession(text(body?.slug, 80));
  if (!session) {
    return Response.json({ error: "Unknown Master Class session." }, { status: 404 });
  }

  const amount = feeInShillings(session);
  if (amount == null) {
    return Response.json(
      {
        error:
          "Online registration for this city is not open yet. Please contact us to reserve a seat.",
      },
      { status: 400 },
    );
  }

  const input = {
    type: "training",
    name: text(body?.name, 100),
    email: text(body?.email, MAX_EMAIL),
    phone: text(body?.phone, 20),
    organization: text(body?.organization, 80),
    position: text(body?.position, 80),
    message: text(body?.motivation, 180),
    packageName: sessionLabel(session),
    amount,
  };

  const error = validate(input);
  if (error) return Response.json({ error }, { status: 400 });

  try {
    const result = await initiateDonation(input);
    if (!result.ok) {
      return Response.json({ error: result.error }, { status: 400 });
    }
    return Response.json({
      paymentUrl: result.paymentUrl,
      fields: result.fields,
      reference: result.reference,
    });
  } catch (err) {
    console.error("[masterclass] registration failed", err);
    return Response.json(
      { error: "Registration could not be started. Please try again." },
      { status: 500 },
    );
  }
}

function text(value, max) {
  return String(value ?? "").trim().slice(0, max);
}

function validate(input) {
  if (!input.name) return "Full name is required.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email)) {
    return "A valid email address is required.";
  }
  if (!/^\d{9,12}$/.test(input.phone.replace(/\D/g, ""))) {
    return "A valid phone number is required.";
  }
  if (!input.message) return "Tell us why you want to attend.";
  return null;
}
