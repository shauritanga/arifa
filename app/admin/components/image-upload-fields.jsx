"use client";

import { useRef, useState } from "react";

/**
 * Upload helper: POST /api/admin/upload
 * @returns {Promise<string[]>} public URLs
 */
async function uploadFiles(fileList, folder) {
  const files = Array.from(fileList || []);
  if (!files.length) return [];

  const body = new FormData();
  body.set("folder", folder || "general");
  for (const f of files) body.append("files", f);

  const res = await fetch("/api/admin/upload", {
    method: "POST",
    body,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || "Upload failed.");
  }
  return data.urls || [];
}

const box =
  "flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-black/15 bg-black/[0.02] px-4 py-6 text-center transition-colors hover:border-primary/40 hover:bg-primary/5";

/** Single cover / avatar image — device upload only. */
export function CoverImageField({
  name = "image",
  value = "",
  folder = "general",
  label = "Cover image",
  hint,
  /** Optional: "cover" (default) or "avatar" (circular crop preview). */
  variant = "cover",
  onChange,
}) {
  const inputRef = useRef(null);
  const [url, setUrl] = useState(value || "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const setAndNotify = (next) => {
    setUrl(next);
    onChange?.(next);
  };

  const onPick = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setError("");
    setBusy(true);
    try {
      const [uploaded] = await uploadFiles([file], folder);
      if (uploaded) setAndNotify(uploaded);
    } catch (err) {
      setError(err.message || "Upload failed.");
    } finally {
      setBusy(false);
    }
  };

  const isAvatar = variant === "avatar";

  return (
    <div>
      <span className="mb-1.5 block text-[0.7rem] font-semibold uppercase tracking-wide text-black/80">
        {label}
      </span>

      <input type="hidden" name={name} value={url} />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
        <div
          className={`relative shrink-0 overflow-hidden border border-black/10 bg-black/[0.03] ${
            isAvatar
              ? "h-28 w-28 rounded-full"
              : "h-32 w-full rounded-xl sm:h-28 sm:w-40"
          }`}
        >
          {url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={url} alt="" className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center text-xs text-black/35">
              {isAvatar ? <i className="fas fa-user text-2xl text-black/20" /> : "No image"}
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1 space-y-2">
          <button
            type="button"
            disabled={busy}
            onClick={() => inputRef.current?.click()}
            className={`${box} w-full py-4 disabled:opacity-60`}
          >
            <i className="fas fa-cloud-upload-alt mb-1 text-lg text-black/40" />
            <span className="text-sm font-semibold text-black">
              {busy
                ? "Uploading…"
                : url
                  ? isAvatar
                    ? "Replace photo"
                    : "Replace image"
                  : isAvatar
                    ? "Upload photo"
                    : "Upload from device"}
            </span>
            <span className="mt-0.5 text-xs text-black/45">
              JPEG, PNG, WebP · max 5MB
            </span>
          </button>
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
            className="sr-only"
            onChange={onPick}
          />

          {url && (
            <button
              type="button"
              onClick={() => setAndNotify("")}
              className="text-xs font-semibold text-red-600 hover:underline"
            >
              {isAvatar ? "Remove photo" : "Remove image"}
            </button>
          )}
        </div>
      </div>

      {error && (
        <p className="mt-2 text-sm font-medium text-red-600" role="alert">
          {error}
        </p>
      )}
      {hint && !error && (
        <p className="mt-2 text-xs text-black/50">{hint}</p>
      )}
    </div>
  );
}

/** Multi-image gallery: uploads append; hidden field stores one URL per line. */
export function GalleryImagesField({
  name = "images",
  value = [],
  folder = "events",
  label = "Gallery images",
  hint,
}) {
  const inputRef = useRef(null);
  const initial = Array.isArray(value)
    ? value
    : String(value || "")
        .split(/\r?\n/)
        .map((s) => s.trim())
        .filter(Boolean);

  const [urls, setUrls] = useState(initial);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const onPick = async (e) => {
    const list = e.target.files;
    e.target.value = "";
    if (!list?.length) return;
    setError("");
    setBusy(true);
    try {
      const uploaded = await uploadFiles(list, folder);
      setUrls((prev) => [...prev, ...uploaded]);
    } catch (err) {
      setError(err.message || "Upload failed.");
    } finally {
      setBusy(false);
    }
  };

  const removeAt = (index) => {
    setUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const move = (index, dir) => {
    setUrls((prev) => {
      const next = [...prev];
      const j = index + dir;
      if (j < 0 || j >= next.length) return prev;
      [next[index], next[j]] = [next[j], next[index]];
      return next;
    });
  };

  return (
    <div>
      <span className="mb-1.5 block text-[0.7rem] font-semibold uppercase tracking-wide text-black/80">
        {label}
      </span>

      {/* Form value: one URL per line for kind: lines */}
      <textarea
        name={name}
        value={urls.join("\n")}
        readOnly
        className="sr-only"
        aria-hidden="true"
        tabIndex={-1}
      />

      {urls.length > 0 && (
        <ul className="mb-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {urls.map((src, i) => (
            <li
              key={`${src}-${i}`}
              className="group relative overflow-hidden rounded-xl border border-black/10 bg-black/[0.02]"
            >
              <div className="relative aspect-[4/3]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt="" className="h-full w-full object-cover" />
              </div>
              <div className="flex items-center justify-between gap-1 border-t border-black/5 px-2 py-1.5">
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => move(i, -1)}
                    disabled={i === 0}
                    className="rounded px-1.5 py-0.5 text-xs text-black/50 hover:bg-black/5 disabled:opacity-30"
                    aria-label="Move earlier"
                  >
                    ←
                  </button>
                  <button
                    type="button"
                    onClick={() => move(i, 1)}
                    disabled={i === urls.length - 1}
                    className="rounded px-1.5 py-0.5 text-xs text-black/50 hover:bg-black/5 disabled:opacity-30"
                    aria-label="Move later"
                  >
                    →
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => removeAt(i)}
                  className="text-xs font-semibold text-red-600 hover:underline"
                >
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <button
        type="button"
        disabled={busy}
        onClick={() => inputRef.current?.click()}
        className={`${box} w-full disabled:opacity-60`}
      >
        <i className="fas fa-images mb-2 text-xl text-black/40" />
        <span className="text-sm font-semibold text-black">
          {busy ? "Uploading…" : "Upload gallery images"}
        </span>
        <span className="mt-1 text-xs text-black/45">
          Select multiple · JPEG, PNG, WebP · max 5MB each · up to 12 at once
        </span>
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
        multiple
        className="sr-only"
        onChange={onPick}
      />

      {error && (
        <p className="mt-2 text-sm font-medium text-red-600" role="alert">
          {error}
        </p>
      )}
      {hint && !error && (
        <p className="mt-2 text-xs text-black/50">{hint}</p>
      )}
    </div>
  );
}

