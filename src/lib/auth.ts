import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { NextAuthOptions, getServerSession } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "./db";
import { users } from "@/db/schema";
import { eq, or } from "drizzle-orm";

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
        email: { label: "Email / Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await db.query.users.findFirst({
          where: or(
            eq(users.email, credentials.email),
            eq(users.username, credentials.email)
          ),
        });

        if (!user || !user.passwordHash) return null;

        // Simple check for now. In production, use bcrypt.
        if (user.passwordHash !== credentials.password) return null;

        return {
          id: user.id,
          name: user.fullName,
          email: user.email,
          role: user.isSuperAdmin ? "ADMIN" : "USER",
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

export const isAdmin = async () => {
  const session = await getServerSession(authOptions);
  return (session?.user as any)?.role === "ADMIN";
};
