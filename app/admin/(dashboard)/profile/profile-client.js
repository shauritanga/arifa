"use client";

import { useState, useTransition } from "react";
import { changePassword, updateProfile } from "../../actions";

const INPUT =
  "w-full rounded-lg border border-black/10 px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20";

function initials(name, email) {
  if (name?.trim()) {
    const p = name.trim().split(/\s+/);
    if (p.length >= 2) return (p[0][0] + p[1][0]).toUpperCase();
    return name.slice(0, 2).toUpperCase();
  }
  return (email || "A").slice(0, 2).toUpperCase();
}

export default function ProfileClient({ user }) {
  const [profilePending, startProfile] = useTransition();
  const [passPending, startPass] = useTransition();
  const [profileResult, setProfileResult] = useState(null);
  const [passResult, setPassResult] = useState(null);

  const onProfile = (formData) => {
    setProfileResult(null);
    startProfile(async () => {
      setProfileResult(await updateProfile(formData));
    });
  };

  const onPassword = (formData) => {
    setPassResult(null);
    startPass(async () => {
      const res = await changePassword(formData);
      setPassResult(res);
      if (res.ok) {
        // clear password fields by remounting form via key is overkill; leave message
      }
    });
  };

  const created = new Date(user.createdAt).toLocaleDateString(undefined, {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div>
      <div className="mb-6">
        <p className="mb-1 text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-primary">
          Account
        </p>
        <h1 className="text-xl font-bold text-black font-[var(--font-heading)] sm:text-2xl">
          Profile
        </h1>
        <p className="mt-1 text-xs text-black/50 sm:text-sm">
          Your personal admin identity and security credentials.
        </p>
      </div>

      {/* Identity card */}
      <div className="mb-6 flex flex-col gap-4 rounded-2xl border border-black/10 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:p-6">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-primary text-xl font-bold text-white shadow-md shadow-primary/25">
          {initials(user.name, user.email)}
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="truncate text-base font-bold text-black">
            {user.name || "Unnamed admin"}
          </h2>
          <p className="truncate text-sm text-black/55">{user.email}</p>
          <div className="mt-2 flex flex-wrap gap-2">
            <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[0.65rem] font-bold uppercase tracking-wide text-primary">
              {user.role}
            </span>
            <span className="rounded-full bg-black/[0.04] px-2.5 py-0.5 text-[0.65rem] font-medium text-black/50">
              Member since {created}
            </span>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Profile details */}
        <section className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-4 flex items-center gap-2 border-b border-black/5 pb-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-500/10 text-sky-700">
              <i className="fas fa-user text-xs" />
            </span>
            <div>
              <h3 className="text-sm font-bold text-black">Personal details</h3>
              <p className="text-[0.7rem] text-black/45">
                How you appear in the admin dashboard.
              </p>
            </div>
          </div>

          <form action={onProfile} className="space-y-4">
            {profileResult && (
              <div
                role="alert"
                className={`rounded-lg px-3 py-2.5 text-xs font-medium ${
                  profileResult.ok
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-red-50 text-red-700"
                }`}
              >
                {profileResult.ok
                  ? profileResult.message || "Saved."
                  : profileResult.error}
              </div>
            )}

            <label className="block">
              <span className="mb-1.5 block text-[0.7rem] font-semibold uppercase tracking-wide text-black/70">
                Display name
              </span>
              <input
                name="name"
                defaultValue={user.name}
                required
                className={INPUT}
                placeholder="Your full name"
              />
            </label>

            <label className="block">
              <span className="mb-1.5 block text-[0.7rem] font-semibold uppercase tracking-wide text-black/70">
                Email address
              </span>
              <input
                name="email"
                type="email"
                defaultValue={user.email}
                required
                className={INPUT}
              />
              <span className="mt-1 block text-[0.7rem] text-black/40">
                Used to sign in. Changing it updates your login email.
              </span>
            </label>

            <label className="block">
              <span className="mb-1.5 block text-[0.7rem] font-semibold uppercase tracking-wide text-black/70">
                Role
              </span>
              <input
                type="text"
                value={user.role}
                disabled
                readOnly
                className={`${INPUT} cursor-not-allowed bg-black/[0.03] text-black/50`}
              />
              <span className="mt-1 block text-[0.7rem] text-black/40">
                Roles are managed by super-admins under Admin Users.
              </span>
            </label>

            <button
              type="submit"
              disabled={profilePending}
              className="rounded-lg bg-primary px-4 py-2.5 text-xs font-bold text-white disabled:opacity-70 sm:text-sm"
            >
              {profilePending ? "Saving…" : "Save profile"}
            </button>
          </form>
        </section>

        {/* Security */}
        <section className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-4 flex items-center gap-2 border-b border-black/5 pb-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-700">
              <i className="fas fa-shield-halved text-xs" />
            </span>
            <div>
              <h3 className="text-sm font-bold text-black">Security</h3>
              <p className="text-[0.7rem] text-black/45">
                Change your password regularly.
              </p>
            </div>
          </div>

          <form action={onPassword} className="space-y-4">
            {passResult && (
              <div
                role="alert"
                className={`rounded-lg px-3 py-2.5 text-xs font-medium ${
                  passResult.ok
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-red-50 text-red-700"
                }`}
              >
                {passResult.ok
                  ? "Password updated successfully."
                  : passResult.error}
              </div>
            )}

            <label className="block">
              <span className="mb-1.5 block text-[0.7rem] font-semibold uppercase tracking-wide text-black/70">
                Current password
              </span>
              <input
                name="current"
                type="password"
                required
                autoComplete="current-password"
                className={INPUT}
              />
            </label>

            <label className="block">
              <span className="mb-1.5 block text-[0.7rem] font-semibold uppercase tracking-wide text-black/70">
                New password
              </span>
              <input
                name="next"
                type="password"
                required
                minLength={10}
                autoComplete="new-password"
                className={INPUT}
              />
              <span className="mt-1 block text-[0.7rem] text-black/40">
                At least 10 characters.
              </span>
            </label>

            <label className="block">
              <span className="mb-1.5 block text-[0.7rem] font-semibold uppercase tracking-wide text-black/70">
                Confirm new password
              </span>
              <input
                name="confirm"
                type="password"
                required
                minLength={10}
                autoComplete="new-password"
                className={INPUT}
              />
            </label>

            <button
              type="submit"
              disabled={passPending}
              className="rounded-lg bg-primary px-4 py-2.5 text-xs font-bold text-white disabled:opacity-70 sm:text-sm"
            >
              {passPending ? "Updating…" : "Update password"}
            </button>
          </form>
        </section>
      </div>

      {/* Account meta */}
      <section className="mt-6 rounded-2xl border border-black/10 bg-white p-5 shadow-sm sm:p-6">
        <h3 className="mb-3 text-sm font-bold text-black">Account information</h3>
        <dl className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl bg-black/[0.02] px-4 py-3">
            <dt className="text-[0.65rem] font-semibold uppercase tracking-wide text-black/40">
              User ID
            </dt>
            <dd className="mt-1 truncate font-mono text-xs text-black/70">
              {user.id}
            </dd>
          </div>
          <div className="rounded-xl bg-black/[0.02] px-4 py-3">
            <dt className="text-[0.65rem] font-semibold uppercase tracking-wide text-black/40">
              Role
            </dt>
            <dd className="mt-1 text-sm font-semibold capitalize text-black">
              {user.role}
            </dd>
          </div>
          <div className="rounded-xl bg-black/[0.02] px-4 py-3">
            <dt className="text-[0.65rem] font-semibold uppercase tracking-wide text-black/40">
              Created
            </dt>
            <dd className="mt-1 text-sm font-semibold text-black">{created}</dd>
          </div>
        </dl>
      </section>
    </div>
  );
}
