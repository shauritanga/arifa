import { auth } from "../../../../lib/auth";
import { prisma } from "../../../../lib/prisma";
import { redirect } from "next/navigation";
import ProfileClient from "./profile-client";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user?.email) redirect("/admin/login");

  const user = await prisma.adminUser.findUnique({
    where: { email: session.user.email },
  });
  if (!user) redirect("/admin/login");

  return (
    <ProfileClient
      user={{
        id: user.id,
        email: user.email,
        name: user.name || "",
        image: user.image || "",
        role: user.role || "admin",
        createdAt: user.createdAt.toISOString(),
      }}
    />
  );
}
