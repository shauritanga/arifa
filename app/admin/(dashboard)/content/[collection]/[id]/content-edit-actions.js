"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import ConfirmDialog from "../../../../components/confirm-dialog";
import {
  deleteContentItem,
  duplicateContentItem,
} from "../../../../content-actions";

export default function ContentEditActions({ collection, item }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [confirm, setConfirm] = useState(null);

  const onDelete = () => {
    setError("");
    startTransition(async () => {
      const res = await deleteContentItem(collection, item.id);
      setConfirm(null);
      if (res && !res.ok) {
        setError(res.error);
        return;
      }
      router.push(`/admin/content/${collection}`);
      router.refresh();
    });
  };

  const onDuplicate = () => {
    setError("");
    startTransition(async () => {
      const res = await duplicateContentItem(collection, item.id);
      setConfirm(null);
      if (res && !res.ok) {
        setError(res.error);
        return;
      }
      if (res.id) {
        router.push(`/admin/content/${collection}/${res.id}`);
        router.refresh();
      }
    });
  };

  return (
    <div className="mt-8 rounded-2xl border border-red-100 bg-red-50/40 p-5">
      <h2 className="text-sm font-bold text-black">Danger zone</h2>
      <p className="mt-1 text-xs text-black/55">
        Duplicate creates a draft copy. Delete removes this entry from the site.
      </p>
      {error && (
        <p className="mt-2 text-sm font-medium text-red-700">{error}</p>
      )}
      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          disabled={pending}
          onClick={() => setConfirm("duplicate")}
          className="inline-flex items-center gap-1.5 rounded-lg border border-black/10 bg-white px-3 py-2 text-xs font-semibold text-black/70 disabled:opacity-50"
        >
          <i className="fas fa-copy text-[0.65rem]" />
          Duplicate
        </button>
        <button
          type="button"
          disabled={pending}
          onClick={() => setConfirm("delete")}
          className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 disabled:opacity-50"
        >
          <i className="fas fa-trash-can text-[0.65rem]" />
          Delete
        </button>
      </div>

      <ConfirmDialog
        open={confirm === "delete"}
        destructive
        busy={pending}
        title="Delete this entry?"
        description={
          <>
            Permanently delete{" "}
            <span className="font-semibold text-black">
              “{item.title || "Untitled"}”
            </span>
            . This cannot be undone.
          </>
        }
        confirmLabel="Delete forever"
        cancelLabel="Keep it"
        onCancel={() => !pending && setConfirm(null)}
        onConfirm={onDelete}
      />
      <ConfirmDialog
        open={confirm === "duplicate"}
        busy={pending}
        title="Duplicate this entry?"
        description="Creates a draft copy. You will be taken to the new draft to edit it."
        confirmLabel="Create draft copy"
        cancelLabel="Cancel"
        onCancel={() => !pending && setConfirm(null)}
        onConfirm={onDuplicate}
      />
    </div>
  );
}
