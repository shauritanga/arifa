import { notFound } from "next/navigation";
import { prisma } from "../../../../lib/prisma";
import PaymentStatus from "./payment-status";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Payment Status | ARIFA",
  description: "The status of your ARIFA donation.",
  robots: { index: false, follow: false },
};

export default async function PaymentStatusPage({ params }) {
  const { reference } = await params;

  const donation = await prisma.donation.findUnique({
    where: { reference },
    select: {
      reference: true,
      status: true,
      amount: true,
      gatewayTransId: true,
    },
  });

  if (!donation) notFound();

  return (
    <section className="min-h-[70vh] bg-white pt-40 pb-24">
      <div className="max-w-[760px] mx-auto px-6">
        <div className="rounded-2xl border border-black/10 bg-white p-8 md:p-12 shadow-[0_20px_40px_rgba(0,0,0,0.08)]">
          <div className="text-sm font-bold uppercase tracking-[0.2em] text-primary mb-4">
            AirPay Payment
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-black font-[var(--font-heading)] mb-8">
            Payment Status
          </h1>
          <PaymentStatus
            donation={{
              reference: donation.reference,
              status: donation.status,
              amount: donation.amount,
              transId: donation.gatewayTransId,
            }}
          />
        </div>
      </div>
    </section>
  );
}
