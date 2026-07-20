import { notFound } from "next/navigation";
import { getBySlug } from "@/lib/content";
import Link from "next/link";
import ApplyButton from "@/app/components/ApplyButton";
import SafeHtml from "@/components/ui/safe-html";
import DetailHero from "@/components/ui/detail-hero";
import {
  formatCertificateModules,
  isModulesSection,
  orderCertificationSections,
} from "@/lib/html";

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

  // Same order as admin: overview…assessment first, core modules always last.
  const orderedSections = orderCertificationSections(data.sections || []);
  const modulesSection = orderedSections.find((section) =>
    isModulesSection(section),
  );
  const otherSections = orderedSections.filter(
    (section) => !isModulesSection(section),
  );

  return (
    <div className="min-h-screen bg-canvas">
      <DetailHero
        badge="Professional Certification"
        title={data.title}
        description="Advance your career and master the skills required to excel in the modern digital economy with our industry-recognized certification program."
        image={data.image}
        imageAlt={data.title}
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Certifications", href: "/training/certifications" },
          { label: data.title },
        ]}
        actions={
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex flex-wrap gap-4 text-sm text-white/70">
              <span className="inline-flex items-center gap-2">
                <i className="fas fa-laptop-house text-[#b6ecc9]" />
                Hybrid &amp; Online
              </span>
              <span className="text-white/25">|</span>
              <span className="inline-flex items-center gap-2">
                <i className="fas fa-layer-group text-[#b6ecc9]" />
                Professional
              </span>
            </div>
            <ApplyButton
              courseTitle={data.title}
              courseImage={data.image}
              className="inline-flex items-center justify-center px-6 py-3 bg-primary text-white rounded-md font-semibold text-sm hover:bg-primary-light transition-colors"
            />
          </div>
        }
      />

      <section className="py-20">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid lg:grid-cols-12 gap-12">
            <div className="lg:col-span-8 space-y-8">
              {otherSections.map((sec, idx) => (
                <div
                  key={`${sec.heading}-${idx}`}
                  className="bg-white p-8 md:p-12 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-line transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] relative overflow-hidden group"
                >
                  <div className="relative z-10">
                    <div className="flex items-center gap-4 mb-8">
                      <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary shadow-sm">
                        <i
                          className={`fas ${idx === 0 ? "fa-info-circle" : idx === 1 ? "fa-bullseye" : "fa-check-double"} text-xl`}
                        />
                      </div>
                      <h2 className="text-3xl font-bold text-ink font-[var(--font-heading)]">
                        {sec.heading}
                      </h2>
                    </div>
                    <SafeHtml
                      className="max-w-none text-lg text-muted leading-relaxed text-justify [&_p]:mb-6 [&_ul]:list-none [&_ul]:pl-0 [&_ul]:mb-6 [&_ul]:space-y-4 [&_li]:relative [&_li]:pl-8 [&_li]:before:content-[''] [&_li]:before:absolute [&_li]:before:left-0 [&_li]:before:top-2.5 [&_li]:before:w-2 [&_li]:before:h-2 [&_li]:before:bg-primary [&_li]:before:rounded-full [&_strong]:text-black [&_strong]:font-bold [&_strong]:bg-primary/10 [&_strong]:px-1 [&_strong]:rounded"
                      html={sec.content || ""}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="lg:col-span-4 relative">
              <div className="sticky top-32 space-y-8">
                <div className="bg-primary p-8 rounded-xl shadow-xl relative overflow-hidden">
                  <h3 className="text-2xl font-bold text-white font-[var(--font-heading)] mb-4">
                    Ready to Enroll?
                  </h3>
                  <p className="text-white/70 text-sm mb-8 leading-relaxed text-justify">
                    Join hundreds of professionals advancing their careers
                    through ARIFA&apos;s premier training network across Africa.
                  </p>
                  <ApplyButton
                    courseTitle={data.title}
                    courseImage={data.image}
                    className="w-full py-4 bg-primary text-white rounded-xl font-bold flex items-center justify-center gap-3 shadow-lg hover:bg-white hover:text-black transition-all duration-300 group"
                  />
                </div>

                <div className="bg-white p-8 rounded-xl shadow-sm border border-line">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-muted">
                      <i className="fas fa-headset" />
                    </div>
                    <h4 className="font-bold text-black">Need Help?</h4>
                  </div>
                  <p className="text-sm text-black/60 mb-6 text-justify">
                    Our admissions team is available to answer any questions
                    about the curriculum or enrollment process.
                  </p>
                  <Link
                    href="/contact-us"
                    className="text-sm font-bold text-primary hover:underline flex items-center gap-2"
                  >
                    Contact Admissions <i className="fas fa-arrow-right" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {modulesSection && (
        <section className="py-24 bg-white border-t border-line">
          <div className="max-w-[1000px] mx-auto px-6">
            <div className="text-center mb-16">
              <span className="text-primary font-bold tracking-wider uppercase text-sm mb-2 block">
                Curriculum Breakdown
              </span>
              <h2 className="text-4xl md:text-5xl font-bold text-ink font-[var(--font-heading)] relative inline-block">
                Course Modules
                <span className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-20 h-1.5 bg-primary rounded-full" />
              </h2>
            </div>
            <SafeHtml
              className="modules-container space-y-6 [&>.module]:bg-primary/5 [&>.module]:rounded-xl [&>.module]:p-8 [&>.module]:border [&>.module]:border-line [&>.module]:transition-all hover:[&>.module]:border-primary/30 hover:[&>.module]:shadow-md [&>.module_h6]:text-2xl [&>.module_h6]:font-bold [&>.module_h6]:text-black [&>.module_h6]:mb-4 [&>.module_h6]:font-[var(--font-heading)] [&>.module_ul]:list-none [&>.module_ul]:pl-0 [&>.module_ul]:space-y-3 [&>.module_ul_li]:relative [&>.module_ul_li]:pl-8 [&>.module_ul_li]:text-muted [&>.module_ul_li]:text-lg [&>.module_ul_li::before]:content-['✓'] [&>.module_ul_li::before]:font-bold [&>.module_ul_li::before]:absolute [&>.module_ul_li::before]:left-0 [&>.module_ul_li::before]:text-secondary [&>.module_ul_li_strong]:text-black [&>.module_ul_li_strong]:bg-white [&>.module_ul_li_strong]:px-2 [&>.module_ul_li_strong]:py-0.5 [&>.module_ul_li_strong]:rounded-md [&>.module_ul_li_strong]:shadow-sm [&>.module_ul_li_strong]:border [&>.module_ul_li_strong]:border-line"
              html={formatCertificateModules(modulesSection.content || "")}
            />
          </div>
        </section>
      )}
    </div>
  );
}
