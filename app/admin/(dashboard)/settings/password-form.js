"use client";

import { useState, useTransition } from "react";
import { changePassword } from "../../actions";

export default function PasswordForm() {
  const [pending, startTransition] = useTransition();
  const [result, setResult] = useState(null);

  const onSubmit = (formData) => {
    setResult(null);
    startTransition(async () => {
      setResult(await changePassword(formData));
    });
  };

  return (
    <form action={onSubmit} className="max-w-sm space-y-5">
      {result && (
        <div
          role="alert"
          className={`rounded-xl px-5 py-4 text-sm font-medium ${
            result.ok ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
          }`}
        >
          {result.ok ? "Password updated." : result.error}
        </div>
      )}

      <label className="block">
        <span className="mb-2 block text-sm font-bold uppercase tracking-wide text-black">
          Current password
        </span>
        <input
          name="current"
          type="password"
          required
          autoComplete="current-password"
          className="w-full rounded-xl border border-black/10 px-4 py-3 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
      </label>

      <label className="block">
        <span className="mb-2 block text-sm font-bold uppercase tracking-wide text-black">
          New password
        </span>
        <input
          name="next"
          type="password"
          required
          minLength={10}
          autoComplete="new-password"
          className="w-full rounded-xl border border-black/10 px-4 py-3 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
        <span className="mt-2 block text-xs text-black/50">
          At least 10 characters.
        </span>
      </label>

      <button
        type="submit"
        disabled={pending}
        className="rounded-xl bg-primary px-6 py-3 font-bold text-white disabled:opacity-70"
      >
        {pending ? "Updating…" : "Update password"}
      </button>
    </form>
  );
}
