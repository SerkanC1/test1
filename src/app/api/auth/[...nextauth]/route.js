// src/app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
//import { prisma } from "@/app/lib/prisma";
import { prisma } from '../../../lib/prisma'
import { getLocalDate } from "../../../lib/date-utils";

if (!process.env.NEXTAUTH_SECRET) {
  throw new Error("NEXTAUTH_SECRET eksik");
}

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Credentials kontrolü
        if (!credentials?.username || !credentials?.password) {
          return null; // throw yerine null dön
        }

        try {
          const user = await prisma.user.findUnique({
            where: { username: credentials.username },
          });

          // Kullanıcı kontrolü
          if (!user) {
            return null; // throw yerine null dön
          }

          const passwordMatch = await bcrypt.compare(
            credentials.password,
            user.password
          );

          // Şifre kontrolü
          if (!passwordMatch) {
            return null; // throw yerine null dön
          }

          // Başarılı giriş
          return {
            id: user.id.toString(),
            name: user.namesurname,
            username: user.username,
            role: user.role,
          };
        } catch (error) {
          // Sadece development'da log
          if (process.env.NODE_ENV === "development") {
            console.error("Auth error:", error);
          }
          return null;
        }
      },
    }),
  ],
  // Diğer konfigürasyonlar aynı kalacak
  session: {
    strategy: "jwt",
    maxAge: parseInt(process.env.SESSION_MAXAGE ?? "86400"),
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async signIn({ user }) {
      // Login zamanı ve durumu güncelle
      await prisma.user.update({
        where: { id: BigInt(user.id) },
        data: {
          lastLoginAt: getLocalDate(),
          isLogin: true
        }
      })
      return true
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
