"use client";

import { useTransition } from "react";
import { setSubmissionStatus } from "../actions";

const NEXT = {
  NEW: { status: "READ", label: "Mark read" },
  READ: { status: "ARCHIVED", label: "Archive" },
  ARCHIVED: { status: "NEW", label: "Restore" },
};

export default function StatusActions({ kind, id, status }) {
  const [pending, startTransition] = useTransition();
  const next = NEXT[status];

  return (
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
  );
}
