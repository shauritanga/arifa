import { initiateDonation, retryDonation } from "../../../../lib/donations";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Airpay caps buyer_email at 50 chars, and rejects the transaction if longer. */
const MAX_EMAIL = 50;

/**
 * Start a donation payment. Returns the Airpay checkout form for the browser to
 * POST — Airpay has no hosted-checkout URL to redirect to, so the client builds
 * a hidden form from these fields and submits it.
 *
 * Two shapes: `{ reference }` re-opens an existing unpaid donation (the donor's
 * "try again"), anything else creates a new one from the pledge form.
 */
export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }

  const result = body?.reference
    ? await retryDonation(String(body.reference))
    : await createFromForm(body);

  if (!result.ok) {
    return Response.json({ error: result.error }, { status: 400 });
  }

  return Response.json({
    paymentUrl: result.paymentUrl,
    fields: result.fields,
    reference: result.reference,
  });
}

async function createFromForm(body) {
  const input = {
    name: text(body?.name, 100),
    email: text(body?.email, MAX_EMAIL),
    phone: text(body?.phone, 20),
    organization: text(body?.organization, 80),
    message: text(body?.message, 180),
    packageName: text(body?.packageName, 80),
    type: body?.paymentType === "sponsorship" ? "sponsorship" : "donation",
    amount: toWholeShillings(body?.amount),
  };

  const error = validate(input);
  if (error) return { ok: false, error };

  try {
    return await initiateDonation(input);
  } catch (err) {
    console.error("[airpay] initiate failed", err);
    return { ok: false, error: "Payment could not be started. Please try again." };
  }
}

/** Airpay bills whole Tanzanian shillings; TZS has no subunit in practice. */
function toWholeShillings(value) {
  const parsed = Number(String(value ?? "").replace(/,/g, ""));
  if (!Number.isFinite(parsed)) return NaN;
  return Math.round(parsed);
}

function text(value, max) {
  return String(value ?? "").trim().slice(0, max);
}

function validate(input) {
  if (!input.name) return "Full name is required.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email)) {
    return "A valid email address is required.";
  }
  // 9 digits (712345678), or 10-12 with a 0 / 255 prefix.
  if (!/^\d{9,12}$/.test(input.phone.replace(/\D/g, ""))) {
    return "A valid Tanzanian phone number is required.";
  }
  if (!Number.isFinite(input.amount) || input.amount < 1000) {
    return "Enter a donation amount of at least TSh 1,000.";
  }
  return null;
}
