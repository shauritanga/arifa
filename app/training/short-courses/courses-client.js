"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { startPayment } from "@/lib/client/start-payment";

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
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" },
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

const PERIODS = ["3 months", "3 weeks", "1 week", "1 day"];

const INPUT =
  "w-full px-4 py-3 rounded-lg border border-black/10 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all";
const LABEL = "block text-sm font-bold text-black mb-2";

/** Enroll + pay form for one course; posts to the courses route which prices it. */
function EnrollForm({ course, fee }) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));
    setError("");
    setSubmitting(true);
    try {
      // The amount is never sent: the server prices the course from `slug`. On
      // success this navigates away to Airpay, so `submitting` stays true.
      await startPayment({ ...data, slug: course.id }, "/api/courses/register");
    } catch (err) {
      setError(err.message);
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label htmlFor="name" className={LABEL}>
            Full Name <span className="text-primary">*</span>
          </label>
          <input id="name" name="name" type="text" required className={INPUT} />
        </div>
        <div>
          <label htmlFor="email" className={LABEL}>
            Email Address <span className="text-primary">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            maxLength={50}
            className={INPUT}
          />
        </div>
        <div>
          <label htmlFor="phone" className={LABEL}>
            Phone Number <span className="text-primary">*</span>
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            required
            placeholder="0712 345 678"
            className={INPUT}
          />
        </div>
        <div>
          <label htmlFor="organization" className={LABEL}>
            Organization / Company
          </label>
          <input
            id="organization"
            name="organization"
            type="text"
            className={INPUT}
          />
        </div>
      </div>

      {error && (
        <div role="alert" className="rounded-xl bg-red-50 px-5 py-4 text-red-700">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="flex w-full items-center justify-center gap-2.5 rounded-lg bg-primary px-6 py-3.5 font-bold text-white transition-all hover:-translate-y-0.5 disabled:opacity-70"
      >
        {submitting
          ? "Taking you to AirPay…"
          : `Enroll — pay TSh ${fee.toLocaleString("en-TZ")}`}
      </button>

      <p className="text-center text-sm text-black/50">
        Payment is handled by AirPay. Card, M-Pesa, Tigo Pesa and Airtel Money
        are accepted on the next screen.
      </p>
    </form>
  );
}

/** Modal wrapper around EnrollForm, opened from a course card. */
function EnrollModal({ course, onClose }) {
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
      aria-label={`Enroll in ${course.title}`}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-[600px] rounded-2xl bg-white p-7 shadow-[0_30px_80px_rgba(0,0,0,0.35)] md:p-9"
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
          Short Course
        </div>
        <h2 className="mt-1 text-2xl font-extrabold text-black font-[var(--font-heading)]">
          Enroll — {course.title}
        </h2>
        <p className="mt-2 mb-7 text-sm text-black/60">
          {course.date && (
            <>
              <i className="fa-regular fa-calendar-days mr-1.5 text-primary" />
              {course.date} ·{" "}
            </>
          )}
          You will pay{" "}
          <strong className="text-black">
            TSh {feeInShillings(course).toLocaleString("en-TZ")}
          </strong>{" "}
          via AirPay.
        </p>

        <EnrollForm course={course} fee={feeInShillings(course)} />
      </div>
    </div>
  );
}

/** Mirror of lib/courses feeInShillings for client-side gating/labels. */
function feeInShillings(course) {
  const digits = String(course?.price_tzs ?? "").replace(/[^\d]/g, "");
  if (!digits) return null;
  const amount = Number(digits);
  return Number.isFinite(amount) && amount >= 1000 ? amount : null;
}

function EnrollButton({ course, onEnroll }) {
  const className =
    "rounded-[5px] bg-[#800000] px-3.5 py-2 text-sm font-semibold text-white transition-all hover:bg-primary";

  if (feeInShillings(course) == null) {
    return (
      <Link href="/contact-us" className={className}>
        Enquire
      </Link>
    );
  }
  return (
    <button type="button" onClick={() => onEnroll(course)} className={className}>
      Enroll
    </button>
  );
}

export default function ShortCourses({ courses }) {
  const [period, setPeriod] = useState("all");
  const [active, setActive] = useState(null);

  const visible =
    period === "all"
      ? courses
      : courses.filter((c) => (c.period || "") === period);

  return (
    <>
      {/* ====== Page Header ====== */}
      <section className="relative pt-40 pb-24 bg-primary overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/program-training.png"
            alt="Short Courses Background"
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
            Intensive <span className="text-secondary">Short Courses</span>
          </h1>
          <p className="text-lg md:text-xl text-white/80 max-w-[700px] mx-auto animate-fadeInUp animate-delay-200">
            Upskill rapidly with our hands-on, focused workshops designed for
            professionals seeking immediate practical knowledge.
          </p>
        </div>
      </section>

      {/* ====== Sidebar + course grid ====== */}
      <section className="bg-[#f7f7f7] py-16">
        <div className="mx-auto flex max-w-[1200px] flex-col gap-8 px-6 md:flex-row md:items-start">
          {/* Sidebar */}
          <aside className="w-full shrink-0 rounded-xl bg-white p-6 shadow-[0_4px_10px_rgba(0,0,0,0.04)] md:sticky md:top-28 md:w-[220px]">
            <h2 className="mb-4 text-lg font-bold text-black font-[var(--font-heading)]">
              Short Courses Period
            </h2>
            <ul className="space-y-1">
              <li>
                <button
                  type="button"
                  onClick={() => setPeriod("all")}
                  className={`w-full rounded-md px-3 py-2 text-left text-sm font-semibold transition-colors ${
                    period === "all"
                      ? "bg-primary text-white"
                      : "text-black/70 hover:bg-primary/10 hover:text-primary"
                  }`}
                >
                  All Courses
                </button>
              </li>
              {PERIODS.map((p) => (
                <li key={p}>
                  <button
                    type="button"
                    onClick={() => setPeriod(p)}
                    className={`w-full rounded-md px-3 py-2 text-left text-sm font-semibold transition-colors ${
                      period === p
                        ? "bg-primary text-white"
                        : "text-black/70 hover:bg-primary/10 hover:text-primary"
                    }`}
                  >
                    {p}
                  </button>
                </li>
              ))}
            </ul>
          </aside>

          {/* Cards */}
          <div className="min-w-0 flex-1">
            <div className="grid gap-5 [grid-template-columns:repeat(auto-fit,minmax(280px,1fr))]">
              {visible.map((course, idx) => (
                <RevealOnScroll key={course.id} delay={(idx % 3) * 80}>
                  <article className="flex h-full flex-col overflow-hidden rounded-[10px] bg-white shadow-[0_4px_10px_rgba(0,0,0,0.06)] transition-shadow hover:shadow-[0_14px_28px_rgba(0,0,0,0.12)]">
                    <div className="relative h-[120px] w-full bg-[#e9edf2]">
                      {course.image && (
                        <Image
                          src={course.image}
                          alt={course.title}
                          fill
                          sizes="(max-width: 768px) 100vw, 360px"
                          className="object-cover"
                        />
                      )}
                    </div>
                    <div className="flex flex-1 flex-col px-5 py-4">
                      <h3 className="mb-2.5 text-lg font-bold text-black">
                        {course.title}
                      </h3>
                      {course.date && (
                        <div className="mb-0.5 text-sm font-bold text-black">
                          <i className="fa-regular fa-calendar-days mr-1.5 text-primary" />
                          Date: {course.date}
                        </div>
                      )}
                      {course.location && (
                        <div className="mb-0.5 text-sm font-bold text-black">
                          <i className="fa-solid fa-location-dot mr-1.5 text-primary" />
                          Location: {course.location}
                        </div>
                      )}
                      {course.certificate && (
                        <div className="mb-0.5 text-sm font-bold text-black">
                          <i className="fa-solid fa-certificate mr-1.5 text-primary" />
                          Certificate: {course.certificate}
                        </div>
                      )}
                      {course.desc && (
                        <p className="mt-2 text-sm leading-relaxed text-black/60">
                          {course.desc}
                        </p>
                      )}
                      <div className="mt-auto flex items-center justify-between pt-4">
                        <span className="font-bold text-[#800000]">
                          {course.price}
                        </span>
                        <EnrollButton course={course} onEnroll={setActive} />
                      </div>
                    </div>
                  </article>
                </RevealOnScroll>
              ))}
            </div>

            {visible.length === 0 && (
              <p className="py-16 text-center text-black/50">
                No courses in this period yet.
              </p>
            )}
          </div>
        </div>
      </section>

      {active && (
        <EnrollModal course={active} onClose={() => setActive(null)} />
      )}
    </>
  );
}
