import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getBySlug, getCollection } from "@/lib/content";

export const dynamic = "force-dynamic";

const FALLBACK_IMAGE = "/hero-bg.png";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const event = await getBySlug("EVENT", slug);
  return {
    title: event ? `${event.title} - ARIFA Events` : "Event - ARIFA",
    description: event?.desc || undefined,
  };
}

function formatDate(day, month, year) {
  const parts = [month, day, year].filter(Boolean);
  if (!parts.length) return "—";
  // "July 27, 2025" style when month is short code, keep as-is from CMS
  if (day && month && year) return `${month} ${day}, ${year}`;
  return parts.join(" ");
}

function durationLabel(event) {
  const startM = event.month;
  const endM = event.endMonth || event.month;
  const startY = event.year;
  const endY = event.endYear || event.year;
  const startD = Number(event.day);
  const endD = Number(event.endDay || event.day);

  if (
    !startD ||
    !endD ||
    (String(event.day) === String(event.endDay || event.day) &&
      startM === endM &&
      startY === endY)
  ) {
    return "1 day";
  }

  if (startM === endM && startY === endY && endD >= startD) {
    const days = endD - startD + 1;
    return days === 1 ? "1 day" : `${days} days`;
  }
  return "Multi-day";
}

export default async function EventDetailPage({ params }) {
  const { slug } = await params;
  let event = await getBySlug("EVENT", slug);

  if (!event) {
    const all = await getCollection("EVENT");
    event = all.find((e) => e.id === slug || e.slug === slug);
  }
  if (!event) notFound();

  const gallery = Array.isArray(event.images)
    ? event.images.map(String).filter(Boolean)
    : [];
  const image = event.image || gallery[0] || FALLBACK_IMAGE;
  // Cover first, then other gallery photos (deduped)
  const galleryImages = [
    image,
    ...gallery.filter((src) => src !== image),
  ].filter(Boolean);
  const kind = event.kind || "Event";
  const start = formatDate(event.day, event.month, event.year);
  const end = formatDate(
    event.endDay || event.day,
    event.endMonth || event.month,
    event.endYear || event.year,
  );
  const body = event.content || event.desc || "";
  const status = event.group || "Past";
  const publishedLabel = start !== "—" ? start : "";
  const tags = Array.isArray(event.tags)
    ? event.tags.filter(Boolean)
    : [kind, "Announcement", status === "Upcoming" ? "Upcoming" : "Archive"];
  const registerUrl = event.registerUrl || "";

  const facts = [
    { label: "Start Date", value: start, icon: "fas fa-calendar-plus" },
    { label: "End Date", value: end, icon: "fas fa-calendar-check" },
    {
      label: "Location",
      value: event.location || "—",
      icon: "fas fa-map-marker-alt",
    },
    { label: "Duration", value: durationLabel(event), icon: "fas fa-clock" },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* ── Page banner (demo “Blog Details” style) ── */}
      <section className="relative overflow-hidden bg-night pt-32 pb-14 md:pt-40 md:pb-16">
        <div className="absolute inset-0 z-0">
          <Image
            src={image}
            alt=""
            fill
            className="object-cover object-center"
            style={{ filter: "brightness(0.28) saturate(0.6)" }}
            aria-hidden="true"
            priority
          />
          <div className="absolute inset-0 bg-night/75" />
        </div>
        <div className="relative z-10 max-w-[1200px] mx-auto px-6 text-center">
          <nav
            className="mb-5 flex flex-wrap items-center justify-center gap-2 text-sm text-white/65"
            aria-label="Breadcrumb"
          >
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <span className="text-white/35">/</span>
            <Link
              href="/events/engagements"
              className="hover:text-white transition-colors"
            >
              Events
            </Link>
            <span className="text-white/35">/</span>
            <span className="text-white/90">Details</span>
          </nav>
          <h1
            className="font-[var(--font-heading)] text-3xl font-bold md:text-4xl lg:text-5xl"
            style={{ color: "#ffffff" }}
          >
            Event Details
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-sm text-white/70 md:text-base">
            Event, Announcement, News: Inform, Update, Engage, Report
          </p>
        </div>
        <div
          className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-primary via-primary to-secondary"
          aria-hidden="true"
        />
      </section>

      {/* ── Content (demo single-blog layout) ── */}
      <section className="py-12 md:py-16 lg:py-20">
        <div className="mx-auto max-w-[900px] px-6">
          {/* Featured image + gallery */}
          <div className="mb-8 md:mb-10">
            <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl bg-surface-warm shadow-[0_12px_40px_rgba(15,20,25,0.1)]">
              <Image
                src={galleryImages[0]}
                alt={event.title}
                fill
                className="object-cover"
                sizes="(max-width: 900px) 100vw, 900px"
                priority
              />
            </div>
            {galleryImages.length > 1 && (
              <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
                {galleryImages.slice(1).map((src, i) => (
                  <div
                    key={`${src}-${i}`}
                    className="relative aspect-[4/3] overflow-hidden rounded-lg border border-line bg-surface-warm"
                  >
                    <Image
                      src={src}
                      alt={`${event.title} photo ${i + 2}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 50vw, 25vw"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Meta row: by Admin · date · type · location */}
          <div className="mb-6 flex flex-wrap items-center gap-x-5 gap-y-2 border-b border-line pb-5 text-sm text-muted">
            <span className="inline-flex items-center gap-2">
              <i className="fas fa-user text-primary text-xs" />
              by Admin
            </span>
            {publishedLabel ? (
              <span className="inline-flex items-center gap-2">
                <i className="fas fa-calendar-alt text-primary text-xs" />
                {publishedLabel}
              </span>
            ) : null}
            <span className="inline-flex items-center gap-2">
              <i className="fas fa-bookmark text-primary text-xs" />
              {kind}
            </span>
            {event.location ? (
              <span className="inline-flex min-w-0 items-center gap-2">
                <i className="fas fa-map-marker-alt text-primary text-xs" />
                <span className="truncate">{event.location}</span>
              </span>
            ) : null}
          </div>

          {/* Title */}
          <h2
            className="mb-8 font-[var(--font-heading)] text-2xl font-bold leading-snug tracking-[-0.02em] text-ink md:mb-10 md:text-3xl lg:text-[2.15rem]"
            style={{ color: "var(--color-ink, #14181f)" }}
          >
            {event.title}
          </h2>

          {/* Fact strip — Start / End / Location / Duration (demo style) */}
          <div className="mb-10 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-line bg-line md:grid-cols-4">
            {facts.map((fact) => (
              <div
                key={fact.label}
                className="bg-white px-4 py-5 text-center sm:px-5 sm:py-6"
              >
                <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-primary/8 text-primary">
                  <i className={`${fact.icon} text-sm`} />
                </div>
                <p className="text-[0.7rem] font-bold uppercase tracking-[0.12em] text-primary">
                  {fact.label}
                </p>
                <p className="mt-1.5 text-sm font-semibold leading-snug text-ink">
                  {fact.value}
                </p>
              </div>
            ))}
          </div>

          {/* Body */}
          <div className="max-w-none text-base leading-[1.85] text-ink-soft md:text-lg [&_p]:mb-5">
            {body.split(/\n\n+/).map((para, i) => (
              <p key={i} className="mb-5 text-justify last:mb-0">
                {para.trim()}
              </p>
            ))}
          </div>

          {event.organizer ? (
            <p className="mt-8 text-sm text-muted">
              <span className="font-semibold text-ink">Organizer: </span>
              {event.organizer}
            </p>
          ) : null}

          {/* Tags + Share (demo footer of post) */}
          <div className="mt-12 flex flex-col gap-6 border-t border-line pt-8 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <span className="mr-3 text-sm font-bold text-ink">Tags:</span>
              <div className="mt-2 inline-flex flex-wrap gap-2 sm:mt-0 sm:inline-flex">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-line bg-surface-alt px-3 py-1 text-xs font-semibold text-muted"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm font-bold text-ink">Share:</span>
              <div className="flex gap-2">
                {[
                  { icon: "fab fa-facebook-f", label: "Facebook" },
                  { icon: "fab fa-twitter", label: "Twitter" },
                  { icon: "fab fa-linkedin-in", label: "LinkedIn" },
                  { icon: "fas fa-link", label: "Copy link" },
                ].map((s) => (
                  <span
                    key={s.label}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-sm text-muted transition-colors hover:border-primary hover:bg-primary hover:text-white"
                    aria-label={s.label}
                  >
                    <i className={s.icon} />
                  </span>
                ))}
              </div>
            </div>
          </div>

          {status === "Upcoming" && (
            <div className="mt-10 rounded-xl border border-primary/20 bg-primary/5 px-6 py-6 text-center sm:px-8">
              <p className="mb-4 text-sm text-ink-soft md:text-base">
                Interested in attending or partnering on this event?
              </p>
              <Link
                href={registerUrl || "/contact-us"}
                {...(registerUrl
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
                className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-semibold text-white hover:bg-primary-light"
              >
                {registerUrl ? "Register / more info" : "Register interest"}
                <i className="fas fa-arrow-right text-xs opacity-90" />
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
