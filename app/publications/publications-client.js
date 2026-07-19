"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

const FALLBACK_COVER = "/hero-bg.png";

function RevealOnScroll({ children, className = "", delay = 0 }) {
  const ref = useRef(null);
  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduceMotion) {
      node.classList.add("opacity-100", "translate-y-0");
      node.classList.remove("opacity-0", "translate-y-6");
      return undefined;
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

function PublicationCard({ pub, index }) {
  // Always open the on-site detail page; external PDFs live on that page.
  const href = `/publications/${pub.slug || pub.id}`;
  const cover = pub.image || FALLBACK_COVER;

  return (
    <RevealOnScroll delay={(index % 4) * 60} className="h-full">
      <Link
        href={href}
        className="block h-full rounded-[10px] outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
      >
        <article className="group flex h-full flex-col overflow-hidden rounded-[10px] border border-line bg-white shadow-[0_4px_12px_rgba(15,20,25,0.08)] transition-all duration-300 hover:-translate-y-1 hover:border-primary/20 hover:shadow-[0_12px_28px_rgba(15,20,25,0.1)]">
          <div className="relative h-[220px] w-full shrink-0 overflow-hidden bg-surface-warm sm:h-[260px] lg:h-[290px]">
            <Image
              src={cover}
              alt={pub.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            />
            {!pub.image && (
              <div className="absolute inset-0 bg-gradient-to-br from-primary/40 via-night/50 to-secondary/30" />
            )}
            {pub.year ? (
              <span className="absolute top-3 left-3 rounded border border-white/20 bg-night/70 px-2 py-0.5 text-[0.65rem] font-semibold text-white backdrop-blur-sm">
                {pub.year}
              </span>
            ) : null}
          </div>
          <div className="flex flex-1 flex-col p-4 text-left">
            <h3 className="font-[var(--font-heading)] text-[0.95rem] font-semibold leading-snug text-ink transition-colors group-hover:text-primary sm:text-base">
              {pub.title}
            </h3>
            {pub.authors ? (
              <p className="mt-2 line-clamp-2 text-xs font-medium text-muted">
                {pub.authors}
              </p>
            ) : null}
            {pub.venue ? (
              <p className="mt-1 line-clamp-2 text-xs italic text-subtle">
                {pub.venue}
              </p>
            ) : null}
            <span className="mt-auto inline-flex items-center gap-1.5 pt-3 text-xs font-semibold text-primary">
              View details
              <i className="fas fa-arrow-right text-[0.7em] transition-transform group-hover:translate-x-0.5" />
            </span>
          </div>
        </article>
      </Link>
    </RevealOnScroll>
  );
}

function CategorySection({ title, items }) {
  return (
    <section className="mb-14 last:mb-0">
      <h2 className="mb-6 text-left font-[var(--font-heading)] text-lg font-bold tracking-[-0.01em] text-ink md:text-xl">
        {title}
      </h2>
      {items.length === 0 ? (
        <div className="rounded-xl border border-dashed border-line bg-white px-6 py-10 text-center">
          <p className="text-sm text-muted">No publications available yet</p>
          {title === "ARIFA Journal" ? (
            <a
              href="https://ijait.arifa.org"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary-dark"
            >
              Visit IJAIT
              <i className="fas fa-arrow-up-right-from-square text-[0.7em]" />
            </a>
          ) : null}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((pub, i) => (
            <PublicationCard key={pub.id || `${title}-${i}`} pub={pub} index={i} />
          ))}
        </div>
      )}
    </section>
  );
}

export default function Publications({
  publications = [],
  categories = [],
}) {
  const [active, setActive] = useState("all");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return publications.filter((p) => {
      if (active !== "all" && p.category !== active) return false;
      if (!q) return true;
      const hay = [p.title, p.authors, p.venue, p.year, p.category]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return hay.includes(q);
    });
  }, [publications, active, query]);

  const byCategory = useMemo(() => {
    const map = new Map(categories.map((c) => [c, []]));
    for (const p of filtered) {
      const key = p.category || "Research Reports";
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(p);
    }
    return map;
  }, [filtered, categories]);

  return (
    <>
      {/* Hero — original “Publications” breadcrumb style with fade image */}
      <section className="relative overflow-hidden border-b border-white/10 pt-28 pb-14 md:pt-36 md:pb-16">
        <div className="absolute inset-0" aria-hidden="true">
          <Image
            src="/hero-bg.png"
            alt=""
            fill
            priority
            className="object-cover object-center"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-night/70" />
          <div className="absolute inset-0 bg-gradient-to-b from-night/50 via-night/65 to-night/85" />
        </div>
        <div className="relative z-10 mx-auto max-w-[1200px] px-6 text-center">
          <nav
            className="mb-5 flex flex-wrap items-center justify-center gap-2 text-sm font-medium text-white/65"
            aria-label="Breadcrumb"
          >
            <Link href="/" className="transition-colors hover:text-white">
              Home
            </Link>
            <span className="text-white/35" aria-hidden="true">
              /
            </span>
            <span className="text-white/90">Publications</span>
          </nav>
          <h1
            className="font-[var(--font-heading)] text-3xl font-bold tracking-[-0.02em] md:text-4xl lg:text-5xl"
            style={{
              color: "#ffffff",
              textShadow: "0 2px 16px rgba(0,0,0,0.35)",
            }}
          >
            Publications
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-white/75 md:text-lg">
            Research reports, policy briefs, and scholarly work from ARIFA.
          </p>
        </div>
        <div
          className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-primary via-primary to-secondary"
          aria-hidden="true"
        />
      </section>

      <section className="bg-canvas py-12 md:py-16 min-h-[50vh]">
        <div className="mx-auto max-w-[1200px] px-6">
          {/* Toolbar: search + category tabs (original header-item pattern) */}
          <div className="mb-10 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative w-full max-w-sm">
              <i
                className="fas fa-search pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-muted"
                aria-hidden="true"
              />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search publications…"
                className="w-full rounded-lg border border-line bg-white py-2.5 pl-10 pr-3 text-sm text-ink outline-none transition-shadow focus:border-primary focus:ring-2 focus:ring-primary/15"
                aria-label="Search publications"
              />
            </div>

            <div
              className="flex flex-wrap gap-2"
              role="tablist"
              aria-label="Publication categories"
            >
              <button
                type="button"
                role="tab"
                aria-selected={active === "all"}
                onClick={() => setActive("all")}
                className={`inline-flex min-h-[40px] cursor-pointer items-center rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
                  active === "all"
                    ? "border-primary bg-primary text-white"
                    : "border-line bg-white text-ink hover:border-primary/30 hover:text-primary"
                }`}
              >
                All
              </button>
              {categories.map((cat) => {
                const selected = active === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    role="tab"
                    aria-selected={selected}
                    onClick={() => setActive(cat)}
                    className={`inline-flex min-h-[40px] cursor-pointer items-center rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
                      selected
                        ? "border-primary bg-primary text-white"
                        : "border-line bg-white text-ink hover:border-primary/30 hover:text-primary"
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Content: sectioned when All, single grid when filtered */}
          {active === "all" ? (
            categories.map((cat) => (
              <CategorySection
                key={cat}
                title={cat}
                items={byCategory.get(cat) || []}
              />
            ))
          ) : (
            <CategorySection
              title={active}
              items={byCategory.get(active) || []}
            />
          )}
        </div>
      </section>
    </>
  );
}
