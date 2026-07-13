import { redirect } from "next/navigation";
import { auth } from "../../../lib/auth";
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

  return <AdminShell user={{ email: session.user.email }}>{children}</AdminShell>;
}
