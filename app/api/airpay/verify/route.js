import { prisma } from "../../../../lib/prisma";
import { verifyDonation } from "../../../../lib/donations";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Poll/refresh a donation's status (called by the payment status page). */
export async function GET(request) {
  const reference = new URL(request.url).searchParams.get("reference");
  if (!reference) {
    return Response.json({ error: "Missing reference" }, { status: 400 });
  }

  // Only hit the gateway while the donation is still open; once settled the
  // local record is authoritative (avoids hammering Airpay's verify endpoint).
  const current = await prisma.donation.findUnique({ where: { reference } });
  if (!current) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }
  if (current.status === "PENDING" || current.status === "PROCESSING") {
    await verifyDonation(reference).catch(() => null);
  }

  const donation = await prisma.donation.findUnique({ where: { reference } });

  return Response.json({
    reference: donation.reference,
    status: donation.status,
    amount: donation.amount,
    currency: donation.currency,
    type: donation.type,
    donorName: donation.donorName,
    transId: donation.gatewayTransId,
  });
}
