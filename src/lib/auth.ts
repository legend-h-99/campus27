import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { getPermissionsForRole, type Role, type Permission } from "@/lib/permissions";
import "@/types/auth";

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
      if (user) {
        token.id = user.id!;
        token.email = user.email!;
        token.nameAr = (user as any).nameAr;
        token.nameEn = (user as any).nameEn;
        token.role = (user as any).role;
        token.permissions = getPermissionsForRole((user as any).role);
        token.avatar = (user as any).avatar;
      }
      return token;
    },
    async session({ session, token }) {
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
