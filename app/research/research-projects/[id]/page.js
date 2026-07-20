import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getBySlug, getCollection } from "@/lib/content";
import SafeHtml from "@/components/ui/safe-html";

export const dynamic = "force-dynamic";

/** Drop legacy CMS wrappers that duplicate the title / add empty spacing. */
function cleanProjectHtml(html) {
  return String(html || "")
    .replace(/<h2[^>]*class=["']blog-title["'][^>]*>[\s\S]*?<\/h2>/gi, "")
    .replace(/<p[^>]*class=["'][^"']*blog-text[^"']*["'][^>]*>\s*<\/p>/gi, "")
    .replace(/^\s*(?:<p[^>]*>\s*<\/p>\s*)+/i, "")
    .trim();
}

/**
 * Slim page banner with faded cover image — title/category live in the
 * article body (original arifa.org “Project Detail” pattern).
 */
function ProjectDetailHero({ cover, title }) {
  return (
    <section
      className="relative overflow-hidden border-b border-white/10 pt-28 pb-12 md:pt-36 md:pb-16"
      style={{ color: "#ffffff" }}
    >
      <div className="absolute inset-0" aria-hidden="true">
        <Image
          src={cover}
          alt=""
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        {/* Soft fade: photo visible, type stays readable */}
        <div className="absolute inset-0 bg-night/70" />
        <div className="absolute inset-0 bg-gradient-to-b from-night/55 via-night/65 to-night/85" />
        <div className="absolute inset-0 bg-gradient-to-r from-night/50 via-transparent to-night/40" />
      </div>

      <div className="relative z-10 mx-auto max-w-[1200px] px-6 text-center">
        <nav
          className="mb-5 flex flex-wrap items-center justify-center gap-2 text-sm font-medium text-white/65"
          aria-label="Breadcrumb"
        >
          <Link href="/" className="transition-colors hover:text-white">
            Home
          </Link>
          <span className="text-white/35" aria-hidden="true">
            /
          </span>
          <Link
            href="/research/research-projects"
            className="transition-colors hover:text-white"
          >
            Research Projects
          </Link>
          <span className="text-white/35" aria-hidden="true">
            /
          </span>
          <span className="text-white/90">Project Detail</span>
        </nav>
        <h1
          className="font-[var(--font-heading)] text-3xl font-bold tracking-[-0.02em] md:text-4xl lg:text-5xl"
          style={{
            color: "#ffffff",
            textShadow: "0 2px 16px rgba(0,0,0,0.35)",
          }}
        >
          Project Detail
        </h1>
        {/* sr-only keeps document outline; visible title is in the article */}
        <span className="sr-only">{title}</span>
      </div>

      <div
        className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-primary via-primary to-secondary"
        aria-hidden="true"
      />
    </section>
  );
}

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
  const [data, all] = await Promise.all([
    getBySlug("RESEARCH_PROJECT", id),
    getCollection("RESEARCH_PROJECT"),
  ]);

  if (!data) {
    notFound();
  }

  const category = data.group || "";
  const dateRange = data.dateRange || "";
  const cover = data.image || "/hero-bg.png";

  // Sidebar category index (like original arifa.org widget).
  const categoryCounts = new Map();
  for (const p of all) {
    if (!p.group) continue;
    categoryCounts.set(p.group, (categoryCounts.get(p.group) || 0) + 1);
  }
  const categories = [...categoryCounts.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="min-h-screen bg-canvas">
      <ProjectDetailHero cover={cover} title={data.title} />

      <section className="py-16 md:py-20">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-12">
            <div className="lg:col-span-8">
              <article className="bg-white">
                {/* Cover — full-bleed rounded image like original blog-img */}
                <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl bg-surface-warm sm:aspect-[2/1]">
                  <Image
                    src={cover}
                    alt={data.title}
                    fill
                    priority
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 800px"
                  />
                </div>

                {/* Meta row: user | calendar + dates | pin + category (original blog-meta) */}
                <div className="mt-5 mb-6 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-ink-soft sm:mt-6 sm:mb-7">
                  <span
                    className="inline-flex h-8 w-8 items-center justify-center text-muted"
                    aria-hidden="true"
                    title="ARIFA"
                  >
                    <i className="fas fa-user text-[0.9rem]" />
                  </span>

                  {(dateRange || category) && (
                    <span className="select-none text-black/20" aria-hidden="true">
                      |
                    </span>
                  )}

                  {dateRange ? (
                    <span className="inline-flex items-center gap-2 font-medium text-ink-soft">
                      <i
                        className="far fa-calendar text-[0.9rem] text-muted"
                        aria-hidden="true"
                      />
                      <span>{dateRange}</span>
                    </span>
                  ) : null}

                  {dateRange && category ? (
                    <span className="select-none text-black/20" aria-hidden="true">
                      |
                    </span>
                  ) : null}

                  {category ? (
                    <Link
                      href={`/research/research-projects?category=${encodeURIComponent(category)}`}
                      className="inline-flex items-center gap-2 font-semibold text-secondary transition-opacity hover:opacity-80"
                    >
                      <i
                        className="fas fa-location-dot text-[0.9rem]"
                        aria-hidden="true"
                      />
                      <span>{category}</span>
                    </Link>
                  ) : null}
                </div>

                <h2 className="mb-4 font-[var(--font-heading)] text-2xl font-bold leading-snug tracking-[-0.02em] text-ink md:text-[1.75rem]">
                  {data.title}
                </h2>

                <SafeHtml
                  className="max-w-none text-base md:text-lg text-ink-soft leading-relaxed text-justify [&_p]:mb-5 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-ink [&_h2]:mt-10 [&_h2]:mb-4 [&_h2]:font-[var(--font-heading)] [&_h3]:text-xl [&_h3]:font-bold [&_h3]:text-ink [&_h3]:mt-8 [&_h3]:mb-3 [&_h3]:font-[var(--font-heading)] [&_h4]:text-lg [&_h4]:font-semibold [&_h4]:text-ink [&_h4]:mt-6 [&_h4]:mb-2 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-6 [&_ul]:space-y-2 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-6 [&_li]:leading-relaxed [&_strong]:text-ink [&_strong]:font-semibold [&_a]:text-primary [&_a]:underline [&_img]:rounded-lg [&_img]:my-4 [&_img]:max-w-full [&_blockquote]:border-l-4 [&_blockquote]:border-primary/25 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-muted"
                  html={cleanProjectHtml(data.content)}
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
                    {category ? (
                      <li className="flex items-start gap-3.5">
                        <div className="w-10 h-10 rounded-lg bg-white/8 flex items-center justify-center text-[#9fe0b8] shrink-0 border border-white/10">
                          <i className="fas fa-folder-open" />
                        </div>
                        <div>
                          <strong className="block text-sm text-white font-semibold mb-0.5">
                            Category
                          </strong>
                          <Link
                            href={`/research/research-projects?category=${encodeURIComponent(category)}`}
                            className="text-sm text-[#9fe0b8] hover:text-white transition-colors"
                          >
                            {category}
                          </Link>
                        </div>
                      </li>
                    ) : null}
                    {dateRange ? (
                      <li className="flex items-start gap-3.5">
                        <div className="w-10 h-10 rounded-lg bg-white/8 flex items-center justify-center text-[#9fe0b8] shrink-0 border border-white/10">
                          <i className="fas fa-calendar-alt" />
                        </div>
                        <div>
                          <strong className="block text-sm text-white font-semibold mb-0.5">
                            Project dates
                          </strong>
                          <span className="text-sm text-white/60">{dateRange}</span>
                        </div>
                      </li>
                    ) : (
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
                    )}
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

                {categories.length > 0 && (
                  <div className="bg-white p-6 rounded-xl border border-line">
                    <h4 className="font-semibold text-ink mb-4 text-sm font-[var(--font-heading)]">
                      Categories
                    </h4>
                    <ul className="divide-y divide-line">
                      {categories.map((cat) => {
                        const active = cat.name === category;
                        return (
                          <li key={cat.name}>
                            <Link
                              href={`/research/research-projects?category=${encodeURIComponent(cat.name)}`}
                              className={`flex items-center justify-between gap-3 py-3 text-sm transition-colors ${
                                active
                                  ? "font-semibold text-primary"
                                  : "text-ink-soft hover:text-primary"
                              }`}
                            >
                              <span className="inline-flex min-w-0 items-center gap-2">
                                <i
                                  className={`fas fa-folder text-[0.7em] shrink-0 ${
                                    active ? "text-primary" : "text-muted"
                                  }`}
                                  aria-hidden="true"
                                />
                                <span className="truncate">{cat.name}</span>
                              </span>
                              <span
                                className={`shrink-0 rounded-full px-2 py-0.5 text-[0.65rem] font-semibold tabular-nums ${
                                  active
                                    ? "bg-primary/10 text-primary"
                                    : "bg-surface-alt text-muted"
                                }`}
                              >
                                {cat.count}
                              </span>
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}

                <div className="bg-white p-6 rounded-xl border border-line">
                  <h4 className="font-semibold text-ink mb-4 text-sm">
                    Share this Research
                  </h4>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      className="flex h-11 w-11 items-center justify-center rounded-lg border border-line text-muted transition-colors hover:border-secondary hover:bg-secondary hover:text-white"
                      aria-label="Share on Twitter"
                    >
                      <i className="fab fa-twitter" />
                    </button>
                    <button
                      type="button"
                      className="flex h-11 w-11 items-center justify-center rounded-lg border border-line text-muted transition-colors hover:border-primary hover:bg-primary hover:text-white"
                      aria-label="Share on LinkedIn"
                    >
                      <i className="fab fa-linkedin-in" />
                    </button>
                    <button
                      type="button"
                      className="flex h-11 w-11 items-center justify-center rounded-lg border border-line text-muted transition-colors hover:border-ink hover:bg-ink hover:text-white"
                      aria-label="Copy link"
                    >
                      <i className="fas fa-link" />
                    </button>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </div>
  );
}
