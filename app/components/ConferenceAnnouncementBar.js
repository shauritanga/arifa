"use client";

import { useCallback, useEffect, useSyncExternalStore } from "react";
import { ICAFOW, isIcaFowCampaignActive } from "@/lib/icafow";

const DISMISS_EVENT = "arifa:announce-dismiss";

function subscribe(onStoreChange) {
  if (typeof window === "undefined") return () => {};
  window.addEventListener("storage", onStoreChange);
  window.addEventListener(DISMISS_EVENT, onStoreChange);
  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener(DISMISS_EVENT, onStoreChange);
  };
}

function getSnapshot() {
  if (!isIcaFowCampaignActive()) return false;
  try {
    return sessionStorage.getItem(ICAFOW.dismissKey) !== "1";
  } catch {
    return true;
  }
}

/** Prefer showing the bar on SSR; client snapshot may hide if dismissed. */
function getServerSnapshot() {
  return isIcaFowCampaignActive();
}

/**
 * Sitewide dismissible promo for ICAFoW. Lives above the main header.
 */
export default function ConferenceAnnouncementBar() {
  const visible = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  useEffect(() => {
    if (visible) {
      document.documentElement.setAttribute("data-announcement", "1");
    } else {
      document.documentElement.removeAttribute("data-announcement");
    }
    return () => {
      document.documentElement.removeAttribute("data-announcement");
    };
  }, [visible]);

  const dismiss = useCallback(() => {
    try {
      sessionStorage.setItem(ICAFOW.dismissKey, "1");
    } catch {
      /* private mode */
    }
    window.dispatchEvent(new Event(DISMISS_EVENT));
  }, []);

  if (!visible) return null;

  return (
    <div
      className="relative z-[60] w-full bg-primary text-white"
      role="region"
      aria-label={`${ICAFOW.shortName} announcement`}
    >
      <div className="mx-auto flex max-w-[1200px] items-center justify-center gap-2 px-3 py-2 sm:gap-3 sm:px-6 sm:py-2.5">
        <p className="min-w-0 flex-1 text-center text-[0.7rem] font-medium leading-snug sm:flex-none sm:text-xs md:text-[0.8125rem]">
          <span className="font-bold tracking-wide">{ICAFOW.shortName}</span>
          <span className="mx-1.5 hidden text-white/50 sm:inline" aria-hidden="true">
            ·
          </span>
          <span className="hidden sm:inline text-white/90">{ICAFOW.dateLabel}</span>
          <span className="mx-1.5 hidden text-white/50 md:inline" aria-hidden="true">
            ·
          </span>
          <span className="hidden md:inline text-white/90">{ICAFOW.venueShort}</span>
          <span className="mx-1.5 text-white/50" aria-hidden="true">
            ·
          </span>
          <a
            href={ICAFOW.registerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 font-bold underline decoration-white/40 underline-offset-2 transition-colors hover:decoration-white"
          >
            Register now
            <i
              className="fas fa-arrow-up-right-from-square text-[0.65em] opacity-80"
              aria-hidden="true"
            />
          </a>
        </p>
        <button
          type="button"
          onClick={dismiss}
          className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 shrink-0 items-center justify-center rounded-md text-white/80 transition-colors hover:bg-white/10 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50 sm:right-3 cursor-pointer"
          aria-label="Dismiss conference announcement"
        >
          <i className="fas fa-times text-sm" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
