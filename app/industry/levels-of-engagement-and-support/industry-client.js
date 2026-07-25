"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import SponsorMarquee from "../../components/SponsorMarquee";
import { startPayment } from "../../../lib/client/start-payment";
import { TZS_PER_USD, formatShillings } from "../../../lib/currency";

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

const INPUT =
  "w-full px-4 py-3 rounded-lg border border-line focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all";
const LABEL = "block text-sm font-bold text-black mb-2";

/**
 * Sponsorship form for one fixed-price package. Posts straight to the Selcom
 * initiate route with the package's amount — the visitor never sees the
 * general /support-us pledge form or has to re-enter what they are paying.
 */
function SponsorForm({ pkg, onCancel }) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const shillingsDue = Math.round(pkg.usd * TZS_PER_USD);

  const onSubmit = async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));
    setError("");
    setSubmitting(true);
    try {
      // Navigates away to Selcom on success, so `submitting` stays true.
      await startPayment({
        ...data,
        paymentType: "sponsorship",
        packageName: pkg.label,
        amount: shillingsDue,
      });
    } catch (err) {
      setError(err.message);
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label htmlFor="name" className={LABEL}>
            Full Name <span className="text-primary">*</span>
          </label>
          <input id="name" name="name" type="text" required className={INPUT} />
        </div>
        <div>
          <label htmlFor="email" className={LABEL}>
            Email Address <span className="text-primary">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            maxLength={50}
            className={INPUT}
          />
        </div>
        <div>
          <label htmlFor="phone" className={LABEL}>
            Phone Number <span className="text-primary">*</span>
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            required
            placeholder="0712 345 678"
            className={INPUT}
          />
        </div>
        <div>
          <label htmlFor="organization" className={LABEL}>
            Organization / Company <span className="text-primary">*</span>
          </label>
          <input
            id="organization"
            name="organization"
            type="text"
            required
            className={INPUT}
          />
        </div>
      </div>

      <div>
        <label htmlFor="message" className={LABEL}>
          Message (optional)
        </label>
        <textarea
          id="message"
          name="message"
          rows={3}
          maxLength={180}
          className={`${INPUT} resize-y`}
        />
      </div>

      {error && (
        <div role="alert" className="rounded-xl bg-red-50 px-5 py-4 text-red-700">
          {error}
        </div>
      )}

      <div className="flex flex-col-reverse sm:flex-row gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          disabled={submitting}
          className="w-full sm:w-auto rounded-xl border border-line px-6 py-3.5 font-bold text-muted disabled:opacity-70"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="flex flex-1 items-center justify-center gap-2.5 rounded-xl bg-primary px-6 py-3.5 font-bold text-white transition-all hover:-translate-y-0.5 disabled:opacity-70"
        >
          {submitting
            ? "Taking you to Selcom…"
            : `Pay USD ${pkg.usd.toLocaleString("en-US")}`}
        </button>
      </div>

      <p className="text-center text-sm text-black/50">
        Payment is handled by Selcom. Card, M-Pesa, Tigo Pesa and Airtel Money
        are accepted on the next screen.
      </p>
    </form>
  );
}

/** Modal wrapper around SponsorForm, opened from a package's "Choose" button. */
function SponsorModal({ pkg, onClose }) {
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-black/60 p-4 py-10 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={`Sponsor — ${pkg.label}`}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-[600px] rounded-xl bg-white p-7 shadow-[0_30px_80px_rgba(0,0,0,0.35)] md:p-9"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full bg-black/5 text-black/60 transition-colors hover:bg-black/10 hover:text-black"
        >
          <i className="fas fa-times" />
        </button>

        <div className="text-xs font-bold uppercase tracking-[2px] text-primary">
          Sponsorship
        </div>
        <h2 className="mt-1 text-2xl font-bold text-ink font-[var(--font-heading)]">
          {pkg.label}
        </h2>
        <p className="mt-2 mb-7 text-sm text-black/60">
          You will pay{" "}
          <strong className="text-black">
            USD {pkg.usd.toLocaleString("en-US")}
          </strong>
          , charged as {formatShillings(Math.round(pkg.usd * TZS_PER_USD))} via
          Selcom.
        </p>

        <SponsorForm pkg={pkg} onCancel={onClose} />
      </div>
    </div>
  );
}

export default function IndustryEngagement({ sponsors = [] }) {
  const [active, setActive] = useState(null);

  return (
    <>
      {" "}
      {/* ====== Page Header ====== */}{" "}
      <section className="page-hero">
        {" "}
        <div className="absolute inset-0 z-0">
          {" "}
          <Image
            src="/about-img.png"
            alt="Industry Engagement Background"
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
            Industry{" "}
          </div>{" "}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6 animate-fadeInUp animate-delay-100 font-[var(--font-heading)]">
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
      {/* ====== Sponsor Marquee ====== */}{" "}
      <SponsorMarquee sponsors={sponsors} />{" "}
      {/* ====== Engagement Models ====== */}{" "}
      <section className="py-24 bg-white min-h-[60vh]">
        {" "}
        <div className="max-w-[1200px] mx-auto px-6">
          {" "}
          <div className="text-center max-w-[700px] mx-auto mb-16">
            {" "}
            <h2 className="text-3xl font-bold text-ink font-[var(--font-heading)] mb-6">
              Sponsorship Packages
            </h2>{" "}
            <p className="text-muted text-lg">
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
              className="bg-white rounded-xl p-10 border border-line shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_32px_rgba(15,20,25,0.07)] transition-all flex flex-col relative overflow-hidden"
            >
              {" "}
              <div className="absolute top-0 right-0 w-24 h-24 bg-white rounded-bl-full -z-10" />{" "}
              <div className="w-14 h-14 rounded-full bg-white text-primary flex items-center justify-center text-xl mb-6">
                {" "}
                <i className="fas fa-handshake" />{" "}
              </div>{" "}
              <h3 className="text-2xl font-bold text-ink font-[var(--font-heading)] mb-2">
                Basic Package
              </h3>{" "}
              <div className="mb-6">
                {" "}
                <span className="text-3xl font-bold text-black">
                  $25,000
                </span>{" "}
                <span className="text-sm font-bold text-muted uppercase tracking-wider ml-1">
                  / Annually
                </span>{" "}
              </div>{" "}
              <p className="text-muted mb-8 font-medium text-justify">
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
              <button
                type="button"
                onClick={() => setActive({ id: "basic", label: "Basic Package", usd: 25000 })}
                className="w-full py-4 border-2 border-primary text-primary rounded-xl font-bold text-center hover:bg-primary hover:text-white transition-all"
              >
                {" "}
                Choose Basic{" "}
              </button>{" "}
            </RevealOnScroll>{" "}
            {/* Standard Package */}{" "}
            <RevealOnScroll
              delay={200}
              className="bg-primary rounded-xl p-10 border border-primary shadow-[0_20px_40px_rgba(0,0,0,0.15)] transition-all flex flex-col relative overflow-hidden lg:-translate-y-4"
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
                <span className="text-3xl font-bold text-white">
                  $50,000
                </span>{" "}
                <span className="text-sm font-bold text-white/50 uppercase tracking-wider ml-1">
                  / Annually
                </span>{" "}
              </div>{" "}
              <p className="text-white/70 mb-8 font-medium text-justify">
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
              <button
                type="button"
                onClick={() =>
                  setActive({ id: "standard", label: "Standard Package", usd: 50000 })
                }
                className="w-full py-4 bg-primary text-white rounded-xl font-bold text-center hover:bg-primary transition-all"
              >
                {" "}
                Choose Standard{" "}
              </button>{" "}
            </RevealOnScroll>{" "}
            {/* Premium Package */}{" "}
            <RevealOnScroll
              delay={300}
              className="bg-white rounded-xl p-10 border border-line shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_32px_rgba(15,20,25,0.07)] transition-all flex flex-col relative overflow-hidden"
            >
              {" "}
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-tr-full -z-10" />{" "}
              <div className="w-14 h-14 rounded-full bg-white text-primary flex items-center justify-center text-xl mb-6">
                {" "}
                <i className="fas fa-crown" />{" "}
              </div>{" "}
              <h3 className="text-2xl font-bold text-ink font-[var(--font-heading)] mb-2">
                Premium Package
              </h3>{" "}
              <div className="mb-6">
                {" "}
                <span className="text-3xl font-bold text-black">
                  $100,000
                </span>{" "}
                <span className="text-sm font-bold text-muted uppercase tracking-wider ml-1">
                  / Annually
                </span>{" "}
              </div>{" "}
              <p className="text-muted mb-8 font-medium text-justify">
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
              <button
                type="button"
                onClick={() =>
                  setActive({ id: "premium", label: "Premium Package", usd: 100000 })
                }
                className="w-full py-4 border-2 border-primary text-primary rounded-xl font-bold text-center hover:bg-primary hover:text-white transition-all"
              >
                {" "}
                Choose Premium{" "}
              </button>{" "}
            </RevealOnScroll>{" "}
          </div>{" "}
        </div>{" "}
      </section>{" "}
      {active && <SponsorModal pkg={active} onClose={() => setActive(null)} />}
    </>
  );
}
