"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import SponsorMarquee from "./components/SponsorMarquee";

const heroImages = [
  "/hero-bg.png",
  "/who-we-are-office.png",
  "/program-training.png",
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
      node.textContent = current + "+";
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
        className="relative min-h-[100svh] flex items-center justify-center pt-28 pb-36 md:pb-40 overflow-hidden bg-night"
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
                filter: "brightness(0.38) saturate(0.7) contrast(1.05)",
              }}
              priority={idx === 0}
            />
          ))}
          <div className="absolute inset-0 bg-gradient-to-b from-night/70 via-night/55 to-night/85" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_0%,rgba(139,0,0,0.22),transparent_65%)]" />
        </div>

        <div className="max-w-[1200px] w-full mx-auto px-6 relative z-10">
          <div className="max-w-[44rem] mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/15 bg-white/6 text-white/80 text-xs font-semibold tracking-[0.14em] uppercase mb-7 animate-fadeInUp">
              Africa Research Institute for AI
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-bold text-white leading-[1.12] mb-6 animate-fadeInUp animate-delay-100 font-[var(--font-heading)] tracking-[-0.03em]">
              Advancing{" "}
              <span className="text-[#8fd4aa]">Artificial Intelligence</span>{" "}
              Research for Africa
            </h1>
            <p className="text-base md:text-lg text-white/70 leading-relaxed mb-10 max-w-[36rem] mx-auto animate-fadeInUp animate-delay-200">
              Driving innovation through cutting-edge research, world-class
              training programs, and strategic industry partnerships to shape
              Africa&apos;s AI future.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 animate-fadeInUp animate-delay-300">
              <Link href="/research/research-projects" className="btn-primary w-full sm:w-auto">
                Explore Research
                <i className="fas fa-arrow-right text-xs opacity-80" />
              </Link>
              <Link href="/training/certifications" className="btn-secondary w-full sm:w-auto">
                Our Programs
              </Link>
            </div>
          </div>
        </div>

        {/* Stats bar — desktop */}
        <div className="absolute bottom-0 left-0 right-0 z-20 translate-y-1/2 hidden md:block">
          <div className="max-w-[56rem] mx-auto px-6">
            <div className="bg-white rounded-xl border border-line shadow-[0_16px_48px_rgba(15,20,25,0.1)] grid grid-cols-4 divide-x divide-line">
              {[
                { end: 15, label: "Researchers" },
                { end: 20, label: "Publications" },
                { end: 5, label: "Countries" },
                { end: 500, label: "Trainees" },
              ].map((stat) => (
                <div key={stat.label} className="text-center px-4 py-7">
                  <div className="stat-value text-3xl lg:text-4xl text-primary">
                    <AnimatedCounter end={stat.end} />
                  </div>
                  <div className="stat-label">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Mobile stats */}
      <div className="md:hidden bg-white border-b border-line">
        <div className="grid grid-cols-2 divide-x divide-y divide-line">
          {[
            { end: 15, label: "Researchers" },
            { end: 20, label: "Publications" },
            { end: 5, label: "Countries" },
            { end: 500, label: "Trainees" },
          ].map((stat) => (
            <div key={stat.label} className="text-center px-4 py-5">
              <div className="stat-value text-2xl text-primary">
                <AnimatedCounter end={stat.end} />
              </div>
              <div className="stat-label">{stat.label}</div>
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
              <h2 className="text-3xl md:text-4xl font-bold text-ink font-[var(--font-heading)] leading-tight mb-5 tracking-[-0.02em]">
                Shaping Africa&apos;s AI Future Through Research & Innovation
              </h2>
              <p className="text-base md:text-lg text-muted mb-8 leading-relaxed prose-institute">
                The Africa Research Institute for AI (ARIFA) is a pioneering
                institution dedicated to advancing artificial intelligence
                research, training, and innovation across the African continent.
                Based in Dar es Salaam, Tanzania, we bridge the gap between
                cutting-edge AI technology and Africa&apos;s unique challenges
                and opportunities.
              </p>
              <div className="space-y-5 mb-9">
                <div className="flex gap-4">
                  <div className="w-11 h-11 rounded-lg bg-primary/8 text-primary flex items-center justify-center shrink-0 border border-primary/10">
                    <i className="fas fa-microscope" />
                  </div>
                  <div>
                    <h4 className="text-base font-semibold text-ink font-[var(--font-heading)] mb-1">
                      Research Excellence
                    </h4>
                    <p className="text-muted text-sm leading-relaxed">
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
                    <p className="text-muted text-sm leading-relaxed">
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

      {/* ====== Research Focus Areas ====== */}
      <section id="our-focus" className="section-pad section-muted border-y border-line">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="max-w-[36rem] mb-14">
            <span className="institute-eyebrow mb-3">Our Focus</span>
            <h2 className="text-3xl md:text-4xl font-bold text-ink font-[var(--font-heading)] leading-tight mb-3 tracking-[-0.02em]">
              Research Focus Areas
            </h2>
            <p className="text-muted leading-relaxed">
              We pursue impactful research across key domains where AI can
              transform Africa&apos;s future.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {focusAreas.map((area, i) => (
              <RevealOnScroll
                key={area.title}
                delay={i * 80}
                className="institute-card p-6 h-full flex flex-col"
              >
                <div className="w-11 h-11 rounded-lg bg-surface-alt text-primary flex items-center justify-center text-lg mb-5 border border-line">
                  <i className={area.icon} />
                </div>
                <h3 className="text-lg font-semibold text-ink font-[var(--font-heading)] mb-2.5">
                  {area.title}
                </h3>
                <p className="text-sm text-muted leading-relaxed mb-6 flex-grow">
                  {area.text}
                </p>
                <Link
                  href="/research/research-projects"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary-dark"
                >
                  Learn more
                  <i className="fas fa-arrow-right text-[0.7em]" />
                </Link>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* ====== Programs ====== */}
      <section className="section-pad bg-canvas">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="max-w-[36rem] mb-14">
            <span className="institute-eyebrow mb-3">Programs</span>
            <h2 className="text-3xl md:text-4xl font-bold text-ink font-[var(--font-heading)] leading-tight mb-3 tracking-[-0.02em]">
              Training & Certifications
            </h2>
            <p className="text-muted leading-relaxed">
              Build your AI career with our industry-recognized certification
              programs and hands-on short courses.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {programs.map((program, i) => (
              <RevealOnScroll key={program.title} delay={i * 90} className="h-full">
                <Link
                  href={program.href}
                  className="institute-card overflow-hidden h-full flex flex-col group block"
                >
                  <div className="relative h-48 overflow-hidden bg-surface-warm">
                    <Image
                      src={program.image}
                      alt={program.alt}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                    />
                    <div className="absolute top-3 left-3 px-2.5 py-1 bg-white/95 border border-line rounded text-[0.65rem] font-semibold text-primary uppercase tracking-wide">
                      {program.badge}
                    </div>
                  </div>
                  <div className="p-6 flex flex-col flex-grow">
                    <h3 className="text-lg font-semibold text-ink font-[var(--font-heading)] mb-2 group-hover:text-primary transition-colors">
                      {program.title}
                    </h3>
                    <p className="text-sm text-muted leading-relaxed mb-5 flex-grow">
                      {program.text}
                    </p>
                    <div className="flex gap-4 border-t border-line pt-4">
                      <span className="text-xs font-medium text-muted flex items-center gap-1.5">
                        <i className="fas fa-clock text-secondary text-[0.75em]" />{" "}
                        {program.duration}
                      </span>
                      <span className="text-xs font-medium text-muted flex items-center gap-1.5">
                        <i className="fas fa-signal text-secondary text-[0.75em]" />{" "}
                        {program.level}
                      </span>
                    </div>
                  </div>
                </Link>
              </RevealOnScroll>
            ))}
          </div>

          <div>
            <Link href="/training/certifications" className="btn-outline">
              View All Programs
              <i className="fas fa-arrow-right text-xs opacity-70" />
            </Link>
          </div>
        </div>
      </section>

      {/* ====== Impact Stats ====== */}
      <section className="relative section-pad bg-night overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/hero-bg.png"
            alt=""
            fill
            className="object-cover object-center opacity-[0.12] grayscale"
            aria-hidden="true"
          />
          <div className="absolute inset-0 bg-night/80" />
        </div>
        <div className="max-w-[1200px] mx-auto px-6 relative z-10">
          <div className="max-w-[36rem] mb-14">
            <span className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.14em] uppercase text-[#8fd4aa] mb-3">
              <span className="w-4 h-px bg-[#8fd4aa]" />
              Our Impact
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-white font-[var(--font-heading)] leading-tight tracking-[-0.02em]">
              Making a Difference Across Africa
            </h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-4">
            {[
              { end: 15, label: "Expert Researchers" },
              { end: 20, label: "Published Papers" },
              { end: 500, label: "Professionals Trained" },
              { end: 5, label: "Partner Countries" },
            ].map((stat) => (
              <div key={stat.label} className="lg:border-l lg:border-white/10 lg:pl-8 first:lg:border-0 first:lg:pl-0">
                <div className="text-4xl md:text-5xl font-bold text-white font-[var(--font-heading)] mb-2 tracking-tight">
                  <AnimatedCounter end={stat.end} />
                </div>
                <div className="text-xs md:text-sm font-medium text-white/50 uppercase tracking-[0.1em]">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ====== CTA Section ====== */}
      <section className="section-pad bg-canvas">
        <div className="max-w-[52rem] mx-auto px-6">
          <div className="rounded-xl p-10 md:p-14 text-center border border-line bg-white shadow-[0_8px_40px_rgba(15,20,25,0.04)] relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-primary via-primary to-secondary" />
            <h2 className="text-2xl md:text-3xl font-bold text-ink font-[var(--font-heading)] mb-4 tracking-[-0.02em]">
              Ready to Shape Africa&apos;s AI Future?
            </h2>
            <p className="text-muted text-base md:text-lg mb-8 max-w-[32rem] mx-auto leading-relaxed">
              Whether you&apos;re a researcher, student, or industry partner,
              there&apos;s a place for you at ARIFA. Join us in building
              Africa&apos;s AI ecosystem.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/training/certifications"
                className="btn-primary w-full sm:w-auto !bg-secondary hover:!bg-secondary-light"
              >
                Start Learning
                <i className="fas fa-graduation-cap text-xs opacity-80" />
              </Link>
              <Link href="/contact-us" className="btn-ghost-dark w-full sm:w-auto">
                Get in Touch
              </Link>
            </div>
          </div>
        </div>
      </section>

      <SponsorMarquee />
    </>
  );
}
