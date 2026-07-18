"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";

/**
 * In-app confirm dialog (no window.confirm).
 * destructive=true styles the confirm action as danger (delete).
 */
export default function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  destructive = false,
  busy = false,
  onConfirm,
  onCancel,
}) {
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === "Escape" && !busy) onCancel?.();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, busy, onCancel]);

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[100000] flex items-center justify-center p-4"
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
      aria-describedby="confirm-dialog-desc"
    >
      <button
        type="button"
        className="absolute inset-0 bg-night/60 backdrop-blur-[2px]"
        aria-label="Dismiss"
        disabled={busy}
        onClick={() => !busy && onCancel?.()}
      />

      <div className="relative z-10 w-full max-w-md overflow-hidden rounded-2xl border border-black/10 bg-white shadow-2xl">
        <div className="px-6 pb-2 pt-6">
          <div className="mb-4 flex items-start gap-3">
            <span
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${
                destructive
                  ? "bg-red-50 text-red-600"
                  : "bg-primary/10 text-primary"
              }`}
            >
              <i
                className={`fas ${
                  destructive ? "fa-trash-can" : "fa-circle-question"
                } text-lg`}
              />
            </span>
            <div className="min-w-0 pt-0.5">
              <h2
                id="confirm-dialog-title"
                className="text-lg font-bold text-black font-[var(--font-heading)]"
              >
                {title}
              </h2>
              {description && (
                <p
                  id="confirm-dialog-desc"
                  className="mt-1.5 text-sm leading-relaxed text-black/60"
                >
                  {description}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col-reverse gap-2 border-t border-black/5 bg-black/[0.02] px-6 py-4 sm:flex-row sm:justify-end">
          <button
            type="button"
            disabled={busy}
            onClick={onCancel}
            className="rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm font-bold text-black/70 transition-colors hover:bg-black/[0.03] disabled:opacity-50"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={onConfirm}
            className={`rounded-xl px-4 py-2.5 text-sm font-bold text-white shadow-sm transition-colors disabled:opacity-60 ${
              destructive
                ? "bg-red-600 hover:bg-red-700 shadow-red-600/20"
                : "bg-primary hover:bg-primary-light shadow-primary/20"
            }`}
          >
            {busy ? (
              <>
                <i className="fas fa-circle-notch fa-spin mr-2" />
                Working…
              </>
            ) : (
              confirmLabel
            )}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
