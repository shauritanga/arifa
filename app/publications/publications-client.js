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
export default function Publications({ publications }) {
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
            alt="Publications Background"
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
            Research{" "}
          </div>{" "}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6 animate-fadeInUp animate-delay-100 font-[var(--font-heading)]">
            {" "}
            Our <span className="text-secondary">Publications</span>{" "}
          </h1>{" "}
          <p className="text-lg md:text-xl text-white/80 max-w-[700px] mx-auto animate-fadeInUp animate-delay-200">
            {" "}
            A comprehensive repository of academic papers, journals, and
            technical reports published by ARIFA researchers.{" "}
          </p>{" "}
        </div>{" "}
      </section>{" "}
      {/* ====== Publications List ====== */}{" "}
      <section className="py-24 bg-canvas min-h-[60vh]">
        {" "}
        <div className="max-w-[900px] mx-auto px-6">
          {" "}
          <div className="mb-12 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 bg-white p-6 rounded-xl border border-line">
            {" "}
            <div>
              {" "}
              <h3 className="font-semibold text-ink font-[var(--font-heading)]">
                Looking for the ARIFA Journal?
              </h3>{" "}
              <p className="text-sm text-muted mt-1">
                Visit the International Journal of AI Technology (IJAIT)
              </p>{" "}
            </div>{" "}
            <a
              href="https://ijait.arifa.org"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-5 py-2.5 bg-primary text-white rounded-md font-semibold text-sm hover:bg-primary-light transition-colors shrink-0"
            >
              {" "}
              Go to IJAIT{" "}
            </a>{" "}
          </div>{" "}
          <div className="space-y-14">
            {" "}
            {publications.map((group, groupIdx) => (
              <div key={groupIdx}>
                {" "}
                <h2 className="text-2xl font-bold text-ink font-[var(--font-heading)] mb-6 pb-3 border-b border-line tracking-[-0.02em]">
                  {" "}
                  {group.year}{" "}
                </h2>{" "}
                <div className="space-y-4">
                  {" "}
                  {group.papers.map((paper, idx) => (
                    <RevealOnScroll
                      key={idx}
                      delay={idx * 60}
                      className="group"
                    >
                      {" "}
                      <article className="flex gap-4 rounded-xl border border-line bg-white p-5 transition-all hover:border-primary/20 hover:shadow-[0_8px_24px_rgba(15,20,25,0.05)]">
                        {" "}
                        <div className="w-10 h-10 rounded-md bg-surface-alt border border-line text-primary flex items-center justify-center shrink-0 mt-0.5">
                          {" "}
                          <i className="fas fa-file-alt text-sm" />{" "}
                        </div>{" "}
                        <div>
                          {" "}
                          <h3 className="text-lg font-semibold text-ink font-[var(--font-heading)] leading-snug mb-2 group-hover:text-primary transition-colors">
                            {" "}
                            <a
                              href={paper.link}
                              className="hover:underline decoration-primary/30 underline-offset-4"
                            >
                              {paper.title}
                            </a>{" "}
                          </h3>{" "}
                          <p className="text-ink-soft text-sm font-medium mb-1">
                            {" "}
                            {paper.authors}{" "}
                          </p>{" "}
                          <p className="text-sm text-muted">
                            {" "}
                            Published in:{" "}
                            <span className="italic">{paper.venue}</span>{" "}
                          </p>{" "}
                        </div>{" "}
                      </article>{" "}
                    </RevealOnScroll>
                  ))}{" "}
                </div>{" "}
              </div>
            ))}{" "}
          </div>{" "}
        </div>{" "}
      </section>{" "}
    </>
  );
}
