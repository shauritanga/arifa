"use server";

import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma";
import { requireAdmin } from "../../lib/auth";
import { retryDonation, verifyDonation } from "../../lib/donations";

/**
 * Re-ask Selcom for the authoritative status of a donation.
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

  if (!res) return { ok: false, error: "Could not reach Selcom. Try again." };
  if (res.unresolved) {
    return { ok: false, error: "Selcom did not answer. The donation is unchanged." };
  }
  if (res.mismatch) {
    return {
      ok: false,
      error: "Selcom reported a different amount. Flagged for review — not settled.",
    };
  }
  return { ok: true, status: res.status };
}

function publicOrigin() {
  return (
    process.env.AUTH_URL ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    "https://arifa.org"
  ).replace(/\/$/, "");
}

function statusPagePath(donation) {
  return donation.type === "TRAINING"
    ? `/training/masterclass/payment/${encodeURIComponent(donation.reference)}`
    : `/support-us/payment/${encodeURIComponent(donation.reference)}`;
}

function revalidateDonation(reference) {
  revalidatePath("/admin/donations");
  if (reference) revalidatePath(`/admin/donations/${reference}`);
}

/**
 * Open a new Selcom checkout for an unpaid donation and return links the
 * admin can copy or email. Does not create a second donor row.
 */
export async function resendDonationLink(reference) {
  await requireAdmin();

  const donation = await prisma.donation.findUnique({ where: { reference } });
  if (!donation) return { ok: false, error: "Donation not found." };
  if (donation.status === "PAID" || donation.status === "REFUNDED") {
    return { ok: false, error: "This payment is already settled." };
  }

  const res = await retryDonation(reference);
  revalidateDonation(reference);

  if (!res.ok) return { ok: false, error: res.error || "Could not start checkout." };

  const origin = publicOrigin();
  return {
    ok: true,
    checkoutUrl: res.checkoutUrl,
    statusUrl: `${origin}${statusPagePath(donation)}`,
    email: donation.email,
    donorName: donation.donorName,
    reference: donation.reference,
  };
}

const DELETABLE = new Set(["FAILED", "CANCELLED"]);

export async function deleteDonation(reference) {
  await requireAdmin();

  const donation = await prisma.donation.findUnique({ where: { reference } });
  if (!donation) return { ok: false, error: "Donation not found." };
  if (!DELETABLE.has(donation.status)) {
    return {
      ok: false,
      error: `Cannot delete a ${donation.status.toLowerCase()} payment. Only failed or cancelled records can be removed.`,
    };
  }

  await prisma.donation.delete({ where: { id: donation.id } });
  revalidateDonation(reference);
  return { ok: true };
}

export async function deleteCancelledDonations() {
  await requireAdmin();

  const result = await prisma.donation.deleteMany({
    where: { status: "CANCELLED" },
  });
  revalidatePath("/admin/donations");
  return { ok: true, deleted: result.count };
}

/** Re-ask Selcom for every PROCESSING (and PENDING) checkout still open. */
export async function reverifyProcessingDonations() {
  await requireAdmin();

  const open = await prisma.donation.findMany({
    where: { status: { in: ["PROCESSING", "PENDING"] } },
    select: { reference: true },
    orderBy: { createdAt: "asc" },
  });

  const stats = { checked: 0, paid: 0, failed: 0, cancelled: 0, stillOpen: 0, errors: 0 };

  for (const row of open) {
    const res = await verifyDonation(row.reference, "MANUAL").catch((err) => {
      console.error("[admin] bulk reverify failed", row.reference, err);
      return null;
    });
    stats.checked++;
    if (!res || res.unresolved || res.mismatch) {
      stats.errors++;
      continue;
    }
    if (res.status === "PAID") stats.paid++;
    else if (res.status === "FAILED") stats.failed++;
    else if (res.status === "CANCELLED") stats.cancelled++;
    else stats.stillOpen++;
  }

  revalidatePath("/admin/donations");
  return { ok: true, ...stats };
}

export async function countCancelledDonations() {
  await requireAdmin();
  return prisma.donation.count({ where: { status: "CANCELLED" } });
}

export async function countOpenDonations() {
  await requireAdmin();
  return prisma.donation.count({
    where: { status: { in: ["PROCESSING", "PENDING"] } },
  });
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
  siteTagline: "Africa Research Institute For AI",
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

export async function deleteSubmission(kind, id) {
  await requireAdmin();

  if (kind === "message") {
    await prisma.contactMessage.delete({ where: { id } });
    revalidatePath("/admin/messages");
  } else if (kind === "application") {
    await prisma.application.delete({ where: { id } });
    revalidatePath("/admin/applications");
  } else {
    return { ok: false, error: "Unknown submission type." };
  }

  revalidatePath("/admin");
  return { ok: true };
}
