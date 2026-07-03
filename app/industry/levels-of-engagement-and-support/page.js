"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import SponsorMarquee from "../../components/SponsorMarquee";
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
export default function IndustryEngagement() {
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
            alt="Industry Engagement Background"
            fill
            className="object-cover object-center opacity-20"
            priority
          />{" "}
          <div className="absolute inset-0 bg-primary/85" />{" "}
        </div>{" "}
        <div className="max-w-[1200px] w-full mx-auto px-6 relative z-10 text-center">
          {" "}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white text-sm font-semibold mb-6 animate-fadeInUp">
            {" "}
            Industry{" "}
          </div>{" "}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6 animate-fadeInUp animate-delay-100 font-[var(--font-heading)]">
            {" "}
            Levels of Engagement{" "}
            <span className="text-secondary">& Support</span>{" "}
          </h1>{" "}
          <p className="text-lg md:text-xl text-white/80 max-w-[700px] mx-auto animate-fadeInUp animate-delay-200">
            {" "}
            Partner with ARIFA to accelerate AI adoption in your organization.
            We offer tiered engagement models to bridge the gap between academic
            research and commercial application.{" "}
          </p>{" "}
        </div>{" "}
      </section>{" "}
      {/* ====== Sponsor Marquee ====== */} <SponsorMarquee />{" "}
      {/* ====== Engagement Models ====== */}{" "}
      <section className="py-24 bg-white min-h-[60vh]">
        {" "}
        <div className="max-w-[1200px] mx-auto px-6">
          {" "}
          <div className="text-center max-w-[700px] mx-auto mb-16">
            {" "}
            <h2 className="text-3xl font-bold text-black font-[var(--font-heading)] mb-6">
              Sponsorship Packages
            </h2>{" "}
            <p className="text-black/70 text-lg">
              {" "}
              Pricing plans for Digital Transformation. Choose a partnership
              tier that best aligns with your organizational goals.{" "}
            </p>{" "}
          </div>{" "}
          <div className="grid lg:grid-cols-3 gap-8">
            {" "}
            {/* Basic Package */}{" "}
            <RevealOnScroll
              delay={100}
              className="bg-white rounded-2xl p-10 border border-black/10 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] transition-all flex flex-col relative overflow-hidden"
            >
              {" "}
              <div className="absolute top-0 right-0 w-24 h-24 bg-white rounded-bl-full -z-10" />{" "}
              <div className="w-14 h-14 rounded-full bg-white text-primary flex items-center justify-center text-xl mb-6">
                {" "}
                <i className="fas fa-handshake" />{" "}
              </div>{" "}
              <h3 className="text-2xl font-bold text-black font-[var(--font-heading)] mb-2">
                Basic Package
              </h3>{" "}
              <div className="mb-6">
                {" "}
                <span className="text-3xl font-extrabold text-black">
                  $25,000
                </span>{" "}
                <span className="text-sm font-bold text-black/70 uppercase tracking-wider ml-1">
                  / Annually
                </span>{" "}
              </div>{" "}
              <p className="text-black/70 mb-8 font-medium">
                {" "}
                Pricing plan for Digital Transformation{" "}
              </p>{" "}
              <ul className="space-y-4 mb-10 flex-grow">
                {" "}
                <li className="flex items-start gap-3 text-sm font-medium text-black">
                  {" "}
                  <i className="fas fa-check-circle text-secondary mt-0.5 min-w-[16px]" />{" "}
                  <span>Publications & Newspaper</span>{" "}
                </li>{" "}
                <li className="flex items-start gap-3 text-sm font-medium text-black">
                  {" "}
                  <i className="fas fa-check-circle text-secondary mt-0.5 min-w-[16px]" />{" "}
                  <span>Invitation to ARIFA events</span>{" "}
                </li>{" "}
                <li className="flex items-start gap-3 text-sm font-medium text-black">
                  {" "}
                  <i className="fas fa-check-circle text-secondary mt-0.5 min-w-[16px]" />{" "}
                  <span>Donor recognition on the ARIFA website</span>{" "}
                </li>{" "}
                <li className="flex items-start gap-3 text-sm font-medium text-black">
                  {" "}
                  <i className="fas fa-check-circle text-secondary mt-0.5 min-w-[16px]" />{" "}
                  <span>
                    Fellowship and Internship recruiting opportunities
                  </span>{" "}
                </li>{" "}
                <li className="flex items-start gap-3 text-sm font-medium text-black">
                  {" "}
                  <i className="fas fa-check-circle text-secondary mt-0.5 min-w-[16px]" />{" "}
                  <span>
                    Opportunities to provide guest lectures and to sponsor
                    networking events.
                  </span>{" "}
                </li>{" "}
              </ul>{" "}
              <Link
                href="/contact-us"
                className="w-full py-4 border-2 border-primary text-primary rounded-xl font-bold text-center hover:bg-primary hover:text-white transition-all"
              >
                {" "}
                Choose Basic{" "}
              </Link>{" "}
            </RevealOnScroll>{" "}
            {/* Standard Package */}{" "}
            <RevealOnScroll
              delay={200}
              className="bg-primary rounded-2xl p-10 border border-primary shadow-[0_20px_40px_rgba(0,0,0,0.15)] transition-all flex flex-col relative overflow-hidden lg:-translate-y-4"
            >
              {" "}
              <div className="absolute top-0 left-0 w-full h-2 bg-secondary" />{" "}
              <div className="absolute top-4 right-4 bg-primary/30 text-secondary text-xs font-bold px-3 py-1 rounded-full border border-secondary/30">
                {" "}
                RECOMMENDED{" "}
              </div>{" "}
              <div className="w-14 h-14 rounded-full bg-primary/20 text-secondary flex items-center justify-center text-xl mb-6">
                {" "}
                <i className="fas fa-star" />{" "}
              </div>{" "}
              <h3 className="text-2xl font-bold text-white font-[var(--font-heading)] mb-2">
                Standard Package
              </h3>{" "}
              <div className="mb-6">
                {" "}
                <span className="text-3xl font-extrabold text-white">
                  $50,000
                </span>{" "}
                <span className="text-sm font-bold text-white/50 uppercase tracking-wider ml-1">
                  / Annually
                </span>{" "}
              </div>{" "}
              <p className="text-white/70 mb-8 font-medium">
                {" "}
                All ARIFA Level 1 Partner opportunities, plus:{" "}
              </p>{" "}
              <ul className="space-y-4 mb-10 flex-grow">
                {" "}
                <li className="flex items-start gap-3 text-sm font-medium text-white/90">
                  {" "}
                  <i className="fas fa-check-circle text-secondary mt-0.5 min-w-[16px]" />{" "}
                  <span>Contract Research & Project Management</span>{" "}
                </li>{" "}
                <li className="flex items-start gap-3 text-sm font-medium text-white/90">
                  {" "}
                  <i className="fas fa-check-circle text-secondary mt-0.5 min-w-[16px]" />{" "}
                  <span>Personnel Exchange: Research & Advisory</span>{" "}
                </li>{" "}
                <li className="flex items-start gap-3 text-sm font-medium text-white/90">
                  {" "}
                  <i className="fas fa-check-circle text-secondary mt-0.5 min-w-[16px]" />{" "}
                  <span>Shared Workload & Joint Projects</span>{" "}
                </li>{" "}
                <li className="flex items-start gap-3 text-sm font-medium text-white/90">
                  {" "}
                  <i className="fas fa-check-circle text-secondary mt-0.5 min-w-[16px]" />{" "}
                  <span>Full access to ARIFA collected data</span>{" "}
                </li>{" "}
                <li className="flex items-start gap-3 text-sm font-medium text-white/90">
                  {" "}
                  <i className="fas fa-check-circle text-secondary mt-0.5 min-w-[16px]" />{" "}
                  <span>
                    Generic/collaborative driven research oriented toward
                    creating new knowledge and tools valuable to the greater
                    community and general public.
                  </span>{" "}
                </li>{" "}
              </ul>{" "}
              <Link
                href="/contact-us"
                className="w-full py-4 bg-primary text-white rounded-xl font-bold text-center hover:bg-primary transition-all"
              >
                {" "}
                Choose Standard{" "}
              </Link>{" "}
            </RevealOnScroll>{" "}
            {/* Premium Package */}{" "}
            <RevealOnScroll
              delay={300}
              className="bg-white rounded-2xl p-10 border border-black/10 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] transition-all flex flex-col relative overflow-hidden"
            >
              {" "}
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-tr-full -z-10" />{" "}
              <div className="w-14 h-14 rounded-full bg-white text-primary flex items-center justify-center text-xl mb-6">
                {" "}
                <i className="fas fa-crown" />{" "}
              </div>{" "}
              <h3 className="text-2xl font-bold text-black font-[var(--font-heading)] mb-2">
                Premium Package
              </h3>{" "}
              <div className="mb-6">
                {" "}
                <span className="text-3xl font-extrabold text-black">
                  $100,000
                </span>{" "}
                <span className="text-sm font-bold text-black/70 uppercase tracking-wider ml-1">
                  / Annually
                </span>{" "}
              </div>{" "}
              <p className="text-black/70 mb-8 font-medium">
                {" "}
                All ARIFA Level 2 Partner opportunities, plus:{" "}
              </p>{" "}
              <ul className="space-y-4 mb-10 flex-grow">
                {" "}
                <li className="flex items-start gap-3 text-sm font-medium text-black">
                  {" "}
                  <i className="fas fa-check-circle text-secondary mt-0.5 min-w-[16px]" />{" "}
                  <span>Partnership guided by the ARIFA Director</span>{" "}
                </li>{" "}
                <li className="flex items-start gap-3 text-sm font-medium text-black">
                  {" "}
                  <i className="fas fa-check-circle text-secondary mt-0.5 min-w-[16px]" />{" "}
                  <span>
                    An assigned, dedicated research liaison within the ARIFA
                    group
                  </span>{" "}
                </li>{" "}
                <li className="flex items-start gap-3 text-sm font-medium text-black">
                  {" "}
                  <i className="fas fa-check-circle text-secondary mt-0.5 min-w-[16px]" />{" "}
                  <span>Pre-Access to papers before publication.</span>{" "}
                </li>{" "}
              </ul>{" "}
              <Link
                href="/contact-us"
                className="w-full py-4 border-2 border-primary text-primary rounded-xl font-bold text-center hover:bg-primary hover:text-white transition-all"
              >
                {" "}
                Choose Premium{" "}
              </Link>{" "}
            </RevealOnScroll>{" "}
          </div>{" "}
        </div>{" "}
      </section>{" "}
    </>
  );
}
