import { type Permission, type Role } from "@/lib/permissions";
import { type DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      nameAr: string;
      nameEn: string;
      role: Role;
      permissions: Permission[];
      avatar?: string | null;
    } & DefaultSession["user"];
  }

  interface User {
    id?: string;
    email?: string | null;
    nameAr: string;
    nameEn: string;
    role: Role;
    avatar?: string | null;
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    id: string;
    email: string;
    nameAr: string;
    nameEn: string;
    role: Role;
    permissions: Permission[];
    avatar?: string | null;
  }
}
