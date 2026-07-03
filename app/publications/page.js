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
const publications = [
  {
    year: "2025",
    papers: [
      {
        title:
          "Adapting Large Language Models for Low-Resource African Languages: A Case Study in Kiswahili",
        authors: "Dr. Sarah Akinyi, Fatima Hassan",
        venue: "Proceedings of the African Conference on AI (ACAI)",
        link: "#",
      },
      {
        title:
          "Computer Vision and Edge Computing for Real-Time Pest Detection in Maize",
        authors: "Dr. David Nwachukwu, Eng. Prof. Zaipuna O. Yonah",
        venue: "Journal of Smart Agriculture in Developing Nations",
        link: "#",
      },
    ],
  },
  {
    year: "2024",
    papers: [
      {
        title:
          "Mitigating Algorithmic Bias in Healthcare Diagnostics for Underrepresented Populations",
        authors: "Prof. Kwame Osei, Dr. Sarah Akinyi",
        venue: "International Journal of AI Ethics",
        link: "#",
      },
      {
        title: "The State of AI Readiness in East African Public Sectors",
        authors: "Eng. Dr. Dennis N. Mwighusa",
        venue: "ARIFA Institute Whitepapers",
        link: "#",
      },
      {
        title:
          "Deep Learning Approaches to Traffic Flow Optimization in Dar es Salaam",
        authors: "Fatima Hassan, Dr. David Nwachukwu",
        venue: "IEEE Conference on Intelligent Transportation Systems",
        link: "#",
      },
    ],
  },
];
export default function Publications() {
  return (
    <>
      {" "}
      {/* ====== Page Header ====== */}{" "}
      <section className="relative pt-40 pb-24 bg-primary overflow-hidden">
        {" "}
        <div className="absolute inset-0 z-0">
          {" "}
          <div className="absolute inset-0 bg-primary/85" />{" "}
        </div>{" "}
        <div className="max-w-[1200px] w-full mx-auto px-6 relative z-10 text-center">
          {" "}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white text-sm font-semibold mb-6 animate-fadeInUp">
            {" "}
            Research{" "}
          </div>{" "}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6 animate-fadeInUp animate-delay-100 font-[var(--font-heading)]">
            {" "}
            Our <span className="text-secondary">Publications</span>{" "}
          </h1>{" "}
          <p className="text-lg md:text-xl text-white/80 max-w-[700px] mx-auto animate-fadeInUp animate-delay-200">
            {" "}
            A comprehensive repository of academic papers, journals, and
            technical reports published by ARIFA researchers.{" "}
          </p>{" "}
        </div>{" "}
      </section>{" "}
      {/* ====== Publications List ====== */}{" "}
      <section className="py-24 bg-white min-h-[60vh]">
        {" "}
        <div className="max-w-[900px] mx-auto px-6">
          {" "}
          <div className="mb-12 flex justify-between items-center bg-white p-6 rounded-2xl border border-black/10">
            {" "}
            <div>
              {" "}
              <h3 className="font-bold text-black font-[var(--font-heading)]">
                Looking for the ARIFA Journal?
              </h3>{" "}
              <p className="text-sm text-black/70">
                Visit the International Journal of AI Technology (IJAIT)
              </p>{" "}
            </div>{" "}
            <a
              href="https://ijait.arifa.org"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-2.5 bg-primary text-white rounded-full font-semibold text-sm hover:bg-primary transition-colors"
            >
              {" "}
              Go to IJAIT{" "}
            </a>{" "}
          </div>{" "}
          <div className="space-y-16">
            {" "}
            {publications.map((group, groupIdx) => (
              <div key={groupIdx}>
                {" "}
                <h2 className="text-3xl font-extrabold text-black font-[var(--font-heading)] mb-8 pb-4 border-b-2 border-primary/20">
                  {" "}
                  {group.year}{" "}
                </h2>{" "}
                <div className="space-y-8">
                  {" "}
                  {group.papers.map((paper, idx) => (
                    <RevealOnScroll
                      key={idx}
                      delay={idx * 100}
                      className="group"
                    >
                      {" "}
                      <div className="flex gap-4">
                        {" "}
                        <div className="w-10 h-10 rounded-full bg-white text-secondary flex items-center justify-center shrink-0 mt-1 group-hover:bg-primary group-hover:text-white transition-colors">
                          {" "}
                          <i className="fas fa-file-alt" />{" "}
                        </div>{" "}
                        <div>
                          {" "}
                          <h3 className="text-xl font-bold text-black font-[var(--font-heading)] leading-snug mb-2 group-hover:text-primary transition-colors">
                            {" "}
                            <a
                              href={paper.link}
                              className="hover:underline decoration-primary/30 underline-offset-4"
                            >
                              {paper.title}
                            </a>{" "}
                          </h3>{" "}
                          <p className="text-black font-medium mb-1">
                            {" "}
                            {paper.authors}{" "}
                          </p>{" "}
                          <p className="text-sm text-black/70 italic">
                            {" "}
                            Published in: {paper.venue}{" "}
                          </p>{" "}
                        </div>{" "}
                      </div>{" "}
                    </RevealOnScroll>
                  ))}{" "}
                </div>{" "}
              </div>
            ))}{" "}
          </div>{" "}
        </div>{" "}
      </section>{" "}
    </>
  );
}
