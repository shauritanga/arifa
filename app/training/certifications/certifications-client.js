"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import ApplyButton from "@/app/components/ApplyButton";
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
export default function Certifications({ certifications }) {
  return (
    <>
      {" "}
      {/* ====== Page Header ====== */}{" "}
      <section className="page-hero">
        {" "}
        <div className="absolute inset-0 z-0">
          {" "}
          <Image
            src="/program-certification.png"
            alt="Certifications Background"
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
            Training{" "}
          </div>{" "}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6 animate-fadeInUp animate-delay-100 font-[var(--font-heading)]">
            {" "}
            Professional{" "}
            <span className="text-secondary">Certifications</span>{" "}
          </h1>{" "}
          <p className="text-lg md:text-xl text-white/80 max-w-[700px] mx-auto animate-fadeInUp animate-delay-200">
            {" "}
            Industry-recognized certification programs designed to build
            world-class AI, Data Science, and Tech talent across Africa.{" "}
          </p>{" "}
        </div>{" "}
      </section>{" "}
      {/* ====== Certification Grid ====== */}{" "}
      <section className="py-24 bg-white min-h-[60vh]">
        {" "}
        <div className="max-w-[1200px] mx-auto px-6">
          {" "}
          <div className="text-center max-w-[800px] mx-auto mb-16">
            {" "}
            <h2 className="text-3xl font-bold text-ink font-[var(--font-heading)] mb-6">
              Our Comprehensive Certification Portfolio
            </h2>{" "}
            <p className="text-muted text-lg">
              {" "}
              Explore our wide range of professional certifications tailored for
              different career stages, from foundational concepts to advanced
              engineering and strategic consulting.{" "}
            </p>{" "}
          </div>{" "}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {" "}
            {certifications.map((cert, idx) => (
              <RevealOnScroll
                key={idx}
                delay={(idx % 3) * 50}
                className="bg-white rounded-xl overflow-hidden border border-line shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.12)] transition-all group flex flex-col h-full"
              >
                {" "}
                <div className="relative h-56 w-full overflow-hidden bg-primary/5">
                  {" "}
                  {cert.image && (
                    <Image
                      src={cert.image}
                      alt={cert.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  )}{" "}
                  <div className="absolute top-4 left-4">
                    {" "}
                    <span className="inline-block px-3 py-1 rounded-full text-xs font-bold tracking-wide bg-white/90 text-black shadow-sm">
                      {" "}
                      {cert.category}{" "}
                    </span>{" "}
                  </div>{" "}
                </div>{" "}
                <div className="p-6 flex flex-col flex-grow">
                  {" "}
                  <h3 className="text-xl font-bold text-ink font-[var(--font-heading)] leading-snug mb-3 group-hover:text-primary transition-colors line-clamp-2">
                    {" "}
                    {cert.title}{" "}
                  </h3>{" "}
                  <p className="text-muted text-sm mb-6 line-clamp-3 leading-relaxed text-justify">
                    {" "}
                    {cert.desc}{" "}
                  </p>{" "}
                  <div className="mt-auto pt-5 border-t border-line flex justify-between items-center gap-4">
                    {" "}
                    <Link
                      href={`/training/certifications/view/${cert.view_url.split("/").pop()}`}
                      className="text-sm font-bold text-black hover:text-primary transition-colors flex-1 text-center py-2.5 border border-line hover:border-primary rounded-lg"
                    >
                      {" "}
                      View Syllabus{" "}
                    </Link>{" "}
                    <ApplyButton
                      courseTitle={cert.title}
                      courseImage={cert.image}
                      className="text-sm font-bold text-white bg-primary hover:bg-primary transition-colors flex-1 text-center py-2.5 rounded-lg shadow-md hover:shadow-lg hover:-translate-y-0.5"
                    />{" "}
                  </div>{" "}
                </div>{" "}
              </RevealOnScroll>
            ))}{" "}
          </div>{" "}
        </div>{" "}
      </section>{" "}
    </>
  );
}
