"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

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

/** Progress bar that fills to `pct` the first time it scrolls into view. */
function SkillBar({ label, pct }) {
  const ref = useRef(null);
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setWidth(pct);
          observer.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [pct]);
  return (
    <div ref={ref} className="mb-6 last:mb-0">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm font-bold text-black md:text-base">{label}</span>
        <span className="text-sm font-bold text-primary">{pct}%</span>
      </div>
      <div className="h-2.5 w-full overflow-hidden rounded-full bg-black/10">
        <div
          className="h-full rounded-full bg-primary transition-[width] duration-[1200ms] ease-out"
          style={{ width: `${width}%` }}
        />
      </div>
    </div>
  );
}

const MVV = [
  {
    icon: "fas fa-bullseye",
    title: "Our Mission",
    text: "Our mission at ARIFA is to empower Africa through AI research, capacity building, and policy guidance for ethical, sustainable development.",
  },
  {
    icon: "fas fa-eye",
    title: "Our Vision",
    text: "Our vision at ARIFA is to be a world-class think tank and global leader in AI research, driving sustainable development and innovation.",
  },
  {
    icon: "fas fa-gem",
    title: "Our Values",
    text: "Innovation & Excellence, Ethical AI & Responsibility, Inclusivity & Diversity, Collaboration & Knowledge Sharing, Empowerment & Impact-Driven Research.",
  },
];

const SKILLS = [
  { label: "Research, Development & Innovation", pct: 96 },
  { label: "Training & Capacity Building", pct: 94 },
  { label: "Data Driven AI Policies", pct: 90 },
  { label: "Responsible & Ethical AI Practices", pct: 92 },
];

export default function About() {
  return (
    <>
      {/* ====== Page Header ====== */}
      <section className="page-hero">
        <div className="absolute inset-0 z-0">
          <Image
            src="/about-img.png"
            alt="About ARIFA Background"
            fill
            className="object-cover object-center opacity-30 grayscale-[0.2]"
            priority
          />
          <div className="absolute inset-0 bg-night/80" />
        </div>
        <div className="max-w-[1200px] w-full mx-auto px-6 relative z-10 text-center">
          <div className="page-hero-badge animate-fadeInUp">
            About Us
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6 animate-fadeInUp animate-delay-100 font-[var(--font-heading)]">
            Driving Africa&apos;s{" "}
            <span className="text-secondary">AI Revolution</span>
          </h1>
          <p className="text-lg md:text-xl text-white/80 max-w-[700px] mx-auto animate-fadeInUp animate-delay-200">
            We share our mission, values, history, and team to help you
            understand who we are, what we do, and why.
          </p>
        </div>
      </section>

      {/* ====== Intro: Africa Research Institute For AI ====== */}
      <section className="py-24 bg-white">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <RevealOnScroll delay={200} className="relative order-2 md:order-1">
              <div className="relative rounded-xl overflow-hidden aspect-[4/3] shadow-2xl">
                <Image
                  src="/images/about/about1.jpg"
                  alt="ARIFA researchers"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="absolute -right-8 -bottom-8 w-48 h-48 rounded-xl overflow-hidden border-8 border-white shadow-xl hidden md:block">
                <Image
                  src="/images/about/about2.jpg"
                  alt="ARIFA at work"
                  fill
                  className="object-cover"
                />
              </div>
            </RevealOnScroll>

            <RevealOnScroll className="order-1 md:order-2">
              <span className="block text-primary font-bold tracking-widest uppercase text-sm mb-4">
                Who We Are
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-ink font-[var(--font-heading)] leading-tight mb-6">
                Africa Research Institute For AI
              </h2>
              <div className="space-y-4 text-muted leading-relaxed text-justify">
                <p>
                  Africa Research Institute For AI (ARIFA),  is a pan-African
                  think tank united by a shared commitment to advancing impactful
                  research, training and advisory. ARIFA is specifically focused
                  on African Continent and seeks to foster innovation,
                  facilitate knowledge exchange, and drive evidence-based
                  policymaking to effectively tackle the dynamic challenges posed
                  by the rapid advancements in technology.
                </p>
                <p>
                  Rooted in its commitment to interdisciplinary research and
                  collaboration, ARIFA has emerged as a pivotal force within the
                  research and development (R&amp;D) sector. As a key player in
                  the renaissance of AI, ARIFA actively contributes to shaping the
                  future integration of AI and other emerging technologies into
                  the fabric of modern society.
                </p>
                <p>
                  Since its inception, ARIFA has been dedicated to fostering a
                  renaissance in AI, leveraging computational power and abundant
                  data to push the boundaries of real-world applications. Its
                  historic background stands as a testament to its founding
                  principles, serving as a foundation for growth, impact, and a
                  relentless pursuit of excellence in the ever-evolving fields of
                  AI and other Emerging Technologies.
                </p>
              </div>
              <Link
                href="/research/research-projects"
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-base font-semibold text-white transition-all hover:-translate-y-1"
              >
                Learn More <i className="fas fa-arrow-right text-xs" />
              </Link>
            </RevealOnScroll>
          </div>
        </div>
      </section>

      {/* ====== Mission / Vision / Values ====== */}
      <section className="pb-24 bg-white">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid gap-8 md:grid-cols-3">
            {MVV.map((item, idx) => (
              <RevealOnScroll
                key={item.title}
                delay={idx * 100}
                className="rounded-xl border border-line bg-white p-9 shadow-[0_10px_40px_rgba(0,0,0,0.04)] transition-shadow hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)]"
              >
                <div className="mb-7 flex h-16 w-16 items-center justify-center rounded-xl bg-primary/10 text-3xl text-primary">
                  <i className={item.icon} />
                </div>
                <h3 className="mb-4 text-2xl font-bold text-ink font-[var(--font-heading)]">
                  {item.title}
                </h3>
                <p className="leading-relaxed text-muted text-justify">
                  {item.text}
                </p>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* ====== Why Choose Us — skill bars ====== */}
      <section className="py-24 bg-[#f7f7f7]">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid gap-16 md:grid-cols-2 md:items-center">
            <RevealOnScroll className="relative">
              <div className="relative aspect-[4/5] overflow-hidden rounded-xl shadow-2xl">
                <Image
                  src="/images/about/about3.jpg"
                  alt="Africa Research Institute for AI"
                  fill
                  className="object-cover"
                />
              </div>
            </RevealOnScroll>

            <RevealOnScroll delay={150}>
              <span className="block text-primary font-bold tracking-widest uppercase text-sm mb-4">
                Why Choose Us
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-ink font-[var(--font-heading)] leading-tight mb-5">
                Africa Research Institute for AI
              </h2>
              <p className="mb-10 leading-relaxed text-muted text-justify">
                At Africa Research Institute for AI, we are committed to shaping
                the future of artificial intelligence on the continent through a
                holistic, ethical, and innovative approach. Here&apos;s why we
                stand out:
              </p>
              <div>
                {SKILLS.map((skill) => (
                  <SkillBar key={skill.label} label={skill.label} pct={skill.pct} />
                ))}
              </div>
            </RevealOnScroll>
          </div>
        </div>
      </section>

      {/* ====== CTA Section ====== */}
      <section className="py-20 bg-primary text-center">
        <div className="max-w-[800px] mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-white font-[var(--font-heading)] mb-6">
            Meet the Minds Behind ARIFA
          </h2>
          <p className="text-white/70 text-lg mb-10">
            Our success is driven by a passionate team of researchers, educators,
            and visionaries committed to Africa&apos;s technological advancement.
          </p>
          <Link
            href="/team"
            className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-secondary text-white rounded-full text-base font-semibold shadow-[0_8px_20px_rgba(0,0,0,0.24)] hover:-translate-y-1 transition-all"
          >
            View Our Team <i className="fas fa-arrow-right text-xs" />
          </Link>
        </div>
      </section>
    </>
  );
}
