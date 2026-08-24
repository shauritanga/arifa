import Link from "next/link";
import { notFound } from "next/navigation";
import { feeInShillings, getSession } from "@/lib/masterclass";
import { formatShillings } from "@/lib/currency";
import RegisterForm from "../[slug]/register-form";
import ShareBar from "./share-bar";

export const dynamic = "force-dynamic";

const SLUG = "AIforHR";

export async function generateMetadata() {
  return {
    title: "AI Powered HR Masterclass | ARIFA",
    description:
      "Two-day AI masterclass for HR professionals, 02–03 October 2026 at KingJada Hotel, Dar es Salaam. Register and pay online.",
    alternates: { canonical: "/training/masterclass/AIforHR" },
    openGraph: {
      title: "AI Powered HR Masterclass | ARIFA",
      description:
        "Transform HR. Empower people. Lead the AI revolution. 02–03 October 2026, KingJada Hotel, Dar es Salaam.",
      url: "/training/masterclass/AIforHR",
    },
  };
}

const DETAILS = [
  {
    icon: "fas fa-calendar-check",
    label: "Date",
    value: "02 – 03 October 2026 · 2 days",
  },
  {
    icon: "fas fa-location-dot",
    label: "Location",
    value: "KingJada Hotel, Dar es Salaam, TZ",
  },
  {
    icon: "fas fa-chart-line",
    label: "Investment",
    value: "TZS 500,000 per participant",
  },
];

export default async function AiForHrMasterclassPage() {
  const session = await getSession(SLUG);
  if (!session) notFound();

  const fee = feeInShillings(session);
  if (fee == null) notFound();

  return (
    <div className="bg-[#f4f1ea]">
      <section className="relative overflow-hidden bg-[#12382a] pt-32 pb-16 text-white">
        <div className="pointer-events-none absolute inset-0 opacity-40">
          <div className="absolute -right-24 top-10 h-80 w-80 rounded-full bg-[#d4a017]/30 blur-3xl" />
          <div className="absolute bottom-0 left-1/4 h-56 w-56 rounded-full bg-primary/40 blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-[1100px] px-6">
          <Link
            href="/training/masterclass"
            className="mb-8 inline-flex items-center gap-2 text-sm font-bold text-[#e8c547]"
          >
            <i className="fas fa-arrow-left text-xs" /> All Masterclasses
          </Link>

          <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#e8c547]">
            ARIFA · Africa Research Institute for AI
          </p>
          <h1 className="mt-3 max-w-3xl text-4xl font-extrabold leading-tight md:text-6xl font-[var(--font-heading)]">
            AI Powered HR{" "}
            <span className="text-[#e8c547]">Masterclass</span>
          </h1>
          <p className="mt-2 text-lg font-semibold uppercase tracking-[0.18em] text-white/80">
            For HR professionals
          </p>
          <p className="mt-5 max-w-xl text-xl font-medium text-[#f3e6b5]">
            Transform HR. Empower people. Lead the AI revolution.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-6">
            <div className="flex h-28 w-28 flex-col items-center justify-center rounded-full border-4 border-[#d4a017] bg-[#1a4a38] text-center shadow-[0_0_0_8px_rgba(212,160,23,0.15)]">
              <span className="text-[0.65rem] font-bold uppercase tracking-wider text-[#e8c547]">
                Investment
              </span>
              <span className="text-lg font-extrabold leading-none text-white">
                TZS
              </span>
              <span className="text-xl font-extrabold leading-none text-[#e8c547]">
                500,000
              </span>
            </div>
            <div>
              <p className="text-sm font-bold uppercase tracking-wide text-[#e8c547]">
                Seats are strictly limited
              </p>
              <p className="text-white/80">First come, first served.</p>
            </div>
          </div>

          <div className="mt-10">
            <ShareBar />
          </div>

          <a
            href="#register"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-primary px-7 py-3.5 font-bold text-white transition-transform hover:-translate-y-0.5"
          >
            Reserve your seat now
            <i className="fas fa-arrow-right text-xs" />
          </a>
        </div>
      </section>

      <section className="mx-auto max-w-[1100px] px-6 py-14">
        <div className="grid gap-5 md:grid-cols-3">
          {DETAILS.map((row) => (
            <div
              key={row.label}
              className="rounded-2xl border border-black/5 bg-white p-6 shadow-[0_12px_32px_-16px_rgba(18,56,42,0.35)]"
            >
              <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-[#12382a] text-[#e8c547]">
                <i className={row.icon} />
              </div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#12382a]">
                {row.label}
              </p>
              <p className="mt-1 text-lg font-semibold text-ink">{row.value}</p>
            </div>
          ))}
        </div>

        <div
          id="register"
          className="mt-14 scroll-mt-28 rounded-2xl border border-black/5 bg-white p-8 shadow-[0_16px_40px_-18px_rgba(18,56,42,0.4)] md:p-10"
        >
          <h2 className="text-2xl font-bold text-ink font-[var(--font-heading)] md:text-3xl">
            Register and pay online
          </h2>
          <p className="mt-3 max-w-2xl text-muted">
            Complete the form to reserve your seat. You will be taken to Selcom
            to pay{" "}
            <strong className="text-black">{formatShillings(fee)}</strong> by
            card or mobile money. Bank transfer and M-Pesa pay-number details
            are no longer required.
          </p>
          <div className="mt-8">
            <RegisterForm
              slug={String(session.id)}
              city="AI for HR"
              fee={fee}
            />
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 rounded-2xl bg-[#12382a] px-7 py-6 text-white sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-[#e8c547]">
              Questions
            </p>
            <p className="mt-1">
              <a className="underline-offset-2 hover:underline" href="mailto:training@arifa.org">
                training@arifa.org
              </a>
              {" · "}
              <a
                className="underline-offset-2 hover:underline"
                href="https://wa.me/255794755650"
              >
                +255 794 755 650
              </a>
            </p>
          </div>
          <p className="text-sm text-white/70">@ARIFA_AI</p>
        </div>
      </section>
    </div>
  );
}
