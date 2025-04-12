import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { createClient } from '@supabase/supabase-js';

// Create a Supabase client with the service role key
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === 'google') {
        try {
          // Check if user exists
          const { data: existingUser } = await supabase
            .from('users')
            .select('*')
            .eq('email', user.email)
            .single();

          if (!existingUser) {
            // Create new user with role
            const role = user.email === 'vladhan2@gmail.com' ? 'ADMIN' : 'USER';
            
            await supabase.from('users').insert([
              {
                email: user.email,
                name: user.name,
                role: role,
              },
            ]);
          }
        } catch (error) {
          console.error('Error in signIn callback:', error);
        }
      }
      return true;
    },
    async session({ session, user }) {
      try {
        // Get user role from Supabase
        const { data: userData } = await supabase
          .from('users')
          .select('role')
          .eq('email', session.user?.email)
          .single();

        return {
          ...session,
          user: {
            ...session.user,
            role: userData?.role || 'USER',
          },
        };
      } catch (error) {
        console.error('Error in session callback:', error);
        return session;
      }
    },
  },
  pages: {
    signIn: '/auth/signin',
  },
});

export { handler as GET, handler as POST }; 