import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "@/db/db";
import NextAuth, { NextAuthOptions, SessionStrategy } from "next-auth";
import { Adapter } from "next-auth/adapters";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as Adapter,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user, account }) {
      console.log("JWT Callback - Token:", token);
      console.log("JWT Callback - User:", user);
      console.log("JWT Callback - Account:", account);

      if (account && user) {
        token.accessToken = account.access_token;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      console.log("Session Callback - Session:", session);
      console.log("Session Callback - Token:", token);

      if (token) {
        session.accessToken = token.accessToken as string;
        if (session.user) {
          session.user.id = token.id as string;
        }
      }
      return session;
    },
  },
  session: { strategy: "jwt" as SessionStrategy },
  debug: true,
};

export default NextAuth(authOptions);
