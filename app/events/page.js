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

const events = [
  {
    day: "15",
    month: "Jul",
    title: "ARIFA Annual AI Conference 2026",
    location: "YMCA Building, Dar es Salaam, Tanzania",
    desc: "Join leading AI researchers and practitioners for our flagship annual conference featuring keynotes, workshops, and networking sessions."
  },
  {
    day: "02",
    month: "Aug",
    title: "Robotics & Innovation Challenge",
    location: "Dar es Salaam, Tanzania",
    desc: "A hands-on robotics competition bringing together young innovators to design AI-powered solutions for real-world challenges."
  },
  {
    day: "18",
    month: "Sep",
    title: "Women in AI — East Africa Meetup",
    location: "Virtual Event",
    desc: "A networking and mentorship event dedicated to highlighting and supporting female researchers and engineers in the African AI ecosystem."
  },
  {
    day: "10",
    month: "Oct",
    title: "Data Science for Public Policy Workshop",
    location: "Dodoma, Tanzania",
    desc: "An exclusive workshop for government officials and policymakers on leveraging data analytics for evidence-based decision making."
  }
];

export default function Events() {
  return (
    <>
      {/* ====== Page Header ====== */}
      <section className="relative pt-40 pb-24 bg-dark overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/about-img.png"
            alt="Events Background"
            fill
            className="object-cover object-center opacity-20"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-dark/90 via-dark/80 to-dark" />
        </div>
        
        <div className="max-w-[1200px] w-full mx-auto px-6 relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6 animate-fadeInUp font-[var(--font-heading)]">
            Upcoming <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-[#FDE68A]">Events</span>
          </h1>
          <p className="text-lg md:text-xl text-white/80 max-w-[700px] mx-auto animate-fadeInUp animate-delay-100">
            Conferences, workshops, and meetups hosted by ARIFA. Join us as we build the African AI community.
          </p>
        </div>
      </section>

      {/* ====== Events Grid ====== */}
      <section className="py-24 bg-[var(--color-surface)] min-h-[60vh]">
        <div className="max-w-[1000px] mx-auto px-6">
          <div className="space-y-8">
            {events.map((event, idx) => (
              <RevealOnScroll key={idx} delay={(idx % 3) * 100} className="bg-white rounded-2xl flex flex-col md:flex-row overflow-hidden border border-border-light shadow-[0_4px_20px_rgba(26,26,46,0.03)] hover:shadow-[0_20px_40px_rgba(26,26,46,0.08)] hover:-translate-y-1 transition-all group">
                
                {/* Date Block */}
                <div className="bg-primary text-white flex flex-col justify-center items-center p-8 md:w-40 shrink-0">
                  <span className="text-4xl font-extrabold font-[var(--font-heading)]">{event.day}</span>
                  <span className="text-lg font-bold uppercase tracking-widest text-secondary">{event.month}</span>
                </div>
                
                {/* Content Block */}
                <div className="p-8 md:px-10 flex-grow flex flex-col justify-center">
                  <h3 className="text-2xl font-bold text-dark font-[var(--font-heading)] mb-2 group-hover:text-primary transition-colors">
                    {event.title}
                  </h3>
                  <p className="text-sm font-semibold text-[var(--color-text-muted)] mb-4 flex items-center gap-2">
                    <i className="fas fa-map-marker-alt text-secondary" /> {event.location}
                  </p>
                  <p className="text-[var(--color-text-muted)] leading-relaxed">
                    {event.desc}
                  </p>
                  
                  <div className="mt-6 pt-6 border-t border-border-light flex justify-between items-center">
                    <Link href="/contact-us" className="text-sm font-bold text-primary hover:text-secondary transition-colors">
                      Register Now <i className="fas fa-arrow-right ml-1 text-[0.8em]" />
                    </Link>
                  </div>
                </div>

              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
