"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import SponsorMarquee from "./components/SponsorMarquee";
const heroImages = [
  "/hero-bg.png",
  "/who-we-are-office.png",
  "/program-training.png",
];
function AnimatedCounter({ end, duration = 2000 }) {
  const nodeRef = useRef(null);
  useEffect(() => {
    const node = nodeRef.current;
    if (!node) return;
    let startTime;
    let startValue = 0;
    let isVisible = false;
    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - (1 - progress) * (1 - progress);
      const current = Math.round(startValue + (end - startValue) * eased);
      node.textContent = current + "+";
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isVisible) {
          isVisible = true;
          requestAnimationFrame(animate);
          observer.disconnect();
        }
      },
      { threshold: 0.5 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [end, duration]);
  return <span ref={nodeRef}>0</span>;
}
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
export default function Home() {
  const [currentImageIdx, setCurrentImageIdx] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIdx((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);
  return (
    <>
      {" "}
      {/* ====== Hero ====== */}{" "}
      <section
        id="hero"
        className="relative min-h-screen flex items-center justify-center pt-24 pb-32 overflow-hidden bg-primary"
      >
        {" "}
        <div className="absolute inset-0 z-0 bg-white">
          {" "}
          {heroImages.map((src, idx) => (
            <Image
              key={src}
              src={src}
              alt={`ARIFA AI Background ${idx + 1}`}
              fill
              className={`object-cover object-center brightness-[0.46] saturate-[0.82] transition-opacity duration-1000 ${idx === currentImageIdx ? "opacity-100" : "opacity-0"}`}
              priority={idx === 0}
            />
          ))}{" "}
        </div>{" "}
        {/* Accents */}{" "}
        <div className="max-w-[1200px] w-full mx-auto px-6 relative z-10">
          {" "}
          <div className="max-w-[800px] mx-auto text-center translate-y-8 md:translate-y-10">
            {" "}
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6 animate-fadeInUp animate-delay-100 font-[var(--font-heading)] [text-shadow:0_3px_20px_rgba(0,0,0,0.35)]">
              {" "}
              Advancing{" "}
              <span className="text-secondary">Artificial Intelligence</span>{" "}
              Research for Africa{" "}
            </h1>{" "}
            <p className="text-lg md:text-xl text-white leading-relaxed mb-10 max-w-[620px] mx-auto animate-fadeInUp animate-delay-200 [text-shadow:0_2px_12px_rgba(0,0,0,0.35)]">
              {" "}
              Driving innovation through cutting-edge research, world-class
              training programs, and strategic industry partnerships to shape
              Africa&apos;s AI future.{" "}
            </p>{" "}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fadeInUp animate-delay-300">
              {" "}
              <Link
                href="/research/research-projects"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-primary rounded-full font-semibold shadow-[0_8px_20px_rgba(0,0,0,0.3)] hover:bg-white hover:-translate-y-1 transition-all"
              >
                {" "}
                Explore Research{" "}
                <i className="fas fa-arrow-right text-sm" />{" "}
              </Link>{" "}
              <Link
                href="/training/certifications"
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 bg-transparent border border-white/60 text-white rounded-full font-semibold hover:bg-white/10 hover:-translate-y-1 transition-all"
              >
                {" "}
                Our Programs{" "}
              </Link>{" "}
            </div>{" "}
          </div>{" "}
        </div>{" "}
        {/* Stats Bar */}{" "}
        <div className="absolute bottom-0 left-0 right-0 z-20 transform translate-y-1/2 hidden md:block">
          {" "}
          <div className="max-w-[1000px] mx-auto px-6">
            {" "}
            <div className="bg-white rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.08)] flex justify-between items-center p-8 lg:px-12 border border-black/10">
              {" "}
              <div className="text-center px-4">
                {" "}
                <div className="text-4xl font-extrabold text-primary font-[var(--font-heading)] mb-1">
                  {" "}
                  <AnimatedCounter end={15} />{" "}
                </div>{" "}
                <div className="text-sm font-bold text-black/70 uppercase tracking-wider">
                  Researchers
                </div>{" "}
              </div>{" "}
              <div className="w-[1px] h-12 bg-primary/10" />{" "}
              <div className="text-center px-4">
                {" "}
                <div className="text-4xl font-extrabold text-primary font-[var(--font-heading)] mb-1">
                  {" "}
                  <AnimatedCounter end={20} />{" "}
                </div>{" "}
                <div className="text-sm font-bold text-black/70 uppercase tracking-wider">
                  Publications
                </div>{" "}
              </div>{" "}
              <div className="w-[1px] h-12 bg-primary/10" />{" "}
              <div className="text-center px-4">
                {" "}
                <div className="text-4xl font-extrabold text-primary font-[var(--font-heading)] mb-1">
                  {" "}
                  <AnimatedCounter end={5} />{" "}
                </div>{" "}
                <div className="text-sm font-bold text-black/70 uppercase tracking-wider">
                  Countries
                </div>{" "}
              </div>{" "}
              <div className="w-[1px] h-12 bg-primary/10" />{" "}
              <div className="text-center px-4">
                {" "}
                <div className="text-4xl font-extrabold text-primary font-[var(--font-heading)] mb-1">
                  {" "}
                  <AnimatedCounter end={500} />{" "}
                </div>{" "}
                <div className="text-sm font-bold text-black/70 uppercase tracking-wider">
                  Trainees
                </div>{" "}
              </div>{" "}
            </div>{" "}
          </div>{" "}
        </div>{" "}
      </section>{" "}
      {/* ====== About ====== */}{" "}
      <section className="py-24 md:py-32 bg-white relative">
        {" "}
        <div className="max-w-[1200px] mx-auto px-6">
          {" "}
          <div className="grid md:grid-cols-2 gap-16 items-center">
            {" "}
            <RevealOnScroll className="relative">
              {" "}
              <div className="relative rounded-2xl overflow-hidden aspect-[4/5] md:aspect-square shadow-2xl">
                {" "}
                <Image
                  src="/who-we-are-office.png"
                  alt="ARIFA researchers in a collaborative workshop"
                  fill
                  className="object-cover"
                />{" "}
              </div>{" "}
              <div className="absolute -bottom-8 -right-8 bg-white p-6 rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.1)] border-l-4 border-secondary max-w-[200px]">
                {" "}
                <div className="text-3xl font-extrabold text-primary font-[var(--font-heading)]">
                  10+
                </div>{" "}
                <div className="text-sm font-bold text-black mt-1">
                  Years of Impact
                </div>{" "}
              </div>{" "}
            </RevealOnScroll>{" "}
            <RevealOnScroll delay={200}>
              {" "}
              <span className="block text-primary font-bold tracking-widest uppercase text-sm mb-4">
                Who We Are
              </span>{" "}
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-black font-[var(--font-heading)] leading-tight mb-6">
                {" "}
                Shaping Africa&apos;s AI Future Through Research &
                Innovation{" "}
              </h2>{" "}
              <p className="text-lg text-black/70 mb-8 leading-relaxed">
                {" "}
                The Africa Research Institute for AI (ARIFA) is a pioneering
                institution dedicated to advancing artificial intelligence
                research, training, and innovation across the African continent.
                Based in Dar es Salaam, Tanzania, we bridge the gap between
                cutting-edge AI technology and Africa&apos;s unique challenges
                and opportunities.{" "}
              </p>{" "}
              <div className="space-y-6 mb-10">
                {" "}
                <div className="flex gap-5">
                  {" "}
                  <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 text-xl">
                    {" "}
                    <i className="fas fa-microscope" />{" "}
                  </div>{" "}
                  <div>
                    {" "}
                    <h4 className="text-[1.1rem] font-bold text-black font-[var(--font-heading)] mb-1">
                      Research Excellence
                    </h4>{" "}
                    <p className="text-black/70 text-sm leading-relaxed">
                      Publishing impactful research in AI, data science, and
                      emerging technologies.
                    </p>{" "}
                  </div>{" "}
                </div>{" "}
                <div className="flex gap-5">
                  {" "}
                  <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 text-xl">
                    {" "}
                    <i className="fas fa-graduation-cap" />{" "}
                  </div>{" "}
                  <div>
                    {" "}
                    <h4 className="text-[1.1rem] font-bold text-black font-[var(--font-heading)] mb-1">
                      Capacity Building
                    </h4>{" "}
                    <p className="text-black/70 text-sm leading-relaxed">
                      Training the next generation of AI professionals through
                      certifications and short courses.
                    </p>{" "}
                  </div>{" "}
                </div>{" "}
              </div>{" "}
              <Link
                href="/about"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-primary text-primary rounded-full font-semibold hover:bg-primary hover:text-white transition-all"
              >
                {" "}
                Learn More About Us{" "}
                <i className="fas fa-arrow-right text-sm" />{" "}
              </Link>{" "}
            </RevealOnScroll>{" "}
          </div>{" "}
        </div>{" "}
      </section>{" "}
      {/* ====== Research Focus Areas ====== */}{" "}
      <section className="py-24 md:py-32 bg-white">
        {" "}
        <div className="max-w-[1200px] mx-auto px-6">
          {" "}
          <div className="text-center max-w-[600px] mx-auto mb-16">
            {" "}
            <span className="block text-primary font-bold tracking-widest uppercase text-sm mb-4">
              Our Focus
            </span>{" "}
            <h2 className="text-3xl md:text-4xl font-bold text-black font-[var(--font-heading)] leading-tight mb-4">
              Research Focus Areas
            </h2>{" "}
            <p className="text-black/70">
              We pursue impactful research across key domains where AI can
              transform Africa&apos;s future.
            </p>{" "}
          </div>{" "}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {" "}
            <RevealOnScroll
              delay={100}
              className="bg-white rounded-2xl p-8 border border-black/10 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] transition-all group"
            >
              {" "}
              <div className="w-14 h-14 rounded-xl bg-white text-primary flex items-center justify-center text-2xl mb-6 group-hover:bg-primary group-hover:text-white transition-colors">
                {" "}
                <i className="fas fa-brain" />{" "}
              </div>{" "}
              <h3 className="text-xl font-bold text-black font-[var(--font-heading)] mb-3">
                Artificial Intelligence
              </h3>{" "}
              <p className="text-sm text-black/70 leading-relaxed mb-6">
                Deep learning, natural language processing, and computer vision
                research tailored for African contexts and languages.
              </p>{" "}
              <Link
                href="/research/research-projects"
                className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:text-secondary transition-colors"
              >
                {" "}
                Learn more{" "}
                <i className="fas fa-arrow-right text-[0.8em]" />{" "}
              </Link>{" "}
            </RevealOnScroll>{" "}
            <RevealOnScroll
              delay={200}
              className="bg-white rounded-2xl p-8 border border-black/10 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] transition-all group"
            >
              {" "}
              <div className="w-14 h-14 rounded-xl bg-white text-primary flex items-center justify-center text-2xl mb-6 group-hover:bg-primary group-hover:text-white transition-colors">
                {" "}
                <i className="fas fa-database" />{" "}
              </div>{" "}
              <h3 className="text-xl font-bold text-black font-[var(--font-heading)] mb-3">
                Data Science & Analytics
              </h3>{" "}
              <p className="text-sm text-black/70 leading-relaxed mb-6">
                Big data analysis, predictive modelling, and data-driven
                decision making for development challenges.
              </p>{" "}
              <Link
                href="/research/research-projects"
                className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:text-secondary transition-colors"
              >
                {" "}
                Learn more{" "}
                <i className="fas fa-arrow-right text-[0.8em]" />{" "}
              </Link>{" "}
            </RevealOnScroll>{" "}
            <RevealOnScroll
              delay={300}
              className="bg-white rounded-2xl p-8 border border-black/10 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] transition-all group"
            >
              {" "}
              <div className="w-14 h-14 rounded-xl bg-white text-primary flex items-center justify-center text-2xl mb-6 group-hover:bg-primary group-hover:text-white transition-colors">
                {" "}
                <i className="fas fa-shield-halved" />{" "}
              </div>{" "}
              <h3 className="text-xl font-bold text-black font-[var(--font-heading)] mb-3">
                ICT & e-Governance
              </h3>{" "}
              <p className="text-sm text-black/70 leading-relaxed mb-6">
                Digital transformation, smart governance solutions, and
                technology-enabled public service delivery.
              </p>{" "}
              <Link
                href="/research/research-projects"
                className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:text-secondary transition-colors"
              >
                {" "}
                Learn more{" "}
                <i className="fas fa-arrow-right text-[0.8em]" />{" "}
              </Link>{" "}
            </RevealOnScroll>{" "}
            <RevealOnScroll
              delay={400}
              className="bg-white rounded-2xl p-8 border border-black/10 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] transition-all group"
            >
              {" "}
              <div className="w-14 h-14 rounded-xl bg-white text-primary flex items-center justify-center text-2xl mb-6 group-hover:bg-primary group-hover:text-white transition-colors">
                {" "}
                <i className="fas fa-seedling" />{" "}
              </div>{" "}
              <h3 className="text-xl font-bold text-black font-[var(--font-heading)] mb-3">
                Smart Agriculture
              </h3>{" "}
              <p className="text-sm text-black/70 leading-relaxed mb-6">
                AI-powered solutions for precision farming, crop monitoring, and
                agricultural innovation across Africa.
              </p>{" "}
              <Link
                href="/research/research-projects"
                className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:text-secondary transition-colors"
              >
                {" "}
                Learn more{" "}
                <i className="fas fa-arrow-right text-[0.8em]" />{" "}
              </Link>{" "}
            </RevealOnScroll>{" "}
          </div>{" "}
        </div>{" "}
      </section>{" "}
      {/* ====== Programs ====== */}{" "}
      <section className="py-24 md:py-32 bg-white">
        {" "}
        <div className="max-w-[1200px] mx-auto px-6">
          {" "}
          <div className="text-center max-w-[600px] mx-auto mb-16">
            {" "}
            <span className="block text-primary font-bold tracking-widest uppercase text-sm mb-4">
              Programs
            </span>{" "}
            <h2 className="text-3xl md:text-4xl font-bold text-black font-[var(--font-heading)] leading-tight mb-4">
              Training & Certifications
            </h2>{" "}
            <p className="text-black/70">
              Build your AI career with our industry-recognized certification
              programs and hands-on short courses.
            </p>{" "}
          </div>{" "}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {" "}
            <RevealOnScroll
              delay={100}
              className="bg-white rounded-2xl overflow-hidden border border-black/10 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all group"
            >
              {" "}
              <div className="relative h-56 overflow-hidden">
                {" "}
                <Image
                  src="/program-certification.png"
                  alt="ARIFA certification graduates"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />{" "}
                <div className="absolute top-4 left-4 px-3 py-1 bg-white/90 rounded-full text-xs font-bold text-primary uppercase tracking-wide">
                  Certification
                </div>{" "}
              </div>{" "}
              <div className="p-8">
                {" "}
                <h3 className="text-xl font-bold text-black font-[var(--font-heading)] mb-3 group-hover:text-primary transition-colors">
                  Certified Data Science Associate
                </h3>{" "}
                <p className="text-sm text-black/70 leading-relaxed mb-6">
                  Comprehensive certification covering data analysis, machine
                  learning, and statistical methods for aspiring data
                  scientists.
                </p>{" "}
                <div className="flex gap-4 border-t border-black/10 pt-4">
                  {" "}
                  <span className="text-xs font-semibold text-black/70 flex items-center gap-1.5">
                    <i className="fas fa-clock text-secondary" /> 12 Weeks
                  </span>{" "}
                  <span className="text-xs font-semibold text-black/70 flex items-center gap-1.5">
                    <i className="fas fa-signal text-secondary" /> Beginner-Int
                  </span>{" "}
                </div>{" "}
              </div>{" "}
            </RevealOnScroll>{" "}
            <RevealOnScroll
              delay={200}
              className="bg-white rounded-2xl overflow-hidden border border-black/10 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all group"
            >
              {" "}
              <div className="relative h-56 overflow-hidden">
                {" "}
                <Image
                  src="/program-training.png"
                  alt="Hands-on AI training workshop"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />{" "}
                <div className="absolute top-4 left-4 px-3 py-1 bg-white/90 rounded-full text-xs font-bold text-primary uppercase tracking-wide">
                  Short Course
                </div>{" "}
              </div>{" "}
              <div className="p-8">
                {" "}
                <h3 className="text-xl font-bold text-black font-[var(--font-heading)] mb-3 group-hover:text-primary transition-colors">
                  Applied Machine Learning
                </h3>{" "}
                <p className="text-sm text-black/70 leading-relaxed mb-6">
                  Hands-on course covering supervised and unsupervised learning,
                  neural networks, and real-world AI applications.
                </p>{" "}
                <div className="flex gap-4 border-t border-black/10 pt-4">
                  {" "}
                  <span className="text-xs font-semibold text-black/70 flex items-center gap-1.5">
                    <i className="fas fa-clock text-secondary" /> 6 Weeks
                  </span>{" "}
                  <span className="text-xs font-semibold text-black/70 flex items-center gap-1.5">
                    <i className="fas fa-signal text-secondary" /> Intermediate
                  </span>{" "}
                </div>{" "}
              </div>{" "}
            </RevealOnScroll>{" "}
            <RevealOnScroll
              delay={300}
              className="bg-white rounded-2xl overflow-hidden border border-black/10 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all group"
            >
              {" "}
              <div className="relative h-56 overflow-hidden">
                {" "}
                <Image
                  src="/hero-bg.png"
                  alt="AI robotics and innovation workshop"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />{" "}
                <div className="absolute top-4 left-4 px-3 py-1 bg-white/90 rounded-full text-xs font-bold text-primary uppercase tracking-wide">
                  Workshop
                </div>{" "}
              </div>{" "}
              <div className="p-8">
                {" "}
                <h3 className="text-xl font-bold text-black font-[var(--font-heading)] mb-3 group-hover:text-primary transition-colors">
                  AI & Robotics Innovation Lab
                </h3>{" "}
                <p className="text-sm text-black/70 leading-relaxed mb-6">
                  Intensive workshop on robotics, computer vision, and AI-driven
                  automation for industry applications.
                </p>{" "}
                <div className="flex gap-4 border-t border-black/10 pt-4">
                  {" "}
                  <span className="text-xs font-semibold text-black/70 flex items-center gap-1.5">
                    <i className="fas fa-clock text-secondary" /> 4 Weeks
                  </span>{" "}
                  <span className="text-xs font-semibold text-black/70 flex items-center gap-1.5">
                    <i className="fas fa-signal text-secondary" /> Advanced
                  </span>{" "}
                </div>{" "}
              </div>{" "}
            </RevealOnScroll>{" "}
          </div>{" "}
          <div className="text-center">
            {" "}
            <Link
              href="/training/certifications"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-primary text-primary rounded-full font-semibold hover:bg-primary hover:text-white transition-all"
            >
              {" "}
              View All Programs{" "}
              <i className="fas fa-arrow-right text-sm" />{" "}
            </Link>{" "}
          </div>{" "}
        </div>{" "}
      </section>{" "}
      {/* ====== Impact Stats ====== */}{" "}
      <section className="relative py-24 md:py-32 bg-primary overflow-hidden">
        {" "}
        <div className="absolute inset-0 z-0">
          {" "}
          <Image
            src="/hero-bg.png"
            alt="Background"
            fill
            className="object-cover object-center opacity-10"
          />{" "}
          <div className="absolute inset-0 bg-primary/90 " />{" "}
        </div>{" "}
        <div className="max-w-[1200px] mx-auto px-6 relative z-10">
          {" "}
          <div className="text-center max-w-[600px] mx-auto mb-16">
            {" "}
            <span className="block text-secondary font-bold tracking-widest uppercase text-sm mb-4">
              Our Impact
            </span>{" "}
            <h2 className="text-3xl md:text-4xl font-bold text-white font-[var(--font-heading)] leading-tight mb-4">
              Making a Difference Across Africa
            </h2>{" "}
          </div>{" "}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {" "}
            <div className="text-center">
              {" "}
              <div className="text-4xl md:text-6xl font-extrabold text-white font-[var(--font-heading)] mb-2">
                <AnimatedCounter end={15} />
              </div>{" "}
              <div className="text-sm md:text-base font-bold text-white/70 uppercase tracking-wider">
                Expert Researchers
              </div>{" "}
            </div>{" "}
            <div className="text-center">
              {" "}
              <div className="text-4xl md:text-6xl font-extrabold text-white font-[var(--font-heading)] mb-2">
                <AnimatedCounter end={20} />
              </div>{" "}
              <div className="text-sm md:text-base font-bold text-white/70 uppercase tracking-wider">
                Published Papers
              </div>{" "}
            </div>{" "}
            <div className="text-center">
              {" "}
              <div className="text-4xl md:text-6xl font-extrabold text-white font-[var(--font-heading)] mb-2">
                <AnimatedCounter end={500} />
              </div>{" "}
              <div className="text-sm md:text-base font-bold text-white/70 uppercase tracking-wider">
                Professionals Trained
              </div>{" "}
            </div>{" "}
            <div className="text-center">
              {" "}
              <div className="text-4xl md:text-6xl font-extrabold text-white font-[var(--font-heading)] mb-2">
                <AnimatedCounter end={5} />
              </div>{" "}
              <div className="text-sm md:text-base font-bold text-white/70 uppercase tracking-wider">
                Partner Countries
              </div>{" "}
            </div>{" "}
          </div>{" "}
        </div>{" "}
      </section>{" "}
      {/* ====== CTA Section ====== */}{" "}
      <section className="py-20 bg-white">
        {" "}
        <div className="max-w-[1000px] mx-auto px-6">
          {" "}
          <div className="bg-white rounded-3xl p-10 md:p-16 text-center shadow-[0_20px_60px_rgba(0,0,0,0.08)] border border-black/10 relative overflow-hidden">
            {" "}
            <h2 className="text-3xl md:text-4xl font-bold text-black font-[var(--font-heading)] mb-6 relative z-10">
              Ready to Shape Africa&apos;s AI Future?
            </h2>{" "}
            <p className="text-black/70 text-lg mb-10 max-w-[600px] mx-auto relative z-10">
              Whether you&apos;re a researcher, student, or industry partner,
              there&apos;s a place for you at ARIFA. Join us in building
              Africa&apos;s AI ecosystem.
            </p>{" "}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
              {" "}
              <Link
                href="/training/certifications"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-secondary text-white rounded-full text-base font-semibold shadow-[0_8px_20px_rgba(0,0,0,0.24)] hover:bg-secondary hover:-translate-y-1 transition-all"
              >
                {" "}
                Start Learning{" "}
                <i className="fas fa-graduation-cap text-xs" />{" "}
              </Link>{" "}
              <Link
                href="/contact-us"
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 border-2 border-black text-black rounded-full font-bold hover:bg-primary hover:text-white hover:-translate-y-1 transition-all"
              >
                {" "}
                Get in Touch{" "}
              </Link>{" "}
            </div>{" "}
          </div>{" "}
        </div>{" "}
      </section>{" "}
      <SponsorMarquee />
    </>
  );
}
