import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "./prisma";

function publicOrigin(fallback) {
  const raw =
    process.env.AUTH_URL || process.env.NEXT_PUBLIC_SITE_URL || fallback;
  return String(raw).replace(/\/$/, "");
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  session: { strategy: "jwt" },
  pages: { signIn: "/admin/login" },
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = String(credentials?.email || "")
          .toLowerCase()
          .trim();
        const password = String(credentials?.password || "");
        if (!email || !password) return null;

        const user = await prisma.adminUser.findUnique({ where: { email } });
        if (!user) return null;

        const valid = await bcrypt.compare(password, user.passwordHash);
        if (!valid) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role ?? "admin";
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    },
    /**
     * Behind nginx the Node process listens on localhost:3002, so Auth.js's
     * detected origin is https://localhost:3002. A relative post-logout path
     * then becomes https://localhost:3002/admin/login. Prefer the public site.
     */
    redirect({ url, baseUrl }) {
      const origin = publicOrigin(baseUrl);
      if (url.startsWith("/")) return `${origin}${url}`;
      try {
        if (new URL(url).origin === new URL(origin).origin) return url;
      } catch {
        /* fall through */
      }
      return `${origin}/admin/login`;
    },
  },
});

/** Guard for server actions: throws unless a session exists. */
export async function requireAdmin() {
  const session = await auth();
  if (!session?.user?.email) {
    throw new Error("Not authorised");
  }
  return session.user;
}
