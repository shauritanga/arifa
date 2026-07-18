"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { submitApplication } from "@/lib/client/submit-application";

export default function ApplicationModal({
  isOpen,
  onClose,
  courseTitle,
  courseImage,
}) {
  const [mounted, setMounted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");
  const [cvName, setCvName] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return undefined;
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen, mounted]);

  useEffect(() => {
    if (!isOpen) return undefined;
    const onKey = (e) => {
      if (e.key === "Escape" && !isSubmitting) onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, isSubmitting, onClose]);

  useEffect(() => {
    if (isOpen) {
      setIsSuccess(false);
      setError("");
      setCvName("");
      setIsSubmitting(false);
    }
  }, [isOpen]);

  if (!isOpen || !mounted) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    setError("");
    setIsSubmitting(true);

    try {
      await submitApplication(form, { programme: courseTitle });
      setIsSubmitting(false);
      setIsSuccess(true);

      setTimeout(() => {
        setIsSuccess(false);
        onClose();
      }, 3000);
    } catch (err) {
      setError(err.message);
      setIsSubmitting(false);
    }
  };

  const inputClass =
    "w-full rounded-xl border border-line bg-primary/5 px-4 py-3 text-black outline-none transition-all focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10";

  const modalContent = (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-4 md:p-6">
      {/* Backdrop — dark glass, not full primary red */}
      <div
        className="absolute inset-0 bg-night/70 backdrop-blur-[2px]"
        onClick={() => !isSubmitting && onClose()}
        aria-hidden="true"
      />

      {/*
        Original two-column layout, constrained to the viewport on short screens.
        Left brand panel stays; right form column scrolls between sticky header + footer.
      */}
      <div
        className="relative flex w-full max-w-4xl max-h-[min(92dvh,900px)] transform flex-col overflow-hidden rounded-xl bg-white shadow-2xl md:flex-row"
        role="dialog"
        aria-modal="true"
        aria-label={`Apply for ${courseTitle || "programme"}`}
      >
        <button
          type="button"
          onClick={() => !isSubmitting && onClose()}
          className="absolute right-3 top-3 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white transition-colors hover:bg-white/40 md:right-4 md:top-4 md:bg-primary/5 md:text-black md:hover:bg-primary/10"
          aria-label="Close modal"
        >
          <i className="fas fa-times text-xl" />
        </button>

        {/* Left brand panel (original) */}
        <div className="relative h-36 w-full flex-shrink-0 bg-primary sm:h-44 md:h-auto md:w-1/3 md:min-h-0">
          <Image
            src={courseImage || "/program-certification.png"}
            alt={courseTitle || "Certification"}
            fill
            className="object-cover opacity-60"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
          <div className="absolute inset-0 bg-primary/80" />
          <div className="absolute inset-0 flex flex-col justify-end p-5 sm:p-6 md:justify-center md:p-8">
            <span className="mb-2 inline-block w-fit rounded-full bg-white/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white sm:mb-4">
              Application
            </span>
            <h3 className="mb-2 font-[var(--font-heading)] text-xl font-bold leading-tight text-white sm:mb-4 sm:text-2xl md:text-3xl">
              {courseTitle}
            </h3>
            <p className="hidden text-sm leading-relaxed text-white/80 md:block">
              Take the next step in your career. Submit your application and our
              admissions team will contact you within 24 hours.
            </p>
          </div>
        </div>

        {/* Right column: header + scroll body + footer */}
        <div className="flex min-h-0 min-w-0 flex-1 flex-col bg-white md:w-2/3">
          {isSuccess ? (
            <div className="flex flex-1 flex-col items-center justify-center space-y-4 overflow-y-auto px-6 py-12 text-center sm:px-8 md:px-10">
              <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-secondary/10 text-secondary">
                <i className="fas fa-check text-4xl" />
              </div>
              <h3 className="text-2xl font-bold text-black">
                Application Received!
              </h3>
              <p className="max-w-sm text-muted">
                Thank you for applying. Our admissions team will be in touch
                shortly.
              </p>
            </div>
          ) : (
            <>
              {/* Sticky header */}
              <div className="shrink-0 border-b border-line px-5 py-4 sm:px-8 sm:py-5 md:px-10">
                <h2 className="font-[var(--font-heading)] text-xl font-bold text-black sm:text-2xl">
                  Personal Details
                </h2>
              </div>

              {/* Scrollable form fields only */}
              <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-5 sm:px-8 sm:py-6 md:px-10">
                <form
                  id="application-form"
                  onSubmit={handleSubmit}
                  className="space-y-5 sm:space-y-6"
                >
                  <div className="grid gap-5 sm:grid-cols-2 sm:gap-6">
                    <div>
                      <label className="mb-2 block text-sm font-bold text-black">
                        First Name <span className="text-primary">*</span>
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        autoComplete="given-name"
                        className={inputClass}
                        required
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-bold text-black">
                        Last Name <span className="text-primary">*</span>
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        autoComplete="family-name"
                        className={inputClass}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2 sm:gap-6">
                    <div>
                      <label className="mb-2 block text-sm font-bold text-black">
                        Email Address <span className="text-primary">*</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        autoComplete="email"
                        className={inputClass}
                        required
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-bold text-black">
                        Phone Number <span className="text-primary">*</span>
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        autoComplete="tel"
                        className={inputClass}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-bold text-black">
                      Why are you interested in this certification?{" "}
                      <span className="text-primary">*</span>
                    </label>
                    <textarea
                      name="motivation"
                      rows={3}
                      className={`${inputClass} resize-none`}
                      required
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="cv-modal"
                      className="mb-2 block text-sm font-bold text-black"
                    >
                      Resume / CV (Optional)
                    </label>
                    <label
                      htmlFor="cv-modal"
                      className="block w-full cursor-pointer rounded-xl border-2 border-dashed border-line p-5 text-center transition-all hover:border-primary hover:bg-primary/5 sm:p-6"
                    >
                      <i className="fas fa-cloud-upload-alt mb-2 text-2xl text-black/50 transition-colors" />
                      <p className="text-sm font-medium text-black">
                        {cvName || "Click to upload"}
                      </p>
                      <p className="mt-1 text-xs text-black/60">
                        PDF, DOC or DOCX up to 5MB
                      </p>
                    </label>
                    <input
                      id="cv-modal"
                      name="cv"
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={(e) =>
                        setCvName(e.target.files?.[0]?.name || "")
                      }
                      className="sr-only"
                    />
                  </div>

                  {error && (
                    <div
                      role="alert"
                      className="rounded-xl bg-red-50 px-5 py-4 text-sm font-medium text-red-700"
                    >
                      {error}
                    </div>
                  )}
                </form>
              </div>

              {/* Sticky footer */}
              <div className="shrink-0 border-t border-line bg-white px-5 py-3 sm:px-8 sm:py-4 md:px-10">
                <div className="flex items-center justify-end gap-3 sm:gap-4">
                  <button
                    type="button"
                    onClick={() => !isSubmitting && onClose()}
                    disabled={isSubmitting}
                    className="rounded-xl px-5 py-3 text-sm font-bold text-black transition-colors hover:bg-primary/10 disabled:opacity-50 sm:px-6"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    form="application-form"
                    disabled={isSubmitting}
                    className="flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-white shadow-lg transition-all hover:bg-primary hover:shadow-primary/30 hover:-translate-y-0.5 disabled:pointer-events-none disabled:opacity-70 sm:px-8"
                  >
                    {isSubmitting ? (
                      <>
                        <i className="fas fa-circle-notch fa-spin" />{" "}
                        Submitting...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-paper-plane" /> Submit Application
                      </>
                    )}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
