import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "./db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export const authOptions: NextAuthOptions = {
  adapter: DrizzleAdapter(db) as any,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        // For demo/development, we use a simple hardcoded admin
        if (credentials.email === "admin@plazakasir.com" && credentials.password === "admin123") {
          return {
            id: "admin-1",
            name: "PlazaKasir Admin",
            email: "admin@plazakasir.com",
            role: "ADMIN",
          };
        }

        const results = await db.select().from(users).where(eq(users.email, credentials.email)).limit(1);
        const user = results[0];

        if (!user) return null;

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role;
        (session.user as any).id = token.id;
      }
      return session;
    },
  },
};
