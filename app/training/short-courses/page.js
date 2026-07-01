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

const courses = [
  {
    title: "Applied Machine Learning",
    duration: "6 Weeks",
    level: "Intermediate",
    format: "Hybrid",
    desc: "A hands-on course covering regression, classification, clustering, and the deployment of ML models into production environments.",
  },
  {
    title: "AI & Robotics Innovation Lab",
    duration: "4 Weeks",
    level: "Advanced",
    format: "In-Person",
    desc: "An intensive workshop focusing on computer vision and reinforcement learning applied to physical robotics and automation.",
  },
  {
    title: "Python for Data Analysis",
    duration: "3 Weeks",
    level: "Beginner",
    format: "Online",
    desc: "Master Pandas, NumPy, and Matplotlib. Perfect for analysts wanting to move beyond Excel into programmatic data manipulation.",
  },
  {
    title: "AI Ethics & Governance",
    duration: "2 Weeks",
    level: "All Levels",
    format: "Online",
    desc: "A seminar-style course exploring algorithmic bias, data privacy laws, and responsible AI deployment frameworks in Africa.",
  }
];

export default function ShortCourses() {
  return (
    <>
      {/* ====== Page Header ====== */}
      <section className="relative pt-40 pb-24 bg-dark overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/program-training.png"
            alt="Short Courses Background"
            fill
            className="object-cover object-center opacity-20"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-dark/90 via-dark/80 to-dark" />
        </div>
        
        <div className="max-w-[1200px] w-full mx-auto px-6 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm font-semibold mb-6 animate-fadeInUp">
            Training
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6 animate-fadeInUp animate-delay-100 font-[var(--font-heading)]">
            Intensive <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-[#FDE68A]">Short Courses</span>
          </h1>
          <p className="text-lg md:text-xl text-white/80 max-w-[700px] mx-auto animate-fadeInUp animate-delay-200">
            Upskill rapidly with our hands-on, focused workshops designed for professionals seeking immediate practical knowledge.
          </p>
        </div>
      </section>

      {/* ====== Courses Grid ====== */}
      <section className="py-24 bg-[var(--color-surface)] min-h-[60vh]">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-8">
            {courses.map((course, idx) => (
              <RevealOnScroll key={idx} delay={(idx % 2) * 100} className="bg-white rounded-2xl p-8 lg:p-10 border border-border-light shadow-[0_4px_20px_rgba(26,26,46,0.03)] hover:shadow-[0_20px_40px_rgba(26,26,46,0.08)] transition-all flex flex-col h-full">
                
                <div className="flex flex-wrap gap-3 mb-6">
                  <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider rounded-full flex items-center gap-1.5">
                    <i className="fas fa-clock" /> {course.duration}
                  </span>
                  <span className="px-3 py-1 bg-secondary/20 text-secondary text-xs font-bold uppercase tracking-wider rounded-full flex items-center gap-1.5">
                    <i className="fas fa-signal" /> {course.level}
                  </span>
                  <span className="px-3 py-1 bg-[var(--color-surface-alt)] text-[var(--color-text-muted)] text-xs font-bold uppercase tracking-wider rounded-full flex items-center gap-1.5">
                    <i className={course.format === 'Online' ? 'fas fa-laptop' : course.format === 'In-Person' ? 'fas fa-chalkboard-teacher' : 'fas fa-sync'} /> {course.format}
                  </span>
                </div>
                
                <h3 className="text-2xl font-bold text-dark font-[var(--font-heading)] mb-4">{course.title}</h3>
                <p className="text-[var(--color-text-muted)] leading-relaxed flex-grow mb-8">{course.desc}</p>
                
                <Link href="/contact-us" className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:text-secondary transition-colors">
                  Request Info & Registration <i className="fas fa-arrow-right text-[0.8em]" />
                </Link>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
