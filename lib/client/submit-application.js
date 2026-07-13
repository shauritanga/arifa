"use client";

/**
 * Submit a course / certification application.
 *
 * Sent as multipart rather than JSON so the optional CV can ride along with the
 * fields. `form` is the <form> element itself, so every named input (including
 * the file input) is picked up without restating the field list here.
 */
export async function submitApplication(form, extra = {}) {
  const data = new FormData(form);
  for (const [key, value] of Object.entries(extra)) {
    if (value != null) data.set(key, String(value));
  }

  const res = await fetch("/api/applications", { method: "POST", body: data });
  const payload = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(payload.error || "Could not submit your application.");
  }
  return payload;
}
