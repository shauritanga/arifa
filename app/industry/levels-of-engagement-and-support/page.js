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
      { threshold: 0.15, rootMargin: "0px 0px -50px 0px" }
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

export default function IndustryEngagement() {
  return (
    <>
      {/* ====== Page Header ====== */}
      <section className="relative pt-40 pb-24 bg-dark overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/about-img.png"
            alt="Industry Engagement Background"
            fill
            className="object-cover object-center opacity-20"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-dark/90 via-dark/80 to-dark" />
        </div>
        
        <div className="max-w-[1200px] w-full mx-auto px-6 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm font-semibold mb-6 animate-fadeInUp">
            Industry
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6 animate-fadeInUp animate-delay-100 font-[var(--font-heading)]">
            Levels of Engagement <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-[#FDE68A]">& Support</span>
          </h1>
          <p className="text-lg md:text-xl text-white/80 max-w-[700px] mx-auto animate-fadeInUp animate-delay-200">
            Partner with ARIFA to accelerate AI adoption in your organization. We offer tiered engagement models to bridge the gap between academic research and commercial application.
          </p>
        </div>
      </section>

      {/* ====== Engagement Models ====== */}
      <section className="py-24 bg-[var(--color-surface)] min-h-[60vh]">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="text-center max-w-[700px] mx-auto mb-16">
            <h2 className="text-3xl font-bold text-dark font-[var(--font-heading)] mb-6">Partnership Tiers</h2>
            <p className="text-[var(--color-text-muted)] text-lg">
              We work closely with telecom companies, banks, agricultural enterprises, and tech startups to translate AI research into scalable business solutions.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            
            {/* Tier 1 */}
            <RevealOnScroll delay={100} className="bg-white rounded-2xl p-10 border border-border-light shadow-[0_4px_20px_rgba(26,26,46,0.03)] hover:shadow-[0_20px_40px_rgba(26,26,46,0.08)] transition-all flex flex-col relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-[var(--color-surface)] rounded-bl-full -z-10" />
              <div className="w-14 h-14 rounded-full bg-[var(--color-surface-alt)] text-primary flex items-center justify-center text-xl mb-6">
                <i className="fas fa-handshake" />
              </div>
              <h3 className="text-2xl font-bold text-dark font-[var(--font-heading)] mb-2">Corporate Sponsor</h3>
              <p className="text-[var(--color-text-muted)] mb-8 flex-grow">
                Ideal for companies looking to support the African AI ecosystem while gaining visibility and early access to our talent pool.
              </p>
              <ul className="space-y-4 mb-10">
                <li className="flex items-start gap-3 text-sm font-medium text-[var(--color-text-body)]">
                  <i className="fas fa-check-circle text-secondary mt-0.5" /> Brand placement at ARIFA events
                </li>
                <li className="flex items-start gap-3 text-sm font-medium text-[var(--color-text-body)]">
                  <i className="fas fa-check-circle text-secondary mt-0.5" /> Priority recruitment access to our graduates
                </li>
                <li className="flex items-start gap-3 text-sm font-medium text-[var(--color-text-body)]">
                  <i className="fas fa-check-circle text-secondary mt-0.5" /> Invitations to exclusive industry roundtables
                </li>
              </ul>
              <Link href="/contact-us" className="w-full py-4 border-2 border-primary text-primary rounded-xl font-bold text-center hover:bg-primary hover:text-white transition-all">
                Inquire Now
              </Link>
            </RevealOnScroll>

            {/* Tier 2 - Highlighted */}
            <RevealOnScroll delay={200} className="bg-dark rounded-2xl p-10 border border-primary shadow-[0_20px_40px_rgba(107,29,42,0.15)] transition-all flex flex-col relative overflow-hidden lg:-translate-y-4">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-secondary to-[#FDE68A]" />
              <div className="absolute top-4 right-4 bg-primary/30 text-secondary text-xs font-bold px-3 py-1 rounded-full border border-secondary/30">
                RECOMMENDED
              </div>
              <div className="w-14 h-14 rounded-full bg-primary/20 text-secondary flex items-center justify-center text-xl mb-6">
                <i className="fas fa-flask" />
              </div>
              <h3 className="text-2xl font-bold text-white font-[var(--font-heading)] mb-2">Research Partner</h3>
              <p className="text-white/70 mb-8 flex-grow">
                Collaborate directly with our researchers to solve specific business problems using custom AI and machine learning models.
              </p>
              <ul className="space-y-4 mb-10">
                <li className="flex items-start gap-3 text-sm font-medium text-white/90">
                  <i className="fas fa-check-circle text-secondary mt-0.5" /> Everything in Corporate Sponsor
                </li>
                <li className="flex items-start gap-3 text-sm font-medium text-white/90">
                  <i className="fas fa-check-circle text-secondary mt-0.5" /> Dedicated research team assignment
                </li>
                <li className="flex items-start gap-3 text-sm font-medium text-white/90">
                  <i className="fas fa-check-circle text-secondary mt-0.5" /> Co-authorship on resulting publications
                </li>
                <li className="flex items-start gap-3 text-sm font-medium text-white/90">
                  <i className="fas fa-check-circle text-secondary mt-0.5" /> Intellectual Property (IP) sharing agreements
                </li>
              </ul>
              <Link href="/contact-us" className="w-full py-4 bg-primary text-white rounded-xl font-bold text-center hover:bg-primary-light transition-all">
                Become a Partner
              </Link>
            </RevealOnScroll>

            {/* Tier 3 */}
            <RevealOnScroll delay={300} className="bg-white rounded-2xl p-10 border border-border-light shadow-[0_4px_20px_rgba(26,26,46,0.03)] hover:shadow-[0_20px_40px_rgba(26,26,46,0.08)] transition-all flex flex-col relative overflow-hidden">
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-[var(--color-surface)] rounded-tr-full -z-10" />
              <div className="w-14 h-14 rounded-full bg-[var(--color-surface-alt)] text-primary flex items-center justify-center text-xl mb-6">
                <i className="fas fa-building" />
              </div>
              <h3 className="text-2xl font-bold text-dark font-[var(--font-heading)] mb-2">Innovation Hub</h3>
              <p className="text-[var(--color-text-muted)] mb-8 flex-grow">
                Establish a joint lab or innovation center within ARIFA to incubate products and drive long-term strategic technology goals.
              </p>
              <ul className="space-y-4 mb-10">
                <li className="flex items-start gap-3 text-sm font-medium text-[var(--color-text-body)]">
                  <i className="fas fa-check-circle text-secondary mt-0.5" /> Physical lab space on campus
                </li>
                <li className="flex items-start gap-3 text-sm font-medium text-[var(--color-text-body)]">
                  <i className="fas fa-check-circle text-secondary mt-0.5" /> Exclusive access to proprietary datasets
                </li>
                <li className="flex items-start gap-3 text-sm font-medium text-[var(--color-text-body)]">
                  <i className="fas fa-check-circle text-secondary mt-0.5" /> Custom training programs for your staff
                </li>
              </ul>
              <Link href="/contact-us" className="w-full py-4 border-2 border-primary text-primary rounded-xl font-bold text-center hover:bg-primary hover:text-white transition-all">
                Inquire Now
              </Link>
            </RevealOnScroll>

          </div>
        </div>
      </section>
    </>
  );
}
