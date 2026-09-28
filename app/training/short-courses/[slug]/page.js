import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { feeInShillings, getCourse } from "@/lib/courses";
import {
  formatShillings,
  formatUsd,
  usdFromShillings,
} from "@/lib/currency";
import SafeHtml from "@/components/ui/safe-html";
import EnrollForm from "./enroll-form";
import ShareBar from "../../masterclass/share-bar";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const course = await getCourse(slug);
  if (!course) return { title: "Short Course | ARIFA" };
  return {
    title: `Enroll — ${course.title} | ARIFA`,
    description: course.desc || `Enroll in ${course.title} at ARIFA.`,
  };
}

const DETAILS_PROSE_CLASSES =
  "text-[0.95rem] leading-relaxed text-ink-soft [&_h2]:mt-8 [&_h2]:mb-3 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-ink [&_h2]:font-[var(--font-heading)] [&_h2:first-child]:mt-0 [&_h3]:mt-6 [&_h3]:mb-2 [&_h3]:text-base [&_h3]:font-bold [&_h3]:text-ink [&_h4]:mt-4 [&_h4]:mb-1.5 [&_h4]:text-sm [&_h4]:font-semibold [&_h4]:text-ink [&_p]:mb-3 [&_ul]:mb-4 [&_ul]:list-none [&_ul]:space-y-2 [&_ul]:pl-0 [&_ol]:mb-4 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:space-y-1.5 [&_li]:relative [&_li]:pl-6 [&_ul>li]:before:absolute [&_ul>li]:before:left-0 [&_ul>li]:before:top-[0.55em] [&_ul>li]:before:h-1.5 [&_ul>li]:before:w-1.5 [&_ul>li]:before:rounded-full [&_ul>li]:before:bg-primary [&_strong]:font-semibold [&_strong]:text-ink [&_a]:font-semibold [&_a]:text-primary [&_a]:underline";

const TUTORS_PROSE_CLASSES =
  "course-tutors text-[0.95rem] leading-relaxed text-ink-soft [&_h3]:mb-1 [&_h3]:text-lg [&_h3]:font-bold [&_h3]:text-ink [&_h4]:mb-2 [&_h4]:text-sm [&_h4]:font-semibold [&_h4]:text-muted [&_p]:mb-3 [&_strong]:font-semibold [&_strong]:text-ink [&_a]:font-semibold [&_a]:text-primary [&_a]:underline";

export default async function ShortCourseEnrollPage({ params }) {
  const { slug } = await params;
  const course = await getCourse(slug);
  if (!course) notFound();

  const fee = feeInShillings(course);
  const path = `/training/short-courses/${course.id}`;

  const facts = [
    course.date && {
      icon: "fa-regular fa-calendar-days",
      label: "Date",
      value: course.date,
    },
    course.location && {
      icon: "fa-solid fa-location-dot",
      label: "Format",
      value: course.location,
    },
    course.certificate && {
      icon: "fa-solid fa-certificate",
      label: "Certificate",
      value: course.certificate,
    },
  ].filter(Boolean);

  return (
    <section className="bg-white pt-32 pb-24">
      <div className="mx-auto max-w-[1200px] px-6">
        <Link
          href="/training/short-courses"
          className="mb-8 inline-flex items-center gap-2 text-sm font-bold text-primary"
        >
          <i className="fas fa-arrow-left text-xs" /> All short courses
        </Link>

        <div className="max-w-[720px]">
          <div className="text-xs font-bold uppercase tracking-[2px] text-primary">
            Short Course
          </div>
          <h1 className="mt-2 text-3xl font-bold text-ink font-[var(--font-heading)] md:text-4xl">
            {course.title}
          </h1>
          {course.desc && (
            <p className="mt-4 text-lg leading-relaxed text-muted">
              {course.desc}
            </p>
          )}
        </div>

        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_360px] lg:items-start">
          {/* Buy box: shows first on mobile (before the long read), sits as a
              sticky sidebar once there is room for two columns. */}
          <aside className="order-1 lg:order-2 lg:sticky lg:top-28">
            <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-[0_10px_40px_rgba(0,0,0,0.08)]">
              <div className="relative h-[170px] w-full bg-gradient-to-br from-primary to-night">
                {course.image ? (
                  <Image
                    src={course.image}
                    alt={course.title}
                    fill
                    sizes="360px"
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <i className="fa-solid fa-graduation-cap text-4xl text-white/60" />
                  </div>
                )}
              </div>

              <div className="p-6">
                <p className="text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-muted">
                  Fee
                </p>
                <p className="mt-1 text-3xl font-bold leading-tight text-ink">
                  {course.price
                    ? course.price
                    : usdFromShillings(fee) != null
                      ? formatUsd(usdFromShillings(fee))
                      : "Contact us"}
                </p>
                {!course.price && fee != null && (
                  <p className="mt-0.5 text-xs font-medium text-black/50">
                    Charged as {formatShillings(fee)}
                  </p>
                )}

                <div className="mt-5">
                  {fee == null ? (
                    <Link
                      href="/contact-us"
                      className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3.5 font-bold text-white transition-all hover:-translate-y-0.5"
                    >
                      Contact us to enroll
                      <i className="fas fa-arrow-right text-xs" />
                    </Link>
                  ) : (
                    <a
                      href="#enroll"
                      className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3.5 font-bold text-white transition-all hover:-translate-y-0.5"
                    >
                      Enroll now
                    </a>
                  )}
                </div>

                {facts.length > 0 && (
                  <ul className="mt-6 space-y-3 border-t border-line pt-5">
                    {facts.map((f) => (
                      <li
                        key={f.label}
                        className="flex items-start gap-2.5 text-sm text-ink-soft"
                      >
                        <i
                          className={`${f.icon} mt-0.5 w-4 shrink-0 text-primary`}
                          aria-hidden="true"
                        />
                        <span>
                          <span className="font-semibold text-ink">
                            {f.label}:
                          </span>{" "}
                          {f.value}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}

                <div className="mt-6 border-t border-line pt-5">
                  <ShareBar
                    compact
                    path={path}
                    title={`${course.title} | ARIFA`}
                    text={`Enroll in ${course.title} at ARIFA. ${course.desc || ""}`.trim()}
                  />
                </div>
              </div>
            </div>
          </aside>

          {/* Main content */}
          <div className="order-2 min-w-0 lg:order-1">
            {course.details && (
              <section aria-label="About this course">
                <h2 className="mb-4 text-2xl font-bold text-ink font-[var(--font-heading)]">
                  About this course
                </h2>
                <SafeHtml className={DETAILS_PROSE_CLASSES} html={course.details} />
              </section>
            )}

            {course.tutors && (
              <section aria-label="Meet your instructors" className="mt-12">
                <h2 className="mb-2 text-2xl font-bold text-ink font-[var(--font-heading)]">
                  Meet your instructors
                </h2>
                <SafeHtml className={TUTORS_PROSE_CLASSES} html={course.tutors} />
              </section>
            )}

            {fee != null && (
              <div
                id="enroll"
                className="mt-12 scroll-mt-28 rounded-xl border border-line bg-white p-8 shadow-[0_10px_40px_rgba(0,0,0,0.05)] md:p-10"
              >
                <h2 className="mb-2 text-2xl font-bold text-ink font-[var(--font-heading)]">
                  Enrollment
                </h2>
                <p className="mb-8 text-muted">
                  Complete the form to enroll. You will be taken to Selcom to
                  pay <strong className="text-black">{formatShillings(fee)}</strong>{" "}
                  by card or mobile money.
                </p>
                <EnrollForm course={course} fee={fee} />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
