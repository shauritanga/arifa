"use client";

import { useState, useTransition } from "react";
import ConfirmDialog from "../../components/confirm-dialog";
import {
  deleteCancelledDonations,
  reverifyProcessingDonations,
} from "../../actions";

export default function DonationsToolbar({ openCount, cancelledCount }) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [note, setNote] = useState("");
  const [dialog, setDialog] = useState(null); // "check" | "purge" | null

  const runCheck = () => {
    setError("");
    setNote("");
    startTransition(async () => {
      const res = await reverifyProcessingDonations();
      setDialog(null);
      if (!res.ok) {
        setError(res.error || "Could not check Selcom.");
        return;
      }
      setNote(
        `Checked ${res.checked}: ${res.paid} paid, ${res.stillOpen} still open, ${res.failed} failed, ${res.cancelled} cancelled, ${res.errors} errors.`,
      );
    });
  };

  const runPurge = () => {
    setError("");
    setNote("");
    startTransition(async () => {
      const res = await deleteCancelledDonations();
      setDialog(null);
      if (!res.ok) {
        setError(res.error || "Could not delete cancelled records.");
        return;
      }
      setNote(`Deleted ${res.deleted} cancelled record${res.deleted === 1 ? "" : "s"}.`);
    });
  };

  return (
    <div className="mb-4">
      <div className="flex flex-wrap gap-2">
        {openCount > 0 && (
          <button
            type="button"
            disabled={pending}
            onClick={() => setDialog("check")}
            className="rounded-xl border border-black/10 bg-white px-4 py-2 text-sm font-bold text-black/70 hover:bg-black/[0.03] disabled:opacity-50"
          >
            <i className="fas fa-rotate mr-2" />
            Check {openCount} processing
          </button>
        )}
        {cancelledCount > 0 && (
          <button
            type="button"
            disabled={pending}
            onClick={() => setDialog("purge")}
            className="rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-bold text-red-700 hover:bg-red-100 disabled:opacity-50"
          >
            <i className="fas fa-trash-can mr-2" />
            Delete all cancelled ({cancelledCount})
          </button>
        )}
      </div>
      {error && (
        <p className="mt-2 text-sm font-medium text-red-700">{error}</p>
      )}
      {note && (
        <p className="mt-2 text-sm font-medium text-emerald-700">{note}</p>
      )}

      <ConfirmDialog
        open={dialog === "check"}
        busy={pending}
        title="Check processing payments with Selcom?"
        description={`This will ask Selcom for the status of ${openCount} pending or processing checkout${openCount === 1 ? "" : "s"}. Paid records will settle only if the gateway amount matches. Nothing is deleted.`}
        confirmLabel="Check Selcom"
        cancelLabel="Not now"
        onCancel={() => !pending && setDialog(null)}
        onConfirm={runCheck}
      />
      <ConfirmDialog
        open={dialog === "purge"}
        destructive
        busy={pending}
        title="Delete all cancelled donations?"
        description={`Permanently delete ${cancelledCount} cancelled record${cancelledCount === 1 ? "" : "s"}. Paid and processing payments are not touched. This cannot be undone.`}
        confirmLabel="Delete cancelled"
        cancelLabel="Keep them"
        onCancel={() => !pending && setDialog(null)}
        onConfirm={runPurge}
      />
    </div>
  );
}
