import Link from "next/link";
import { notFound } from "next/navigation";
import { feeInShillings, getSession } from "@/lib/masterclass";
import { formatShillings, formatUsd, parseUsd, usdHeadline } from "@/lib/currency";
import RegisterForm from "./register-form";
import ShareBar from "../share-bar";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const session = await getSession(slug);
  if (!session) return { title: "Masterclass | ARIFA" };
  return {
    title: `Register — ${session.title} Masterclass | ARIFA`,
    description: session.desc,
  };
}

function payLabel(session, fee) {
  if (parseUsd(session.early_price)) {
    return `${formatUsd(
      usdHeadline({ usdPrice: session.early_price, shillings: fee }),
    )}, charged as ${formatShillings(fee)}`;
  }
  return formatShillings(fee);
}

export default async function MasterclassRegisterPage({ params }) {
  const { slug } = await params;
  const session = await getSession(slug);
  if (!session) notFound();

  const fee = feeInShillings(session);
  const path = `/training/masterclass/${session.id}`;

  return (
    <section className="bg-white pt-32 pb-24">
      <div className="mx-auto max-w-[720px] px-6">
        <Link
          href="/training/masterclass"
          className="mb-8 inline-flex items-center gap-2 text-sm font-bold text-primary"
        >
          <i className="fas fa-arrow-left text-xs" /> All Masterclass cities
        </Link>

        <div className="text-xs font-bold uppercase tracking-[2px] text-primary">
          {session.country} · Register and pay
        </div>
        <h1 className="mt-2 text-3xl font-bold text-ink font-[var(--font-heading)] md:text-4xl">
          {session.title} Masterclass
        </h1>
        <p className="mt-3 text-muted">
          <i className="fa-solid fa-calendar-days mr-1.5 text-primary" />
          {session.date}
          {session.venue ? ` · ${session.venue}` : session.format ? ` · ${session.format}` : ""}
        </p>

        <ShareBar
          path={path}
          title={`${session.title} Masterclass | ARIFA`}
          text={`Register for the ARIFA ${session.title} Masterclass. ${session.desc}`}
        />

        <div className="mt-10 rounded-xl border border-line bg-white p-8 shadow-[0_10px_40px_rgba(0,0,0,0.05)] md:p-10">
          <h2 className="mb-2 text-2xl font-bold text-ink font-[var(--font-heading)]">
            Registration
          </h2>

          {fee == null ? (
            <>
              <p className="mb-8 text-muted">
                Online registration for {session.title} is not open yet. Contact
                our team and we will reserve your seat and confirm the fee.
              </p>
              <Link
                href="/contact-us"
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 font-bold text-white"
              >
                Contact us to register{" "}
                <i className="fas fa-arrow-right text-xs" />
              </Link>
            </>
          ) : (
            <>
              <p className="mb-8 text-muted">
                Complete the form to reserve your seat. You will be taken to
                Selcom to pay{" "}
                <strong className="text-black">{payLabel(session, fee)}</strong>{" "}
                by card or mobile money.
              </p>
              <RegisterForm
                slug={String(session.id)}
                city={session.title}
                fee={fee}
              />
            </>
          )}
        </div>
      </div>
    </section>
  );
}
