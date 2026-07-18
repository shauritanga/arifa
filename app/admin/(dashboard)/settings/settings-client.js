"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { saveSiteSettings } from "../../actions";
// path: settings-client is in (dashboard)/settings → ../../actions = admin/actions

const INPUT =
  "w-full rounded-lg border border-black/10 px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20";

function Field({ label, hint, children }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[0.7rem] font-semibold uppercase tracking-wide text-black/70">
        {label}
      </span>
      {children}
      {hint && (
        <span className="mt-1 block text-[0.7rem] text-black/40">{hint}</span>
      )}
    </label>
  );
}

function Section({ icon, iconClass, title, desc, children }) {
  return (
    <section className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-4 flex items-start gap-2.5 border-b border-black/5 pb-3">
        <span
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${iconClass}`}
        >
          <i className={`fas ${icon} text-xs`} />
        </span>
        <div>
          <h2 className="text-sm font-bold text-black">{title}</h2>
          {desc && <p className="text-[0.7rem] text-black/45">{desc}</p>}
        </div>
      </div>
      {children}
    </section>
  );
}

export default function SettingsClient({ settings }) {
  const [pending, startTransition] = useTransition();
  const [result, setResult] = useState(null);

  const onSubmit = (formData) => {
    setResult(null);
    startTransition(async () => {
      setResult(await saveSiteSettings(formData));
    });
  };

  return (
    <div>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-1 text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-primary">
            Configuration
          </p>
          <h1 className="text-xl font-bold text-black font-[var(--font-heading)] sm:text-2xl">
            Settings
          </h1>
          <p className="mt-1 text-xs text-black/50 sm:text-sm">
            Organisation, contact, notifications, and system preferences.
          </p>
        </div>
        <Link
          href="/admin/profile"
          className="inline-flex items-center gap-2 rounded-lg border border-black/10 bg-white px-3 py-2 text-xs font-semibold text-black/70 hover:bg-black/[0.02]"
        >
          <i className="fas fa-user text-[0.65rem]" />
          Your profile
        </Link>
      </div>

      <form action={onSubmit} className="space-y-5">
        {result && (
          <div
            role="alert"
            className={`rounded-xl px-4 py-3 text-sm font-medium ${
              result.ok
                ? "bg-emerald-50 text-emerald-700"
                : "bg-red-50 text-red-700"
            }`}
          >
            {result.ok ? "Settings saved." : result.error}
          </div>
        )}

        <div className="grid gap-5 lg:grid-cols-2">
          <Section
            icon="fa-building"
            iconClass="bg-violet-500/10 text-violet-700"
            title="Organisation"
            desc="Public-facing identity of ARIFA."
          >
            <div className="space-y-4">
              <Field label="Site name">
                <input
                  name="siteName"
                  defaultValue={settings.siteName}
                  className={INPUT}
                  required
                />
              </Field>
              <Field label="Tagline">
                <input
                  name="siteTagline"
                  defaultValue={settings.siteTagline}
                  className={INPUT}
                  placeholder="Africa Research Institute for AI"
                />
              </Field>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Timezone">
                  <select
                    name="timezone"
                    defaultValue={settings.timezone}
                    className={INPUT}
                  >
                    <option value="Africa/Dar_es_Salaam">
                      Africa/Dar es Salaam
                    </option>
                    <option value="Africa/Nairobi">Africa/Nairobi</option>
                    <option value="Africa/Kampala">Africa/Kampala</option>
                    <option value="Africa/Johannesburg">
                      Africa/Johannesburg
                    </option>
                    <option value="UTC">UTC</option>
                  </select>
                </Field>
                <Field label="Default currency">
                  <select
                    name="currency"
                    defaultValue={settings.currency}
                    className={INPUT}
                  >
                    <option value="TZS">TZS — Tanzanian Shilling</option>
                    <option value="USD">USD — US Dollar</option>
                    <option value="EUR">EUR — Euro</option>
                    <option value="KES">KES — Kenyan Shilling</option>
                  </select>
                </Field>
              </div>
            </div>
          </Section>

          <Section
            icon="fa-address-book"
            iconClass="bg-sky-500/10 text-sky-700"
            title="Contact"
            desc="How the public and partners reach ARIFA."
          >
            <div className="space-y-4">
              <Field label="Public contact email">
                <input
                  name="contactEmail"
                  type="email"
                  defaultValue={settings.contactEmail}
                  className={INPUT}
                  placeholder="info@arifa.org"
                />
              </Field>
              <Field label="Support / admissions email">
                <input
                  name="supportEmail"
                  type="email"
                  defaultValue={settings.supportEmail}
                  className={INPUT}
                  placeholder="admissions@arifa.org"
                />
              </Field>
              <Field label="Phone">
                <input
                  name="contactPhone"
                  type="tel"
                  defaultValue={settings.contactPhone}
                  className={INPUT}
                  placeholder="+255 …"
                />
              </Field>
              <Field label="Address">
                <textarea
                  name="contactAddress"
                  rows={3}
                  defaultValue={settings.contactAddress}
                  className={`${INPUT} resize-y`}
                  placeholder="Office address"
                />
              </Field>
            </div>
          </Section>

          <Section
            icon="fa-share-nodes"
            iconClass="bg-emerald-500/10 text-emerald-700"
            title="Social links"
            desc="Optional profile URLs shown in public footers later."
          >
            <div className="space-y-3">
              {[
                ["socialLinkedIn", "LinkedIn", settings.socialLinkedIn],
                ["socialFacebook", "Facebook", settings.socialFacebook],
                ["socialTwitter", "X / Twitter", settings.socialTwitter],
                ["socialInstagram", "Instagram", settings.socialInstagram],
                ["socialYoutube", "YouTube", settings.socialYoutube],
                ["socialTiktok", "TikTok", settings.socialTiktok],
              ].map(([name, label, val]) => (
                <Field key={name} label={label}>
                  <input
                    name={name}
                    type="url"
                    defaultValue={val}
                    className={INPUT}
                    placeholder="https://"
                  />
                </Field>
              ))}
            </div>
          </Section>

          <Section
            icon="fa-bell"
            iconClass="bg-amber-500/10 text-amber-700"
            title="Notifications"
            desc="What the dashboard should highlight for admins."
          >
            <div className="space-y-3">
              {[
                [
                  "notifyNewApplications",
                  "New course / job applications",
                  settings.notifyNewApplications,
                ],
                [
                  "notifyNewMessages",
                  "New contact messages",
                  settings.notifyNewMessages,
                ],
                [
                  "notifyNewDonations",
                  "New donations & payments",
                  settings.notifyNewDonations,
                ],
              ].map(([name, label, checked]) => (
                <label
                  key={name}
                  className="flex cursor-pointer items-start gap-3 rounded-lg border border-black/10 bg-black/[0.02] p-3"
                >
                  <input
                    type="checkbox"
                    name={name}
                    defaultChecked={!!checked}
                    className="mt-0.5 h-3.5 w-3.5 rounded border-black/20 accent-[var(--color-primary,#990000)]"
                  />
                  <span className="text-xs font-semibold text-black sm:text-sm">
                    {label}
                  </span>
                </label>
              ))}
              <p className="text-[0.7rem] text-black/40">
                These flags drive overview badges and future email alerts.
              </p>
            </div>
          </Section>
        </div>

        <Section
          icon="fa-server"
          iconClass="bg-slate-500/10 text-slate-700"
          title="System"
          desc="Environment information for this deployment."
        >
          <dl className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl bg-black/[0.02] px-4 py-3">
              <dt className="text-[0.65rem] font-semibold uppercase tracking-wide text-black/40">
                App
              </dt>
              <dd className="mt-1 text-sm font-semibold text-black">
                ARIFA Admin
              </dd>
            </div>
            <div className="rounded-xl bg-black/[0.02] px-4 py-3">
              <dt className="text-[0.65rem] font-semibold uppercase tracking-wide text-black/40">
                Runtime
              </dt>
              <dd className="mt-1 text-sm font-semibold text-black">Next.js</dd>
            </div>
            <div className="rounded-xl bg-black/[0.02] px-4 py-3">
              <dt className="text-[0.65rem] font-semibold uppercase tracking-wide text-black/40">
                Uploads
              </dt>
              <dd className="mt-1 text-sm font-semibold text-black">
                /public/uploads
              </dd>
            </div>
          </dl>
          <p className="mt-3 text-[0.7rem] text-black/40">
            Theme preference is stored in your browser. Manage admin users under{" "}
            <Link href="/admin/users" className="font-semibold text-primary hover:underline">
              Admin Users
            </Link>
            .
          </p>
        </Section>

        <div className="flex flex-wrap items-center gap-3 border-t border-black/5 pt-4">
          <button
            type="submit"
            disabled={pending}
            className="rounded-lg bg-primary px-5 py-2.5 text-xs font-bold text-white shadow-sm shadow-primary/20 disabled:opacity-70 sm:text-sm"
          >
            {pending ? "Saving…" : "Save settings"}
          </button>
          <span className="text-[0.7rem] text-black/40">
            Changes apply to stored organisation preferences immediately.
          </span>
        </div>
      </form>
    </div>
  );
}
