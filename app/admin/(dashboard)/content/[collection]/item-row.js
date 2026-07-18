"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import {
  deleteContentItem,
  moveContentItem,
  toggleContentPublished,
} from "../../../content-actions";
import ConfirmDialog from "../../../components/confirm-dialog";

export default function ItemRow({ collection, item, isFirst, isLast, hasImage }) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);

  const run = (fn) => {
    setError("");
    startTransition(async () => {
      const res = await fn();
      if (res && !res.ok) setError(res.error);
    });
  };

  const confirmDelete = () => {
    setError("");
    startTransition(async () => {
      const res = await deleteContentItem(collection, item.id);
      if (res && !res.ok) {
        setError(res.error);
        setConfirmOpen(false);
        return;
      }
      setConfirmOpen(false);
    });
  };

  return (
    <>
      <tr
        className={`border-b border-black/5 transition-colors last:border-0 hover:bg-black/[0.02] ${
          pending ? "opacity-60" : ""
        }`}
      >
        {/* Reorder */}
        <td className="w-12 px-3 py-3 align-middle">
          <div className="flex flex-col items-center gap-0.5">
            <button
              type="button"
              disabled={pending || isFirst}
              onClick={() =>
                run(() => moveContentItem(collection, item.id, "up"))
              }
              aria-label="Move up"
              className="rounded p-1 text-black/30 hover:bg-black/5 hover:text-primary disabled:opacity-20"
            >
              <i className="fas fa-chevron-up text-[0.65rem]" />
            </button>
            <button
              type="button"
              disabled={pending || isLast}
              onClick={() =>
                run(() => moveContentItem(collection, item.id, "down"))
              }
              aria-label="Move down"
              className="rounded p-1 text-black/30 hover:bg-black/5 hover:text-primary disabled:opacity-20"
            >
              <i className="fas fa-chevron-down text-[0.65rem]" />
            </button>
          </div>
        </td>

        {/* Title + meta */}
        <td className="min-w-0 px-3 py-3 align-middle">
          <div className="flex items-center gap-3">
            {hasImage && (
              <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-lg border border-black/10 bg-black/[0.03]">
                {item.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.image}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-[0.6rem] text-black/25">
                    <i className="fas fa-image" />
                  </div>
                )}
              </div>
            )}
            <div className="min-w-0">
              <Link
                href={`/admin/content/${collection}/${item.id}`}
                className="block truncate text-sm font-semibold text-black hover:text-primary"
              >
                {item.title || "Untitled"}
              </Link>
              <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-black/45">
                {item.group && (
                  <span className="rounded-md bg-black/[0.04] px-1.5 py-0.5 font-medium text-black/55">
                    {item.group}
                  </span>
                )}
                {item.slug && (
                  <span className="font-mono text-[0.7rem]">/{item.slug}</span>
                )}
                {error && (
                  <span className="font-semibold text-red-600">{error}</span>
                )}
              </div>
            </div>
          </div>
        </td>

        {/* Status */}
        <td className="hidden px-3 py-3 align-middle sm:table-cell">
          <button
            type="button"
            disabled={pending}
            onClick={() =>
              run(() => toggleContentPublished(collection, item.id))
            }
            className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[0.65rem] font-semibold normal-case tracking-normal transition-colors disabled:opacity-50 ${
              item.published
                ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200/80"
                : "bg-black/5 text-black/45 ring-1 ring-black/5"
            }`}
            title="Click to toggle"
          >
            <span
              className={`h-1 w-1 rounded-full ${
                item.published ? "bg-emerald-500" : "bg-black/25"
              }`}
            />
            {item.published ? "Published" : "Draft"}
          </button>
        </td>

        {/* Updated */}
        <td className="hidden px-3 py-3 align-middle text-xs text-black/45 md:table-cell">
          {item.updatedAt
            ? new Date(item.updatedAt).toLocaleDateString(undefined, {
                day: "numeric",
                month: "short",
                year: "numeric",
              })
            : "—"}
        </td>

        {/* Actions — Edit = neutral/brand-safe, Delete = destructive red */}
        <td className="px-3 py-3 align-middle">
          <div className="flex items-center justify-end gap-2">
            <Link
              href={`/admin/content/${collection}/${item.id}`}
              className="inline-flex items-center gap-1.5 rounded-lg border border-black/10 bg-white px-2.5 py-1.5 text-xs font-semibold text-black/70 shadow-sm transition-colors hover:border-black/20 hover:bg-black/[0.03] hover:text-black"
            >
              <i className="fas fa-pen text-[0.65rem] text-black/40" />
              Edit
            </Link>
            <button
              type="button"
              disabled={pending}
              onClick={() => setConfirmOpen(true)}
              aria-label="Delete"
              className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-2.5 py-1.5 text-xs font-semibold text-red-700 transition-colors hover:border-red-300 hover:bg-red-100 disabled:opacity-50"
            >
              <i className="fas fa-trash-can text-[0.65rem]" />
              Delete
            </button>
          </div>
        </td>
      </tr>

      <ConfirmDialog
        open={confirmOpen}
        destructive
        busy={pending}
        title="Delete this entry?"
        description={
          <>
            You are about to permanently delete{" "}
            <span className="font-semibold text-black">
              “{item.title || "Untitled"}”
            </span>
            . This cannot be undone and it will disappear from the public site
            if it was published.
          </>
        }
        confirmLabel="Delete forever"
        cancelLabel="Keep it"
        onCancel={() => !pending && setConfirmOpen(false)}
        onConfirm={confirmDelete}
      />
    </>
  );
}
