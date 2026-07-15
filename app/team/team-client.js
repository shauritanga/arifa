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
        className="group flex h-full w-full flex-col items-center rounded-[28px] border border-white/10 bg-primary px-6 pt-7 pb-6 text-center shadow-[0_8px_22px_rgba(0,0,0,0.15)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_24px_55px_rgba(0,0,0,0.28)] focus:outline-none focus-visible:ring-4 focus-visible:ring-secondary/40"
      >
        <div className="mb-5 h-[126px] w-[126px] shrink-0 rounded-full border-[3px] border-white/90 bg-[#f1f5fe] p-[3px]">
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
        <h4 className="font-[var(--font-heading)] text-lg font-extrabold leading-tight text-white">
          {member.name}
        </h4>
        {role && (
          <div className="mt-1.5 text-sm font-semibold text-white/70">
            {role}
          </div>
        )}
        <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-white/80">
          {member.bio}
        </p>
        <span className="mt-5 inline-block rounded-[10px] border-[1.5px] border-white bg-white px-5 py-2 text-sm font-semibold text-primary transition-colors group-hover:bg-transparent group-hover:text-white">
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
      <section className="relative pt-40 pb-24 bg-primary overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/about-img.png"
            alt="Our Team Background"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center opacity-35"
          />
          <div className="absolute inset-0 bg-primary/70" />
        </div>
        <div className="max-w-[1200px] w-full mx-auto px-6 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white text-sm font-semibold mb-6 animate-fadeInUp">
            About Us
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6 animate-fadeInUp animate-delay-100 font-[var(--font-heading)]">
            Meet Our <span className="text-secondary">Team</span>
          </h1>
          <p className="text-lg md:text-xl text-white/80 max-w-[700px] mx-auto animate-fadeInUp animate-delay-200">
            A dedicated group of researchers, engineers, and professionals
            driving innovation in AI and digital transformation across Africa.
          </p>
        </div>
      </section>

      {/* ====== Team sections (stacked by category) ====== */}
      <section className="py-24 bg-white">
        <div className="max-w-[1400px] mx-auto px-6">
          {categories.map((category) => (
            <div key={category} className="mb-20 last:mb-0">
              <div className="mx-auto mb-12 max-w-[760px] text-center">
                <span className="mb-3 block text-sm font-bold uppercase tracking-[0.18em] text-[#990000]">
                  ARIFA People
                </span>
                <h2 className="text-3xl font-extrabold text-black font-[var(--font-heading)]">
                  {category}
                </h2>
                <div className="mx-auto mt-5 flex h-1 w-16 overflow-hidden rounded-full">
                  <span className="h-full flex-1 bg-[#990000]" />
                  <span className="h-full flex-1 bg-[#00803D]" />
                </div>
              </div>

              <div className="grid gap-8 [grid-template-columns:repeat(auto-fit,minmax(260px,1fr))]">
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
            className="absolute inset-0 bg-primary/70"
            onClick={() => setSelectedMember(null)}
          />
          <div className="relative z-10 flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl md:flex-row animate-fadeInUp">
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
              <div className="absolute inset-x-0 bottom-0 h-28 bg-primary/70 md:hidden" />
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
              <h2 className="mb-6 text-3xl font-extrabold text-black font-[var(--font-heading)]">
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
