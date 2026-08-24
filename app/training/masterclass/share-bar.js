"use client";

import { useState } from "react";

function pageUrl(path) {
  if (typeof window !== "undefined") return window.location.href;
  return `https://arifa.org${path}`;
}

export default function ShareBar({ path, title, text }) {
  const [copied, setCopied] = useState(false);
  const canonical = `https://arifa.org${path}`;

  const copyLink = async () => {
    const url = pageUrl(path);
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      window.prompt("Copy this registration link", url);
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  const shareNative = async () => {
    const url = pageUrl(path);
    if (typeof navigator.share === "function") {
      try {
        await navigator.share({ title, text, url });
        return;
      } catch (err) {
        if (err?.name === "AbortError") return;
      }
    }
    await copyLink();
  };

  const encodedUrl = encodeURIComponent(canonical);
  const shareText = encodeURIComponent(text);

  return (
    <div className="mt-6 flex flex-wrap items-center gap-3">
      <button
        type="button"
        onClick={copyLink}
        className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-4 py-2 text-sm font-semibold text-ink transition-colors hover:border-primary hover:text-primary"
      >
        <i className="fas fa-link text-xs" />
        {copied ? "Link copied" : "Copy link"}
      </button>
      <button
        type="button"
        onClick={shareNative}
        className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-primary-light"
      >
        <i className="fas fa-share-nodes text-xs" />
        Share
      </button>
      <a
        href={`https://wa.me/?text=${shareText}%20${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-line text-muted hover:border-primary hover:text-primary"
        aria-label="Share on WhatsApp"
      >
        <i className="fab fa-whatsapp" />
      </a>
      <a
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-line text-muted hover:border-primary hover:text-primary"
        aria-label="Share on LinkedIn"
      >
        <i className="fab fa-linkedin-in" />
      </a>
      <a
        href={`https://twitter.com/intent/tweet?text=${shareText}&url=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-line text-muted hover:border-primary hover:text-primary"
        aria-label="Share on X"
      >
        <i className="fab fa-x-twitter" />
      </a>
    </div>
  );
}
