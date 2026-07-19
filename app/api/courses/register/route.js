import { initiateDonation } from "../../../../lib/donations";
import { courseLabel, feeInShillings, getCourse } from "../../../../lib/courses";
import { clientIp, isRateLimited } from "../../../../lib/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Airpay caps buyer_email at 50 chars and rejects the transaction if longer. */
const MAX_EMAIL = 50;

/**
 * Enroll (and pay) for a short course.
 *
 * The price is NOT taken from the request: the browser only says which course,
 * and the fee is read from that course's record. An enrollee therefore cannot
 * pick what they pay. Returns the Airpay checkout form for the browser to POST,
 * exactly like the Masterclass route — settlement, retries and the status page
 * are then the shared donation lifecycle.
 */
export async function POST(request) {
  if (isRateLimited(`course:${clientIp(request)}`, 5)) {
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

  const course = await getCourse(text(body?.slug, 80));
  if (!course) {
    return Response.json({ error: "Unknown short course." }, { status: 404 });
  }

  const amount = feeInShillings(course);
  if (amount == null) {
    return Response.json(
      {
        error:
          "Online enrollment for this course is not open yet. Please contact us to reserve a place.",
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
    packageName: courseLabel(course),
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
    console.error("[course] enrollment failed", err);
    return Response.json(
      { error: "Enrollment could not be started. Please try again." },
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
  return null;
}
