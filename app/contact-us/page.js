"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
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
export default function Contact() {
  const [status, setStatus] = useState({ state: "idle", error: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    setStatus({ state: "sending", error: "" });

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(new FormData(form))),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setStatus({ state: "idle", error: data.error || "Could not send your message." });
        return;
      }

      form.reset();
      setStatus({ state: "sent", error: "" });
    } catch {
      setStatus({ state: "idle", error: "Could not send your message." });
    }
  };
  return (
    <>
      {" "}
      {/* ====== Page Header ====== */}{" "}
      <section className="page-hero">
        {" "}
        <div className="absolute inset-0 z-0">
          {" "}
          <Image
            src="/hero-bg.png"
            alt="Contact ARIFA Background"
            fill
            className="object-cover object-center opacity-30 grayscale-[0.2]"
            priority
          />{" "}
          <div className="absolute inset-0 bg-night/80" />{" "}
        </div>{" "}
        <div className="max-w-[1200px] w-full mx-auto px-6 relative z-10 text-center">
          {" "}
          <div className="page-hero-badge animate-fadeInUp">
            {" "}
            Get in Touch{" "}
          </div>{" "}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6 animate-fadeInUp animate-delay-100 font-[var(--font-heading)]">
            {" "}
            Contact <span className="text-secondary">ARIFA</span>{" "}
          </h1>{" "}
          <p className="text-lg md:text-xl text-white/80 max-w-[700px] mx-auto animate-fadeInUp animate-delay-200">
            {" "}
            Have questions about our research, programs, or partnership
            opportunities? We&apos;d love to hear from you.{" "}
          </p>{" "}
        </div>{" "}
      </section>{" "}
      {/* ====== Contact Area ====== */}{" "}
      <section className="py-24 bg-white min-h-[60vh]">
        {" "}
        <div className="max-w-[1200px] mx-auto px-6">
          {" "}
          <div className="grid lg:grid-cols-5 gap-12">
            {" "}
            {/* Contact Info */}{" "}
            <div className="lg:col-span-2 space-y-8">
              {" "}
              <RevealOnScroll>
                {" "}
                <h2 className="text-3xl font-bold text-ink font-[var(--font-heading)] mb-6">
                  Contact Information
                </h2>{" "}
                <p className="text-muted mb-8 text-justify">
                  {" "}
                  Reach out to us using the details below or fill out the
                  contact form and a member of our team will assist you.{" "}
                </p>{" "}
                <div className="space-y-6">
                  {" "}
                  <div className="flex gap-4">
                    {" "}
                    <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center text-xl shrink-0">
                      {" "}
                      <i className="fas fa-map-marker-alt" />{" "}
                    </div>{" "}
                    <div>
                      {" "}
                      <h4 className="font-bold text-ink font-[var(--font-heading)] mb-1">
                        Our Location
                      </h4>{" "}
                      <p className="text-muted text-sm leading-relaxed">
                        {" "}
                        Old Bagamoyo Road, Brown Street,
                        <br /> Box 2512, Mbezi Beach, Kinondoni,
                        <br /> Dar es Salaam, Tanzania{" "}
                      </p>{" "}
                    </div>{" "}
                  </div>{" "}
                  <div className="flex gap-4">
                    {" "}
                    <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center text-xl shrink-0">
                      {" "}
                      <i className="fas fa-envelope" />{" "}
                    </div>{" "}
                    <div>
                      {" "}
                      <h4 className="font-bold text-ink font-[var(--font-heading)] mb-1">
                        Email Us
                      </h4>{" "}
                      <p className="text-muted text-sm">
                        {" "}
                        <a
                          href="mailto:info@arifa.org"
                          className="hover:text-primary transition-colors"
                        >
                          info@arifa.org
                        </a>{" "}
                      </p>{" "}
                    </div>{" "}
                  </div>{" "}
                  <div className="flex gap-4">
                    {" "}
                    <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center text-xl shrink-0">
                      {" "}
                      <i className="fas fa-clock" />{" "}
                    </div>{" "}
                    <div>
                      {" "}
                      <h4 className="font-bold text-ink font-[var(--font-heading)] mb-1">
                        Office Hours
                      </h4>{" "}
                      <p className="text-muted text-sm">
                        {" "}
                        Mon – Sat: 8:00 AM – 7:00 PM
                        <br /> Sunday: Closed{" "}
                      </p>{" "}
                    </div>{" "}
                  </div>{" "}
                </div>{" "}
                {/* Socials */}{" "}
                <div className="mt-10 pt-10 border-t border-line">
                  {" "}
                  <h4 className="font-bold text-ink font-[var(--font-heading)] mb-4">
                    Follow Us
                  </h4>{" "}
                  <div className="flex flex-wrap gap-3">
                    {" "}
                    <a
                      href="https://www.linkedin.com/company/arifaai/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors"
                      aria-label="LinkedIn"
                    >
                      {" "}
                      <i className="fab fa-linkedin-in" />{" "}
                    </a>{" "}
                    <a
                      href="https://www.facebook.com/arifa1ai"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors"
                      aria-label="Facebook"
                    >
                      {" "}
                      <i className="fab fa-facebook-f" />{" "}
                    </a>{" "}
                    <a
                      href="https://twitter.com/arifa__ai"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors"
                      aria-label="Twitter"
                    >
                      {" "}
                      <i className="fab fa-twitter" />{" "}
                    </a>{" "}
                    <a
                      href="https://www.instagram.com/arifa_ai/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors"
                      aria-label="Instagram"
                    >
                      {" "}
                      <i className="fab fa-instagram" />{" "}
                    </a>{" "}
                    <a
                      href="https://www.youtube.com/@ARIFA_AI"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors"
                      aria-label="YouTube"
                    >
                      {" "}
                      <i className="fab fa-youtube" />{" "}
                    </a>{" "}
                    <a
                      href="https://www.tiktok.com/ARIFA_AI"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors"
                      aria-label="TikTok"
                    >
                      {" "}
                      <i className="fab fa-tiktok" />{" "}
                    </a>{" "}
                  </div>{" "}
                </div>{" "}
              </RevealOnScroll>{" "}
            </div>{" "}
            {/* Contact Form */}{" "}
            <div className="lg:col-span-3">
              {" "}
              <RevealOnScroll
                delay={200}
                className="bg-white rounded-xl p-8 md:p-12 border border-line shadow-[0_8px_30px_rgba(15,20,25,0.05)]"
              >
                {" "}
                <h3 className="text-2xl font-bold text-ink font-[var(--font-heading)] mb-6">
                  Send us a Message
                </h3>{" "}
                <form onSubmit={handleSubmit} className="space-y-6">
                  {" "}
                  <div className="grid sm:grid-cols-2 gap-6">
                    {" "}
                    <div className="space-y-2">
                      {" "}
                      <label
                        htmlFor="firstName"
                        className="text-sm font-bold text-black"
                      >
                        First Name *
                      </label>{" "}
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        required
                        className="w-full px-4 py-3 rounded-xl bg-white border border-line focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                        placeholder="John"
                      />{" "}
                    </div>{" "}
                    <div className="space-y-2">
                      {" "}
                      <label
                        htmlFor="lastName"
                        className="text-sm font-bold text-black"
                      >
                        Last Name *
                      </label>{" "}
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        required
                        className="w-full px-4 py-3 rounded-xl bg-white border border-line focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                        placeholder="Doe"
                      />{" "}
                    </div>{" "}
                  </div>{" "}
                  <div className="grid sm:grid-cols-2 gap-6">
                    {" "}
                    <div className="space-y-2">
                      {" "}
                      <label
                        htmlFor="email"
                        className="text-sm font-bold text-black"
                      >
                        Email Address *
                      </label>{" "}
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        className="w-full px-4 py-3 rounded-xl bg-white border border-line focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                        placeholder="john@example.com"
                      />{" "}
                    </div>{" "}
                    <div className="space-y-2">
                      {" "}
                      <label
                        htmlFor="phone"
                        className="text-sm font-bold text-black"
                      >
                        Phone Number
                      </label>{" "}
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        className="w-full px-4 py-3 rounded-xl bg-white border border-line focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                        placeholder="+255 123 456 789"
                      />{" "}
                    </div>{" "}
                  </div>{" "}
                  <div className="space-y-2">
                    {" "}
                    <label
                      htmlFor="subject"
                      className="text-sm font-bold text-black"
                    >
                      Subject *
                    </label>{" "}
                    <select
                      id="subject"
                      name="subject"
                      defaultValue=""
                      required
                      className="w-full px-4 py-3 rounded-xl bg-white border border-line focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all appearance-none"
                    >
                      {" "}
                      <option value="" disabled>
                        Select a subject...
                      </option>{" "}
                      <option value="General Inquiry">General Inquiry</option>{" "}
                      <option value="Research Partnership">
                        Research Partnership
                      </option>{" "}
                      <option value="Training & Certification">
                        Training & Certification
                      </option>{" "}
                      <option value="Careers">Careers</option>{" "}
                    </select>{" "}
                  </div>{" "}
                  <div className="space-y-2">
                    {" "}
                    <label
                      htmlFor="message"
                      className="text-sm font-bold text-black"
                    >
                      Message *
                    </label>{" "}
                    <textarea
                      id="message"
                      name="message"
                      rows="5"
                      required
                      className="w-full px-4 py-3 rounded-xl bg-white border border-line focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all resize-none"
                      placeholder="How can we help you?"
                    ></textarea>{" "}
                  </div>{" "}
                  {status.error && (
                    <div
                      role="alert"
                      className="rounded-xl bg-red-50 px-5 py-4 font-medium text-red-700"
                    >
                      {status.error}
                    </div>
                  )}{" "}
                  {status.state === "sent" && (
                    <div
                      role="status"
                      className="rounded-xl bg-green-50 px-5 py-4 font-medium text-green-700"
                    >
                      Thank you for your message. We will get back to you
                      shortly.
                    </div>
                  )}{" "}
                  <button
                    type="submit"
                    disabled={status.state === "sending"}
                    className="w-full py-4 bg-primary text-white rounded-xl font-bold shadow-[0_4px_14px_rgba(0,0,0,0.25)] hover:bg-primary hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:hover:translate-y-0"
                  >
                    {" "}
                    {status.state === "sending" ? "Sending…" : "Send Message"}{" "}
                    <i className="fas fa-paper-plane ml-2 text-sm" />{" "}
                  </button>{" "}
                </form>{" "}
              </RevealOnScroll>{" "}
            </div>{" "}
          </div>{" "}
        </div>{" "}
      </section>{" "}
      {/* ====== Map ====== */}{" "}
      <section className="h-[400px] w-full bg-primary/10 relative">
        {" "}
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15847.10651137021!2d39.2789178128418!3d-6.812239083592658!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x185c4b09ec25fbb3%3A0x64ce5f0c13bbbe9a!2sDar%20es%20Salaam%2C%20Tanzania!5e0!3m2!1sen!2sus!4v1717616111000!5m2!1sen!2sus"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="ARIFA Location Map"
          className="absolute inset-0"
        />{" "}
      </section>{" "}
    </>
  );
}
