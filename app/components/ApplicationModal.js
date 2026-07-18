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
  const mounted = typeof document !== "undefined";
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");
  const [cvName, setCvName] = useState("");

  useEffect(() => {
    if (!mounted) return;
    document.body.style.overflow = isOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen, mounted]);

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

  const modalContent = (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center overflow-y-auto bg-primary/85 p-4 transition-all duration-300 sm:p-6">
      <div className="absolute inset-0" onClick={onClose} />
      <div className="relative my-auto flex w-full max-w-4xl transform flex-col overflow-hidden rounded-xl bg-white shadow-2xl transition-all duration-300 md:flex-row">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white transition-colors hover:bg-white/40 md:bg-primary/5 md:text-black md:hover:bg-primary/10"
          aria-label="Close modal"
        >
          <i className="fas fa-times text-xl" />
        </button>

        <div className="relative h-48 flex-shrink-0 bg-primary md:h-auto md:w-1/3">
          <Image
            src={courseImage || "/program-certification.png"}
            alt={courseTitle || "Certification"}
            fill
            className="object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-primary/80" />
          <div className="absolute inset-0 flex flex-col justify-end p-8 md:justify-center">
            <span className="mb-4 inline-block w-fit rounded-full bg-white/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white">
              Application
            </span>
            <h3 className="mb-4 font-[var(--font-heading)] text-2xl font-bold leading-tight text-white md:text-3xl">
              {courseTitle}
            </h3>
            <p className="hidden text-sm leading-relaxed text-white/80 md:block">
              Take the next step in your career. Submit your application and our
              admissions team will contact you within 24 hours.
            </p>
          </div>
        </div>

        <div className="max-h-[80vh] bg-white p-8 md:w-2/3 md:p-10">
          {isSuccess ? (
            <div className="flex h-full flex-col items-center justify-center space-y-4 py-12 text-center">
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
              <h2 className="mb-6 font-[var(--font-heading)] text-2xl font-bold text-black">
                Personal Details
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-bold text-black">
                      First Name <span className="text-primary">*</span>
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      className="w-full rounded-xl border border-line bg-primary/5 px-4 py-3 text-black outline-none transition-all focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10"
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
                      className="w-full rounded-xl border border-line bg-primary/5 px-4 py-3 text-black outline-none transition-all focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10"
                      required
                    />
                  </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-bold text-black">
                      Email Address <span className="text-primary">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      className="w-full rounded-xl border border-line bg-primary/5 px-4 py-3 text-black outline-none transition-all focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10"
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
                      className="w-full rounded-xl border border-line bg-primary/5 px-4 py-3 text-black outline-none transition-all focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10"
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
                    className="w-full resize-none rounded-xl border border-line bg-primary/5 px-4 py-3 text-black outline-none transition-all focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10"
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
                    className="block w-full cursor-pointer rounded-xl border-2 border-dashed border-line p-6 text-center transition-all hover:border-primary hover:bg-primary/5"
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
                    onChange={(e) => setCvName(e.target.files?.[0]?.name || "")}
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

                <div className="flex items-center justify-end gap-4 border-t border-line pt-4">
                  <button
                    type="button"
                    onClick={onClose}
                    className="rounded-xl px-6 py-3 text-sm font-bold text-black transition-colors hover:bg-primary/10"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex items-center gap-2 rounded-xl bg-primary px-8 py-3 text-sm font-bold text-white shadow-lg transition-all hover:bg-primary hover:shadow-primary/30 hover:-translate-y-0.5 disabled:pointer-events-none disabled:opacity-70"
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
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
