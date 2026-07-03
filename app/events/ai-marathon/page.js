"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
export default function AIMarathon() {
  return (
    <>
      {" "}
      <section className="relative min-h-[58vh] bg-primary flex flex-col items-center justify-center overflow-hidden pt-20">
        {" "}
        {/* Background Elements */}{" "}
        <div className="absolute inset-0 z-0">
          {" "}
          <Image
            src="/about-img.png"
            alt="AI Marathon Background"
            fill
            className="object-cover object-center opacity-35"
            priority
          />{" "}
          <div className="absolute inset-0 bg-primary/70" />{" "}
        </div>{" "}
        <div className="max-w-[800px] w-full mx-auto px-6 relative z-10 text-center">
          {" "}
          {/* Construction Icon */}{" "}
          <div className="w-24 h-24 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-8 border border-primary/20 shadow-[0_0_30px_rgba(0,0,0,0.3)] animate-fadeInUp">
            {" "}
            <i className="fas fa-hammer text-4xl text-primary animate-bounce" />{" "}
          </div>{" "}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6 animate-fadeInUp font-[var(--font-heading)]">
            {" "}
            ARIFA AI <span className="text-secondary">Marathon</span>{" "}
          </h1>{" "}
          <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-secondary/10 border border-secondary/20 text-secondary font-bold text-sm tracking-widest uppercase mb-8 animate-fadeInUp animate-delay-100">
            {" "}
            <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />{" "}
            Website Under Construction{" "}
          </div>{" "}
        </div>{" "}
      </section>{" "}
      <section className="bg-white py-20 md:py-24">
        {" "}
        <div className="max-w-[800px] w-full mx-auto px-6 text-center">
          {" "}
          <p className="text-lg md:text-xl text-black/70 max-w-[600px] mx-auto animate-fadeInUp animate-delay-200 leading-relaxed mb-10">
            {" "}
            We are working hard to build an amazing digital experience for the
            upcoming AI Marathon. Stay tuned for exciting updates, registration
            details, and the event schedule.{" "}
          </p>{" "}
          <div className="flex flex-col sm:flex-row justify-center gap-4 animate-fadeInUp animate-delay-300">
            {" "}
            <Link
              href="/"
              className="px-8 py-3.5 bg-primary hover:bg-primary text-white rounded-xl font-bold transition-all hover:-translate-y-1 shadow-[0_4px_20px_rgba(0,0,0,0.15)]"
            >
              {" "}
              Return Home{" "}
            </Link>{" "}
            <Link
              href="/contact-us"
              className="px-8 py-3.5 bg-white hover:bg-white border border-black/10 text-black rounded-xl font-bold transition-all hover:-translate-y-1 shadow-[0_4px_20px_rgba(0,0,0,0.06)]"
            >
              {" "}
              Contact Us for Inquiries{" "}
            </Link>{" "}
          </div>{" "}
        </div>{" "}
      </section>{" "}
    </>
  );
}
