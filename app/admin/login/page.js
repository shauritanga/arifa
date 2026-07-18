"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const form = new FormData(e.currentTarget);
    const res = await signIn("credentials", {
      email: String(form.get("email")),
      password: String(form.get("password")),
      redirect: false,
    });

    setLoading(false);
    if (res?.error) {
      setError("Invalid email or password.");
      return;
    }
    router.push("/admin");
    router.refresh();
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-primary/5 px-6 py-24">
      <div className="w-full max-w-sm rounded-2xl border border-black/10 bg-white p-8 shadow-[0_20px_40px_rgba(0,0,0,0.08)]">
        <div className="mb-8 text-center">
          <div className="mb-4 flex justify-center">
            <Image
              src="/images/arifa-logo-dark.png"
              alt="ARIFA"
              width={140}
              height={48}
              className="h-10 w-auto object-contain"
              priority
            />
          </div>
          <h1 className="mt-2 text-2xl font-extrabold text-black font-[var(--font-heading)]">
            Admin Dashboard
          </h1>
          <p className="mt-1 text-sm text-black/60">Sign in to continue</p>
        </div>

        <form onSubmit={onSubmit} className="space-y-5">
          {error && (
            <div
              role="alert"
              className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
            >
              {error}
            </div>
          )}

          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-bold uppercase tracking-wide text-black"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              className="w-full rounded-xl border border-black/10 px-4 py-3 outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-bold uppercase tracking-wide text-black"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className="w-full rounded-xl border border-black/10 px-4 py-3 outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-primary py-4 font-bold text-white transition-all hover:shadow-lg disabled:opacity-70"
          >
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
