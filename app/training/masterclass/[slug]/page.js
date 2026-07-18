import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { feeInShillings, getSession } from "@/lib/masterclass";
import RegisterForm from "./register-form";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const session = await getSession(slug);
  if (!session) return { title: "Master Class | ARIFA" };
  return {
    title: `${session.title} Master Class | ARIFA`,
    description: session.desc,
  };
}

function DetailRow({ icon, label, value }) {
  return (
    <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-black/5 py-3 last:border-0">
      <span className="flex items-center gap-2 text-sm font-bold text-black">
        <i className={`${icon} text-primary`} />
        {label}
      </span>
      <span className="text-right text-muted">{value}</span>
    </div>
  );
}

export default async function MasterclassSessionPage({ params }) {
  const { slug } = await params;
  const session = await getSession(slug);
  if (!session) notFound();

  const fee = feeInShillings(session);

  return (
    <section className="bg-white pt-32 pb-24">
      <div className="mx-auto max-w-[1000px] px-6">
        <Link
          href="/training/masterclass"
          className="mb-8 inline-flex items-center gap-2 text-sm font-bold text-primary"
        >
          <i className="fas fa-arrow-left text-xs" /> All Master Class cities
        </Link>

        <div className="text-xs font-bold uppercase tracking-[2px] text-primary">
          {session.country} · Executive Session
        </div>
        <h1 className="mt-2 text-4xl md:text-5xl font-bold text-ink font-[var(--font-heading)]">
          {session.title}
        </h1>

        <div className="mt-10 grid gap-10 md:grid-cols-[1.1fr_1fr] md:items-start">
          <div>
            {session.image && (
              <div className="relative h-[260px] w-full overflow-hidden rounded-xl">
                <Image
                  src={session.image}
                  alt={`AI Master Class in ${session.title}, ${session.country}`}
                  fill
                  sizes="(max-width: 768px) 100vw, 520px"
                  className="object-cover"
                  priority
                />
              </div>
            )}
            <p className="mt-6 text-lg leading-relaxed text-muted">
              {session.desc}
            </p>
          </div>

          <div className="rounded-xl border border-line bg-white p-7 shadow-[0_10px_40px_rgba(0,0,0,0.05)]">
            <h2 className="mb-2 text-xl font-bold text-ink font-[var(--font-heading)]">
              Session details
            </h2>
            <DetailRow
              icon="fas fa-map-marker-alt"
              label="Location"
              value={`${session.title}, ${session.country}`}
            />
            <DetailRow
              icon="fas fa-calendar-check"
              label="Dates"
              value={session.date}
            />
            {session.format && (
              <DetailRow
                icon="fas fa-clock"
                label="Duration"
                value={session.format}
              />
            )}
            <DetailRow
              icon="fas fa-coins"
              label="Fee"
              value={
                <>
                  {session.early_price && (
                    <span className="font-bold text-primary">
                      {session.early_price}
                    </span>
                  )}
                  {session.standard_price && (
                    <span className="ml-2 text-black/50 line-through">
                      {session.standard_price}
                    </span>
                  )}
                  {fee != null && (
                    <span className="block text-sm text-black/60">
                      Charged as TSh {fee.toLocaleString("en-TZ")}
                    </span>
                  )}
                </>
              }
            />
          </div>
        </div>

        <div className="mt-16 rounded-xl border border-line bg-white p-8 md:p-10 shadow-[0_10px_40px_rgba(0,0,0,0.05)]">
          <h2 className="mb-2 text-2xl font-bold text-ink font-[var(--font-heading)]">
            Registration
          </h2>

          {fee == null ? (
            /* No fee set for this city yet, so there is nothing we could
               legitimately charge. Take the enquiry instead of inventing a price. */
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
                AirPay to pay{" "}
                <strong className="text-black">
                  TSh {fee.toLocaleString("en-TZ")}
                </strong>{" "}
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
