"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";

function RevealOnScroll({ children, className = "", delay = 0 }) {
  const ref = useRef(null);
  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduceMotion) {
      node.classList.add("opacity-100", "translate-y-0");
      node.classList.remove("opacity-0", "translate-y-6");
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          entries[0].target.classList.add("opacity-100", "translate-y-0");
          entries[0].target.classList.remove("opacity-0", "translate-y-6");
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" },
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

function ProjectCard({ project }) {
  return (
    <Link
      href={`/research/research-projects/${project.id}`}
      className="group block h-full"
    >
      <article className="relative flex h-full flex-col overflow-hidden rounded-xl border border-line bg-white transition-all duration-300 hover:-translate-y-1 hover:border-primary/20 hover:shadow-[0_12px_32px_rgba(15,20,25,0.07)]">
        <div className="relative h-48 w-full shrink-0 overflow-hidden bg-surface-warm">
          <Image
            src={project.image || "/hero-bg.png"}
            alt={project.title}
            fill
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute top-3 left-3 z-20 flex max-w-[90%] flex-wrap gap-1.5">
            <span className="rounded border border-line bg-white/95 px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-wider text-ink">
              {project.category
                ? project.category.replace(/ Project$/i, "")
                : "Research"}
            </span>
          </div>
        </div>

        <div className="flex flex-1 flex-col p-6">
          {project.dateRange ? (
            <p className="mb-2 inline-flex items-center gap-1.5 text-xs font-medium text-muted">
              <i className="fas fa-calendar-alt text-primary/80 text-[0.65em]" aria-hidden="true" />
              {project.dateRange}
            </p>
          ) : null}

          <h3 className="mb-3 min-h-[4.5rem] font-[var(--font-heading)] text-lg font-semibold leading-snug tracking-[-0.01em] text-ink line-clamp-3 transition-colors group-hover:text-primary">
            {project.title}
          </h3>

          <div className="mb-4 h-0.5 w-8 bg-primary/30 transition-all duration-300 group-hover:w-12 group-hover:bg-primary" />

          <p className="mb-6 min-h-[4.5rem] flex-1 text-sm leading-relaxed text-muted line-clamp-3">
            {project.excerpt ||
              "Explore this ARIFA research initiative and its impact across Africa."}
          </p>

          <div className="mt-auto flex items-center border-t border-line pt-4">
            <span className="inline-flex items-center gap-2 text-sm font-semibold text-ink transition-colors group-hover:text-primary">
              Read Project Details
              <i className="fas fa-arrow-right text-xs transition-transform group-hover:translate-x-1" />
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}

export default function ResearchProjects({ projects = [] }) {
  return (
    <div className="min-h-screen bg-white">
      <section className="page-hero flex min-h-[42vh] flex-col justify-center">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 z-10 bg-night/80" />
          <Image
            src="/hero-bg.png"
            alt=""
            fill
            className="object-cover object-center opacity-30 grayscale-[0.2]"
            priority
            aria-hidden="true"
          />
        </div>
        <div className="relative z-10 mx-auto w-full max-w-[1200px] px-6 text-center">
          <RevealOnScroll>
            <span className="page-hero-badge mb-6">Discover Our Work</span>
          </RevealOnScroll>
          <RevealOnScroll delay={100}>
            <h1 className="mb-6 font-[var(--font-heading)] text-4xl font-bold leading-tight text-white md:text-6xl lg:text-7xl">
              Research <span className="text-[#8fd4aa]">Projects</span>
            </h1>
          </RevealOnScroll>
          <RevealOnScroll delay={200}>
            <p className="mx-auto max-w-3xl text-lg leading-relaxed text-white/70 md:text-xl">
              Exploring the frontiers of Artificial Intelligence across Africa.
              Discover our initiatives in AI policy, agriculture, healthcare,
              and sustainable development.
            </p>
          </RevealOnScroll>
        </div>
        <div className="absolute bottom-0 left-0 z-10 w-full overflow-hidden leading-none">
          <svg
            className="relative block h-[50px] w-full"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path
              d="M1200 120L0 120 0 0 1200 0 1200 120z"
              fill="#FFFFFF"
              opacity="0.1"
            />
            <path d="M0 120h1200V0C936.56 120 263.44 120 0 0v120z" fill="#FFFFFF" />
          </svg>
        </div>
      </section>

      <section className="bg-canvas py-16 md:py-24">
        <div className="mx-auto max-w-[1200px] px-6">
          {projects.length === 0 ? (
            <p className="py-16 text-center text-muted">
              Research projects will appear here once published.
            </p>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {projects.map((project, idx) => (
                <RevealOnScroll
                  key={project.id}
                  delay={(idx % 3) * 80}
                  className="h-full"
                >
                  <ProjectCard project={project} />
                </RevealOnScroll>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
