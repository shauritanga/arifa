import Image from "next/image";
import Link from "next/link";

/**
 * High-contrast detail page hero.
 * Text sits on solid dark surfaces — background photos never fight the title.
 */
export default function DetailHero({
  breadcrumb = [],
  badge,
  title,
  description,
  image,
  imageAlt = "",
  actions,
}) {
  return (
    <section
      className="relative overflow-hidden bg-night pt-28 pb-12 md:pt-36 md:pb-16 border-b border-white/10"
      style={{ color: "#ffffff" }}
    >
      {/* Ambient brand glow only — no photo under type */}
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_0%_0%,rgba(139,0,0,0.35),transparent_55%),radial-gradient(ellipse_50%_40%_at_100%_100%,rgba(13,122,66,0.12),transparent_50%)]"
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-[1200px] mx-auto px-6">
        {breadcrumb.length > 0 && (
          <nav
            className="flex flex-wrap items-center gap-2 text-sm text-white/60 mb-8 font-medium"
            aria-label="Breadcrumb"
          >
            {breadcrumb.map((item, i) => (
              <span key={`${item.label}-${i}`} className="inline-flex items-center gap-2">
                {i > 0 && (
                  <i className="fas fa-chevron-right text-[0.55rem] text-white/30" />
                )}
                {item.href ? (
                  <Link
                    href={item.href}
                    className="hover:text-white transition-colors inline-flex items-center gap-1.5"
                  >
                    {i === 0 && (
                      <i className="fas fa-home text-white/40 text-xs" />
                    )}
                    {item.label}
                  </Link>
                ) : (
                  <span className="text-white/90 truncate max-w-[10rem] sm:max-w-[16rem] md:max-w-sm">
                    {item.label}
                  </span>
                )}
              </span>
            ))}
          </nav>
        )}

        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          <div className={`${image ? "lg:col-span-8" : "lg:col-span-12"} max-w-4xl`}>
            {badge && (
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/20 bg-white/10 text-[#b6ecc9] text-xs font-semibold uppercase tracking-[0.14em] mb-5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#b6ecc9]" />
                {badge}
              </span>
            )}
            <h1
              className="text-2xl sm:text-3xl md:text-4xl font-bold leading-[1.25] font-[var(--font-heading)] tracking-[-0.02em]"
              style={{ color: "#ffffff" }}
            >
              {title}
            </h1>
            {description && (
              <p
                className="mt-5 text-base md:text-lg leading-relaxed max-w-2xl"
                style={{ color: "rgba(255,255,255,0.78)" }}
              >
                {description}
              </p>
            )}
            {actions && <div className="mt-7">{actions}</div>}
          </div>

          {image && (
            <div className="lg:col-span-4">
              <div className="relative aspect-[4/3] w-full max-w-md lg:max-w-none rounded-xl overflow-hidden border border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.35)] bg-night-soft">
                <Image
                  src={image}
                  alt={imageAlt || title}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 1024px) 100vw, 320px"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      <div
        className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-primary via-primary to-secondary"
        aria-hidden="true"
      />
    </section>
  );
}
