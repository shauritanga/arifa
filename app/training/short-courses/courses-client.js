"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import ShareBar from "../masterclass/share-bar";
import {
  formatShillings,
  formatUsd,
  usdFromShillings,
} from "@/lib/currency";

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

const PERIODS = ["2 days", "3 months", "3 weeks", "1 week", "1 day"];

/** Mirror of lib/courses feeInShillings for client-side gating/labels. */
function feeInShillings(course) {
  const digits = String(course?.price_tzs ?? "").replace(/[^\d]/g, "");
  if (!digits) return null;
  const amount = Number(digits);
  return Number.isFinite(amount) && amount >= 1000 ? amount : null;
}

function EnrollButton({ course }) {
  const className =
    "inline-flex w-full items-center justify-center rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-light";
  const href = `/training/short-courses/${course.id}`;

  if (feeInShillings(course) == null) {
    return (
      <Link href="/contact-us" className={className}>
        Enquire
      </Link>
    );
  }
  return (
    <Link href={href} className={className}>
      Enroll and pay
    </Link>
  );
}

export default function ShortCourses({ courses }) {
  const [period, setPeriod] = useState("all");

  const visible =
    period === "all"
      ? courses
      : courses.filter((c) => (c.period || "") === period);

  return (
    <>
      {/* ====== Page Header ====== */}
      <section className="page-hero">
        <div className="absolute inset-0 z-0">
          <Image
            src="/program-training.png"
            alt="Short Courses Background"
            fill
            className="object-cover object-center opacity-30 grayscale-[0.2]"
            priority
          />
          <div className="absolute inset-0 bg-night/80" />
        </div>
        <div className="max-w-[1200px] w-full mx-auto px-6 relative z-10 text-center">
          <div className="page-hero-badge animate-fadeInUp">
            Training
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6 animate-fadeInUp animate-delay-100 font-[var(--font-heading)]">
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
            <h2 className="mb-4 text-lg font-bold text-ink font-[var(--font-heading)]">
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
                      : "text-muted hover:bg-primary/10 hover:text-primary"
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
                        : "text-muted hover:bg-primary/10 hover:text-primary"
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
                <RevealOnScroll key={course.id} delay={(idx % 3) * 80} className="h-full">
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
                    <div className="flex flex-1 flex-col px-5 pt-4 pb-3">
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
                        <p className="mt-2 text-sm leading-relaxed text-black/60 text-justify">
                          {course.desc}
                        </p>
                      )}
                    </div>
                    <div className="mt-auto border-t border-line bg-[#fafaf8] px-5 py-4">
                      <div className="mb-3">
                        <p className="text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-muted">
                          Fee
                        </p>
                        <p className="text-base font-bold leading-tight text-primary">
                          {course.price
                            ? course.price
                            : usdFromShillings(feeInShillings(course)) != null
                              ? formatUsd(
                                  usdFromShillings(feeInShillings(course)),
                                )
                              : "—"}
                        </p>
                        {!course.price &&
                          feeInShillings(course) != null && (
                            <p className="text-[0.7rem] font-medium text-black/50">
                              Charged as {formatShillings(feeInShillings(course))}
                            </p>
                          )}
                      </div>
                      <EnrollButton course={course} />
                      <ShareBar
                        compact
                        path={`/training/short-courses/${course.id}`}
                        title={`${course.title} | ARIFA`}
                        text={`Enroll in ${course.title} at ARIFA. ${course.desc || ""}`.trim()}
                      />
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
    </>
  );
}
