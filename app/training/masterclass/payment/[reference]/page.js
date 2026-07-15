import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import PaymentStatus from "../../../../support-us/payment/[reference]/payment-status";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Registration Status | ARIFA",
  description: "The status of your ARIFA Master Class registration.",
  robots: { index: false, follow: false },
};

/**
 * Where Airpay lands a Master Class registrant after checkout. The record is a
 * Donation row of type TRAINING, so the polling/retry component is the one the
 * donation status page uses — only the wording around it differs.
 */
export default async function MasterclassPaymentStatusPage({ params }) {
  const { reference } = await params;

  const registration = await prisma.donation.findUnique({
    where: { reference },
    select: {
      reference: true,
      status: true,
      amount: true,
      packageName: true,
      gatewayTransId: true,
    },
  });

  if (!registration) notFound();

  return (
    <section className="min-h-[70vh] bg-white pt-40 pb-24">
      <div className="mx-auto max-w-[760px] px-6">
        <div className="rounded-2xl border border-black/10 bg-white p-8 md:p-12 shadow-[0_20px_40px_rgba(0,0,0,0.08)]">
          <div className="mb-4 text-sm font-bold uppercase tracking-[0.2em] text-primary">
            {registration.packageName || "Master Class"}
          </div>
          <h1 className="mb-8 text-3xl md:text-5xl font-extrabold text-black font-[var(--font-heading)]">
            Registration Status
          </h1>
          <PaymentStatus
            kind="training"
            donation={{
              reference: registration.reference,
              status: registration.status,
              amount: registration.amount,
              transId: registration.gatewayTransId,
            }}
          />
        </div>
      </div>
    </section>
  );
}
