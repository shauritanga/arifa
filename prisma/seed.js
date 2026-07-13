/**
 * Seed the first admin user from ADMIN_EMAIL / ADMIN_PASSWORD.
 *
 * Idempotent: re-running updates the password of the existing account rather
 * than creating a duplicate, so it doubles as a password reset for a locked-out
 * admin. Every other admin user is created from within the dashboard.
 */
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  const email = String(process.env.ADMIN_EMAIL || "").toLowerCase().trim();
  const password = String(process.env.ADMIN_PASSWORD || "");

  if (!email || !password) {
    throw new Error("Set ADMIN_EMAIL and ADMIN_PASSWORD in .env before seeding.");
  }
  if (password.length < 10) {
    throw new Error("ADMIN_PASSWORD must be at least 10 characters.");
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const user = await prisma.adminUser.upsert({
    where: { email },
    update: { passwordHash },
    create: { email, passwordHash, name: "ARIFA Admin", role: "admin" },
  });

  console.log(`Admin user ready: ${user.email}`);
}

main()
  .catch((err) => {
    console.error(err.message);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
