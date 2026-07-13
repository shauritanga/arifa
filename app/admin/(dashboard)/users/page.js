import { auth } from "../../../../lib/auth";
import { prisma } from "../../../../lib/prisma";
import UsersClient from "./users-client";

export const dynamic = "force-dynamic";

export default async function UsersPage() {
  const session = await auth();

  const users = await prisma.adminUser.findMany({
    orderBy: { createdAt: "asc" },
    select: { id: true, email: true, name: true, role: true, createdAt: true },
  });

  return (
    <UsersClient
      currentEmail={session.user.email}
      users={users.map((u) => ({
        ...u,
        createdAt: u.createdAt.toLocaleDateString("en-GB"),
      }))}
    />
  );
}
