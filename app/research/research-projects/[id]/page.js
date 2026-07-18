import { notFound } from "next/navigation";
import Link from "next/link";
import { getBySlug } from "@/lib/content";
import SafeHtml from "@/components/ui/safe-html";
import DetailHero from "@/components/ui/detail-hero";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { id } = await params;
  const project = await getBySlug("RESEARCH_PROJECT", id);

  return {
    title: project
      ? `${project.title} - ARIFA Research`
      : "Research Project - ARIFA",
  };
}

export default async function ResearchProjectDetails({ params }) {
  const { id } = await params;
  const data = await getBySlug("RESEARCH_PROJECT", id);

  if (!data) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-canvas">
      <DetailHero
        badge="Active Research"
        title={data.title}
        image={data.image}
        imageAlt={data.title}
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Research Projects", href: "/research/research-projects" },
          { label: data.title },
        ]}
      />

      <section className="py-16 md:py-20">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-12">
            <div className="lg:col-span-8">
              <article className="bg-white p-7 md:p-10 rounded-xl border border-line shadow-[0_8px_30px_rgba(15,20,25,0.04)]">
                <h2 className="text-xl md:text-2xl font-bold text-ink font-[var(--font-heading)] mb-6 pb-4 border-b border-line flex items-center gap-3">
                  <span className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary shrink-0">
                    <i className="fas fa-file-alt" />
                  </span>
                  Project Overview
                </h2>
                <SafeHtml
                  className="max-w-none text-base md:text-lg text-ink-soft leading-relaxed [&_p]:mb-5 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-ink [&_h2]:mt-10 [&_h2]:mb-4 [&_h2]:font-[var(--font-heading)] [&_h3]:text-xl [&_h3]:font-bold [&_h3]:text-ink [&_h3]:mt-8 [&_h3]:mb-3 [&_h3]:font-[var(--font-heading)] [&_h4]:text-lg [&_h4]:font-semibold [&_h4]:text-ink [&_h4]:mt-6 [&_h4]:mb-2 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-6 [&_ul]:space-y-2 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-6 [&_li]:leading-relaxed [&_strong]:text-ink [&_strong]:font-semibold [&_a]:text-primary [&_a]:underline [&_img]:rounded-lg [&_img]:my-4 [&_img]:max-w-full [&_blockquote]:border-l-4 [&_blockquote]:border-primary/25 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-muted"
                  html={data.content}
                />
              </article>
            </div>

            <aside className="lg:col-span-4">
              <div className="sticky top-28 space-y-5">
                <div className="bg-night p-7 rounded-xl border border-white/10">
                  <h3 className="text-lg font-bold text-white font-[var(--font-heading)] mb-5">
                    Research Details
                  </h3>
                  <ul className="space-y-5">
                    <li className="flex items-start gap-3.5">
                      <div className="w-10 h-10 rounded-lg bg-white/8 flex items-center justify-center text-[#9fe0b8] shrink-0 border border-white/10">
                        <i className="fas fa-calendar-alt" />
                      </div>
                      <div>
                        <strong className="block text-sm text-white font-semibold mb-0.5">
                          Status
                        </strong>
                        <span className="text-sm text-white/60">
                          Ongoing Research
                        </span>
                      </div>
                    </li>
                    <li className="flex items-start gap-3.5">
                      <div className="w-10 h-10 rounded-lg bg-white/8 flex items-center justify-center text-[#9fe0b8] shrink-0 border border-white/10">
                        <i className="fas fa-globe-africa" />
                      </div>
                      <div>
                        <strong className="block text-sm text-white font-semibold mb-0.5">
                          Region
                        </strong>
                        <span className="text-sm text-white/60">
                          Pan-African Initiative
                        </span>
                      </div>
                    </li>
                    <li className="flex items-start gap-3.5">
                      <div className="w-10 h-10 rounded-lg bg-white/8 flex items-center justify-center text-[#9fe0b8] shrink-0 border border-white/10">
                        <i className="fas fa-users" />
                      </div>
                      <div>
                        <strong className="block text-sm text-white font-semibold mb-0.5">
                          Stakeholders
                        </strong>
                        <span className="text-sm text-white/60">
                          Government &amp; Academic
                        </span>
                      </div>
                    </li>
                  </ul>
                </div>

                <div className="bg-white p-6 rounded-xl border border-line">
                  <h4 className="font-semibold text-ink mb-4 text-sm">
                    Share this Research
                  </h4>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      className="w-11 h-11 rounded-lg border border-line flex items-center justify-center text-muted hover:text-white hover:bg-secondary hover:border-secondary transition-colors"
                      aria-label="Share on Twitter"
                    >
                      <i className="fab fa-twitter" />
                    </button>
                    <button
                      type="button"
                      className="w-11 h-11 rounded-lg border border-line flex items-center justify-center text-muted hover:text-white hover:bg-primary hover:border-primary transition-colors"
                      aria-label="Share on LinkedIn"
                    >
                      <i className="fab fa-linkedin-in" />
                    </button>
                    <button
                      type="button"
                      className="w-11 h-11 rounded-lg border border-line flex items-center justify-center text-muted hover:text-white hover:bg-ink hover:border-ink transition-colors"
                      aria-label="Copy link"
                    >
                      <i className="fas fa-link" />
                    </button>
                  </div>
                </div>

                <Link
                  href="/research/research-projects"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary-dark"
                >
                  <i className="fas fa-arrow-left text-xs" />
                  All research projects
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </div>
  );
}
