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

const schedule = [
  { time: "18:00 – 18:30", activity: "Arrival, Registration & Welcome Refreshments" },
  { time: "18:30 – 18:45", activity: "Opening Remarks & Introduction to ARIFA AI Dinner" },
  { time: "18:45 – 19:15", activity: "Keynote Presentation: The Future of AI in Africa" },
  { time: "19:15 – 19:35", activity: "AI Innovation Showcase & Industry Insights" },
  { time: "19:35 – 20:00", activity: "Entertainment Session" },
  { time: "20:00 – 20:45", activity: "Executive Dinner" },
  { time: "20:45 – 21:15", activity: "High-Level Networking & Partnership Engagement" },
  { time: "21:15 – 22:00", activity: "Music, Social Interaction & Closing Moments" }
];

const expectations = [
  "High-level AI keynote presentations and thought leadership sessions",
  "Strategic networking with decision-makers and innovators",
  "AI innovation showcases and success stories",
  "Live entertainment and cultural performances",
  "Executive dinner experience in a premium environment",
  "Opportunities for partnerships, investments, and collaborations",
  "Recognition of outstanding contributions to AI and digital transformation"
];

export default function AIDinner() {
  return (
    <>
      {/* ====== Page Header ====== */}
      <section className="relative pt-40 pb-24 bg-dark overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/about-img.png"
            alt="AI Dinner Background"
            fill
            className="object-cover object-center opacity-20"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-dark/90 via-dark/80 to-dark" />
        </div>
        
        <div className="max-w-[1200px] w-full mx-auto px-6 relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6 animate-fadeInUp font-[var(--font-heading)]">
            ARIFA AI <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-[#FDE68A]">Dinner 2026</span>
          </h1>
          <p className="text-lg md:text-xl text-white/80 max-w-[800px] mx-auto animate-fadeInUp animate-delay-100 font-medium">
            Theme: Shaping Africa’s AI Future Through Collaboration, Innovation, and Leadership
          </p>
        </div>
      </section>

      {/* ====== Content Section ====== */}
      <section className="py-24 bg-[var(--color-surface)]">
        <div className="max-w-[1000px] mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-12">
              <RevealOnScroll>
                <div className="prose prose-lg prose-slate max-w-none">
                  <p className="text-lg text-[var(--color-text-body)] leading-relaxed">
                    The Africa Research Institute For AI (ARIFA) is proud to announce the inaugural ARIFA AI Dinner 2026, an exclusive annual gathering that will bring together leaders, innovators, policymakers, researchers, industry executives, development partners, entrepreneurs, and AI enthusiasts to celebrate the growing impact of Artificial Intelligence in Africa.
                  </p>
                  <p className="text-lg text-[var(--color-text-body)] leading-relaxed mt-4">
                    Participants will have the opportunity to interact with high-profile guests from government institutions, diplomatic missions, academia, private sector organizations, international agencies, technology companies, startups, investors, and media representatives.
                  </p>
                  <p className="text-lg text-[var(--color-text-body)] leading-relaxed mt-4">
                    The ARIFA AI Dinner is more than an event, it is a movement to strengthen Africa’s AI ecosystem, inspire responsible innovation, and foster collaborations that can accelerate sustainable development and digital transformation.
                  </p>
                </div>
              </RevealOnScroll>

              <RevealOnScroll delay={200}>
                <h3 className="text-3xl font-bold text-dark font-[var(--font-heading)] mb-6">
                  What to Expect
                </h3>
                <ul className="space-y-4">
                  {expectations.map((item, idx) => (
                    <li key={idx} className="flex gap-4">
                      <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-1">
                        <i className="fas fa-check text-sm" />
                      </div>
                      <span className="text-[var(--color-text-body)] text-lg">{item}</span>
                    </li>
                  ))}
                </ul>
              </RevealOnScroll>

              <RevealOnScroll delay={300}>
                <h3 className="text-3xl font-bold text-dark font-[var(--font-heading)] mb-8">
                  Tentative Programme
                </h3>
                <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(26,26,46,0.03)] border border-border-light overflow-hidden">
                  <div className="hidden md:grid grid-cols-[1fr_2fr] gap-4 p-6 bg-dark text-white font-bold font-[var(--font-heading)]">
                    <div>Time</div>
                    <div>Activity</div>
                  </div>
                  <div className="divide-y divide-border-light">
                    {schedule.map((item, idx) => (
                      <div key={idx} className="grid md:grid-cols-[1fr_2fr] gap-2 md:gap-4 p-6 hover:bg-surface transition-colors">
                        <div className="text-primary font-bold">{item.time}</div>
                        <div className="text-[var(--color-text-body)] font-medium">{item.activity}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </RevealOnScroll>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <RevealOnScroll delay={400}>
                <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgba(26,26,46,0.06)] border border-border-light p-8 sticky top-32">
                  <h3 className="text-2xl font-bold text-dark font-[var(--font-heading)] mb-6 border-b border-border-light pb-4">
                    Event Details
                  </h3>
                  
                  <div className="space-y-6 mb-8">
                    <div className="flex gap-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 text-xl">
                        <i className="far fa-calendar-alt" />
                      </div>
                      <div>
                        <p className="text-sm text-[var(--color-text-muted)] font-semibold mb-1">Date</p>
                        <p className="text-dark font-bold">20 November 2026</p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 text-xl">
                        <i className="far fa-clock" />
                      </div>
                      <div>
                        <p className="text-sm text-[var(--color-text-muted)] font-semibold mb-1">Time</p>
                        <p className="text-dark font-bold">From 18:00 HRS</p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 text-xl">
                        <i className="fas fa-map-marker-alt" />
                      </div>
                      <div>
                        <p className="text-sm text-[var(--color-text-muted)] font-semibold mb-1">Location</p>
                        <p className="text-dark font-bold">Serena Hotel</p>
                      </div>
                    </div>
                  </div>

                  <Link href="/contact-us" className="block w-full py-4 bg-primary text-white text-center rounded-xl font-bold hover:bg-primary-light hover:shadow-lg transition-all hover:-translate-y-0.5">
                    Reserve Your Seat
                  </Link>
                  <p className="text-xs text-center text-[var(--color-text-muted)] mt-4">
                    The ARIFA AI Dinner is expected to become one of the region’s premier AI networking and thought leadership events.
                  </p>
                </div>
              </RevealOnScroll>
            </div>

          </div>
        </div>
      </section>
    </>
  );
}
