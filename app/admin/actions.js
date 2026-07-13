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

  if (next.length < 10) {
    return { ok: false, error: "New password must be at least 10 characters." };
  }

  const user = await prisma.adminUser.findUnique({ where: { email: me.email } });
  if (!user || !(await bcrypt.compare(current, user.passwordHash))) {
    return { ok: false, error: "Current password is incorrect." };
  }

  await prisma.adminUser.update({
    where: { id: user.id },
    data: { passwordHash: await bcrypt.hash(next, 12) },
  });

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
