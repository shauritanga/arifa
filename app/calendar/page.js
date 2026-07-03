"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
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
      {" "}
      {children}{" "}
    </div>
  );
}
const calendarEvents = [
  {
    month: "August 2026",
    title: "Certified Data Science Associate - Fall Intake",
    type: "Certification",
    dates: "Aug 10 - Nov 02",
  },
  {
    month: "September 2026",
    title: "Data Science Bootcamp — Cohort 5",
    type: "Short Course",
    dates: "Sep 18 - Sep 20",
  },
  {
    month: "October 2026",
    title: "AI Ethics & Governance Seminar",
    type: "Workshop",
    dates: "Oct 05 - Oct 16",
  },
  {
    month: "January 2027",
    title: "Certified Data Science Associate - Spring Intake",
    type: "Certification",
    dates: "Jan 15 - Apr 10",
  },
];
export default function Calendar() {
  return (
    <>
      {" "}
      {/* ====== Page Header ====== */}{" "}
      <section className="relative pt-40 pb-24 bg-primary overflow-hidden">
        {" "}
        <div className="absolute inset-0 z-0">
          {" "}
          <Image
            src="/hero-bg.png"
            alt="Academic Calendar Background"
            fill
            className="object-cover object-center opacity-35"
            priority
          />{" "}
          <div className="absolute inset-0 bg-primary/70" />{" "}
        </div>{" "}
        <div className="max-w-[1200px] w-full mx-auto px-6 relative z-10 text-center">
          {" "}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white text-sm font-semibold mb-6 animate-fadeInUp">
            {" "}
            Training{" "}
          </div>{" "}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6 animate-fadeInUp animate-delay-100 font-[var(--font-heading)]">
            {" "}
            Academic <span className="text-secondary">Calendar</span>{" "}
          </h1>{" "}
          <p className="text-lg md:text-xl text-white/80 max-w-[700px] mx-auto animate-fadeInUp animate-delay-200">
            {" "}
            Plan your learning journey with our schedule of upcoming program
            intakes and workshops.{" "}
          </p>{" "}
        </div>{" "}
      </section>{" "}
      {/* ====== Calendar List ====== */}{" "}
      <section className="py-24 bg-white min-h-[60vh]">
        {" "}
        <div className="max-w-[800px] mx-auto px-6">
          {" "}
          <div className="space-y-6">
            {" "}
            {calendarEvents.map((item, idx) => (
              <RevealOnScroll
                key={idx}
                delay={idx * 100}
                className="flex flex-col md:flex-row md:items-center bg-white rounded-2xl p-6 border border-black/10 hover:shadow-lg transition-all group"
              >
                {" "}
                <div className="md:w-1/3 mb-4 md:mb-0 border-b md:border-b-0 md:border-r border-black/10 pb-4 md:pb-0 md:pr-6">
                  {" "}
                  <h3 className="text-xl font-bold text-black font-[var(--font-heading)]">
                    {item.month}
                  </h3>{" "}
                  <p className="text-primary font-medium mt-1">
                    {item.dates}
                  </p>{" "}
                </div>{" "}
                <div className="md:w-2/3 md:pl-6">
                  {" "}
                  <span
                    className={`inline-block px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider mb-2 ${item.type === "Certification" ? "bg-primary/10 text-primary" : item.type === "Short Course" ? "bg-secondary/20 text-secondary" : "bg-primary/10 text-black/70"}`}
                  >
                    {" "}
                    {item.type}{" "}
                  </span>{" "}
                  <h4 className="text-lg font-bold text-black mb-1">
                    {item.title}
                  </h4>{" "}
                </div>{" "}
              </RevealOnScroll>
            ))}{" "}
          </div>{" "}
          <div className="mt-16 text-center">
            {" "}
            <Link
              href="/contact-us"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary text-white rounded-full font-bold shadow-[0_4px_14px_rgba(0,0,0,0.25)] hover:bg-primary hover:-translate-y-0.5 transition-all"
            >
              {" "}
              Contact Admissions <i className="fas fa-envelope text-sm" />{" "}
            </Link>{" "}
          </div>{" "}
        </div>{" "}
      </section>{" "}
    </>
  );
}
