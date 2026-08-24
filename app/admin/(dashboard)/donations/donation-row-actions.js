"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import ConfirmDialog from "../../components/confirm-dialog";
import {
  deleteDonation,
  resendDonationLink,
  reverifyDonation,
} from "../../actions";

export default function DonationRowActions({
  reference,
  status,
  email,
  donorName,
  compact = false,
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [note, setNote] = useState("");
  const [confirm, setConfirm] = useState(null); // "delete" | "resend" | null
  const [links, setLinks] = useState(null);
  const [copied, setCopied] = useState("");

  const btn =
    compact
      ? "inline-flex items-center gap-1 rounded-lg border px-2 py-1 text-[0.7rem] font-semibold disabled:opacity-50"
      : "inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-semibold disabled:opacity-50";

  const check = () => {
    setError("");
    setNote("");
    startTransition(async () => {
      const res = await reverifyDonation(reference);
      if (!res.ok) setError(res.error);
      else setNote(`Selcom: ${res.status}`);
    });
  };

  const doResend = () => {
    setError("");
    setNote("");
    startTransition(async () => {
      const res = await resendDonationLink(reference);
      setConfirm(null);
      if (!res.ok) {
        setError(res.error);
        return;
      }
      setLinks(res);
    });
  };

  const doDelete = () => {
    setError("");
    startTransition(async () => {
      const res = await deleteDonation(reference);
      setConfirm(null);
      if (!res.ok) {
        setError(res.error);
        return;
      }
      router.push("/admin/donations");
      router.refresh();
    });
  };

  const copy = async (value, which) => {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      window.prompt("Copy this link", value);
    }
    setCopied(which);
    window.setTimeout(() => setCopied(""), 2000);
  };

  const canResend = status === "FAILED";
  const canCheck = status === "PROCESSING" || status === "PENDING";
  const canDelete = status === "FAILED" || status === "CANCELLED";

  const mailHref = links
    ? `mailto:${links.email}?subject=${encodeURIComponent(
        `ARIFA payment link ${links.reference}`,
      )}&body=${encodeURIComponent(
        `Hello ${links.donorName},\n\nPlease complete your payment using this link:\n${links.statusUrl}\n\nIf that page asks you to try again, use this checkout:\n${links.checkoutUrl}\n`,
      )}`
    : "";

  return (
    <div className="space-y-1">
      <div className="flex flex-wrap items-center justify-end gap-1.5">
        {canCheck && (
          <button
            type="button"
            disabled={pending}
            onClick={check}
            className={`${btn} border-black/10 bg-white text-black/70 hover:bg-black/[0.03]`}
          >
            <i className="fas fa-rotate text-[0.6rem]" />
            Check Selcom
          </button>
        )}
        {canResend && (
          <button
            type="button"
            disabled={pending}
            onClick={() => setConfirm("resend")}
            className={`${btn} border-primary/30 bg-primary/5 text-primary hover:bg-primary/10`}
          >
            <i className="fas fa-paper-plane text-[0.6rem]" />
            Resend link
          </button>
        )}
        {canDelete && (
          <button
            type="button"
            disabled={pending}
            onClick={() => setConfirm("delete")}
            className={`${btn} border-red-200 bg-red-50 text-red-700 hover:bg-red-100`}
          >
            <i className="fas fa-trash-can text-[0.6rem]" />
            Delete
          </button>
        )}
      </div>
      {error && <p className="text-right text-xs font-medium text-red-700">{error}</p>}
      {note && (
        <p className="text-right text-xs font-medium text-emerald-700">{note}</p>
      )}

      <ConfirmDialog
        open={confirm === "resend"}
        busy={pending}
        title="Resend a payment link?"
        description={
          <>
            This opens a new Selcom checkout for{" "}
            <span className="font-semibold text-black">{donorName}</span> (
            {reference}). The previous unpaid attempt is not charged again.
          </>
        }
        confirmLabel="Create new checkout"
        cancelLabel="Cancel"
        onCancel={() => !pending && setConfirm(null)}
        onConfirm={doResend}
      />
      <ConfirmDialog
        open={confirm === "delete"}
        destructive
        busy={pending}
        title="Delete this payment record?"
        description={
          <>
            Permanently delete{" "}
            <span className="font-semibold text-black">{reference}</span> for{" "}
            {donorName}. Paid records cannot be deleted this way.
          </>
        }
        confirmLabel="Delete record"
        cancelLabel="Keep it"
        onCancel={() => !pending && setConfirm(null)}
        onConfirm={doDelete}
      />

      {links && (
        <div className="mt-2 rounded-xl border border-black/10 bg-black/[0.02] p-3 text-left text-xs">
          <p className="mb-2 font-bold text-black">Send this to {links.donorName}</p>
          <p className="mb-1 break-all text-black/60">{links.statusUrl}</p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => copy(links.statusUrl, "status")}
              className="rounded-lg border border-black/10 bg-white px-2 py-1 font-semibold"
            >
              {copied === "status" ? "Copied" : "Copy status page"}
            </button>
            <button
              type="button"
              onClick={() => copy(links.checkoutUrl, "checkout")}
              className="rounded-lg border border-black/10 bg-white px-2 py-1 font-semibold"
            >
              {copied === "checkout" ? "Copied" : "Copy checkout"}
            </button>
            <a
              href={mailHref}
              className="rounded-lg bg-primary px-2 py-1 font-semibold text-white"
            >
              Email donor
            </a>
            <button
              type="button"
              onClick={() => setLinks(null)}
              className="rounded-lg px-2 py-1 font-semibold text-black/50"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
