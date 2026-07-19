import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "../../../../../lib/prisma";
import StatusPill from "../../status-pill";
import ReverifyButton from "./reverify-button";

export const dynamic = "force-dynamic";

const TZS = new Intl.NumberFormat("en-TZ");

const TYPE_LABELS = {
  DONATION: "Donation",
  SPONSORSHIP: "Sponsorship",
  TRAINING: "Masterclass",
};

export default async function DonationDetailPage({ params }) {
  const { reference } = await params;

  const donation = await prisma.donation.findUnique({
    where: { reference },
    include: { events: { orderBy: { createdAt: "desc" } } },
  });

  if (!donation) notFound();

  return (
    <div>
      <Link
        href="/admin/donations"
        className="mb-6 inline-block text-sm font-bold text-black/50 hover:text-primary"
      >
        ← Back to donations
      </Link>

      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-black font-[var(--font-heading)]">
            {donation.donorName}
          </h1>
          <p className="mt-1 font-mono text-sm text-black/50">{donation.reference}</p>
        </div>
        <StatusPill status={donation.status} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card title="Donation">
            <Row label="Amount" value={`TSh ${TZS.format(donation.amount)}`} strong />
            <Row label="Type" value={TYPE_LABELS[donation.type] ?? "Donation"} />
            {donation.packageName && (
              <Row
                label={donation.type === "TRAINING" ? "Session" : "Package"}
                value={donation.packageName}
              />
            )}
            {donation.message && <Row label="Message" value={donation.message} />}
            <Row
              label="Started"
              value={donation.createdAt.toLocaleString("en-GB")}
            />
            {donation.paidAt && (
              <Row label="Paid at" value={donation.paidAt.toLocaleString("en-GB")} />
            )}
          </Card>

          <Card title={donation.type === "TRAINING" ? "Registrant" : "Donor"}>
            <Row label="Name" value={donation.donorName} />
            <Row label="Email" value={donation.email} />
            <Row label="Phone" value={donation.phone} />
            {donation.organization && (
              <Row label="Organisation" value={donation.organization} />
            )}
            {donation.position && <Row label="Job title" value={donation.position} />}
          </Card>

          <Card title="History">
            {donation.events.length === 0 ? (
              <p className="py-4 text-sm text-black/50">
                No status changes recorded yet.
              </p>
            ) : (
              <ul className="divide-y divide-black/5">
                {donation.events.map((e) => (
                  <li key={e.id} className="flex items-start justify-between py-3">
                    <div>
                      <div className="text-sm font-bold text-black">
                        {e.fromStatus ? `${e.fromStatus} → ` : ""}
                        {e.toStatus}
                      </div>
                      <div className="text-xs text-black/50">
                        via {e.source}
                        {e.message ? ` · ${e.message}` : ""}
                      </div>
                    </div>
                    <span className="shrink-0 pl-4 text-xs text-black/40">
                      {e.createdAt.toLocaleString("en-GB")}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>

        <div className="space-y-6">
          <Card title="Gateway">
            <Row label="Order ID" value={donation.gatewayOrderId || "—"} mono />
            <Row label="AirPay txn" value={donation.gatewayTransId || "—"} mono />
            <Row label="Attempts" value={String(donation.attempt)} />
            {donation.failureReason && (
              <Row label="Last error" value={donation.failureReason} />
            )}
          </Card>

          <div className="rounded-2xl border border-black/10 bg-white p-6">
            <h2 className="mb-2 font-extrabold text-black">Status check</h2>
            <p className="mb-4 text-sm text-black/60">
              Asks AirPay directly. A donation is only ever marked paid by the
              gateway, and only if the amount matches.
            </p>
            <ReverifyButton reference={donation.reference} />
          </div>
        </div>
      </div>
    </div>
  );
}

function Card({ title, children }) {
  return (
    <div className="rounded-2xl border border-black/10 bg-white p-6">
      <h2 className="mb-4 font-extrabold text-black">{title}</h2>
      <dl className="space-y-3">{children}</dl>
    </div>
  );
}

function Row({ label, value, strong, mono }) {
  return (
    <div className="flex justify-between gap-4 text-sm">
      <dt className="shrink-0 text-black/50">{label}</dt>
      <dd
        className={`text-right ${strong ? "font-extrabold text-black" : "text-black/80"} ${
          mono ? "font-mono text-xs" : ""
        }`}
      >
        {value}
      </dd>
    </div>
  );
}
