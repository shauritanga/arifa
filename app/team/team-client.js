"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const FALLBACK_IMAGE = "https://arifa.org/storage/images/user_avatar.png";

/** Plain text bios stay readable; HTML from the rich editor is passed through. */
function bioToHtml(bio) {
  const raw = String(bio || "").trim();
  if (!raw) return "";
  if (/<[a-z][\s\S]*>/i.test(raw)) return raw;
  return raw
    .split(/\n\n+/)
    .map((p) => {
      const escaped = p
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/\n/g, "<br />");
      return `<p>${escaped}</p>`;
    })
    .join("");
}

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
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" },
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

function TeamCard({ member, index, onSelect }) {
  const imageSrc = member.image || FALLBACK_IMAGE;

  return (
    <RevealOnScroll delay={(index % 4) * 80} className="h-full">
      <article className="group flex h-full flex-col items-center rounded-xl border border-line bg-white px-6 pt-7 pb-6 text-center shadow-[0_1px_2px_rgba(15,20,25,0.04)] transition-all duration-300 hover:-translate-y-1 hover:border-primary/20 hover:shadow-[0_12px_32px_rgba(15,20,25,0.07)]">
        {/* Avatar */}
        <div className="mb-5 h-[112px] w-[112px] shrink-0 rounded-full border border-line bg-surface-alt p-1">
          <div className="relative h-full w-full overflow-hidden rounded-full">
            <Image
              src={imageSrc}
              alt={member.name}
              fill
              sizes="112px"
              className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
            />
          </div>
        </div>

        {/* Name */}
        <h3 className="font-[var(--font-heading)] text-lg font-semibold leading-snug text-ink">
          {member.name}
        </h3>

        {/* Title / role */}
        {member.role ? (
          <p className="mt-1.5 text-sm font-medium text-primary">
            {member.role}
          </p>
        ) : null}

        {/* Short description */}
        {member.shortBio ? (
          <p className="mt-3 line-clamp-3 flex-grow text-sm leading-relaxed text-muted">
            {member.shortBio}
          </p>
        ) : (
          <div className="flex-grow" />
        )}

        {/* View Bio */}
        <button
          type="button"
          onClick={() => onSelect(member)}
          className="mt-5 inline-flex items-center justify-center rounded-md border border-line bg-surface-alt px-5 py-2.5 text-sm font-semibold text-ink transition-colors hover:border-primary hover:bg-primary hover:text-white focus:outline-none focus-visible:ring-4 focus-visible:ring-primary/20"
        >
          View Bio
        </button>
      </article>
    </RevealOnScroll>
  );
}

export default function TeamPage({ team }) {
  const categories = Object.keys(team);
  const [selectedMember, setSelectedMember] = useState(null);

  useEffect(() => {
    if (!selectedMember) return undefined;
    const onKey = (e) => {
      if (e.key === "Escape") setSelectedMember(null);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [selectedMember]);

  return (
    <>
      <section className="page-hero">
        <div className="absolute inset-0 z-0">
          <Image
            src="/about-img.png"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-center opacity-30 grayscale-[0.2]"
            aria-hidden="true"
          />
          <div className="absolute inset-0 bg-night/80" />
        </div>
        <div className="max-w-[1200px] w-full mx-auto px-6 relative z-10 text-center">
          <div className="page-hero-badge animate-fadeInUp">About Us</div>
          <h1
            className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 animate-fadeInUp animate-delay-100 font-[var(--font-heading)] tracking-[-0.03em]"
            style={{ color: "#ffffff" }}
          >
            Meet Our <span style={{ color: "#8fd4aa" }}>Team</span>
          </h1>
          <p className="text-lg md:text-xl text-white/70 max-w-[700px] mx-auto animate-fadeInUp animate-delay-200">
            A dedicated group of researchers, engineers, and professionals
            driving innovation in AI and digital transformation across Africa.
          </p>
        </div>
      </section>

      <section className="py-20 md:py-24 bg-canvas">
        <div className="max-w-[1200px] mx-auto px-6">
          {categories.length === 0 ? (
            <p className="text-center text-muted py-16">
              Team members will appear here once published in the admin.
            </p>
          ) : (
            categories.map((category) => (
              <div key={category} className="mb-16 last:mb-0">
                <div className="mb-8 max-w-[40rem]">
                  <span className="institute-eyebrow mb-3">ARIFA People</span>
                  <h2 className="text-2xl md:text-3xl font-bold text-ink font-[var(--font-heading)] tracking-[-0.02em]">
                    {category}
                  </h2>
                  <div className="mt-4 flex h-0.5 w-14 overflow-hidden rounded-full">
                    <span className="h-full flex-1 bg-primary" />
                    <span className="h-full flex-1 bg-secondary" />
                  </div>
                </div>

                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {team[category].map((member, index) => (
                    <TeamCard
                      key={`${category}-${member.name}-${index}`}
                      member={member}
                      index={index}
                      onSelect={setSelectedMember}
                    />
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {selectedMember && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-label={`${selectedMember.name} biography`}
        >
          <div
            className="absolute inset-0 bg-night/80"
            onClick={() => setSelectedMember(null)}
          />
          <div className="relative z-10 flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-xl bg-white shadow-2xl md:flex-row animate-fadeInUp">
            <button
              type="button"
              onClick={() => setSelectedMember(null)}
              aria-label="Close profile"
              className="absolute right-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white/95 text-ink shadow-sm transition-colors hover:bg-white focus:outline-none focus-visible:ring-4 focus-visible:ring-primary/20"
            >
              <i className="fas fa-times text-xl" aria-hidden="true" />
            </button>
            <div className="relative h-64 w-full shrink-0 bg-surface-alt md:h-auto md:w-2/5 min-h-[280px]">
              <Image
                src={selectedMember.image || FALLBACK_IMAGE}
                alt={selectedMember.name}
                fill
                sizes="(max-width: 768px) 100vw, 40vw"
                className="object-cover object-top"
              />
            </div>
            <div className="w-full overflow-y-auto p-8 md:w-3/5 md:p-10">
              <div className="mb-5 flex h-1 w-12 overflow-hidden rounded-full">
                <span className="h-full flex-1 bg-primary" />
                <span className="h-full flex-1 bg-secondary" />
              </div>
              {selectedMember.role && (
                <span className="mb-3 inline-flex rounded-full bg-primary/8 px-3 py-1 text-xs font-semibold uppercase tracking-[0.1em] text-primary">
                  {selectedMember.role}
                </span>
              )}
              <h2 className="mb-4 text-2xl md:text-3xl font-bold text-ink font-[var(--font-heading)]">
                {selectedMember.name}
              </h2>
              <div
                className="max-w-none text-base leading-relaxed text-ink-soft text-justify [&_p]:mb-3 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-ink [&_h2]:mt-4 [&_h2]:mb-2 [&_h3]:text-lg [&_h3]:font-bold [&_h3]:text-ink [&_h3]:mt-3 [&_h3]:mb-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-3 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:mb-3 [&_li]:mb-1 [&_strong]:font-semibold [&_a]:text-primary [&_a]:underline [&_img]:rounded-lg [&_img]:my-3 [&_img]:max-w-full"
                dangerouslySetInnerHTML={{
                  __html: bioToHtml(selectedMember.bio),
                }}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
