"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";

const FALLBACK_IMAGE = "/hero-bg.png";

function RevealOnScroll({ children, className = "", delay = 0 }) {
  const ref = useRef(null);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduceMotion) {
      node.classList.add("opacity-100", "translate-y-0");
      node.classList.remove("opacity-0", "translate-y-6");
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          entries[0].target.classList.add("opacity-100", "translate-y-0");
          entries[0].target.classList.remove("opacity-0", "translate-y-6");
          observer.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      className={`opacity-0 translate-y-6 transition-all duration-700 ease-out ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

function formatRange(event) {
  const start = [event.month, event.day].filter(Boolean).join(" ");
  const sameDay =
    event.day === event.endDay &&
    event.month === event.endMonth &&
    event.year === event.endYear;
  if (sameDay || !event.endDay) {
    return [start, event.year].filter(Boolean).join(", ");
  }
  const end = [event.endMonth, event.endDay].filter(Boolean).join(" ");
  if (event.year === event.endYear) {
    return `${start} – ${end}, ${event.year || ""}`.trim();
  }
  return `${start}, ${event.year || ""} – ${end}, ${event.endYear || ""}`.trim();
}

function EventCard({ event, index }) {
  const href = `/events/${event.slug}`;
  const image = event.image || FALLBACK_IMAGE;
  const isFeaturedConference =
    event.slug === "arifa-annual-ai-conference-2026" ||
    /icafow/i.test(event.title || "");

  return (
    <RevealOnScroll delay={(index % 3) * 80} className="h-full">
      <article
        className={`group flex h-full flex-col overflow-hidden rounded-xl border bg-white shadow-[0_1px_2px_rgba(15,20,25,0.04)] transition-all duration-300 hover:-translate-y-1 hover:border-primary/20 hover:shadow-[0_16px_40px_rgba(15,20,25,0.08)] ${
          isFeaturedConference
            ? "border-primary/30 ring-1 ring-primary/15"
            : "border-line"
        }`}
      >
        {/* Image + date badge — inspired by demo.arifa.org/events */}
        <Link href={href} className="relative block aspect-[16/10] overflow-hidden bg-surface-warm">
          <Image
            src={image}
            alt={event.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-night/50 via-transparent to-transparent" />

          {/* Floating date tile */}
          <div className="absolute left-4 top-4 flex min-w-[3.5rem] flex-col items-center rounded-lg bg-white px-2.5 py-2 text-center shadow-md">
            <span className="font-[var(--font-heading)] text-2xl font-bold leading-none text-primary">
              {event.day || "—"}
            </span>
            <span className="mt-1 text-[0.65rem] font-bold uppercase tracking-wider text-ink">
              {event.month || ""}
            </span>
          </div>

          {/* Kind badge */}
          <span className="absolute right-4 top-4 rounded-full bg-night/75 px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-wide text-white backdrop-blur-sm">
            {event.kind || "Event"}
          </span>
        </Link>

        <div className="flex flex-1 flex-col p-5 md:p-6">
          <div className="mb-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-medium text-muted">
            {event.location ? (
              <span className="inline-flex max-w-full items-center gap-1.5">
                <i className="fas fa-map-marker-alt text-[0.7em] text-secondary" />
                <span className="truncate">{event.location}</span>
              </span>
            ) : null}
            <span className="inline-flex items-center gap-1.5">
              <i className="fas fa-calendar-alt text-[0.7em] text-secondary" />
              {formatRange(event)}
            </span>
          </div>

          <h3 className="font-[var(--font-heading)] text-lg font-bold leading-snug text-ink transition-colors group-hover:text-primary md:text-xl">
            <Link href={href} className="line-clamp-2">
              {event.title}
            </Link>
          </h3>

          {event.desc ? (
            <p className="mt-2 line-clamp-2 flex-grow text-sm leading-relaxed text-muted">
              {event.desc}
            </p>
          ) : (
            <div className="flex-grow" />
          )}

          <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-line pt-4">
            <Link
              href={href}
              className="inline-flex items-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-primary-dark"
            >
              Read more
              <i className="fas fa-arrow-right text-[0.7em] transition-transform group-hover:translate-x-0.5" />
            </Link>
            {event.registerUrl ? (
              <a
                href={event.registerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-semibold text-secondary transition-colors hover:opacity-80"
              >
                Register
                <i className="fas fa-arrow-up-right-from-square text-[0.7em]" />
              </a>
            ) : null}
          </div>
        </div>
      </article>
    </RevealOnScroll>
  );
}

function EventGrid({ events, emptyLabel }) {
  if (!events.length) {
    return (
      <div className="rounded-xl border border-dashed border-line bg-white px-6 py-14 text-center text-sm text-muted">
        {emptyLabel}
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-7">
      {events.map((event, idx) => (
        <EventCard key={event.slug || event.title} event={event} index={idx} />
      ))}
    </div>
  );
}

export default function Engagements({ engagements }) {
  const upcomingEvents = engagements.filter((e) => e.type === "Upcoming");
  const pastEvents = engagements.filter((e) => e.type !== "Upcoming");

  return (
    <>
      <section className="page-hero">
        <div className="absolute inset-0 z-0">
          <Image
            src="/about-img.png"
            alt=""
            fill
            className="object-cover object-center opacity-30 grayscale-[0.2]"
            priority
            aria-hidden="true"
          />
          <div className="absolute inset-0 bg-night/80" />
        </div>
        <div className="max-w-[1200px] w-full mx-auto px-6 relative z-10 text-center">
          <div className="page-hero-badge animate-fadeInUp">Events &amp; News</div>
          <h1
            className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-5 animate-fadeInUp animate-delay-100 font-[var(--font-heading)]"
            style={{ color: "#ffffff" }}
          >
            Stay in the <span style={{ color: "#8fd4aa" }}>loop</span>
          </h1>
          <p className="text-lg md:text-xl text-white/75 max-w-[36rem] mx-auto animate-fadeInUp animate-delay-200">
            Latest events, announcements, and highlights from ARIFA&apos;s work
            across Africa — all in one place.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-20 bg-canvas">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="mb-10 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <span className="institute-eyebrow mb-2">Join us</span>
              <h2 className="text-2xl md:text-3xl font-bold text-ink font-[var(--font-heading)] tracking-[-0.02em]">
                Upcoming events
              </h2>
            </div>
            <p className="text-sm text-muted max-w-xs sm:text-right">
              {upcomingEvents.length} open{" "}
              {upcomingEvents.length === 1 ? "engagement" : "engagements"}
            </p>
          </div>
          <EventGrid
            events={upcomingEvents}
            emptyLabel="No upcoming events at the moment. Check past highlights below."
          />
        </div>
      </section>

      <section className="py-16 md:py-20 bg-white border-t border-line">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="mb-10">
            <span className="institute-eyebrow mb-2">Archive</span>
            <h2 className="text-2xl md:text-3xl font-bold text-ink font-[var(--font-heading)] tracking-[-0.02em]">
              Past engagements
            </h2>
          </div>
          <EventGrid
            events={pastEvents}
            emptyLabel="Past events will appear here once published."
          />
        </div>
      </section>
    </>
  );
}
