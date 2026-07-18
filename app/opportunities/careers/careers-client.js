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
export default function Careers({ jobs }) {
  return (
    <>
      {" "}
      {/* ====== Page Header ====== */}{" "}
      <section className="page-hero">
        {" "}
        <div className="absolute inset-0 z-0">
          {" "}
          <Image
            src="/hero-bg.png"
            alt="Careers Background"
            fill
            className="object-cover object-center opacity-30 grayscale-[0.2]"
            priority
          />{" "}
          <div className="absolute inset-0 bg-night/80" />{" "}
        </div>{" "}
        <div className="max-w-[1200px] w-full mx-auto px-6 relative z-10 text-center">
          {" "}
          <div className="page-hero-badge animate-fadeInUp">
            {" "}
            Opportunities{" "}
          </div>{" "}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6 animate-fadeInUp animate-delay-100 font-[var(--font-heading)]">
            {" "}
            Careers at <span className="text-secondary">ARIFA</span>{" "}
          </h1>{" "}
          <p className="text-lg md:text-xl text-white/80 max-w-[700px] mx-auto animate-fadeInUp animate-delay-200">
            {" "}
            Join our team of researchers, educators, and innovators dedicated to
            shaping the future of artificial intelligence in Africa.{" "}
          </p>{" "}
        </div>{" "}
      </section>{" "}
      {/* ====== Jobs List ====== */}{" "}
      <section className="py-24 bg-white min-h-[60vh]">
        {" "}
        <div className="max-w-[1000px] mx-auto px-6">
          {" "}
          <div className="text-center max-w-[700px] mx-auto mb-16">
            {" "}
            <h2 className="text-3xl font-bold text-ink font-[var(--font-heading)] mb-6">
              Open Positions
            </h2>{" "}
            <p className="text-muted text-lg">
              {" "}
              We are always looking for exceptional talent. If you don&apos;t
              see a role that fits but believe you belong at ARIFA, please send
              us your CV anyway.{" "}
            </p>{" "}
          </div>{" "}
          <div className="space-y-6">
            {" "}
            {jobs.map((job, idx) => (
              <RevealOnScroll
                key={idx}
                delay={idx * 100}
                className="bg-white rounded-xl p-8 border border-line shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_15px_30px_rgba(0,0,0,0.06)] hover:border-primary/30 transition-all flex flex-col md:flex-row md:items-center justify-between group"
              >
                {" "}
                <div className="mb-6 md:mb-0">
                  {" "}
                  <h3 className="text-xl font-bold text-ink font-[var(--font-heading)] mb-3 group-hover:text-primary transition-colors">
                    {job.title}
                  </h3>{" "}
                  <div className="flex flex-wrap gap-4 text-sm font-semibold text-muted">
                    {" "}
                    <span className="flex items-center gap-1.5">
                      <i className="fas fa-building text-secondary" />{" "}
                      {job.department}
                    </span>{" "}
                    <span className="flex items-center gap-1.5">
                      <i className="fas fa-map-marker-alt text-secondary" />{" "}
                      {job.location}
                    </span>{" "}
                    <span className="flex items-center gap-1.5">
                      <i className="fas fa-clock text-secondary" /> {job.type}
                    </span>{" "}
                  </div>{" "}
                </div>{" "}
                <div>
                  {" "}
                  <Link
                    href="/contact-us"
                    className="px-6 py-3 border-2 border-primary text-primary rounded-md font-bold hover:bg-primary hover:text-white transition-all whitespace-nowrap block text-center md:inline-block"
                  >
                    {" "}
                    Apply Now{" "}
                  </Link>{" "}
                </div>{" "}
              </RevealOnScroll>
            ))}{" "}
          </div>{" "}
        </div>{" "}
      </section>{" "}
    </>
  );
}
