"use client";

import { useState } from "react";

function shareUrl(path) {
  if (typeof window !== "undefined") {
    return `${window.location.origin}${path}`;
  }
  return `https://arifa.org${path}`;
}

export default function ShareBar({ path, title, text, compact = false }) {
  const [copied, setCopied] = useState(false);

  const copyLink = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const url = shareUrl(path);
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      window.prompt("Copy this registration link", url);
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  const shareNative = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const url = shareUrl(path);
    if (typeof navigator.share === "function") {
      try {
        await navigator.share({ title, text, url });
        return;
      } catch (err) {
        if (err?.name === "AbortError") return;
      }
    }
    await copyLink(e);
  };

  const url = encodeURIComponent(shareUrl(path));
  const shareText = encodeURIComponent(text);
  const iconBtn = compact
    ? "inline-flex h-9 w-9 items-center justify-center rounded-full border border-line text-sm text-muted hover:border-primary hover:text-primary"
    : "inline-flex h-10 w-10 items-center justify-center rounded-full border border-line text-muted hover:border-primary hover:text-primary";

  return (
    <div
      className={
        compact
          ? "mt-4 flex flex-wrap items-center gap-2"
          : "mt-6 flex flex-wrap items-center gap-3"
      }
    >
      <button
        type="button"
        onClick={copyLink}
        className={
          compact
            ? "inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-3 py-1.5 text-xs font-semibold text-ink hover:border-primary hover:text-primary"
            : "inline-flex items-center gap-2 rounded-full border border-line bg-white px-4 py-2 text-sm font-semibold text-ink transition-colors hover:border-primary hover:text-primary"
        }
      >
        <i className="fas fa-link text-[0.65rem]" />
        {copied ? "Copied" : "Copy link"}
      </button>
      <button
        type="button"
        onClick={shareNative}
        className={
          compact
            ? "inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1.5 text-xs font-bold text-white hover:bg-primary-light"
            : "inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-primary-light"
        }
      >
        <i className="fas fa-share-nodes text-[0.65rem]" />
        Share
      </button>
      <a
        href={`https://wa.me/?text=${shareText}%20${url}`}
        target="_blank"
        rel="noopener noreferrer"
        className={iconBtn}
        aria-label="Share on WhatsApp"
        onClick={(e) => e.stopPropagation()}
      >
        <i className="fab fa-whatsapp" />
      </a>
      <a
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${url}`}
        target="_blank"
        rel="noopener noreferrer"
        className={iconBtn}
        aria-label="Share on LinkedIn"
        onClick={(e) => e.stopPropagation()}
      >
        <i className="fab fa-linkedin-in" />
      </a>
    </div>
  );
}
