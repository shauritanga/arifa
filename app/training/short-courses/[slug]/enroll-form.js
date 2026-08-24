"use client";

import { useState } from "react";
import { startPayment } from "@/lib/client/start-payment";
import { formatShillings } from "@/lib/currency";

const INPUT =
  "w-full px-4 py-3 rounded-lg border border-line focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all";
const LABEL = "block text-sm font-bold text-black mb-2";

export default function EnrollForm({ course, fee }) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));
    setError("");
    setSubmitting(true);
    try {
      await startPayment({ ...data, slug: course.id }, "/api/courses/register");
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
            Organization / Company
          </label>
          <input
            id="organization"
            name="organization"
            type="text"
            className={INPUT}
          />
        </div>
      </div>

      <div>
        <label htmlFor="motivation" className={LABEL}>
          Why do you want to take this course?{" "}
          <span className="text-primary">*</span>
        </label>
        <textarea
          id="motivation"
          name="motivation"
          rows={4}
          required
          maxLength={180}
          className={`${INPUT} resize-y`}
        />
      </div>

      {error && (
        <div role="alert" className="rounded-xl bg-red-50 px-5 py-4 text-red-700">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="flex w-full items-center justify-center gap-2.5 rounded-lg bg-primary px-6 py-3.5 font-bold text-white transition-all hover:-translate-y-0.5 disabled:opacity-70"
      >
        {submitting
          ? "Taking you to Selcom…"
          : `Enroll — pay ${formatShillings(fee)}`}
      </button>

      <p className="text-center text-sm text-black/50">
        Payment is handled by Selcom. Card, M-Pesa, Tigo Pesa and Airtel Money
        are accepted on the next screen.
      </p>
    </form>
  );
}
