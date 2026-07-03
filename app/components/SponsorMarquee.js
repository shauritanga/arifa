"use client";

import Image from "next/image";

const SPONSORS = [
  { name: "Sponsor 1", logo: "https://via.placeholder.com/150x60/f1f5f9/94a3b8?text=TechCorp" },
  { name: "Sponsor 2", logo: "https://via.placeholder.com/150x60/f1f5f9/94a3b8?text=InnovateInc" },
  { name: "Sponsor 3", logo: "https://via.placeholder.com/150x60/f1f5f9/94a3b8?text=GlobalNet" },
  { name: "Sponsor 4", logo: "https://via.placeholder.com/150x60/f1f5f9/94a3b8?text=FutureAI" },
  { name: "Sponsor 5", logo: "https://via.placeholder.com/150x60/f1f5f9/94a3b8?text=DataSystems" },
  { name: "Sponsor 6", logo: "https://via.placeholder.com/150x60/f1f5f9/94a3b8?text=SmartSolutions" },
];

export default function SponsorMarquee() {
  return (
    <div className="w-full bg-white py-12 border-y border-border-light overflow-hidden flex flex-col items-center">
      <h3 className="text-sm font-bold text-[var(--color-text-muted)] uppercase tracking-widest mb-8">
        Trusted by Leading Organizations
      </h3>
      
      <div className="relative flex overflow-x-hidden w-full max-w-[1400px] group">
        <div className="animate-marquee whitespace-nowrap flex items-center gap-16 px-8 group-hover:[animation-play-state:paused]">
          {[...SPONSORS, ...SPONSORS, ...SPONSORS].map((sponsor, i) => (
            <div key={i} className="flex items-center justify-center grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-300 w-[150px] flex-shrink-0 cursor-pointer">
              <Image 
                src={sponsor.logo} 
                alt={sponsor.name} 
                width={150} 
                height={60} 
                className="object-contain max-h-[60px]"
                unoptimized
              />
            </div>
          ))}
        </div>

        {/* Gradient Fades */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 max-w-[200px] bg-gradient-to-r from-white to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 max-w-[200px] bg-gradient-to-l from-white to-transparent" />
      </div>

      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(calc(-150px * 6 - 4rem * 6)); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
      `}</style>
    </div>
  );
}
