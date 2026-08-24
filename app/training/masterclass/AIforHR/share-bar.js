"use client";

import { useState } from "react";

const PATH = "/training/masterclass/AIforHR";
const TITLE = "AI Powered HR Masterclass | ARIFA";
const TEXT =
  "Join ARIFA’s AI Powered HR Masterclass for HR professionals, 02–03 October 2026 at KingJada Hotel, Dar es Salaam.";

function pageUrl() {
  if (typeof window !== "undefined") return window.location.href;
  return `https://arifa.org${PATH}`;
}

export default function ShareBar() {
  const [copied, setCopied] = useState(false);

  const copyLink = async () => {
    const url = pageUrl();
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      window.prompt("Copy this registration link", url);
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  const shareNative = async () => {
    const url = pageUrl();
    if (typeof navigator.share === "function") {
      try {
        await navigator.share({ title: TITLE, text: TEXT, url });
        return;
      } catch (err) {
        if (err?.name === "AbortError") return;
      }
    }
    await copyLink();
  };

  const url = encodeURIComponent(`https://arifa.org${PATH}`);
  const shareText = encodeURIComponent(TEXT);

  return (
    <div className="flex flex-wrap items-center gap-3">
      <button
        type="button"
        onClick={copyLink}
        className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-white/20"
      >
        <i className="fas fa-link text-xs" />
        {copied ? "Link copied" : "Copy link"}
      </button>
      <button
        type="button"
        onClick={shareNative}
        className="inline-flex items-center gap-2 rounded-full bg-[#d4a017] px-4 py-2 text-sm font-bold text-[#1a2e1a] transition-colors hover:bg-[#e0b12a]"
      >
        <i className="fas fa-share-nodes text-xs" />
        Share
      </button>
      <a
        href={`https://wa.me/?text=${shareText}%20${url}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/25 text-white hover:bg-white/15"
        aria-label="Share on WhatsApp"
      >
        <i className="fab fa-whatsapp" />
      </a>
      <a
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${url}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/25 text-white hover:bg-white/15"
        aria-label="Share on LinkedIn"
      >
        <i className="fab fa-linkedin-in" />
      </a>
      <a
        href={`https://twitter.com/intent/tweet?text=${shareText}&url=${url}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/25 text-white hover:bg-white/15"
        aria-label="Share on X"
      >
        <i className="fab fa-x-twitter" />
      </a>
    </div>
  );
}
