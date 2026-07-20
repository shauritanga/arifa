"use client";

import Image from "next/image";
import { useEffect, useId, useRef, useState } from "react";
import ApplicationModal from "@/app/components/ApplicationModal";
import SafeHtml from "@/components/ui/safe-html";

/** Detect CMS HTML vs legacy plain-text job details. */
function looksLikeHtml(value) {
  return typeof value === "string" && /<\/?[a-z][\s\S]*>/i.test(value);
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

/** Fallback images when a job has no uploaded cover (cycles by index). */
const JOB_IMAGE_FALLBACKS = [
  "/who-we-are-office.png",
  "/about-img.png",
  "/program-training.png",
];

function JobCard({ job, index }) {
  const [open, setOpen] = useState(false);
  const [applyOpen, setApplyOpen] = useState(false);
  const panelId = useId();

  const imageSrc =
    job.image || JOB_IMAGE_FALLBACKS[index % JOB_IMAGE_FALLBACKS.length];

  const meta = [
    job.department && { icon: "fas fa-building", label: job.department },
    job.location && { icon: "fas fa-map-marker-alt", label: job.location },
    job.type && { icon: "fas fa-clock", label: job.type },
  ].filter(Boolean);

  return (
    <RevealOnScroll delay={index * 80}>
      <article
        className={`overflow-hidden rounded-xl border bg-white transition-all duration-300 ${
          open
            ? "border-primary/25 shadow-[0_16px_40px_rgba(15,20,25,0.08)]"
            : "border-line shadow-[0_1px_2px_rgba(15,20,25,0.04)] hover:border-primary/20 hover:shadow-[0_12px_32px_rgba(15,20,25,0.06)]"
        }`}
      >
        {/* Image left · content right (stacks on small screens) */}
        <div className="flex flex-col sm:flex-row">
          <div className="relative h-44 w-full shrink-0 overflow-hidden bg-surface-alt sm:h-auto sm:w-[220px] md:w-[260px]">
            <Image
              src={imageSrc}
              alt=""
              fill
              className="object-cover object-center"
              sizes="(max-width: 640px) 100vw, 260px"
              aria-hidden="true"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-night/25 to-transparent sm:bg-gradient-to-r sm:from-transparent sm:to-night/5" />
          </div>

          <div className="min-w-0 flex-1">
            <div className="p-6 md:p-8">
              {/* Meta chips */}
              {meta.length > 0 && (
                <div className="mb-4 flex flex-wrap items-center gap-2">
                  {meta.map((item) => (
                    <span
                      key={item.label}
                      className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface-alt px-2.5 py-1 text-xs font-medium text-muted"
                    >
                      <i
                        className={`${item.icon} text-[0.65rem] text-secondary`}
                      />
                      {item.label}
                    </span>
                  ))}
                </div>
              )}

              {/* Title */}
              <h3 className="text-xl md:text-2xl font-bold text-ink font-[var(--font-heading)] tracking-[-0.02em] leading-snug">
                {job.title}
              </h3>

              {/* Short description */}
              {job.shortDesc ? (
                <p className="mt-3 text-sm md:text-base text-muted leading-relaxed max-w-3xl text-justify">
                  {job.shortDesc}
                </p>
              ) : null}

              {/* Actions — left-aligned; top Apply only when collapsed */}
              <div className="mt-6 flex flex-wrap items-center justify-start gap-3">
                <button
                  type="button"
                  onClick={() => setOpen((v) => !v)}
                  aria-expanded={open}
                  aria-controls={panelId}
                  className="inline-flex items-center justify-center gap-2 rounded-md border border-line bg-white px-4 py-2.5 text-sm font-semibold text-ink transition-colors hover:border-ink/30 hover:bg-surface-alt focus:outline-none focus-visible:ring-4 focus-visible:ring-primary/15"
                >
                  {open ? "Hide details" : "View more"}
                  <i
                    className={`fas fa-chevron-down text-[0.65em] text-muted transition-transform duration-300 ${
                      open ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {!open && (
                  <button
                    type="button"
                    onClick={() => setApplyOpen(true)}
                    className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary-light focus:outline-none focus-visible:ring-4 focus-visible:ring-primary/25"
                  >
                    Apply now
                    <i className="fas fa-arrow-right text-[0.7em] opacity-90" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Expandable details — full width under the image+summary row */}
        <div
          id={panelId}
          className={`grid transition-[grid-template-rows] duration-300 ease-out ${
            open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
          }`}
        >
          <div className="overflow-hidden">
            <div className="border-t border-line px-6 pb-6 pt-5 md:px-8 md:pb-8 md:pt-6 sm:pl-[calc(220px+1.5rem)] md:pl-[calc(260px+2rem)]">
              <div className="mb-3 flex items-center gap-2">
                <span className="h-px w-6 bg-primary" />
                <h4 className="text-xs font-semibold uppercase tracking-[0.12em] text-primary">
                  Role details
                </h4>
              </div>
              {job.details ? (
                looksLikeHtml(job.details) ? (
                  <SafeHtml
                    className="job-details max-w-3xl text-sm md:text-base text-ink-soft leading-relaxed [&_h2]:mt-5 [&_h2]:mb-2 [&_h2]:text-base [&_h2]:font-bold [&_h2]:text-ink [&_h2]:font-[var(--font-heading)] [&_h3]:mt-5 [&_h3]:mb-2 [&_h3]:text-sm [&_h3]:font-bold [&_h3]:uppercase [&_h3]:tracking-[0.06em] [&_h3]:text-primary [&_h4]:mt-4 [&_h4]:mb-1.5 [&_h4]:text-sm [&_h4]:font-semibold [&_h4]:text-ink [&_p]:mb-3 [&_p:last-child]:mb-0 [&_ul]:mb-4 [&_ul]:list-none [&_ul]:space-y-2 [&_ul]:pl-0 [&_ol]:mb-4 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:relative [&_li]:pl-6 [&_ul>li]:before:absolute [&_ul>li]:before:left-0 [&_ul>li]:before:top-[0.55em] [&_ul>li]:before:h-1.5 [&_ul>li]:before:w-1.5 [&_ul>li]:before:rounded-full [&_ul>li]:before:bg-primary [&_strong]:font-semibold [&_strong]:text-ink [&_a]:font-semibold [&_a]:text-primary [&_a]:underline"
                    html={job.details}
                  />
                ) : (
                  <div className="max-w-3xl whitespace-pre-line text-sm md:text-base leading-relaxed text-ink-soft">
                    {job.details}
                  </div>
                )
              ) : (
                <p className="text-sm text-muted text-justify">
                  Full role details will be shared during the application
                  process. Reach out if you would like more information.
                </p>
              )}

              <div className="mt-6">
                <button
                  type="button"
                  onClick={() => setApplyOpen(true)}
                  className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-light"
                >
                  Apply for this role
                </button>
              </div>
            </div>
          </div>
        </div>
      </article>

      <ApplicationModal
        isOpen={applyOpen}
        onClose={() => setApplyOpen(false)}
        courseTitle={job.title}
        courseImage={imageSrc}
      />
    </RevealOnScroll>
  );
}

export default function Careers({ jobs }) {
  return (
    <>
      <section className="page-hero">
        <div className="absolute inset-0 z-0">
          <Image
            src="/hero-bg.png"
            alt=""
            fill
            className="object-cover object-center opacity-30 grayscale-[0.2]"
            priority
            aria-hidden="true"
          />
          <div className="absolute inset-0 bg-night/80" />
        </div>
        <div className="max-w-[1200px] w-full mx-auto px-6 relative z-10 text-center">
          <div className="page-hero-badge animate-fadeInUp">Opportunities</div>
          <h1
            className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 animate-fadeInUp animate-delay-100 font-[var(--font-heading)]"
            style={{ color: "#ffffff" }}
          >
            Careers at <span style={{ color: "#8fd4aa" }}>ARIFA</span>
          </h1>
          <p className="text-lg md:text-xl text-white/80 max-w-[700px] mx-auto animate-fadeInUp animate-delay-200">
            Join our team of researchers, educators, and innovators dedicated to
            shaping the future of artificial intelligence in Africa.
          </p>
        </div>
      </section>

      <section className="py-20 md:py-24 bg-canvas min-h-[50vh]">
        <div className="max-w-[960px] mx-auto px-6">
          <div className="mb-12 max-w-[36rem]">
            <span className="institute-eyebrow mb-3">Open positions</span>
            <h2 className="text-2xl md:text-3xl font-bold text-ink font-[var(--font-heading)] tracking-[-0.02em] mb-3">
              Work with us
            </h2>
            <p className="text-muted leading-relaxed text-justify">
              We are always looking for exceptional talent. If you don&apos;t
              see a role that fits but believe you belong at ARIFA, please send
              us your CV anyway.
            </p>
          </div>

          {jobs.length === 0 ? (
            <div className="rounded-xl border border-line bg-white px-8 py-16 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/8 text-primary">
                <i className="fas fa-briefcase" />
              </div>
              <p className="text-ink font-semibold mb-2">No open roles right now</p>
              <p className="text-sm text-muted max-w-sm mx-auto">
                Check back soon, or contact us to introduce yourself.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {jobs.map((job, idx) => (
                <JobCard key={job.id || job.title || idx} job={job} index={idx} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
