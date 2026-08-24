"use client";

import { useState, useTransition } from "react";
import { deleteSubmission, setSubmissionStatus } from "../actions";
import ConfirmDialog from "../components/confirm-dialog";

const NEXT = {
  NEW: { status: "READ", label: "Mark read" },
  READ: { status: "ARCHIVED", label: "Archive" },
  ARCHIVED: { status: "NEW", label: "Restore" },
};

export default function StatusActions({ kind, id, status, label }) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const next = NEXT[status];

  const onDelete = () => {
    setError("");
    startTransition(async () => {
      const res = await deleteSubmission(kind, id);
      setConfirmOpen(false);
      if (res && !res.ok) setError(res.error);
    });
  };

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        disabled={pending}
        onClick={() =>
          startTransition(async () => {
            await setSubmissionStatus(kind, id, next.status);
          })
        }
        className="shrink-0 rounded-lg border border-black/10 px-3 py-1.5 text-xs font-bold text-black/60 transition-colors hover:bg-black/5 disabled:opacity-50"
      >
        {pending ? "…" : next.label}
      </button>
      <button
        type="button"
        disabled={pending}
        onClick={() => setConfirmOpen(true)}
        className="shrink-0 rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-bold text-red-700 transition-colors hover:bg-red-100 disabled:opacity-50"
      >
        Delete
      </button>
      {error && (
        <span className="text-xs font-semibold text-red-700">{error}</span>
      )}
      <ConfirmDialog
        open={confirmOpen}
        destructive
        busy={pending}
        title={`Delete this ${kind}?`}
        description={
          <>
            Permanently delete{" "}
            <span className="font-semibold text-black">
              {label || "this record"}
            </span>
            . This cannot be undone.
          </>
        }
        confirmLabel="Delete forever"
        cancelLabel="Keep it"
        onCancel={() => !pending && setConfirmOpen(false)}
        onConfirm={onDelete}
      />
    </div>
  );
}
