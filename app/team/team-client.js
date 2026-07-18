"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const FALLBACK_IMAGE = "https://arifa.org/storage/images/user_avatar.png";

const HONORIFICS = new Set([
  "Eng.", "Dr.", "Prof.", "Mr.", "Mrs.", "Ms.", "Miss", "Adv.", "Hon.",
  "Rev.", "Sir", "Amb.", "Capt.", "Col.",
]);

/** The demo shows the leading honorifics ("Eng. Dr.") as a role line. */
function roleFromName(name) {
  const out = [];
  for (const part of String(name).split(/\s+/)) {
    if (HONORIFICS.has(part)) out.push(part);
    else break;
  }
  return out.join(" ");
}

function RevealOnScroll({ children, className = "", delay = 0 }) {
  const ref = useRef(null);
  useEffect(() => {
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
    if (ref.current) observer.observe(ref.current);
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
  const role = roleFromName(member.name);
  return (
    <RevealOnScroll delay={(index % 4) * 100} className="h-full">
      <button
        type="button"
        onClick={() => onSelect(member)}
        className="group flex h-full w-full flex-col items-center rounded-xl border border-line bg-white px-6 pt-7 pb-6 text-center shadow-[0_1px_2px_rgba(15,20,25,0.04)] transition-all duration-300 hover:-translate-y-1 hover:border-primary/25 hover:shadow-[0_12px_32px_rgba(15,20,25,0.08)] focus:outline-none focus-visible:ring-4 focus-visible:ring-primary/20"
      >
        <div className="mb-5 h-[120px] w-[120px] shrink-0 rounded-full border border-line bg-surface-alt p-1">
          <div className="relative h-full w-full overflow-hidden rounded-full">
            <Image
              src={imageSrc}
              alt={member.name}
              fill
              sizes="120px"
              className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
            />
          </div>
        </div>
        <h4 className="font-[var(--font-heading)] text-lg font-semibold leading-tight text-ink">
          {member.name}
        </h4>
        {role && (
          <div className="mt-1.5 text-xs font-semibold uppercase tracking-[0.08em] text-primary">
            {role}
          </div>
        )}
        <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted">
          {member.bio}
        </p>
        <span className="mt-5 inline-block rounded-md border border-line bg-surface-alt px-4 py-2 text-sm font-semibold text-ink transition-colors group-hover:border-primary group-hover:bg-primary group-hover:text-white">
          View Bio
        </span>
      </button>
    </RevealOnScroll>
  );
}

export default function TeamPage({ team }) {
  const categories = Object.keys(team);
  const [selectedMember, setSelectedMember] = useState(null);
  const selectedRole = selectedMember ? roleFromName(selectedMember.name) : "";

  return (
    <>
      {/* ====== Page Header ====== */}
      <section className="page-hero">
        <div className="absolute inset-0 z-0">
          <Image
            src="/about-img.png"
            alt="Our Team Background"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center opacity-30 grayscale-[0.2]"
          />
          <div className="absolute inset-0 bg-night/80" />
        </div>
        <div className="max-w-[1200px] w-full mx-auto px-6 relative z-10 text-center">
          <div className="page-hero-badge animate-fadeInUp">
            About Us
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6 animate-fadeInUp animate-delay-100 font-[var(--font-heading)] tracking-[-0.03em]">
            Meet Our <span className="text-[#8fd4aa]">Team</span>
          </h1>
          <p className="text-lg md:text-xl text-white/70 max-w-[700px] mx-auto animate-fadeInUp animate-delay-200">
            A dedicated group of researchers, engineers, and professionals
            driving innovation in AI and digital transformation across Africa.
          </p>
        </div>
      </section>

      {/* ====== Team sections (stacked by category) ====== */}
      <section className="py-24 bg-canvas">
        <div className="max-w-[1200px] mx-auto px-6">
          {categories.map((category) => (
            <div key={category} className="mb-20 last:mb-0">
              <div className="mb-10 max-w-[40rem]">
                <span className="institute-eyebrow mb-3">
                  ARIFA People
                </span>
                <h2 className="text-2xl md:text-3xl font-bold text-ink font-[var(--font-heading)] tracking-[-0.02em]">
                  {category}
                </h2>
                <div className="mt-4 flex h-0.5 w-14 overflow-hidden rounded-full">
                  <span className="h-full flex-1 bg-primary" />
                  <span className="h-full flex-1 bg-secondary" />
                </div>
              </div>

              <div className="grid gap-5 [grid-template-columns:repeat(auto-fit,minmax(240px,1fr))]">
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
          ))}
        </div>
      </section>

      {/* ====== Modal for Team Member Bio ====== */}
      {selectedMember && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          <div
            className="absolute inset-0 bg-night/80"
            onClick={() => setSelectedMember(null)}
          />
          <div className="relative z-10 flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-xl bg-white shadow-2xl md:flex-row animate-fadeInUp">
            <button
              onClick={() => setSelectedMember(null)}
              aria-label="Close profile"
              className="absolute right-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-black shadow-sm transition-colors hover:bg-white focus:outline-none focus-visible:ring-4 focus-visible:ring-secondary/30"
            >
              <i className="fas fa-times text-xl" aria-hidden="true" />
            </button>
            <div className="relative h-72 w-full bg-white md:h-auto md:w-2/5">
              <Image
                src={selectedMember.image || FALLBACK_IMAGE}
                alt={selectedMember.name}
                fill
                sizes="(max-width: 768px) 100vw, 40vw"
                className="object-cover object-top"
              />
              <div className="absolute inset-x-0 bottom-0 h-28 bg-night/70 md:hidden" />
            </div>
            <div className="w-full overflow-y-auto p-8 md:w-3/5 md:p-12">
              <div className="mb-6 flex h-1 w-12 overflow-hidden rounded-full">
                <span className="h-full flex-1 bg-[#990000]" />
                <span className="h-full flex-1 bg-[#00803D]" />
              </div>
              {selectedRole && (
                <span className="mb-3 inline-flex rounded-full bg-[#00803D]/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] text-[#990000]">
                  {selectedRole}
                </span>
              )}
              <h2 className="mb-6 text-3xl font-bold text-ink font-[var(--font-heading)]">
                {selectedMember.name}
              </h2>
              <div className="text-lg leading-relaxed text-black">
                <p>{selectedMember.bio}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
