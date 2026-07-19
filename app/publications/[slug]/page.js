import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getBySlug, getCollection } from "@/lib/content";
import SafeHtml from "@/components/ui/safe-html";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const pub = await getBySlug("PUBLICATION", slug);
  return {
    title: pub ? `${pub.title} - ARIFA Publications` : "Publication - ARIFA",
    description: pub?.authors || pub?.venue || undefined,
  };
}

export default async function PublicationDetailPage({ params }) {
  const { slug } = await params;
  let data = await getBySlug("PUBLICATION", slug);

  if (!data) {
    const all = await getCollection("PUBLICATION");
    data = all.find((p) => p.id === slug || p.slug === slug);
  }
  if (!data) notFound();

  const category = data.group || "Research Reports";
  const cover = data.image || "/hero-bg.png";
  const year = data.year || "";
  const authors = data.authors || "";
  const venue = data.venue || "";
  const external =
    data.link && data.link !== "#" && !data.link.includes("arifa.org/publications")
      ? data.link
      : "";
  const body =
    data.summary ||
    (authors || venue
      ? `<p>${[authors && `<strong>Authors:</strong> ${authors}`, venue && `<strong>Published in:</strong> ${venue}`]
          .filter(Boolean)
          .join("</p><p>")}</p>`
      : `<p>This publication is part of ARIFA&apos;s ${category.toLowerCase()} series.</p>`);

  return (
    <div className="min-h-screen bg-canvas">
      {/* Slim fade hero — same pattern as project detail */}
      <section className="relative overflow-hidden border-b border-white/10 pt-28 pb-12 md:pt-36 md:pb-16">
        <div className="absolute inset-0" aria-hidden="true">
          <Image
            src={cover}
            alt=""
            fill
            priority
            className="object-cover object-center"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-night/70" />
          <div className="absolute inset-0 bg-gradient-to-b from-night/55 via-night/65 to-night/85" />
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
              href="/publications"
              className="transition-colors hover:text-white"
            >
              Publications
            </Link>
            <span className="text-white/35" aria-hidden="true">
              /
            </span>
            <span className="text-white/90">Details</span>
          </nav>
          <h1
            className="font-[var(--font-heading)] text-3xl font-bold tracking-[-0.02em] md:text-4xl"
            style={{
              color: "#ffffff",
              textShadow: "0 2px 16px rgba(0,0,0,0.35)",
            }}
          >
            Publication Details
          </h1>
          <span className="sr-only">{data.title}</span>
        </div>
        <div
          className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-primary via-primary to-secondary"
          aria-hidden="true"
        />
      </section>

      <section className="py-14 md:py-20">
        <div className="mx-auto max-w-[1200px] px-6">
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-8">
              <article className="bg-white">
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

                <div className="mt-5 mb-6 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-ink-soft sm:mt-6">
                  <span className="inline-flex items-center gap-2 font-semibold text-secondary">
                    <i className="fas fa-folder text-xs" aria-hidden="true" />
                    {category}
                  </span>
                  {year ? (
                    <>
                      <span className="select-none text-black/20" aria-hidden="true">
                        |
                      </span>
                      <span className="inline-flex items-center gap-2 font-medium">
                        <i
                          className="far fa-calendar text-muted text-[0.9rem]"
                          aria-hidden="true"
                        />
                        {year}
                      </span>
                    </>
                  ) : null}
                </div>

                <h2 className="mb-4 font-[var(--font-heading)] text-2xl font-bold leading-snug tracking-[-0.02em] text-ink md:text-[1.75rem]">
                  {data.title}
                </h2>

                {authors ? (
                  <p className="mb-2 text-sm font-medium text-ink-soft">
                    {authors}
                  </p>
                ) : null}
                {venue ? (
                  <p className="mb-6 text-sm italic text-muted">
                    Published in: {venue}
                  </p>
                ) : (
                  <div className="mb-6" />
                )}

                <SafeHtml
                  className="max-w-none text-base leading-relaxed text-ink-soft md:text-lg [&_p]:mb-5 [&_ul]:mb-5 [&_ul]:list-disc [&_ul]:pl-6"
                  html={body}
                />

                {external ? (
                  <div className="mt-8 border-t border-line pt-6">
                    <a
                      href={external}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary inline-flex"
                    >
                      Open resource
                      <i className="fas fa-arrow-up-right-from-square text-xs opacity-80" />
                    </a>
                  </div>
                ) : null}
              </article>
            </div>

            <aside className="lg:col-span-4">
              <div className="sticky top-28 space-y-5">
                <div className="rounded-xl border border-white/10 bg-night p-7">
                  <h3 className="mb-5 font-[var(--font-heading)] text-lg font-bold text-white">
                    At a glance
                  </h3>
                  <ul className="space-y-5">
                    <li className="flex items-start gap-3.5">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/8 text-[#9fe0b8]">
                        <i className="fas fa-folder-open" />
                      </div>
                      <div>
                        <strong className="mb-0.5 block text-sm font-semibold text-white">
                          Category
                        </strong>
                        <span className="text-sm text-white/60">{category}</span>
                      </div>
                    </li>
                    {year ? (
                      <li className="flex items-start gap-3.5">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/8 text-[#9fe0b8]">
                          <i className="fas fa-calendar-alt" />
                        </div>
                        <div>
                          <strong className="mb-0.5 block text-sm font-semibold text-white">
                            Year
                          </strong>
                          <span className="text-sm text-white/60">{year}</span>
                        </div>
                      </li>
                    ) : null}
                    {authors ? (
                      <li className="flex items-start gap-3.5">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/8 text-[#9fe0b8]">
                          <i className="fas fa-users" />
                        </div>
                        <div>
                          <strong className="mb-0.5 block text-sm font-semibold text-white">
                            Authors
                          </strong>
                          <span className="text-sm text-white/60">{authors}</span>
                        </div>
                      </li>
                    ) : null}
                  </ul>
                </div>

                {external ? (
                  <a
                    href={external}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 rounded-xl border border-line bg-white px-5 py-4 text-sm font-semibold text-primary shadow-sm transition-colors hover:border-primary/30"
                  >
                    Download / external link
                    <i className="fas fa-arrow-up-right-from-square text-xs" />
                  </a>
                ) : null}

                <Link
                  href="/publications"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary-dark"
                >
                  <i className="fas fa-arrow-left text-xs" />
                  All publications
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </div>
  );
}
