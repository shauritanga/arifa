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
      { threshold: 0.15, rootMargin: "0px 0px -50px 0px" },
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
      {" "}
      {children}{" "}
    </div>
  );
}
export default function Engagements({ engagements }) {
  const upcomingEvents = engagements.filter((e) => e.type === "Upcoming");
  const pastEvents = engagements.filter((e) => e.type === "Past");
  return (
    <>
      {" "}
      {/* ====== Page Header ====== */}{" "}
      <section className="relative pt-40 pb-24 bg-primary overflow-hidden">
        {" "}
        <div className="absolute inset-0 z-0">
          {" "}
          <Image
            src="/about-img.png"
            alt="Events Background"
            fill
            className="object-cover object-center opacity-35"
            priority
          />{" "}
          <div className="absolute inset-0 bg-primary/70" />{" "}
        </div>{" "}
        <div className="max-w-[1200px] w-full mx-auto px-6 relative z-10 text-center">
          {" "}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6 animate-fadeInUp font-[var(--font-heading)]">
            {" "}
            Our <span className="text-secondary">Engagements</span>{" "}
          </h1>{" "}
          <p className="text-lg md:text-xl text-white/80 max-w-[700px] mx-auto animate-fadeInUp animate-delay-100">
            {" "}
            A comprehensive overview of ARIFA&apos;s past and upcoming
            conferences, workshops, and strategic partnerships.{" "}
          </p>{" "}
        </div>{" "}
      </section>{" "}
      {/* ====== Upcoming Events ====== */}{" "}
      <section className="py-24 bg-white">
        {" "}
        <div className="max-w-[1200px] mx-auto px-6">
          {" "}
          <div className="text-center mb-16">
            {" "}
            <span className="text-primary font-bold tracking-wider uppercase text-sm mb-2 block">
              Join Us
            </span>{" "}
            <h2 className="text-3xl md:text-4xl font-extrabold text-black font-[var(--font-heading)]">
              {" "}
              Upcoming Events{" "}
            </h2>{" "}
            <div className="w-20 h-1 bg-primary mx-auto mt-6 rounded-full" />{" "}
          </div>{" "}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {" "}
            {upcomingEvents.map((event, idx) => (
              <RevealOnScroll
                key={idx}
                delay={(idx % 3) * 100}
                className="bg-white rounded-2xl flex flex-col overflow-hidden border border-black/10 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] hover:-translate-y-2 transition-all duration-300 group"
              >
                {" "}
                {/* Date Header */}{" "}
                <div className="bg-primary text-white p-6 relative overflow-hidden">
                  {" "}
                  <div className="flex items-center gap-4 relative z-10">
                    {" "}
                    <span className="text-5xl font-extrabold font-[var(--font-heading)] leading-none">
                      {event.day}
                    </span>{" "}
                    <div className="flex flex-col">
                      {" "}
                      <span className="text-lg font-bold uppercase tracking-widest text-secondary leading-tight">
                        {event.month}
                      </span>{" "}
                      <span className="text-sm font-medium opacity-90">
                        {event.year}
                      </span>{" "}
                    </div>{" "}
                  </div>{" "}
                </div>{" "}
                {/* Content */}{" "}
                <div className="p-8 flex-grow flex flex-col">
                  {" "}
                  <h3 className="text-xl font-bold text-black font-[var(--font-heading)] mb-4 group-hover:text-primary transition-colors leading-snug">
                    {" "}
                    {event.title}{" "}
                  </h3>{" "}
                  <p className="text-sm font-semibold text-black/70 mb-4 flex items-center gap-2">
                    {" "}
                    <i className="fas fa-map-marker-alt text-secondary" />{" "}
                    {event.location}{" "}
                  </p>{" "}
                  <p className="text-black/70 leading-relaxed text-sm flex-grow">
                    {" "}
                    {event.desc}{" "}
                  </p>{" "}
                  <div className="mt-8 pt-6 border-t border-black/10">
                    {" "}
                    <Link
                      href="/contact-us"
                      className="inline-flex items-center text-sm font-bold text-primary hover:text-secondary transition-colors group/link"
                    >
                      {" "}
                      Register Now{" "}
                      <i className="fas fa-arrow-right ml-2 text-[0.8em] group-hover/link:translate-x-1 transition-transform" />{" "}
                    </Link>{" "}
                  </div>{" "}
                </div>{" "}
              </RevealOnScroll>
            ))}{" "}
          </div>{" "}
        </div>{" "}
      </section>{" "}
      {/* ====== Past Events ====== */}{" "}
      <section className="py-24 bg-white border-t border-black/10">
        {" "}
        <div className="max-w-[1200px] mx-auto px-6">
          {" "}
          <div className="text-center mb-16">
            {" "}
            <span className="text-secondary font-bold tracking-wider uppercase text-sm mb-2 block">
              Our Track Record
            </span>{" "}
            <h2 className="text-3xl md:text-4xl font-extrabold text-black font-[var(--font-heading)]">
              {" "}
              Past Engagements{" "}
            </h2>{" "}
            <div className="w-20 h-1 bg-secondary mx-auto mt-6 rounded-full" />{" "}
          </div>{" "}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {" "}
            {pastEvents.map((event, idx) => (
              <RevealOnScroll
                key={idx}
                delay={(idx % 3) * 50}
                className="bg-white rounded-2xl flex flex-col overflow-hidden border border-black/10 hover:shadow-xl hover:shadow-black/5 hover:-translate-y-1 transition-all duration-300 group"
              >
                {" "}
                {/* Date Header */}{" "}
                <div className="bg-primary text-white p-5 flex items-center gap-3 border-b-4 border-transparent group-hover:border-primary transition-colors">
                  {" "}
                  <span className="text-3xl font-extrabold font-[var(--font-heading)] leading-none text-white/90">
                    {event.day}
                  </span>{" "}
                  <div className="flex flex-col">
                    {" "}
                    <span className="text-sm font-bold uppercase tracking-widest text-secondary leading-tight">
                      {event.month}
                    </span>{" "}
                    <span className="text-xs font-medium opacity-60">
                      {event.year}
                    </span>{" "}
                  </div>{" "}
                </div>{" "}
                {/* Content */}{" "}
                <div className="p-6 flex-grow flex flex-col">
                  {" "}
                  <h3 className="text-lg font-bold text-black font-[var(--font-heading)] mb-3 group-hover:text-primary transition-colors leading-snug">
                    {" "}
                    {event.title}{" "}
                  </h3>{" "}
                  <p className="text-xs font-semibold text-black/70 mb-4 flex items-center gap-2">
                    {" "}
                    <i className="fas fa-map-marker-alt text-secondary" />{" "}
                    {event.location}{" "}
                  </p>{" "}
                  <p className="text-sm text-black/70 leading-relaxed line-clamp-4 group-hover:line-clamp-none transition-all duration-500">
                    {" "}
                    {event.desc}{" "}
                  </p>{" "}
                </div>{" "}
              </RevealOnScroll>
            ))}{" "}
          </div>{" "}
        </div>{" "}
      </section>{" "}
    </>
  );
}
