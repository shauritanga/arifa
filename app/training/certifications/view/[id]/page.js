import { notFound } from "next/navigation";
import { getBySlug } from "@/lib/content";
import Image from "next/image";
import Link from "next/link";
import ApplyButton from "@/app/components/ApplyButton";
export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { id } = await params;
  const cert = await getBySlug("CERTIFICATION", id);

  return { title: cert ? `${cert.title} - ARIFA` : "Certification - ARIFA" };
}
export default async function CertificationDetails({ params }) {
  const { id } = await params;
  const data = await getBySlug("CERTIFICATION", id);

  if (!data) {
    notFound();
  }

  const modulesSection = data.sections?.find((section) =>
    section.heading.toLowerCase().includes("module"),
  );
  const otherSections =
    data.sections?.filter(
      (section) => !section.heading.toLowerCase().includes("module"),
    ) || [];

  return (
    <div className="min-h-screen bg-white">
      {" "}
      {/* Soft slate background for high contrast with white cards */}{" "}
      {/* ====== Stunning Premium Header ====== */}{" "}
      <section className="relative pt-48 pb-32 overflow-hidden flex flex-col justify-center">
        {" "}
        {/* Background Image & Overlays */}{" "}
        <div className="absolute inset-0 z-0">
          {" "}
          <Image
            src={data.image}
            alt={data.title}
            fill
            className="object-cover object-center scale-105"
            priority
          />{" "}
          <div className="absolute inset-0 bg-night/70 " />{" "}
          <div className="absolute inset-0 bg-primary/60 opacity-60" />{" "}
        </div>{" "}
        <div className="max-w-[1200px] w-full mx-auto px-6 relative z-10">
          {" "}
          {/* Breadcrumb Navigation */}{" "}
          <nav
            className="flex items-center gap-3 text-sm text-white/70 mb-10 font-medium tracking-wide"
            aria-label="Breadcrumb"
          >
            {" "}
            <Link
              href="/"
              className="hover:text-white transition-colors flex items-center gap-2"
            >
              {" "}
              <i className="fas fa-home text-white/50" /> Home{" "}
            </Link>{" "}
            <i className="fas fa-chevron-right text-xs text-white/30" />{" "}
            <Link
              href="/training/certifications"
              className="hover:text-white transition-colors"
            >
              {" "}
              Certifications{" "}
            </Link>{" "}
            <i className="fas fa-chevron-right text-xs text-white/30" />{" "}
            <span
              className="text-white font-bold truncate max-w-[150px] md:max-w-[300px] lg:max-w-md"
              title={data.title}
            >
              {" "}
              {data.title}{" "}
            </span>{" "}
          </nav>{" "}
          <div className="flex flex-col lg:flex-row gap-12 lg:items-end justify-between">
            {" "}
            <div className="max-w-3xl">
              {" "}
              <span className="inline-block px-4 py-1.5 bg-primary/20 text-primary border border-primary/30 rounded-full text-sm font-bold uppercase tracking-wider mb-6">
                {" "}
                Professional Certification{" "}
              </span>{" "}
              <h1 className="text-4xl md:text-6xl font-bold text-white leading-[1.1] mb-6 font-[var(--font-heading)] ">
                {" "}
                {data.title}{" "}
              </h1>{" "}
              <p className="text-lg md:text-xl text-white/80 font-light leading-relaxed max-w-2xl">
                {" "}
                Advance your career and master the skills required to excel in
                the modern digital economy with our industry-recognized
                certification program.{" "}
              </p>{" "}
            </div>{" "}
            {/* Quick Stats / Action inside Hero */}{" "}
            <div className="bg-white/10 border border-white/20 p-8 rounded-xl shrink-0 lg:w-80 shadow-2xl">
              {" "}
              <div className="flex flex-col gap-6">
                {" "}
                <div>
                  {" "}
                  <p className="text-white/60 text-xs font-bold uppercase tracking-wider mb-1">
                    Format
                  </p>{" "}
                  <p className="text-white font-bold flex items-center gap-2">
                    {" "}
                    <i className="fas fa-laptop-house text-primary" /> Hybrid &
                    Online{" "}
                  </p>{" "}
                </div>{" "}
                <div className="h-px w-full bg-white/10" />{" "}
                <div>
                  {" "}
                  <p className="text-white/60 text-xs font-bold uppercase tracking-wider mb-1">
                    Level
                  </p>{" "}
                  <p className="text-white font-bold flex items-center gap-2">
                    {" "}
                    <i className="fas fa-layer-group text-primary" />{" "}
                    Professional{" "}
                  </p>{" "}
                </div>{" "}
                <ApplyButton
                  courseTitle={data.title}
                  courseImage={data.image}
                  className="w-full mt-2 py-4 bg-primary text-white rounded-xl font-bold text-lg shadow-lg shadow-primary/30 hover:bg-white hover:text-primary transition-all duration-300 text-center"
                />{" "}
              </div>{" "}
            </div>{" "}
          </div>{" "}
        </div>{" "}
        {/* Decorative divider */}{" "}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-10">
          {" "}
          <svg
            className="relative block w-full h-[50px]"
            data-name="Layer 1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
          >
            {" "}
            <path
              d="M1200 120L0 120 0 0 1200 0 1200 120z"
              fill="#FFFFFF"
              opacity="0.1"
            ></path>{" "}
            <path
              d="M0 120h1200V0C936.56 120 263.44 120 0 0v120z"
              fill="#FFFFFF"
            ></path>{" "}
          </svg>{" "}
        </div>{" "}
      </section>{" "}
      {/* ====== Course Content with Balance and Hierarchy ====== */}{" "}
      <section className="py-20">
        {" "}
        <div className="max-w-[1200px] mx-auto px-6">
          {" "}
          <div className="grid lg:grid-cols-12 gap-12">
            {" "}
            {/* Left Column: Descriptive Sections */}{" "}
            <div className="lg:col-span-8 space-y-8">
              {" "}
              {otherSections.map((sec, idx) => (
                <div
                  key={idx}
                  className="bg-white p-8 md:p-12 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-line transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] relative overflow-hidden group"
                >
                  {" "}
                  <div className="relative z-10">
                    {" "}
                    <div className="flex items-center gap-4 mb-8">
                      {" "}
                      <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary shadow-sm">
                        {" "}
                        <i
                          className={`fas ${idx === 0 ? "fa-info-circle" : idx === 1 ? "fa-bullseye" : "fa-check-double"} text-xl`}
                        />{" "}
                      </div>{" "}
                      <h2 className="text-3xl font-bold text-ink font-[var(--font-heading)]">
                        {" "}
                        {sec.heading}{" "}
                      </h2>{" "}
                    </div>{" "}
                    <div
                      className="max-w-none text-lg text-muted leading-relaxed [&_p]:mb-6 [&_ul]:list-none [&_ul]:pl-0 [&_ul]:mb-6 [&_ul]:space-y-4 [&_li]:relative [&_li]:pl-8 [&_li]:before:content-[''] [&_li]:before:absolute [&_li]:before:left-0 [&_li]:before:top-2.5 [&_li]:before:w-2 [&_li]:before:h-2 [&_li]:before:bg-primary [&_li]:before:rounded-full [&_strong]:text-black [&_strong]:font-bold [&_strong]:bg-primary/10 [&_strong]:px-1 [&_strong]:rounded"
                      dangerouslySetInnerHTML={{ __html: sec.content }}
                    />{" "}
                  </div>{" "}
                </div>
              ))}{" "}
            </div>{" "}
            {/* Right Column: Sticky Navigation & Quick Actions */}{" "}
            <div className="lg:col-span-4 relative">
              {" "}
              <div className="sticky top-32 space-y-8">
                {" "}
                {/* Secondary Apply Card (High Contrast) */}{" "}
                <div className="bg-primary p-8 rounded-xl shadow-xl relative overflow-hidden">
                  {" "}
                  <h3 className="text-2xl font-bold text-white font-[var(--font-heading)] mb-4">
                    Ready to Enroll?
                  </h3>{" "}
                  <p className="text-white/70 text-sm mb-8 leading-relaxed">
                    {" "}
                    Join hundreds of professionals advancing their careers
                    through ARIFA&apos;s premier training network across
                    Africa.{" "}
                  </p>{" "}
                  <ApplyButton
                    courseTitle={data.title}
                    courseImage={data.image}
                    className="w-full py-4 bg-primary text-white rounded-xl font-bold flex items-center justify-center gap-3 shadow-lg hover:bg-white hover:text-black transition-all duration-300 group"
                  />{" "}
                </div>{" "}
                {/* Help Card */}{" "}
                <div className="bg-white p-8 rounded-xl shadow-sm border border-line">
                  {" "}
                  <div className="flex items-center gap-4 mb-4">
                    {" "}
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-muted">
                      {" "}
                      <i className="fas fa-headset" />{" "}
                    </div>{" "}
                    <h4 className="font-bold text-black">Need Help?</h4>{" "}
                  </div>{" "}
                  <p className="text-sm text-black/60 mb-6">
                    Our admissions team is available to answer any questions
                    about the curriculum or enrollment process.
                  </p>{" "}
                  <Link
                    href="/contact-us"
                    className="text-sm font-bold text-primary hover:underline flex items-center gap-2"
                  >
                    {" "}
                    Contact Admissions <i className="fas fa-arrow-right" />{" "}
                  </Link>{" "}
                </div>{" "}
              </div>{" "}
            </div>{" "}
          </div>{" "}
        </div>{" "}
      </section>{" "}
      {/* ====== Full-Width Modules Section ====== */}{" "}
      {modulesSection && (
        <section className="py-24 bg-white border-t border-line">
          {" "}
          <div className="max-w-[1000px] mx-auto px-6">
            {" "}
            <div className="text-center mb-16">
              {" "}
              <span className="text-primary font-bold tracking-wider uppercase text-sm mb-2 block">
                Curriculum Breakdown
              </span>{" "}
              <h2 className="text-4xl md:text-5xl font-bold text-ink font-[var(--font-heading)] relative inline-block">
                {" "}
                Course Modules{" "}
                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-20 h-1.5 bg-primary rounded-full" />{" "}
              </h2>{" "}
            </div>{" "}
            {/* We use a custom styling trick for the raw HTML modules to make them look like cards */}{" "}
            <div
              className=" modules-container space-y-6 [&>.module]:bg-primary/5 [&>.module]:rounded-xl [&>.module]:p-8 [&>.module]:border [&>.module]:border-line [&>.module]:transition-all hover:[&>.module]:border-primary/30 hover:[&>.module]:shadow-md [&>.module_h6]:text-2xl [&>.module_h6]:font-bold [&>.module_h6]:text-black [&>.module_h6]:mb-4 [&>.module_h6]:font-[var(--font-heading)] [&>.module_ul]:list-none [&>.module_ul]:pl-0 [&>.module_ul]:space-y-3 [&>.module_ul_li]:relative [&>.module_ul_li]:pl-8 [&>.module_ul_li]:text-muted [&>.module_ul_li]:text-lg [&>.module_ul_li::before]:content-['✓'] [&>.module_ul_li::before]:font-bold [&>.module_ul_li::before]:absolute [&>.module_ul_li::before]:left-0 [&>.module_ul_li::before]:text-secondary [&>.module_ul_li_strong]:text-black [&>.module_ul_li_strong]:bg-white [&>.module_ul_li_strong]:px-2 [&>.module_ul_li_strong]:py-0.5 [&>.module_ul_li_strong]:rounded-md [&>.module_ul_li_strong]:shadow-sm [&>.module_ul_li_strong]:border [&>.module_ul_li_strong]:border-line "
              dangerouslySetInnerHTML={{ __html: modulesSection.content }}
            />{" "}
          </div>{" "}
        </section>
      )}{" "}
    </div>
  );
}
