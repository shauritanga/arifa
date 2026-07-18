"use client";

import { useEffect, useRef, useState } from "react";
import { ICAFOW, isIcaFowCampaignActive } from "@/lib/icafow";

function computeCountdown(targetIsoDate) {
  if (!isIcaFowCampaignActive()) return null;
  const target = new Date(`${targetIsoDate}T08:00:00+03:00`).getTime();
  const diff = Math.max(0, target - Date.now());
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

function useCountdown(targetIsoDate) {
  // null until mount — avoids SSR/client Date.now() mismatch (hydration error).
  const [parts, setParts] = useState(null);

  useEffect(() => {
    if (!isIcaFowCampaignActive()) return undefined;

    const frame = requestAnimationFrame(() => {
      setParts(computeCountdown(targetIsoDate));
    });
    const id = setInterval(() => {
      setParts(computeCountdown(targetIsoDate));
    }, 1000);

    return () => {
      cancelAnimationFrame(frame);
      clearInterval(id);
    };
  }, [targetIsoDate]);

  return parts;
}

/**
 * Autoplay muted loop when the section is in view.
 * Respects prefers-reduced-motion (poster / gradient only).
 */
function useInViewVideo(videoRef) {
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return undefined;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduceMotion) {
      video.removeAttribute("autoplay");
      video.pause();
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;
        if (entry.isIntersecting) {
          video.play().catch(() => {
            /* autoplay blocked — poster remains */
          });
        } else {
          video.pause();
        }
      },
      { threshold: 0.15 },
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, [videoRef]);
}

/**
 * Homepage (and reusable) featured band for ICAFoW 2026.
 */
export default function ConferenceFeatured({ className = "" }) {
  const active = isIcaFowCampaignActive();
  const countdown = useCountdown(ICAFOW.startDate);
  const videoRef = useRef(null);
  useInViewVideo(videoRef);

  if (!active) return null;

  return (
    <section
      className={`relative overflow-hidden border-y border-primary-dark bg-night ${className}`}
      aria-labelledby="icafow-featured-heading"
    >
      {/* Video atmosphere (muted loop) */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover"
          src={ICAFOW.videoBg}
          poster={ICAFOW.videoPoster}
          muted
          loop
          playsInline
          preload="metadata"
        />
        {/* Readability scrims — keep text sharp over busy footage */}
        <div className="absolute inset-0 bg-night/70" />
        <div className="absolute inset-0 bg-gradient-to-r from-night/85 via-primary-dark/55 to-night/70" />
        <div className="absolute inset-0 bg-gradient-to-t from-night/80 via-transparent to-night/40" />
      </div>

      <div className="relative z-10 mx-auto max-w-[1200px] px-6 py-14 md:py-16 lg:py-20">
        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-7">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/35 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-white/90 backdrop-blur-sm">
              <span
                className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#a8efc4]"
                aria-hidden="true"
              />
              Coming soon · Flagship event
            </div>
            <p className="mb-2 text-sm font-semibold text-[#a8efc4] drop-shadow">
              {ICAFOW.host}
            </p>
            <h2
              id="icafow-featured-heading"
              className="font-[var(--font-heading)] text-2xl font-bold leading-tight tracking-[-0.02em] text-white md:text-3xl lg:text-[2.15rem]"
              style={{
                textShadow: "0 2px 16px rgba(0,0,0,0.45)",
              }}
            >
              {ICAFOW.fullName}
            </h2>
            <p
              className="mt-4 max-w-[36rem] text-sm leading-relaxed text-white/85 md:text-base"
              style={{ textShadow: "0 1px 8px rgba(0,0,0,0.4)" }}
            >
              {ICAFOW.summary}
            </p>

            <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm text-white/90">
              <li className="inline-flex items-center gap-2">
                <i
                  className="fas fa-calendar-alt text-[#a8efc4] text-xs"
                  aria-hidden="true"
                />
                {ICAFOW.dateLabel}
              </li>
              <li className="inline-flex items-center gap-2">
                <i
                  className="fas fa-map-marker-alt text-[#a8efc4] text-xs"
                  aria-hidden="true"
                />
                {ICAFOW.location}
              </li>
            </ul>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <a
                href={ICAFOW.registerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary w-full sm:w-auto"
              >
                Register now
                <i
                  className="fas fa-arrow-up-right-from-square text-xs opacity-80"
                  aria-hidden="true"
                />
              </a>
              <a
                href={ICAFOW.url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary w-full sm:w-auto"
              >
                Conference site
              </a>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="rounded-2xl border border-white/15 bg-night/55 p-5 shadow-[0_16px_48px_rgba(0,0,0,0.35)] backdrop-blur-md md:p-6">
              <p className="mb-4 text-center text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-white/55">
                Conference begins in
              </p>
              <div className="grid grid-cols-4 gap-2 sm:gap-3">
                {(
                  countdown
                    ? [
                        { v: countdown.days, l: "Days" },
                        { v: countdown.hours, l: "Hours" },
                        { v: countdown.minutes, l: "Mins" },
                        { v: countdown.seconds, l: "Secs" },
                      ]
                    : [
                        { v: "—", l: "Days" },
                        { v: "—", l: "Hours" },
                        { v: "—", l: "Mins" },
                        { v: "—", l: "Secs" },
                      ]
                ).map((unit) => (
                  <div
                    key={unit.l}
                    className="rounded-xl border border-white/10 bg-black/35 px-1 py-3 text-center sm:py-4"
                  >
                    <div className="font-[var(--font-heading)] text-xl font-bold tabular-nums text-white sm:text-2xl md:text-3xl">
                      {typeof unit.v === "number"
                        ? String(unit.v).padStart(2, "0")
                        : unit.v}
                    </div>
                    <div className="mt-1 text-[0.6rem] font-semibold uppercase tracking-wider text-white/50">
                      {unit.l}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3 border-t border-white/10 pt-5">
                {ICAFOW.stats.map((stat) => (
                  <div key={stat.label} className="text-center sm:text-left">
                    <div className="font-[var(--font-heading)] text-lg font-bold text-[#a8efc4] sm:text-xl">
                      {stat.value}
                    </div>
                    <div className="text-[0.7rem] font-medium uppercase tracking-wide text-white/50">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
