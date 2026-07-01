"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";

function RevealOnScroll({ children, className = "", delay = 0 }) {
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          entries[0].target.classList.add("opacity-100", "translate-y-0");
          entries[0].target.classList.remove("opacity-0", "translate-y-6");
          observer.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -50px 0px" }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`opacity-0 translate-y-6 transition-all duration-700 ease-out ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

const teamMembers = [
  {
    name: "Eng. Dr. Dennis N. Mwighusa",
    role: "Board of Directors",
    image: "https://arifa.org/storage/images/01HZHKKXFJBVFD51RWVTH13JY6.png",
    socials: { linkedin: "#", twitter: "#" }
  },
  {
    name: "Eng. Prof. Zaipuna O. Yonah",
    role: "Board of Directors",
    image: "https://arifa.org/storage/images/Eng_Dr_Zaipuna_O_Yonah_v1.png",
    socials: { linkedin: "#", twitter: "#" }
  },
  {
    name: "Dr. Sarah Akinyi",
    role: "Director of Research",
    image: "https://arifa.org/storage/images/01HZHKKXFJBVFD51RWVTH13JY6.png",
    socials: { linkedin: "#", twitter: "#" }
  },
  {
    name: "Prof. Kwame Osei",
    role: "Head of Training & Certification",
    image: "https://arifa.org/storage/images/Eng_Dr_Zaipuna_O_Yonah_v1.png",
    socials: { linkedin: "#", twitter: "#" }
  },
  {
    name: "Fatima Hassan",
    role: "Lead Data Scientist",
    image: "https://arifa.org/storage/images/01HZHKKXFJBVFD51RWVTH13JY6.png",
    socials: { linkedin: "#", twitter: "#" }
  },
  {
    name: "Dr. David Nwachukwu",
    role: "Senior AI Researcher",
    image: "https://arifa.org/storage/images/Eng_Dr_Zaipuna_O_Yonah_v1.png",
    socials: { linkedin: "#", twitter: "#" }
  }
];

export default function Team() {
  return (
    <>
      {/* ====== Page Header ====== */}
      <section className="relative pt-40 pb-24 bg-dark overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/hero-bg.png"
            alt="ARIFA Team Background"
            fill
            className="object-cover object-center opacity-20"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-dark/90 via-dark/80 to-dark" />
        </div>
        
        <div className="max-w-[1200px] w-full mx-auto px-6 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm font-semibold mb-6 animate-fadeInUp">
            Our People
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6 animate-fadeInUp animate-delay-100 font-[var(--font-heading)]">
            Meet the <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-[#FDE68A]">ARIFA Team</span>
          </h1>
          <p className="text-lg md:text-xl text-white/80 max-w-[700px] mx-auto animate-fadeInUp animate-delay-200">
            Our team brings together decades of combined experience in artificial intelligence research, engineering, and tech education across the continent.
          </p>
        </div>
      </section>

      {/* ====== Team Grid ====== */}
      <section className="py-24 bg-[var(--color-surface)] min-h-[60vh]">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member, idx) => (
              <RevealOnScroll key={idx} delay={(idx % 3) * 100} className="bg-white rounded-2xl overflow-hidden border border-border-light shadow-[0_4px_20px_rgba(26,26,46,0.03)] hover:shadow-[0_20px_40px_rgba(26,26,46,0.08)] hover:-translate-y-1 transition-all group">
                <div className="relative h-72 w-full overflow-hidden bg-[var(--color-surface-alt)]">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover object-top group-hover:scale-105 transition-transform duration-700 mix-blend-multiply"
                  />
                  {/* Social Overlay */}
                  <div className="absolute inset-0 bg-primary/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
                    {member.socials.linkedin && (
                      <a href={member.socials.linkedin} className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-primary hover:bg-secondary hover:text-white transition-colors" aria-label="LinkedIn">
                        <i className="fab fa-linkedin-in" />
                      </a>
                    )}
                    {member.socials.twitter && (
                      <a href={member.socials.twitter} className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-primary hover:bg-secondary hover:text-white transition-colors" aria-label="Twitter">
                        <i className="fab fa-twitter" />
                      </a>
                    )}
                  </div>
                </div>
                <div className="p-8 text-center">
                  <h3 className="text-xl font-bold text-dark font-[var(--font-heading)] mb-1">{member.name}</h3>
                  <p className="text-sm font-semibold text-primary uppercase tracking-wider">{member.role}</p>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* ====== Join Team CTA ====== */}
      <section className="py-20 bg-white border-t border-border-light text-center">
        <div className="max-w-[800px] mx-auto px-6">
          <h2 className="text-3xl font-bold text-dark font-[var(--font-heading)] mb-4">Want to Join Our Mission?</h2>
          <p className="text-[var(--color-text-muted)] text-lg mb-8">
            We are always looking for passionate researchers, educators, and innovators to join our team. Check out our open positions.
          </p>
          <Link href="/opportunities/careers" className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-primary text-primary rounded-full font-bold hover:bg-primary hover:text-white transition-all">
            View Career Opportunities <i className="fas fa-arrow-right text-sm" />
          </Link>
        </div>
      </section>
    </>
  );
}
