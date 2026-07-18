import { redirect } from "next/navigation";
import { auth } from "../../../lib/auth";
import { prisma } from "../../../lib/prisma";
import AdminShell from "./admin-shell";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Admin | ARIFA",
  robots: { index: false, follow: false },
};

/** Every page under this layout is behind the session check. */
export default async function AdminLayout({ children }) {
  const session = await auth();
  if (!session?.user?.email) redirect("/admin/login");

  // Prefer DB user so profile name/photo edits show immediately in the shell.
  const dbUser = await prisma.adminUser.findUnique({
    where: { email: session.user.email },
    select: { email: true, name: true, image: true, role: true },
  });

  return (
    <AdminShell
      user={{
        email: dbUser?.email || session.user.email,
        name: dbUser?.name || session.user.name || null,
        image: dbUser?.image || null,
        role: dbUser?.role || session.user.role || "admin",
      }}
    >
      {children}
    </AdminShell>
  );
}
