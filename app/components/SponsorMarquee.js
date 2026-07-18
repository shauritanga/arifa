"use client";
import Image from "next/image";

/**
 * Partner logo marquee. Sponsors are managed in Admin → Content → Sponsors.
 * Falls back to nothing when the list is empty so a fresh DB still renders.
 */
export default function SponsorMarquee({ sponsors = [] }) {
  const list = Array.isArray(sponsors)
    ? sponsors.filter((s) => s?.name && s?.logo)
    : [];

  if (list.length === 0) return null;

  // Two copies so a -50% translate loops seamlessly regardless of count.
  const track = [...list, ...list];

  return (
    <div className="w-full bg-surface-alt py-14 border-y border-line overflow-hidden flex flex-col items-center">
      <h3 className="text-xs font-semibold text-muted uppercase tracking-[0.16em] mb-10">
        Trusted by Leading Organizations
      </h3>
      <div className="relative flex overflow-x-hidden w-full max-w-[1200px] group">
        <div className="animate-marquee whitespace-nowrap flex items-center gap-16 px-6 group-hover:[animation-play-state:paused] w-max">
          {track.map((sponsor, i) => {
            const logo = (
              <div className="flex items-center justify-center w-[180px] flex-shrink-0 opacity-95 transition-opacity duration-300 hover:opacity-100">
                <Image
                  src={sponsor.logo}
                  alt={sponsor.name}
                  width={180}
                  height={72}
                  className="object-contain max-h-[68px] w-auto"
                />
              </div>
            );

            if (sponsor.url) {
              return (
                <a
                  key={`${sponsor.name}-${i}`}
                  href={sponsor.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="outline-none focus-visible:ring-2 focus-visible:ring-primary/40 rounded"
                  title={sponsor.name}
                >
                  {logo}
                </a>
              );
            }

            return <div key={`${sponsor.name}-${i}`}>{logo}</div>;
          })}
        </div>
        <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-surface-alt to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-surface-alt to-transparent" />
      </div>
      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-marquee {
          animation: marquee 36s linear infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-marquee {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}
