"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import teamData from "../data/team.json";

const FALLBACK_IMAGE = "https://arifa.org/storage/images/user_avatar.png";

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
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
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

function TeamCard({ member, category, index, onSelect }) {
  const imageSrc = member.image || FALLBACK_IMAGE;

  return (
    <RevealOnScroll delay={(index % 4) * 100} className="h-full">
      <button
        type="button"
        onClick={() => onSelect(member)}
        className="group relative flex h-full w-full flex-col overflow-hidden rounded-2xl border border-black/10 bg-white text-left shadow-[0_18px_45px_rgba(26,26,46,0.06)] transition-all duration-300 hover:-translate-y-2 hover:border-[#00803D]/60 hover:shadow-[0_24px_60px_rgba(26,26,46,0.12)] focus:outline-none focus-visible:ring-4 focus-visible:ring-[#00803D]/30"
      >
        <div className="relative mx-6 mt-6 aspect-[4/5] overflow-hidden rounded-xl bg-[var(--color-surface)]">
          <div className="absolute right-0 top-0 z-10 h-16 w-16 border-r-2 border-t-2 border-[#00803D]" />
          <Image
            src={imageSrc}
            alt={member.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-dark/55 to-transparent" />
          <span className="absolute bottom-4 left-4 rounded-full bg-white/90 px-3 py-1 text-xs font-bold uppercase tracking-[0.08em] text-[#990000] shadow-sm backdrop-blur">
            {category}
          </span>
        </div>

        <div className="flex flex-1 flex-col p-6">
          <div className="mb-4">
            <div className="mb-4 flex h-[3px] w-16 overflow-hidden rounded-full">
              <span className="h-full flex-1 bg-[#990000]" />
              <span className="h-full flex-1 bg-[#00803D]" />
            </div>
            <h3 className="font-[var(--font-heading)] text-xl font-extrabold leading-tight text-dark">
              {member.name}
            </h3>
          </div>

          <p className="mb-6 line-clamp-3 text-sm leading-relaxed text-[var(--color-text-muted)]">
            {member.bio}
          </p>

          <div className="mt-auto flex items-center justify-between border-t border-[#EFEAE2] pt-4">
            <span className="text-xs font-bold uppercase tracking-[0.12em] text-[#990000]">
              Profile
            </span>
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#00803D]/10 text-[#00803D] transition-colors group-hover:bg-[#990000] group-hover:text-white">
              <i className="fas fa-arrow-right text-sm" aria-hidden="true" />
            </span>
          </div>
        </div>
      </button>
    </RevealOnScroll>
  );
}

export default function TeamPage() {
  const categories = Object.keys(teamData);
  const [activeTab, setActiveTab] = useState(categories[0]);
  const [selectedMember, setSelectedMember] = useState(null);

  return (
    <>
      {/* ====== Page Header ====== */}
      <section className="relative pt-40 pb-24 bg-dark overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/about-img.png"
            alt="Our Team Background"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-dark/90 via-dark/80 to-dark" />
        </div>
        
        <div className="max-w-[1200px] w-full mx-auto px-6 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm font-semibold mb-6 animate-fadeInUp">
            About Us
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6 animate-fadeInUp animate-delay-100 font-[var(--font-heading)]">
            Meet Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#990000] to-[#00803D]">Team</span>
          </h1>
          <p className="text-lg md:text-xl text-white/80 max-w-[700px] mx-auto animate-fadeInUp animate-delay-200">
            A dedicated group of researchers, engineers, and professionals driving innovation in AI and digital transformation across Africa.
          </p>
        </div>
      </section>

      {/* ====== Team Grid with Tabs ====== */}
      <section className="py-24 bg-[#F8FAFC] min-h-[60vh]">
        <div className="max-w-[1400px] mx-auto px-6">
          
          {/* Tab Navigation */}
          <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mb-16 animate-fadeInUp">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveTab(category)}
                className={`px-6 sm:px-8 py-3 rounded-full text-sm font-semibold transition-all duration-300 ${
                  activeTab === category
                    ? "bg-[#990000] text-white shadow-lg shadow-[#990000]/30 -translate-y-1"
                    : "bg-white text-dark hover:bg-surface border border-border-light shadow-sm hover:-translate-y-1"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="mb-24">
            <RevealOnScroll key={activeTab}>
              <div className="mx-auto mb-12 max-w-[760px] text-center">
                <span className="mb-3 block text-sm font-bold uppercase tracking-[0.18em] text-[#990000]">
                  ARIFA People
                </span>
                <h2 className="text-3xl font-extrabold text-dark font-[var(--font-heading)]">{activeTab}</h2>
                <p className="mt-4 text-[var(--color-text-muted)]">
                  Explore the people shaping ARIFA&apos;s research, governance, partnerships, and day-to-day institutional work.
                </p>
                <div className="mx-auto mt-5 flex h-1 w-16 overflow-hidden rounded-full">
                  <span className="h-full flex-1 bg-[#990000]" />
                  <span className="h-full flex-1 bg-[#00803D]" />
                </div>
              </div>
            </RevealOnScroll>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {teamData[activeTab].map((member, index) => (
                <TeamCard
                  key={`${activeTab}-${member.name}-${index}`}
                  member={member}
                  category={activeTab}
                  index={index}
                  onSelect={setSelectedMember}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ====== Modal for Team Member Bio ====== */}
      {selectedMember && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          <div 
            className="absolute inset-0 bg-dark/60 backdrop-blur-sm"
            onClick={() => setSelectedMember(null)}
          />
          <div className="bg-white rounded-2xl overflow-hidden w-full max-w-4xl max-h-[90vh] flex flex-col md:flex-row relative z-10 shadow-2xl animate-fadeInUp">
            <button 
              onClick={() => setSelectedMember(null)}
              aria-label="Close profile"
              className="absolute top-4 right-4 w-10 h-10 bg-white/90 hover:bg-surface rounded-full flex items-center justify-center text-dark z-20 transition-colors shadow-sm focus:outline-none focus-visible:ring-4 focus-visible:ring-[#00803D]/30"
            >
              <i className="fas fa-times text-xl" aria-hidden="true" />
            </button>
            
            <div className="w-full md:w-2/5 h-72 md:h-auto relative bg-surface">
              <Image
                src={selectedMember.image || FALLBACK_IMAGE}
                alt={selectedMember.name}
                fill
                sizes="(max-width: 768px) 100vw, 40vw"
                className="object-cover object-top"
              />
              <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-dark/50 to-transparent md:hidden" />
            </div>
            
            <div className="w-full md:w-3/5 p-8 md:p-12 overflow-y-auto">
              <div className="mb-6 flex h-1 w-12 overflow-hidden rounded-full">
                <span className="h-full flex-1 bg-[#990000]" />
                <span className="h-full flex-1 bg-[#00803D]" />
              </div>
              <span className="mb-3 inline-flex rounded-full bg-[#00803D]/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] text-[#990000]">
                {activeTab}
              </span>
              <h2 className="text-3xl font-extrabold text-dark font-[var(--font-heading)] mb-6">
                {selectedMember.name}
              </h2>
              <div className="prose prose-lg text-[var(--color-text-body)] leading-relaxed">
                <p>{selectedMember.bio}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
