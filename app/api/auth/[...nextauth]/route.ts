import GoogleProvider from 'next-auth/providers/google';
import NextAuth, { AuthOptions } from 'next-auth'
import { PrismaClient } from '@prisma/client'
import { PrismaAdapter } from '@auth/prisma-adapter'

const prisma = new PrismaClient()

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: "openid email profile  https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/calendar"
        }
      }
    }),
  ],
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    jwt: async ({ token, user, account }) => {
      if (user) {
        token.id = user.id
      }

      // console.log(account!.access_token)
      if (account?.provider === "google") {
        await prisma.account.updateMany({
          where: { userId: token.id!, provider: "google" },
          data: {
            access_token: account.access_token,
          },
        });
      }

      return token
    },
    session: async ({ session, token }) => {
      if (session.user) {
        session.user.id = token.id as string
      }
      return session
    },
    async redirect({ baseUrl }) {
      return `${baseUrl}/home`
    },
  },
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }