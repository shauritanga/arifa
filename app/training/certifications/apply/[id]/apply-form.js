"use client";

import { useState } from "react";
import Link from "next/link";
import { submitApplication } from "@/lib/client/submit-application";

const INPUT =
  "w-full px-4 py-3 rounded-lg border border-black/10 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all";
const LABEL = "block text-sm font-bold text-black mb-2";

export default function ApplyForm({ programme, programmeId }) {
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [cvName, setCvName] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    setError("");
    setSubmitting(true);

    try {
      await submitApplication(form, { programme, programmeId });
      form.reset();
      setCvName("");
      setSuccess(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="py-12 text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-secondary/10 text-secondary">
          <i className="fas fa-check text-4xl" />
        </div>
        <h2 className="mb-3 text-2xl font-bold text-black">
          Application received
        </h2>
        <p className="mx-auto max-w-sm text-black/70">
          Thank you for applying for {programme}. Our admissions team will be in
          touch shortly.
        </p>
        <Link
          href="/training/certifications"
          className="mt-8 inline-block rounded-lg border border-primary px-6 py-3 font-bold text-primary"
        >
          Back to certifications
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label htmlFor="firstName" className={LABEL}>
            First Name <span className="text-primary">*</span>
          </label>
          <input
            id="firstName"
            name="firstName"
            type="text"
            required
            placeholder="John"
            className={INPUT}
          />
        </div>
        <div>
          <label htmlFor="lastName" className={LABEL}>
            Last Name <span className="text-primary">*</span>
          </label>
          <input
            id="lastName"
            name="lastName"
            type="text"
            required
            placeholder="Doe"
            className={INPUT}
          />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label htmlFor="email" className={LABEL}>
            Email Address <span className="text-primary">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            placeholder="john@example.com"
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
            placeholder="+255 712 345 678"
            className={INPUT}
          />
        </div>
      </div>

      <div>
        <label htmlFor="occupation" className={LABEL}>
          Current Job Title / Profession
        </label>
        <input
          id="occupation"
          name="occupation"
          type="text"
          placeholder="e.g. Data Analyst"
          className={INPUT}
        />
      </div>

      <div>
        <label htmlFor="motivation" className={LABEL}>
          Why are you interested in this certification?{" "}
          <span className="text-primary">*</span>
        </label>
        <textarea
          id="motivation"
          name="motivation"
          rows={4}
          required
          placeholder="Briefly describe your goals..."
          className={`${INPUT} resize-none`}
        />
      </div>

      <div>
        <label htmlFor="cv" className={LABEL}>
          Upload Resume / CV (Optional)
        </label>
        <label
          htmlFor="cv"
          className="block cursor-pointer rounded-lg border-2 border-dashed border-black/10 bg-primary/5 p-6 text-center transition-colors hover:border-primary"
        >
          <i className="fas fa-cloud-upload-alt mb-2 text-3xl text-primary/50" />
          <p className="text-sm text-black/70">
            {cvName || "Click to upload"}
          </p>
          <p className="mt-1 text-xs text-black/50">
            PDF, DOC, or DOCX (Max 5MB)
          </p>
        </label>
        <input
          id="cv"
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
          className="rounded-lg bg-red-50 px-5 py-4 font-medium text-red-700"
        >
          {error}
        </div>
      )}

      <div className="border-t border-black/10 pt-6">
        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-lg bg-primary py-4 text-lg font-bold text-white shadow-lg transition-all hover:-translate-y-0.5 disabled:pointer-events-none disabled:opacity-70"
        >
          {submitting ? "Submitting…" : "Submit Application"}
        </button>
        <p className="mt-4 text-center text-xs text-black/70">
          By submitting this form, you agree to our{" "}
          <Link href="#" className="text-primary hover:underline">
            Terms &amp; Conditions
          </Link>{" "}
          and{" "}
          <Link href="#" className="text-primary hover:underline">
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    </form>
  );
}
