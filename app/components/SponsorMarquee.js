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
    <div className="w-full bg-white py-12 border-y border-black/10 overflow-hidden flex flex-col items-center">
      {" "}
      <h3 className="text-sm font-bold text-black/70 uppercase tracking-widest mb-8">
        {" "}
        Trusted by Leading Organizations{" "}
      </h3>{" "}
      <div className="relative flex overflow-x-hidden w-full max-w-[1400px] group">
        {" "}
        <div className="animate-marquee whitespace-nowrap flex items-center gap-16 px-8 group-hover:[animation-play-state:paused]">
          {" "}
          {[...SPONSORS, ...SPONSORS, ...SPONSORS].map((sponsor, i) => (
            <div
              key={i}
              className="flex items-center justify-center transition-transform duration-300 hover:-translate-y-1 w-[150px] flex-shrink-0 cursor-pointer"
            >
              {" "}
              <Image
                src={sponsor.logo}
                alt={sponsor.name}
                width={150}
                height={60}
                className="object-contain max-h-[60px]"
              />{" "}
            </div>
          ))}{" "}
        </div>{" "}
        {/* Gradient Fades */}{" "}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 max-w-[200px] bg-white/70" />{" "}
        <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 max-w-[200px] bg-white/70" />{" "}
      </div>{" "}
      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(calc(-150px * 10 - 4rem * 10));
          }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
      `}</style>{" "}
    </div>
  );
}
