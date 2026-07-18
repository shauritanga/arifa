"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { startPayment } from "../../../../lib/client/start-payment";

/** How often to re-ask the server while the gateway hasn't settled yet. */
const POLL_MS = 4000;
/** Stop polling after this long; mobile-money confirmations can be slow. */
const POLL_TIMEOUT_MS = 3 * 60 * 1000;

const OPEN = ["PENDING", "PROCESSING"];

/**
 * The settled-copy differs by what was bought — a gift is thanked for, a seat is
 * confirmed — but every other state (waiting, failed, cancelled, refunded) reads
 * the same, so only PAID is overridden.
 */
const PAID_BY_KIND = {
  training: {
    title: "Your seat is confirmed.",
    body: "AirPay has confirmed your payment. We have emailed you a receipt, and our team will follow up with joining details before the session.",
    tone: "bg-green-50 text-green-700",
  },
};

const COPY = {
  PAID: {
    title: "Thank you — your gift is confirmed.",
    body: "AirPay has confirmed your payment. ARIFA is grateful for your support.",
    tone: "bg-green-50 text-green-700",
  },
  PROCESSING: {
    title: "Waiting for confirmation…",
    body: "If you were asked to approve a mobile money prompt on your phone, please complete it. This page updates itself.",
    tone: "bg-yellow-50 text-yellow-700",
  },
  PENDING: {
    title: "Waiting for confirmation…",
    body: "If you were asked to approve a mobile money prompt on your phone, please complete it. This page updates itself.",
    tone: "bg-yellow-50 text-yellow-700",
  },
  FAILED: {
    title: "The payment did not go through.",
    body: "No money has left your account. You can try again below.",
    tone: "bg-red-50 text-red-700",
  },
  CANCELLED: {
    title: "The payment was cancelled.",
    body: "No money has left your account. You can try again below.",
    tone: "bg-red-50 text-red-700",
  },
  REFUNDED: {
    title: "This payment was refunded.",
    body: "Contact ARIFA if you have any questions about this refund.",
    tone: "bg-black/5 text-muted",
  },
};

export default function PaymentStatus({ donation, kind = "donation" }) {
  const [status, setStatus] = useState(donation.status);
  const [retrying, setRetrying] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!OPEN.includes(status)) return undefined;

    let cancelled = false;
    const startedAt = Date.now();

    const tick = async () => {
      if (cancelled || Date.now() - startedAt > POLL_TIMEOUT_MS) {
        clearInterval(timer);
        return;
      }
      try {
        const res = await fetch(
          `/api/airpay/verify?reference=${encodeURIComponent(donation.reference)}`,
          { cache: "no-store" },
        );
        if (!res.ok) return;
        const next = await res.json();
        if (!cancelled && next.status) setStatus(next.status);
      } catch {
        // Transient network error — the next tick tries again.
      }
    };

    const timer = setInterval(tick, POLL_MS);
    tick();

    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, [status, donation.reference]);

  const retry = useCallback(async () => {
    setError("");
    setRetrying(true);
    try {
      await startPayment({ reference: donation.reference });
    } catch (err) {
      setError(err.message);
      setRetrying(false);
    }
  }, [donation.reference]);

  const copy =
    (status === "PAID" && PAID_BY_KIND[kind]) || COPY[status] || COPY.PENDING;
  const isOpen = OPEN.includes(status);
  const canRetry = status === "FAILED" || status === "CANCELLED";

  return (
    <>
      <div className={`mb-6 rounded-xl px-5 py-4 font-bold ${copy.tone}`}>
        {copy.title}
      </div>
      <p className="text-muted leading-relaxed mb-8">{copy.body}</p>

      <dl className="grid gap-4 text-sm text-muted">
        <div>
          <dt className="font-bold text-black">Reference</dt>
          <dd>{donation.reference}</dd>
        </div>
        <div>
          <dt className="font-bold text-black">Amount</dt>
          <dd>TSh {donation.amount.toLocaleString("en-TZ")}</dd>
        </div>
        {donation.transId && (
          <div>
            <dt className="font-bold text-black">AirPay Reference</dt>
            <dd>{donation.transId}</dd>
          </div>
        )}
      </dl>

      {isOpen && (
        <p className="mt-8 text-sm text-black/50">
          Checking with AirPay… you can safely keep this page open.
        </p>
      )}

      {error && (
        <div role="alert" className="mt-8 rounded-xl bg-red-50 px-5 py-4 text-red-700">
          {error}
        </div>
      )}

      <div className="mt-10 flex flex-col sm:flex-row gap-3">
        {canRetry && (
          <button
            type="button"
            onClick={retry}
            disabled={retrying}
            className="inline-flex justify-center rounded-xl bg-primary px-6 py-3 font-bold text-white disabled:opacity-70"
          >
            {retrying ? "Starting…" : "Try Again"}
          </button>
        )}
        <Link
          href={kind === "training" ? "/training/masterclass" : "/support-us#pledge-form"}
          className="inline-flex justify-center rounded-xl border border-primary px-6 py-3 font-bold text-primary"
        >
          {kind === "training" ? "Back to Master Class" : "Make Another Gift"}
        </Link>
        <Link
          href="/contact-us"
          className="inline-flex justify-center rounded-xl border border-line px-6 py-3 font-bold text-muted"
        >
          Contact ARIFA
        </Link>
      </div>
    </>
  );
}
