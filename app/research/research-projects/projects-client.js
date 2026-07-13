"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
function RevealOnScroll({ children, className = "", delay = 0 }) {
  const ref = useRef(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          entries[0].target.classList.add("opacity-100", "translate-y-0");
          entries[0].target.classList.remove("opacity-0", "translate-y-6");
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" },
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
export default function ResearchProjects({ projects }) {
  return (
    <div className="min-h-screen bg-white">
      {" "}
      {/* ====== Hero Section ====== */}{" "}
      <section className="relative pt-40 pb-24 bg-primary overflow-hidden flex flex-col justify-center min-h-[45vh]">
        {" "}
        {/* Background elements */}{" "}
        <div className="absolute inset-0 z-0">
          {" "}
          <div className="absolute inset-0 bg-primary/70 z-10" />{" "}
          <Image
            src="/hero-bg.png"
            alt="Research Projects"
            fill
            className="object-cover object-center opacity-40"
            priority
          />{" "}
        </div>{" "}
        <div className="max-w-[1200px] w-full mx-auto px-6 relative z-10 text-center">
          {" "}
          <RevealOnScroll>
            {" "}
            <span className="inline-block px-4 py-1.5 bg-white/10 text-white border border-white/20 rounded-full text-sm font-bold uppercase tracking-[0.2em] mb-6 ">
              {" "}
              Discover Our Work{" "}
            </span>{" "}
          </RevealOnScroll>{" "}
          <RevealOnScroll delay={100}>
            {" "}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white leading-tight mb-6 font-[var(--font-heading)]">
              {" "}
              Research <span className="text-primary">Projects</span>{" "}
            </h1>{" "}
          </RevealOnScroll>{" "}
          <RevealOnScroll delay={200}>
            {" "}
            <p className="text-lg md:text-xl text-white/70 font-light leading-relaxed max-w-3xl mx-auto">
              {" "}
              Exploring the frontiers of Artificial Intelligence across Africa.
              Discover our initiatives in AI policy, agriculture, healthcare,
              and sustainable development.{" "}
            </p>{" "}
          </RevealOnScroll>{" "}
        </div>{" "}
        {/* Decorative divider */}{" "}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-10">
          {" "}
          <svg
            className="relative block w-full h-[50px]"
            data-name="Layer 1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
          >
            {" "}
            <path
              d="M1200 120L0 120 0 0 1200 0 1200 120z"
              fill="#FFFFFF"
              opacity="0.1"
            ></path>{" "}
            <path
              d="M0 120h1200V0C936.56 120 263.44 120 0 0v120z"
              fill="#FFFFFF"
            ></path>{" "}
          </svg>{" "}
        </div>{" "}
      </section>{" "}
      {/* ====== Projects Grid ====== */}{" "}
      <section className="py-24">
        {" "}
        <div className="max-w-[1200px] mx-auto px-6">
          {" "}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {" "}
            {projects.map((project, idx) => (
              <RevealOnScroll
                key={project.id}
                delay={(idx % 3) * 100}
                className="h-full"
              >
                {" "}
                <Link
                  href={`/research/research-projects/${project.id}`}
                  className="group block h-full"
                >
                  {" "}
                  <div className="bg-white rounded-2xl shadow-sm border border-black/10 overflow-hidden h-full flex flex-col transition-all duration-500 hover:shadow-xl hover:-translate-y-2 relative">
                    {" "}
                    {/* Hover Glow Effect */}{" "}
                    <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0 pointer-events-none" />{" "}
                    {/* Image Area */}{" "}
                    <div className="relative h-56 w-full overflow-hidden z-10">
                      {" "}
                      <div className="absolute inset-0 bg-primary/15 group-hover:bg-transparent transition-colors duration-500 z-10" />{" "}
                      <Image
                        src={project.image}
                        alt={project.title}
                        fill
                        className="object-cover transform group-hover:scale-110 transition-transform duration-700 ease-in-out"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />{" "}
                      <div className="absolute top-4 left-4 z-20">
                        {" "}
                        <span className="px-3 py-1 bg-white/90 text-black text-xs font-bold uppercase tracking-wider rounded-md shadow-sm">
                          {" "}
                          Research{" "}
                        </span>{" "}
                      </div>{" "}
                    </div>{" "}
                    {/* Content Area */}{" "}
                    <div className="p-8 flex flex-col flex-1 z-10 relative bg-white">
                      {" "}
                      <h3 className="text-xl font-bold text-black font-[var(--font-heading)] leading-snug mb-4 group-hover:text-primary transition-colors line-clamp-3">
                        {" "}
                        {project.title}{" "}
                      </h3>{" "}
                      {/* A subtle decorative line */}{" "}
                      <div className="w-10 h-1 bg-primary/20 mb-6 group-hover:w-16 group-hover:bg-primary transition-all duration-500" />{" "}
                      {/* We extract plain text from the HTML content for the snippet */}{" "}
                      <div
                        className="text-black/60 text-sm leading-relaxed line-clamp-3 mb-8"
                        dangerouslySetInnerHTML={{ __html: project.content }}
                      />{" "}
                      <div className="mt-auto pt-5 border-t border-black/10 flex items-center justify-between">
                        {" "}
                        <span className="text-sm font-bold text-black group-hover:text-primary transition-colors flex items-center gap-2">
                          {" "}
                          Read Project Details{" "}
                          <i className="fas fa-arrow-right text-xs transform group-hover:translate-x-1 transition-transform" />{" "}
                        </span>{" "}
                      </div>{" "}
                    </div>{" "}
                  </div>{" "}
                </Link>{" "}
              </RevealOnScroll>
            ))}{" "}
          </div>{" "}
        </div>{" "}
      </section>{" "}
    </div>
  );
}
