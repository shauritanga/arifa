"use client";
import Image from "next/image";
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
export default function Contact() {
  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Thank you for your message. We will get back to you shortly.");
  };
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
            Get in Touch{" "}
          </div>{" "}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6 animate-fadeInUp animate-delay-100 font-[var(--font-heading)]">
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
                <h2 className="text-3xl font-bold text-black font-[var(--font-heading)] mb-6">
                  Contact Information
                </h2>{" "}
                <p className="text-black/70 mb-8">
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
                      <h4 className="font-bold text-black font-[var(--font-heading)] mb-1">
                        Our Location
                      </h4>{" "}
                      <p className="text-black/70 text-sm leading-relaxed">
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
                      <h4 className="font-bold text-black font-[var(--font-heading)] mb-1">
                        Email Us
                      </h4>{" "}
                      <p className="text-black/70 text-sm">
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
                      <h4 className="font-bold text-black font-[var(--font-heading)] mb-1">
                        Office Hours
                      </h4>{" "}
                      <p className="text-black/70 text-sm">
                        {" "}
                        Mon – Sat: 8:00 AM – 7:00 PM
                        <br /> Sunday: Closed{" "}
                      </p>{" "}
                    </div>{" "}
                  </div>{" "}
                </div>{" "}
                {/* Socials */}{" "}
                <div className="mt-10 pt-10 border-t border-black/10">
                  {" "}
                  <h4 className="font-bold text-black font-[var(--font-heading)] mb-4">
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
                className="bg-white rounded-2xl p-8 md:p-12 border border-black/10 shadow-[0_20px_40px_rgba(0,0,0,0.04)]"
              >
                {" "}
                <h3 className="text-2xl font-bold text-black font-[var(--font-heading)] mb-6">
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
                        required
                        className="w-full px-4 py-3 rounded-xl bg-white border border-black/10 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
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
                        required
                        className="w-full px-4 py-3 rounded-xl bg-white border border-black/10 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
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
                        required
                        className="w-full px-4 py-3 rounded-xl bg-white border border-black/10 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
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
                        className="w-full px-4 py-3 rounded-xl bg-white border border-black/10 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
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
                      required
                      className="w-full px-4 py-3 rounded-xl bg-white border border-black/10 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all appearance-none"
                    >
                      {" "}
                      <option value="" disabled selected>
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
                      rows="5"
                      required
                      className="w-full px-4 py-3 rounded-xl bg-white border border-black/10 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all resize-none"
                      placeholder="How can we help you?"
                    ></textarea>{" "}
                  </div>{" "}
                  <button
                    type="submit"
                    className="w-full py-4 bg-primary text-white rounded-xl font-bold shadow-[0_4px_14px_rgba(0,0,0,0.25)] hover:bg-primary hover:-translate-y-0.5 transition-all"
                  >
                    {" "}
                    Send Message{" "}
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
