"use client";
import Image from "next/image";

const SPONSORS = [
  {
    name: "Agripoa",
    logo: "/images/sponsors-logos/agripoa-logo.png",
  },
  {
    name: "COSTECH",
    logo: "/images/sponsors-logos/costech-logo.png",
  },
  {
    name: "ICT Commission",
    logo: "/images/sponsors-logos/ict-logo.png",
  },
  {
    name: "Jamhuri",
    logo: "/images/sponsors-logos/jamhuri-logo.png",
  },
  {
    name: "TAHIA",
    logo: "/images/sponsors-logos/tahia-logo.png",
  },
  {
    name: "TCRA",
    logo: "/images/sponsors-logos/tcra-logo.png",
  },
  {
    name: "TTCL",
    logo: "/images/sponsors-logos/ttcl-logo.png",
  },
  {
    name: "University of Dodoma",
    logo: "/images/sponsors-logos/udom-logo.png",
  },
  {
    name: "USAID",
    logo: "/images/sponsors-logos/usaid-logo.png",
  },
  {
    name: "World Vision",
    logo: "/images/sponsors-logos/wv-logo.svg",
  },
];

export default function SponsorMarquee() {
  return (
    <div className="w-full bg-surface-alt py-14 border-y border-line overflow-hidden flex flex-col items-center">
      <h3 className="text-xs font-semibold text-muted uppercase tracking-[0.16em] mb-10">
        Trusted by Leading Organizations
      </h3>
      <div className="relative flex overflow-x-hidden w-full max-w-[1200px] group">
        <div className="animate-marquee whitespace-nowrap flex items-center gap-14 px-6 group-hover:[animation-play-state:paused]">
          {[...SPONSORS, ...SPONSORS, ...SPONSORS].map((sponsor, i) => (
            <div
              key={`${sponsor.name}-${i}`}
              className="flex items-center justify-center w-[140px] flex-shrink-0 opacity-70 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-300"
            >
              <Image
                src={sponsor.logo}
                alt={sponsor.name}
                width={140}
                height={52}
                className="object-contain max-h-[48px]"
              />
            </div>
          ))}
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
            transform: translateX(calc(-140px * 10 - 3.5rem * 10));
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
