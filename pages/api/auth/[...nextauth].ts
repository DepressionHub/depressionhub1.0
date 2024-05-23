import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "@/prisma/db";
import NextAuth, { NextAuthOptions, SessionStrategy } from "next-auth";
import { Adapter } from "next-auth/adapters";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
export const authOptions = {
  // Configure one or more authentication providers
  adapter: PrismaAdapter(prisma) as Adapter,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    // ...add more providers here
  ],
  secret: process.env.SECRET || "secret",
  callbacks: {
    async jwt({ token }: any) {
      return token;
    },
    async session({ session, token }: any) {
      if (token) {
        session.accessToken = token.accessToken;
        session.user.id = token.sub;
      }
      return session;
    },
  },
  session: { strategy: "jwt" as SessionStrategy },
} satisfies NextAuthOptions;
export default NextAuth(authOptions);
