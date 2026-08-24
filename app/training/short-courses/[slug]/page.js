import Link from "next/link";
import { notFound } from "next/navigation";
import { feeInShillings, getCourse } from "@/lib/courses";
import { formatShillings } from "@/lib/currency";
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

export default async function ShortCourseEnrollPage({ params }) {
  const { slug } = await params;
  const course = await getCourse(slug);
  if (!course) notFound();

  const fee = feeInShillings(course);
  const path = `/training/short-courses/${course.id}`;

  return (
    <section className="bg-white pt-32 pb-24">
      <div className="mx-auto max-w-[720px] px-6">
        <Link
          href="/training/short-courses"
          className="mb-8 inline-flex items-center gap-2 text-sm font-bold text-primary"
        >
          <i className="fas fa-arrow-left text-xs" /> All short courses
        </Link>

        <div className="text-xs font-bold uppercase tracking-[2px] text-primary">
          Short Course · Enroll and pay
        </div>
        <h1 className="mt-2 text-3xl font-bold text-ink font-[var(--font-heading)] md:text-4xl">
          {course.title}
        </h1>
        <p className="mt-3 text-muted">
          {course.date && (
            <>
              <i className="fa-regular fa-calendar-days mr-1.5 text-primary" />
              {course.date}
            </>
          )}
          {course.location ? ` · ${course.location}` : ""}
        </p>

        <ShareBar
          path={path}
          title={`${course.title} | ARIFA`}
          text={`Enroll in ${course.title} at ARIFA. ${course.desc || ""}`.trim()}
        />

        <div className="mt-10 rounded-xl border border-line bg-white p-8 shadow-[0_10px_40px_rgba(0,0,0,0.05)] md:p-10">
          <h2 className="mb-2 text-2xl font-bold text-ink font-[var(--font-heading)]">
            Enrollment
          </h2>

          {fee == null ? (
            <>
              <p className="mb-8 text-muted">
                Online enrollment for {course.title} is not open yet. Contact
                our team to reserve a place.
              </p>
              <Link
                href="/contact-us"
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 font-bold text-white"
              >
                Contact us <i className="fas fa-arrow-right text-xs" />
              </Link>
            </>
          ) : (
            <>
              <p className="mb-8 text-muted">
                Complete the form to enroll. You will be taken to Selcom to pay{" "}
                <strong className="text-black">{formatShillings(fee)}</strong>{" "}
                by card or mobile money.
              </p>
              <EnrollForm course={course} fee={fee} />
            </>
          )}
        </div>
      </div>
    </section>
  );
}
