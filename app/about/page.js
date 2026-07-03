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
export default function About() {
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
            alt="About ARIFA Background"
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
            About Us{" "}
          </div>{" "}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6 animate-fadeInUp animate-delay-100 font-[var(--font-heading)]">
            {" "}
            Driving Africa&apos;s{" "}
            <span className="text-secondary">AI Revolution</span>{" "}
          </h1>{" "}
          <p className="text-lg md:text-xl text-white/80 max-w-[700px] mx-auto animate-fadeInUp animate-delay-200">
            {" "}
            Learn about our mission, vision, and the core values that guide our
            pursuit of excellence in artificial intelligence research and
            education.{" "}
          </p>{" "}
        </div>{" "}
      </section>{" "}
      {/* ====== Who We Are ====== */}{" "}
      <section className="py-24 bg-white">
        {" "}
        <div className="max-w-[1200px] mx-auto px-6">
          {" "}
          <div className="grid md:grid-cols-2 gap-16 items-center">
            {" "}
            <RevealOnScroll>
              {" "}
              <span className="block text-primary font-bold tracking-widest uppercase text-sm mb-4">
                Our Story
              </span>{" "}
              <h2 className="text-3xl md:text-4xl font-bold text-black font-[var(--font-heading)] leading-tight mb-6">
                {" "}
                Bridging the Gap Between Cutting-Edge Technology and
                Africa&apos;s Unique Challenges{" "}
              </h2>{" "}
              <div className="space-y-4 text-lg text-black/70 leading-relaxed">
                {" "}
                <p>
                  {" "}
                  The Africa Research Institute for AI (ARIFA) was established
                  with a singular focus: to ensure that the African continent is
                  not merely a consumer of artificial intelligence, but an
                  active creator and innovator.{" "}
                </p>{" "}
                <p>
                  {" "}
                  Based in Dar es Salaam, Tanzania, ARIFA brings together
                  leading researchers, industry experts, and policymakers. We
                  conduct foundational and applied research tailored
                  specifically to African languages, socio-economic contexts,
                  and developmental needs.{" "}
                </p>{" "}
                <p>
                  {" "}
                  Through rigorous certification programs and short courses, we
                  are aggressively building the continent&apos;s technical
                  capacity, training thousands of data scientists, machine
                  learning engineers, and AI strategists to solve local problems
                  on a global scale.{" "}
                </p>{" "}
              </div>{" "}
            </RevealOnScroll>{" "}
            <RevealOnScroll delay={200} className="relative">
              {" "}
              <div className="relative rounded-2xl overflow-hidden aspect-[4/3] shadow-2xl">
                {" "}
                <Image
                  src="/hero-bg.png"
                  alt="ARIFA Laboratory"
                  fill
                  className="object-cover"
                />{" "}
              </div>{" "}
              <div className="absolute -left-8 -bottom-8 w-48 h-48 rounded-2xl overflow-hidden border-8 border-white shadow-xl hidden md:block">
                {" "}
                <Image
                  src="/program-training.png"
                  alt="Students in AI Class"
                  fill
                  className="object-cover"
                />{" "}
              </div>{" "}
            </RevealOnScroll>{" "}
          </div>{" "}
        </div>{" "}
      </section>{" "}
      {/* ====== Mission & Vision ====== */}{" "}
      <section className="py-24 bg-white">
        {" "}
        <div className="max-w-[1200px] mx-auto px-6">
          {" "}
          <div className="grid md:grid-cols-2 gap-8">
            {" "}
            <RevealOnScroll
              delay={100}
              className="bg-white rounded-2xl p-10 lg:p-14 border border-black/10 shadow-[0_10px_40px_rgba(0,0,0,0.04)]"
            >
              {" "}
              <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center text-3xl mb-8">
                {" "}
                <i className="fas fa-bullseye" />{" "}
              </div>{" "}
              <h3 className="text-2xl font-bold text-black font-[var(--font-heading)] mb-4">
                Our Mission
              </h3>{" "}
              <p className="text-lg text-black/70 leading-relaxed">
                {" "}
                To advance artificial intelligence research, foster innovation,
                and build world-class technical capacity across Africa, ensuring
                the continent thrives in the digital age.{" "}
              </p>{" "}
            </RevealOnScroll>{" "}
            <RevealOnScroll
              delay={200}
              className="bg-white rounded-2xl p-10 lg:p-14 border border-black/10 shadow-[0_10px_40px_rgba(0,0,0,0.04)]"
            >
              {" "}
              <div className="w-16 h-16 rounded-2xl bg-secondary/10 text-secondary flex items-center justify-center text-3xl mb-8">
                {" "}
                <i className="fas fa-eye" />{" "}
              </div>{" "}
              <h3 className="text-2xl font-bold text-black font-[var(--font-heading)] mb-4">
                Our Vision
              </h3>{" "}
              <p className="text-lg text-black/70 leading-relaxed">
                {" "}
                To be the premier institute in Africa for AI research and
                education, globally recognized for developing solutions that
                address critical local and global challenges.{" "}
              </p>{" "}
            </RevealOnScroll>{" "}
          </div>{" "}
        </div>{" "}
      </section>{" "}
      {/* ====== Values ====== */}{" "}
      <section className="py-24 bg-white">
        {" "}
        <div className="max-w-[1200px] mx-auto px-6">
          {" "}
          <div className="text-center max-w-[600px] mx-auto mb-16">
            {" "}
            <span className="block text-primary font-bold tracking-widest uppercase text-sm mb-4">
              Core Values
            </span>{" "}
            <h2 className="text-3xl md:text-4xl font-bold text-black font-[var(--font-heading)] leading-tight mb-4">
              What Drives Us
            </h2>{" "}
          </div>{" "}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {" "}
            {[
              {
                icon: "fas fa-lightbulb",
                title: "Innovation",
                desc: "We push the boundaries of what's possible, seeking creative, AI-driven solutions to complex societal problems.",
              },
              {
                icon: "fas fa-medal",
                title: "Excellence",
                desc: "We maintain the highest global standards in our research output, academic rigor, and professional training.",
              },
              {
                icon: "fas fa-users",
                title: "Inclusivity",
                desc: "We believe AI must benefit everyone. We champion diversity and work to eliminate algorithmic bias.",
              },
              {
                icon: "fas fa-handshake",
                title: "Collaboration",
                desc: "We partner with global tech leaders, local industries, and governments to maximize our impact.",
              },
              {
                icon: "fas fa-shield-alt",
                title: "Ethics",
                desc: "We are committed to the responsible, safe, and transparent development and deployment of AI.",
              },
              {
                icon: "fas fa-globe-africa",
                title: "Pan-African Impact",
                desc: "Our solutions are rooted in Africa but designed to scale and solve challenges across the continent.",
              },
            ].map((value, idx) => (
              <RevealOnScroll key={idx} delay={idx * 100}>
                {" "}
                <div className="text-center">
                  {" "}
                  <div className="w-16 h-16 mx-auto rounded-full bg-white text-primary flex items-center justify-center text-2xl mb-6">
                    {" "}
                    <i className={value.icon} />{" "}
                  </div>{" "}
                  <h3 className="text-xl font-bold text-black font-[var(--font-heading)] mb-3">
                    {value.title}
                  </h3>{" "}
                  <p className="text-black/70 leading-relaxed">
                    {value.desc}
                  </p>{" "}
                </div>{" "}
              </RevealOnScroll>
            ))}{" "}
          </div>{" "}
        </div>{" "}
      </section>{" "}
      {/* ====== CTA Section ====== */}{" "}
      <section className="py-20 bg-primary text-center">
        {" "}
        <div className="max-w-[800px] mx-auto px-6">
          {" "}
          <h2 className="text-3xl md:text-4xl font-bold text-white font-[var(--font-heading)] mb-6">
            Meet the Minds Behind ARIFA
          </h2>{" "}
          <p className="text-white/70 text-lg mb-10">
            {" "}
            Our success is driven by a passionate team of researchers,
            educators, and visionaries committed to Africa&apos;s technological
            advancement.{" "}
          </p>{" "}
          <Link
            href="/team"
            className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-secondary text-white rounded-full text-base font-semibold shadow-[0_8px_20px_rgba(0,0,0,0.24)] hover:bg-secondary hover:-translate-y-1 transition-all"
          >
            {" "}
            View Our Team <i className="fas fa-arrow-right text-xs" />{" "}
          </Link>{" "}
        </div>{" "}
      </section>{" "}
    </>
  );
}
