"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import RegisterForm from "./[slug]/register-form";

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
      { threshold: 0.15, rootMargin: "0px 0px -50px 0px" },
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

const STATS = [
  { number: "10", label: "Countries Covered" },
  { number: "2", label: "Intensive Days" },
  { number: "500+", label: "Senior Leaders Expected" },
  { number: "15+", label: "Expert Facilitators" },
];

const CONTEXT = [
  {
    icon: "fa-globe-americas",
    title: "Global Context",
    text: "By 2030, AI could contribute $15.7 trillion to the global economy.",
  },
  {
    icon: "fa-calendar-days",
    title: "Urgent Need",
    text: "74% of African executives cite lack of AI strategy as top digital barrier.",
  },
  {
    icon: "fa-trophy",
    title: "Your Advantage",
    text: "Leaders who understand AI govern better, invest smarter, and outcompete.",
  },
];

const OUTCOMES = [
  "Understand global AI landscape & national strategy",
  "Develop a practical AI strategy for your organization",
  "AI governance, ethics & risk management frameworks",
  "Build your 90-day AI action roadmap",
];

const CERT_NOTES = [
  {
    icon: "fa-graduation-cap",
    title: "ARIFA Executive Certificate in AI Leadership",
    text: "Internationally recognized · digitally verifiable",
  },
  {
    icon: "fa-users",
    title: "Group discounts available",
    text: "3+ participants from USD 650/person",
  },
  {
    icon: "fa-globe",
    title: "Government/NGO rates",
    text: "From USD 600/person (Early Bird)",
  },
];

const MODULES = [
  { label: "Day 1 – Module 1", title: "Global AI Landscape & Strategic Imperative" },
  { label: "Day 1 – Module 2", title: "AI Strategy & Competitive Advantage" },
  { label: "Day 1 – Module 3", title: "AI Governance, Ethics & Risk Management" },
  { label: "Day 2 – Module 4", title: "AI for Public Sector Transformation" },
  { label: "Day 2 – Module 5", title: "Organizational Readiness & Change Leadership" },
  { label: "Day 2 – Module 6", title: "Building Your AI Roadmap – Action Lab" },
];

/**
 * Priced cities go to their registration + AirPay checkout page; an unpriced one
 * has nothing it could legitimately charge, so it asks for an enquiry instead.
 * An explicit Register URL on the session overrides both.
 */
function RegisterButton({ session, onRegister }) {
  const className =
    "mt-auto flex w-full items-center justify-center gap-2.5 rounded-[10px] bg-[#5f0202] px-5 py-3 text-sm font-semibold text-white transition-all hover:scale-[0.97] hover:bg-primary";

  if (session.register_url) {
    return (
      <a
        href={session.register_url}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
      >
        Register interest
      </a>
    );
  }

  if (session.fee == null) {
    return (
      <Link href="/contact-us" className={className}>
        Contact us to register
      </Link>
    );
  }

  // Open the payment form in a modal rather than navigating to the detail page.
  return (
    <button
      type="button"
      onClick={() => onRegister(session)}
      className={className}
    >
      {session.early_price
        ? `Register interest — Early Bird ${session.early_price}`
        : "Register interest"}
    </button>
  );
}

/** Modal wrapper around the shared RegisterForm, opened from a city card. */
function RegisterModal({ session, onClose }) {
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-black/60 p-4 py-10 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={`Register for ${session.title} Master Class`}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-[640px] rounded-2xl bg-white p-7 shadow-[0_30px_80px_rgba(0,0,0,0.35)] md:p-9"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full bg-black/5 text-black/60 transition-colors hover:bg-black/10 hover:text-black"
        >
          <i className="fas fa-times" />
        </button>

        <div className="text-xs font-bold uppercase tracking-[2px] text-primary">
          {session.country} · Executive Session
        </div>
        <h2 className="mt-1 text-2xl font-extrabold text-black font-[var(--font-heading)]">
          Register — {session.title}
        </h2>
        <p className="mt-2 mb-7 text-sm text-black/60">
          <i className="fa-solid fa-calendar-days mr-1.5 text-primary" />
          {session.date}
          {session.format ? ` · ${session.format}` : ""} · You will pay{" "}
          <strong className="text-black">
            TSh {session.fee.toLocaleString("en-TZ")}
          </strong>{" "}
          via AirPay.
        </p>

        <RegisterForm
          slug={String(session.id)}
          city={session.title}
          fee={session.fee}
        />
      </div>
    </div>
  );
}

export default function Masterclass({ sessions }) {
  const [activeSession, setActiveSession] = useState(null);
  return (
    <>
      {/* ====== Page Header ====== */}
      <section className="relative pt-40 pb-24 bg-primary overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/program-training.png"
            alt="Executive AI Master Class Background"
            fill
            className="object-cover object-center opacity-35"
            priority
          />
          <div className="absolute inset-0 bg-primary/70" />
        </div>
        <div className="max-w-[1200px] w-full mx-auto px-6 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white text-sm font-semibold mb-6 animate-fadeInUp">
            Training
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6 animate-fadeInUp animate-delay-100 font-[var(--font-heading)]">
            Leading Organizations in the Age of{" "}
            <span className="text-secondary">Artificial Intelligence</span>
          </h1>
          <p className="text-lg md:text-xl text-white/80 max-w-[760px] mx-auto text-center animate-fadeInUp animate-delay-200">
            A premier executive training for CEOs, government leaders, board
            members and senior decision-makers.
          </p>

          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6 rounded-2xl border border-white/15 bg-white/10 px-8 py-6 backdrop-blur-sm animate-fadeInUp animate-delay-300">
            {STATS.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-4xl font-extrabold leading-none text-[#ffd966]">
                  {stat.number}
                </div>
                <div className="mt-2 text-xs font-medium uppercase tracking-[1px] text-white/80">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ====== Why this masterclass (context band) ====== */}
      <section className="pt-16 bg-white">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="flex flex-wrap gap-5 rounded-[40px] bg-white/85 px-6 py-7 shadow-[0_10px_28px_-8px_rgba(0,0,0,0.12)] ring-1 ring-black/5">
            {CONTEXT.map((item, idx) => (
              <div key={item.title} className="flex flex-1 items-stretch gap-5">
                {idx > 0 && (
                  <div className="hidden w-0.5 self-stretch bg-primary sm:block" />
                )}
                <div className="min-w-[180px] flex-1 text-[#141414]">
                  <span className="font-extrabold">
                    <i className={`fa-solid ${item.icon} mr-2 text-primary`} />
                    {item.title}
                  </span>
                  <br />
                  {item.text}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ====== Key Learning Outcomes ====== */}
      <section className="pt-16 bg-white">
        <div className="max-w-[1200px] mx-auto px-6">
          <h2 className="relative inline-block text-2xl font-bold text-black font-[var(--font-heading)] after:absolute after:-bottom-3 after:left-0 after:h-1 after:w-[60px] after:rounded after:bg-primary">
            Key Learning Outcomes
          </h2>
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {OUTCOMES.map((outcome) => (
              <div
                key={outcome}
                className="flex items-start gap-3 rounded-[10px] bg-primary px-5 py-3.5 text-[#dceaf2]"
              >
                <i className="fas fa-check mt-1 text-secondary" />
                <span>{outcome}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ====== 2026 Tour — city cards ====== */}
      <section className="py-20 bg-white min-h-[60vh]">
        <div className="max-w-[1200px] mx-auto px-6">
          <h2 className="relative inline-block text-2xl font-bold text-black font-[var(--font-heading)] after:absolute after:-bottom-3 after:left-0 after:h-1 after:w-[60px] after:rounded after:bg-primary">
            2026 Master Class Tour — Select Your City
          </h2>
          <p className="mt-8 max-w-[780px] text-lg text-[#4a627a] text-left">
            Join a premier session near you. Each master class includes local
            case studies, global frameworks, and an executive certificate.
          </p>

          <div className="mt-12 grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-8">
            {sessions.map((session, idx) => (
              <RevealOnScroll
                key={session.id}
                delay={(idx % 3) * 100}
                className="h-full"
              >
                <article className="flex h-full flex-col overflow-hidden rounded-[28px] bg-white shadow-[0_20px_35px_-12px_rgba(0,0,0,0.08)] transition-all duration-200 hover:-translate-y-1.5 hover:shadow-[0_28px_40px_-16px_rgba(0,0,0,0.15)]">
                  <div className="relative h-[200px] w-full bg-[#dceaf2]">
                    {session.image ? (
                      <Image
                        src={session.image}
                        alt={`AI Master Class in ${session.title}, ${session.country}`}
                        fill
                        sizes="(max-width: 768px) 100vw, 380px"
                        className="object-cover"
                      />
                    ) : (
                      /* Four cities have no photo yet — a branded placeholder
                         rather than a broken image. */
                      <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-gradient-to-br from-primary to-black text-white/90">
                        <i className="fas fa-city text-3xl" />
                        <span className="text-sm font-semibold tracking-wide">
                          {session.title}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-1 flex-col px-6 pt-6 pb-7">
                    <div className="mb-2 text-xs font-bold uppercase tracking-[2px] text-primary">
                      {session.country} · Executive Session
                    </div>
                    <h3 className="text-2xl font-extrabold leading-tight text-[#141414] font-[var(--font-heading)]">
                      {session.title}
                    </h3>
                    <div className="mt-3 flex items-center gap-2 text-sm font-semibold text-[#2c5a6e]">
                      <i className="fa-solid fa-calendar-days" />
                      {session.date}
                      {session.format ? ` | ${session.format}` : ""}
                    </div>

                    {(session.early_price ||
                      session.standard_price ||
                      session.group_price) && (
                      <div className="mt-4 flex flex-wrap items-baseline justify-between gap-2 rounded-[9px] bg-[#eef2fa] px-4 py-3">
                        <span>
                          {session.early_price && (
                            <span className="text-[1.4rem] font-extrabold text-primary">
                              {session.early_price}
                            </span>
                          )}
                          {session.standard_price && (
                            <span className="ml-2 font-semibold text-[#4f6f8f] line-through">
                              {session.standard_price}
                            </span>
                          )}
                        </span>
                        {session.group_price && (
                          <span className="rounded-full bg-white px-3 py-1 text-[0.85rem] font-semibold text-[#2c5a6e]">
                            👥 Group (3+): {session.group_price}/person
                          </span>
                        )}
                        {session.fee != null && (
                          /* The USD figure is the headline, but shillings are
                             what AirPay will actually charge — say so here
                             rather than surprising them at checkout. */
                          <span className="w-full text-[0.8rem] font-medium text-[#4f6f8f]">
                            Charged as TSh{" "}
                            {session.fee.toLocaleString("en-TZ")}
                          </span>
                        )}
                      </div>
                    )}

                    <p className="my-4 text-[0.95rem] leading-relaxed text-[#3e5a6c]">
                      {session.desc}
                    </p>

                    <RegisterButton
                      session={session}
                      onRegister={setActiveSession}
                    />
                  </div>
                </article>
              </RevealOnScroll>
            ))}
          </div>

          {/* Certificate + pricing note */}
          <div className="mt-10 flex flex-wrap items-center justify-between gap-6 rounded-[32px] bg-[#f3dcdc] px-7 py-5 text-primary">
            {CERT_NOTES.map((note) => (
              <div key={note.title}>
                <strong className="font-extrabold">
                  <i className={`fa-solid ${note.icon} mr-2`} />
                  {note.title}
                </strong>
                <br />
                {note.text}
              </div>
            ))}
          </div>

          {/* Full curriculum */}
          <div className="mt-6 mb-2 rounded-[32px] bg-white px-7 py-6 shadow-[0_10px_28px_-8px_rgba(0,0,0,0.12)] ring-1 ring-black/5">
            <h3 className="mb-5 text-xl font-bold text-primary font-[var(--font-heading)]">
              <i className="fa-solid fa-book mr-2" />
              2-Day Intensive Curriculum
            </h3>
            <div className="grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(250px,1fr))]">
              {MODULES.map((mod, idx) => (
                <div
                  key={mod.label}
                  className={
                    idx === 0
                      ? "text-[#141414]"
                      : "border-l-2 border-primary pl-4 text-[#141414]"
                  }
                >
                  <strong>{mod.label}</strong>
                  <br />
                  {mod.title}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {activeSession && (
        <RegisterModal
          session={activeSession}
          onClose={() => setActiveSession(null)}
        />
      )}
    </>
  );
}
