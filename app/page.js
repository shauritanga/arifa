"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import SponsorMarquee from "./components/SponsorMarquee";
import { AiNetworkBg } from "@/components/ui/ai-network-bg";

const heroImages = [
  "/hero-bg.png",
  "/who-we-are-office.png",
  "/program-training.png",
];

const IMPACT_STATS = [
  { end: 100, label: "Researchers", full: "Expert Researchers" },
  { end: 40, label: "Papers", full: "Published Papers" },
  { end: 5000, label: "Trained", full: "Individuals Trained" },
  { end: 10, label: "Countries", full: "African Countries Reached" },
];

function AnimatedCounter({ end, duration = 2000 }) {
  const nodeRef = useRef(null);
  useEffect(() => {
    const node = nodeRef.current;
    if (!node) return;
    let startTime;
    let startValue = 0;
    let isVisible = false;
    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - (1 - progress) * (1 - progress);
      const current = Math.round(startValue + (end - startValue) * eased);
      node.textContent = current.toLocaleString("en-US") + "+";
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isVisible) {
          isVisible = true;
          requestAnimationFrame(animate);
          observer.disconnect();
        }
      },
      { threshold: 0.5 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [end, duration]);
  return <span ref={nodeRef}>0</span>;
}

function RevealOnScroll({ children, className = "", delay = 0 }) {
  const ref = useRef(null);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduceMotion) {
      node.classList.add("opacity-100", "translate-y-0");
      node.classList.remove("opacity-0", "translate-y-6");
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          entries[0].target.classList.add("opacity-100", "translate-y-0");
          entries[0].target.classList.remove("opacity-0", "translate-y-6");
          observer.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
    );
    observer.observe(node);
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

const focusAreas = [
  {
    icon: "fas fa-brain",
    title: "Artificial Intelligence",
    text: "Deep learning, natural language processing, and computer vision research tailored for African contexts and languages.",
  },
  {
    icon: "fas fa-database",
    title: "Data Science & Analytics",
    text: "Big data analysis, predictive modelling, and data-driven decision making for development challenges.",
  },
  {
    icon: "fas fa-shield-halved",
    title: "ICT & e-Governance",
    text: "Digital transformation, smart governance solutions, and technology-enabled public service delivery.",
  },
  {
    icon: "fas fa-seedling",
    title: "Smart Agriculture",
    text: "AI-powered solutions for precision farming, crop monitoring, and agricultural innovation across Africa.",
  },
];

const programs = [
  {
    image: "/program-certification.png",
    alt: "ARIFA certification graduates",
    badge: "Certification",
    title: "Certified Data Science Associate",
    text: "Comprehensive certification covering data analysis, machine learning, and statistical methods for aspiring data scientists.",
    duration: "12 Weeks",
    level: "Beginner-Int",
    href: "/training/certifications",
  },
  {
    image: "/program-training.png",
    alt: "Hands-on AI training workshop",
    badge: "Short Course",
    title: "Applied Machine Learning",
    text: "Hands-on course covering supervised and unsupervised learning, neural networks, and real-world AI applications.",
    duration: "6 Weeks",
    level: "Intermediate",
    href: "/training/short-courses",
  },
  {
    image: "/hero-bg.png",
    alt: "AI robotics and innovation workshop",
    badge: "Workshop",
    title: "AI & Robotics Innovation Lab",
    text: "Intensive workshop on robotics, computer vision, and AI-driven automation for industry applications.",
    duration: "4 Weeks",
    level: "Advanced",
    href: "/training/certifications",
  },
];

export default function Home() {
  const [currentImageIdx, setCurrentImageIdx] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIdx((prev) => (prev + 1) % heroImages.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* ====== Hero ====== */}
      <section
        id="hero"
        className="relative min-h-[100svh] flex items-center justify-center pt-28 pb-36 md:pb-44 overflow-hidden bg-night"
        style={{ color: "#ffffff" }}
      >
        <div className="absolute inset-0 z-0">
          {heroImages.map((src, idx) => (
            <Image
              key={src}
              src={src}
              alt={`ARIFA AI Background ${idx + 1}`}
              fill
              className={`object-cover object-center transition-opacity duration-1000 ${
                idx === currentImageIdx ? "opacity-100" : "opacity-0"
              }`}
              style={{
                filter: "brightness(0.42) saturate(0.75) contrast(1.05)",
              }}
              priority={idx === 0}
            />
          ))}
          {/* Light scrim — photo shows through; text relies on shadow + center darkening */}
          <div className="absolute inset-0 bg-night/45" />
          <div className="absolute inset-0 bg-gradient-to-b from-night/55 via-night/30 to-night/70" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_45%,rgba(0,0,0,0.28),transparent_72%)]" />
        </div>

        <div className="max-w-[1200px] w-full mx-auto px-6 relative z-10">
          <div className="max-w-[42rem] mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/25 bg-black/25 text-white text-xs font-semibold tracking-[0.14em] uppercase mb-7 animate-fadeInUp backdrop-blur-sm">
              Africa Research Institute for AI
            </div>
            <h1
              className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-bold leading-[1.15] mb-6 animate-fadeInUp animate-delay-100 font-[var(--font-heading)] tracking-[-0.03em]"
              style={{
                color: "#ffffff",
                textShadow:
                  "0 2px 4px rgba(0,0,0,0.55), 0 8px 28px rgba(0,0,0,0.45)",
              }}
            >
              <span style={{ color: "#ffffff" }}>Advancing </span>
              <span
                style={{
                  color: "#a8efc4",
                  textShadow:
                    "0 2px 4px rgba(0,0,0,0.5), 0 6px 20px rgba(0,0,0,0.35)",
                }}
              >
                Artificial Intelligence
              </span>
              <span style={{ color: "#ffffff" }}> Research for Africa</span>
            </h1>
            <p
              className="text-base md:text-lg leading-relaxed mb-10 max-w-[34rem] mx-auto animate-fadeInUp animate-delay-200"
              style={{
                color: "rgba(255,255,255,0.88)",
                textShadow: "0 1px 8px rgba(0,0,0,0.45)",
              }}
            >
              Driving innovation through cutting-edge research, world-class
              training programs, and strategic industry partnerships to shape
              Africa&apos;s AI future.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 animate-fadeInUp animate-delay-300">
              <Link
                href="/research/research-projects"
                className="btn-primary w-full sm:w-auto"
              >
                Explore Research
                <i className="fas fa-arrow-right text-xs opacity-80" />
              </Link>
              <Link
                href="/publications"
                className="btn-secondary w-full sm:w-auto"
              >
                Publications
              </Link>
            </div>
          </div>
        </div>

        {/* Single stats strip — desktop (overlapping hero) */}
        <div className="absolute bottom-0 left-0 right-0 z-20 translate-y-1/2 hidden md:block">
          <div className="max-w-[58rem] mx-auto px-6">
            <div className="bg-white rounded-xl border border-line shadow-[0_16px_48px_rgba(15,20,25,0.1)] grid grid-cols-4 divide-x divide-line">
              {IMPACT_STATS.map((stat) => (
                <div
                  key={stat.full}
                  className="text-center px-3 lg:px-5 py-6 lg:py-7"
                  title={stat.full}
                >
                  <div className="stat-value text-3xl lg:text-[2.35rem] text-primary">
                    <AnimatedCounter end={stat.end} />
                  </div>
                  <div className="stat-label mt-2 leading-snug px-1">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Single stats strip — mobile */}
      <div className="md:hidden bg-white border-b border-line">
        <div className="grid grid-cols-2 divide-x divide-y divide-line">
          {IMPACT_STATS.map((stat) => (
            <div
              key={stat.full}
              className="text-center px-3 py-5"
              title={stat.full}
            >
              <div className="stat-value text-2xl text-primary">
                <AnimatedCounter end={stat.end} />
              </div>
              <div className="stat-label mt-1.5 leading-snug">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ====== About ====== */}
      <section className="section-pad bg-canvas pt-20 md:pt-28">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-14 lg:gap-20 items-center">
            <RevealOnScroll className="relative">
              <div className="relative rounded-xl overflow-hidden aspect-[4/5] md:aspect-[5/6] border border-line shadow-[0_20px_50px_rgba(15,20,25,0.08)]">
                <Image
                  src="/who-we-are-office.png"
                  alt="ARIFA researchers in a collaborative workshop"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="absolute -bottom-5 -right-2 sm:right-4 bg-white px-5 py-4 rounded-lg border border-line shadow-lg max-w-[10.5rem]">
                <div className="text-2xl font-bold text-primary font-[var(--font-heading)] tracking-tight">
                  10+
                </div>
                <div className="text-xs font-semibold text-muted mt-1 uppercase tracking-wide">
                  Years of Impact
                </div>
              </div>
            </RevealOnScroll>

            <RevealOnScroll delay={150}>
              <span className="institute-eyebrow mb-4">Who We Are</span>
              <h2 className="text-3xl md:text-4xl font-bold text-ink font-[var(--font-heading)] leading-tight mb-5 tracking-[-0.02em] max-w-[22ch]">
                Shaping Africa&apos;s AI Future Through Research & Innovation
              </h2>
              <p className="text-base md:text-[1.0625rem] text-muted mb-8 leading-[1.75] prose-institute max-w-[38rem]">
                The Africa Research Institute for AI (ARIFA) is a pioneering
                institution dedicated to advancing artificial intelligence
                research, training, and innovation across the African continent.
                Based in Dar es Salaam, Tanzania, we bridge the gap between
                cutting-edge AI technology and Africa&apos;s unique challenges
                and opportunities.
              </p>
              <div className="space-y-5 mb-9 max-w-[36rem]">
                <div className="flex gap-4">
                  <div className="w-11 h-11 rounded-lg bg-primary/8 text-primary flex items-center justify-center shrink-0 border border-primary/10">
                    <i className="fas fa-microscope" />
                  </div>
                  <div>
                    <h4 className="text-base font-semibold text-ink font-[var(--font-heading)] mb-1">
                      Research Excellence
                    </h4>
                    <p className="text-muted text-sm leading-relaxed max-w-[32rem]">
                      Publishing impactful research in AI, data science, and
                      emerging technologies.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-11 h-11 rounded-lg bg-secondary/8 text-secondary flex items-center justify-center shrink-0 border border-secondary/10">
                    <i className="fas fa-graduation-cap" />
                  </div>
                  <div>
                    <h4 className="text-base font-semibold text-ink font-[var(--font-heading)] mb-1">
                      Capacity Building
                    </h4>
                    <p className="text-muted text-sm leading-relaxed max-w-[32rem]">
                      Training the next generation of AI professionals through
                      certifications and short courses.
                    </p>
                  </div>
                </div>
              </div>
              <Link href="/about" className="btn-outline">
                Learn More About Us
                <i className="fas fa-arrow-right text-xs opacity-70" />
              </Link>
            </RevealOnScroll>
          </div>
        </div>
      </section>

      {/* ====== Research Focus (visual peak) ====== */}
      <section
        id="our-focus"
        className="relative section-pad border-y border-line overflow-hidden bg-[#f3f1ec] py-24 md:py-32"
      >
        <AiNetworkBg />
        <div className="relative z-10 max-w-[1200px] mx-auto px-6">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-14">
            <div className="max-w-[36rem]">
              <span className="institute-eyebrow mb-3">Research</span>
              <h2 className="text-3xl md:text-[2.5rem] font-bold text-ink font-[var(--font-heading)] leading-tight mb-3 tracking-[-0.02em]">
                Research Focus Areas
              </h2>
              <p className="text-muted leading-relaxed max-w-[34rem]">
                We pursue impactful research across key domains where AI can
                transform Africa&apos;s future.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 shrink-0">
              <Link
                href="/research/research-projects"
                className="btn-primary text-sm !py-2.5 !px-4"
              >
                All projects
                <i className="fas fa-arrow-right text-[0.65em] opacity-80" />
              </Link>
              <Link
                href="/publications"
                className="btn-outline text-sm !py-2.5 !px-4"
              >
                Publications
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 lg:gap-6">
            {focusAreas.map((area, i) => (
              <RevealOnScroll
                key={area.title}
                delay={i * 70}
                className="institute-card p-7 md:p-8 h-full flex flex-col bg-white shadow-[0_10px_36px_rgba(15,20,25,0.07)] border-line hover:border-primary/25"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/8 text-primary flex items-center justify-center text-xl shrink-0 border border-primary/10">
                    <i className={area.icon} />
                  </div>
                  <div className="pt-1">
                    <span className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-muted">
                      Focus 0{i + 1}
                    </span>
                    <h3 className="text-xl font-semibold text-ink font-[var(--font-heading)] mt-0.5 tracking-[-0.01em]">
                      {area.title}
                    </h3>
                  </div>
                </div>
                <p className="text-[0.9375rem] text-muted leading-relaxed mb-6 flex-grow max-w-[36rem]">
                  {area.text}
                </p>
                <Link
                  href="/research/research-projects"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary-dark"
                >
                  Explore related work
                  <i className="fas fa-arrow-right text-[0.7em]" />
                </Link>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* ====== Programs (quieter support section) ====== */}
      <section className="py-16 md:py-20 bg-canvas border-b border-line">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
            <div className="max-w-[32rem]">
              <span className="institute-eyebrow mb-2 text-[0.7rem]">
                Programs
              </span>
              <h2 className="text-2xl md:text-3xl font-bold text-ink font-[var(--font-heading)] leading-tight tracking-[-0.02em]">
                Training & Certifications
              </h2>
              <p className="text-muted text-sm md:text-base leading-relaxed mt-2 max-w-[30rem]">
                Build your AI career with our industry-recognized certification
                programs and hands-on short courses.
              </p>
            </div>
            <Link
              href="/training/certifications"
              className="text-sm font-semibold text-primary hover:text-primary-dark inline-flex items-center gap-2 shrink-0"
            >
              View all programs
              <i className="fas fa-arrow-right text-[0.7em]" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
            {programs.map((program, i) => (
              <RevealOnScroll key={program.title} delay={i * 70} className="h-full">
                <Link
                  href={program.href}
                  className="group block h-full rounded-lg border border-line bg-white overflow-hidden transition-all hover:border-line-strong hover:shadow-[0_6px_20px_rgba(15,20,25,0.05)]"
                >
                  <div className="relative h-36 overflow-hidden bg-surface-warm">
                    <Image
                      src={program.image}
                      alt={program.alt}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-[1.03] opacity-95"
                    />
                    <div className="absolute top-2.5 left-2.5 px-2 py-0.5 bg-white/95 border border-line rounded text-[0.6rem] font-semibold text-muted uppercase tracking-wide">
                      {program.badge}
                    </div>
                  </div>
                  <div className="p-4 md:p-5 flex flex-col flex-grow">
                    <h3 className="text-base font-semibold text-ink font-[var(--font-heading)] mb-1.5 group-hover:text-primary transition-colors leading-snug">
                      {program.title}
                    </h3>
                    <p className="text-xs text-muted leading-relaxed mb-4 flex-grow line-clamp-2">
                      {program.text}
                    </p>
                    <div className="flex gap-3 border-t border-line pt-3">
                      <span className="text-[0.7rem] font-medium text-subtle flex items-center gap-1">
                        <i className="fas fa-clock text-secondary/80 text-[0.65em]" />{" "}
                        {program.duration}
                      </span>
                      <span className="text-[0.7rem] font-medium text-subtle flex items-center gap-1">
                        <i className="fas fa-signal text-secondary/80 text-[0.65em]" />{" "}
                        {program.level}
                      </span>
                    </div>
                  </div>
                </Link>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* ====== Closing CTA (no repeated stats) ====== */}
      <section
        className="section-pad bg-night relative overflow-hidden"
        style={{ color: "#ffffff" }}
      >
        <div className="absolute inset-0 opacity-[0.12] pointer-events-none">
          <Image
            src="/hero-bg.png"
            alt=""
            fill
            className="object-cover grayscale"
            aria-hidden="true"
          />
        </div>
        <div className="absolute inset-0 bg-night/80 pointer-events-none" />
        <div className="relative z-10 max-w-[40rem] mx-auto px-6 text-center">
          <span
            className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.14em] uppercase mb-4"
            style={{ color: "#a8efc4" }}
          >
            <span className="w-4 h-px" style={{ background: "#a8efc4" }} />
            Join ARIFA
          </span>
          <h2
            className="text-2xl md:text-3xl font-bold font-[var(--font-heading)] mb-4 tracking-[-0.02em]"
            style={{
              color: "#ffffff",
              textShadow: "0 2px 12px rgba(0,0,0,0.4)",
            }}
          >
            Ready to Shape Africa&apos;s AI Future?
          </h2>
          <p
            className="text-base md:text-lg mb-8 leading-relaxed max-w-[32rem] mx-auto"
            style={{ color: "rgba(255,255,255,0.85)" }}
          >
            Whether you&apos;re a researcher, student, or industry partner,
            there&apos;s a place for you at ARIFA. Join us in building
            Africa&apos;s AI ecosystem.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/research/research-projects"
              className="btn-primary w-full sm:w-auto"
            >
              Explore Research
              <i className="fas fa-arrow-right text-xs opacity-80" />
            </Link>
            <Link
              href="/contact-us"
              className="btn-secondary w-full sm:w-auto"
            >
              Get in Touch
            </Link>
          </div>
        </div>
      </section>

      <SponsorMarquee />
    </>
  );
}
