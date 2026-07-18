"use server";

import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma";
import { requireAdmin } from "../../lib/auth";
import { verifyDonation } from "../../lib/donations";

/**
 * Re-ask Airpay for the authoritative status of a donation.
 *
 * This does not decide anything itself — it delegates to verifyDonation, which
 * is the only path allowed to mark a donation PAID and which checks the amount
 * first. An admin cannot hand-settle a payment, by design.
 */
export async function reverifyDonation(reference) {
  await requireAdmin();

  const res = await verifyDonation(reference, "MANUAL").catch((err) => {
    console.error("[admin] reverify failed", reference, err);
    return null;
  });

  revalidatePath("/admin/donations");
  revalidatePath(`/admin/donations/${reference}`);

  if (!res) return { ok: false, error: "Could not reach AirPay. Try again." };
  if (res.unresolved) {
    return { ok: false, error: "AirPay did not answer. The donation is unchanged." };
  }
  if (res.mismatch) {
    return {
      ok: false,
      error: "AirPay reported a different amount. Flagged for review — not settled.",
    };
  }
  return { ok: true, status: res.status };
}

export async function createAdminUser(formData) {
  await requireAdmin();

  const email = String(formData.get("email") || "").toLowerCase().trim();
  const name = String(formData.get("name") || "").trim();
  const password = String(formData.get("password") || "");
  const role = formData.get("role") === "viewer" ? "viewer" : "admin";

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, error: "Enter a valid email address." };
  }
  if (password.length < 10) {
    return { ok: false, error: "Password must be at least 10 characters." };
  }

  const existing = await prisma.adminUser.findUnique({ where: { email } });
  if (existing) return { ok: false, error: "That email already has an account." };

  await prisma.adminUser.create({
    data: {
      email,
      name: name || null,
      role,
      passwordHash: await bcrypt.hash(password, 12),
    },
  });

  revalidatePath("/admin/users");
  return { ok: true };
}

export async function deleteAdminUser(id) {
  const me = await requireAdmin();

  const target = await prisma.adminUser.findUnique({ where: { id } });
  if (!target) return { ok: false, error: "User not found." };
  if (target.email === me.email) {
    return { ok: false, error: "You cannot delete your own account." };
  }

  // Never leave the dashboard with no way in.
  const admins = await prisma.adminUser.count({ where: { role: "admin" } });
  if (target.role === "admin" && admins <= 1) {
    return { ok: false, error: "This is the last admin — create another one first." };
  }

  await prisma.adminUser.delete({ where: { id } });
  revalidatePath("/admin/users");
  return { ok: true };
}

export async function changePassword(formData) {
  const me = await requireAdmin();

  const current = String(formData.get("current") || "");
  const next = String(formData.get("next") || "");
  const confirm = String(formData.get("confirm") || "");

  if (next.length < 10) {
    return { ok: false, error: "New password must be at least 10 characters." };
  }
  if (next !== confirm) {
    return { ok: false, error: "New password and confirmation do not match." };
  }

  const user = await prisma.adminUser.findUnique({ where: { email: me.email } });
  if (!user || !(await bcrypt.compare(current, user.passwordHash))) {
    return { ok: false, error: "Current password is incorrect." };
  }

  await prisma.adminUser.update({
    where: { id: user.id },
    data: { passwordHash: await bcrypt.hash(next, 12) },
  });

  revalidatePath("/admin/profile");
  revalidatePath("/admin/settings");
  return { ok: true };
}

/** Update the signed-in admin's display name, photo, and optional email. */
export async function updateProfile(formData) {
  const me = await requireAdmin();

  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "")
    .toLowerCase()
    .trim();
  // Empty string clears the photo; missing field leaves it unchanged.
  const hasImageField = formData.has("image");
  const imageRaw = String(formData.get("image") || "").trim();
  const image = imageRaw || null;

  if (!name) {
    return { ok: false, error: "Display name is required." };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, error: "Enter a valid email address." };
  }
  if (image && !image.startsWith("/") && !/^https?:\/\//i.test(image)) {
    return { ok: false, error: "Profile picture path looks invalid." };
  }

  const user = await prisma.adminUser.findUnique({ where: { email: me.email } });
  if (!user) return { ok: false, error: "Account not found." };

  if (email !== user.email) {
    const taken = await prisma.adminUser.findUnique({ where: { email } });
    if (taken) return { ok: false, error: "That email is already in use." };
  }

  await prisma.adminUser.update({
    where: { id: user.id },
    data: {
      name,
      email,
      ...(hasImageField ? { image } : {}),
    },
  });

  revalidatePath("/admin/profile");
  revalidatePath("/admin");
  return {
    ok: true,
    message:
      email !== user.email
        ? "Profile saved. Sign in again with your new email on next login."
        : "Profile saved.",
  };
}

const SITE_SETTING_DEFAULTS = {
  siteName: "ARIFA",
  siteTagline: "Africa Research Institute for AI",
  contactEmail: "info@arifa.org",
  contactPhone: "",
  contactAddress: "",
  supportEmail: "",
  timezone: "Africa/Dar_es_Salaam",
  currency: "TZS",
  socialLinkedIn: "https://www.linkedin.com/company/arifaai/",
  socialFacebook: "https://www.facebook.com/arifa1ai",
  socialTwitter: "https://twitter.com/arifa__ai",
  socialInstagram: "https://www.instagram.com/arifa_ai/",
  socialYoutube: "https://www.youtube.com/@ARIFA_AI",
  socialTiktok: "https://www.tiktok.com/ARIFA_AI",
  notifyNewApplications: true,
  notifyNewMessages: true,
  notifyNewDonations: true,
};

/** Load or create the global site settings row. */
export async function getSiteSettings() {
  await requireAdmin();
  let row = await prisma.siteSetting.findUnique({ where: { id: "global" } });
  if (!row) {
    row = await prisma.siteSetting.create({
      data: { id: "global", data: SITE_SETTING_DEFAULTS },
    });
  }
  return { ...SITE_SETTING_DEFAULTS, ...(row.data || {}) };
}

export async function saveSiteSettings(formData) {
  await requireAdmin();

  const bool = (key) => formData.get(key) === "on";
  const str = (key) => String(formData.get(key) || "").trim();

  const data = {
    siteName: str("siteName") || SITE_SETTING_DEFAULTS.siteName,
    siteTagline: str("siteTagline"),
    contactEmail: str("contactEmail"),
    contactPhone: str("contactPhone"),
    contactAddress: str("contactAddress"),
    supportEmail: str("supportEmail"),
    timezone: str("timezone") || SITE_SETTING_DEFAULTS.timezone,
    currency: str("currency") || SITE_SETTING_DEFAULTS.currency,
    socialLinkedIn: str("socialLinkedIn"),
    socialTwitter: str("socialTwitter"),
    socialFacebook: str("socialFacebook"),
    socialInstagram: str("socialInstagram"),
    socialYoutube: str("socialYoutube"),
    socialTiktok: str("socialTiktok"),
    notifyNewApplications: bool("notifyNewApplications"),
    notifyNewMessages: bool("notifyNewMessages"),
    notifyNewDonations: bool("notifyNewDonations"),
  };

  if (data.contactEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.contactEmail)) {
    return { ok: false, error: "Contact email looks invalid." };
  }

  await prisma.siteSetting.upsert({
    where: { id: "global" },
    create: { id: "global", data },
    update: { data },
  });

  revalidatePath("/admin/settings");
  return { ok: true };
}

/** Move a contact message or application through NEW → READ → ARCHIVED. */
export async function setSubmissionStatus(kind, id, status) {
  await requireAdmin();

  if (!["NEW", "READ", "ARCHIVED"].includes(status)) {
    return { ok: false, error: "Unknown status." };
  }

  if (kind === "message") {
    await prisma.contactMessage.update({ where: { id }, data: { status } });
    revalidatePath("/admin/messages");
  } else if (kind === "application") {
    await prisma.application.update({ where: { id }, data: { status } });
    revalidatePath("/admin/applications");
  } else {
    return { ok: false, error: "Unknown submission type." };
  }

  revalidatePath("/admin");
  return { ok: true };
}
