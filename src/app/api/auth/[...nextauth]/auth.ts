import { PrismaAdapter } from "@auth/prisma-adapter";
import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "@/lib/prisma";
import { Session } from "next-auth";
import { JWT } from "next-auth/jwt";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      console.log('🔐 Session callback:', { 
        sessionUser: session.user?.email,
        dbUser: user.email,
        role: user.role 
      });
      
      if (session.user) {
        session.user.role = user.role || 'USER';
      }
      return session;
    },
    async signIn({ user, account, profile }) {
      console.log('📥 Sign in attempt:', { 
        user: user.email,
        provider: account?.provider,
        role: user.role
      });
      return true;
    },
  },
  events: {
    signOut: async ({ token, session }) => {
      console.log('🚪 SignOut event triggered:', {
        userId: token?.sub,
        email: token?.email,
        timestamp: new Date().toISOString()
      });
      console.log('👋 User signing out:', {
        email: session?.user?.email,
        role: session?.user?.role
      });
    },
  },
}; 