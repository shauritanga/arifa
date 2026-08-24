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
  const iconBtn =
    "inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-line bg-white text-sm text-muted transition-colors hover:border-primary hover:text-primary";

  if (compact) {
    return (
      <div className="mt-3 flex items-center justify-between gap-2">
        <span className="text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-muted">
          Share
        </span>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={copyLink}
            className={iconBtn}
            aria-label={copied ? "Link copied" : "Copy link"}
            title={copied ? "Copied" : "Copy link"}
          >
            <i className={copied ? "fas fa-check" : "fas fa-link"} />
          </button>
          <button
            type="button"
            onClick={shareNative}
            className={iconBtn}
            aria-label="Share"
            title="Share"
          >
            <i className="fas fa-share-nodes" />
          </button>
          <a
            href={`https://wa.me/?text=${shareText}%20${url}`}
            target="_blank"
            rel="noopener noreferrer"
            className={iconBtn}
            aria-label="Share on WhatsApp"
            title="WhatsApp"
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
            title="LinkedIn"
            onClick={(e) => e.stopPropagation()}
          >
            <i className="fab fa-linkedin-in" />
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-6 flex flex-wrap items-center gap-3">
      <button
        type="button"
        onClick={copyLink}
        className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-4 py-2 text-sm font-semibold text-ink transition-colors hover:border-primary hover:text-primary"
      >
        <i className="fas fa-link text-[0.65rem]" />
        {copied ? "Copied" : "Copy link"}
      </button>
      <button
        type="button"
        onClick={shareNative}
        className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-primary-light"
      >
        <i className="fas fa-share-nodes text-[0.65rem]" />
        Share
      </button>
      <a
        href={`https://wa.me/?text=${shareText}%20${url}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-line text-muted hover:border-primary hover:text-primary"
        aria-label="Share on WhatsApp"
        onClick={(e) => e.stopPropagation()}
      >
        <i className="fab fa-whatsapp" />
      </a>
      <a
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${url}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-line text-muted hover:border-primary hover:text-primary"
        aria-label="Share on LinkedIn"
        onClick={(e) => e.stopPropagation()}
      >
        <i className="fab fa-linkedin-in" />
      </a>
    </div>
  );
}
