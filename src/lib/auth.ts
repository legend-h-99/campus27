import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { getPermissionsForRole, type Role, type Permission } from "@/lib/permissions";
import "@/types/auth";

// How often (in seconds) to re-fetch the user's role from the DB inside an
// active session, so that role changes take effect without forcing a re-login.
const ROLE_REFRESH_INTERVAL = 5 * 60; // 5 minutes

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });

        if (!user || user.status !== "ACTIVE") {
          return null;
        }

        const isValid = await compare(
          credentials.password as string,
          user.passwordHash
        );

        if (!isValid) {
          return null;
        }

        await prisma.user.update({
          where: { id: user.id },
          data: { lastLoginAt: new Date() },
        });

        return {
          id: user.id,
          email: user.email,
          nameAr: user.nameAr,
          nameEn: user.nameEn,
          role: user.role as Role,
          avatar: user.avatar,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // Initial sign-in: populate token from the authorized user object.
      if (user) {
        token.id = user.id!;
        token.email = user.email!;
        token.nameAr = (user as any).nameAr;
        token.nameEn = (user as any).nameEn;
        token.role = (user as any).role;
        token.permissions = getPermissionsForRole((user as any).role);
        token.avatar = (user as any).avatar;
        token.roleRefreshedAt = Math.floor(Date.now() / 1000);
        return token;
      }

      // Subsequent calls: periodically re-fetch the role from the DB so that
      // role changes (or account suspension) take effect automatically, honouring
      // the Principle of Least Privilege without requiring a full re-login.
      const now = Math.floor(Date.now() / 1000);
      const lastRefresh = (token.roleRefreshedAt as number) ?? 0;

      if (now - lastRefresh >= ROLE_REFRESH_INTERVAL) {
        try {
          const dbUser = await prisma.user.findUnique({
            where: { id: token.id as string },
            select: { role: true, status: true, nameAr: true, nameEn: true, avatar: true },
          });

          if (!dbUser || dbUser.status !== "ACTIVE") {
            // User suspended/deleted — invalidate the token by returning null-like token.
            return { ...token, invalidated: true };
          }

          // Realign permissions to the current DB role (handles role changes).
          token.role = dbUser.role as Role;
          token.permissions = getPermissionsForRole(dbUser.role as Role);
          token.nameAr = dbUser.nameAr;
          token.nameEn = dbUser.nameEn;
          token.avatar = dbUser.avatar;
          token.roleRefreshedAt = now;
        } catch {
          // DB unavailable — keep existing token values.
        }
      }

      return token;
    },

    async session({ session, token }) {
      // If the token was invalidated (user suspended/role removed), return empty session.
      if ((token as any).invalidated) {
        return session;
      }

      session.user.id = token.id as string;
      session.user.email = token.email as string;
      session.user.nameAr = token.nameAr as string;
      session.user.nameEn = token.nameEn as string;
      session.user.role = token.role as Role;
      session.user.permissions = token.permissions as Permission[];
      session.user.avatar = token.avatar as string | null | undefined;
      return session;
    },
  },
  pages: {
    signIn: "/ar/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 hours
  },
});
