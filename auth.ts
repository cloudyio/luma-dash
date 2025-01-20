import NextAuth, { Session } from "next-auth"
import Discord from "next-auth/providers/discord"
import axios from "axios"
 
const discord = Discord({
    clientId: process.env.AUTH_DISCORD_ID,
    clientSecret: process.env.AUTH_DISCORD_SECRET,
    authorization: `https://discord.com/api/oauth2/authorize?client_id=${process.env.AUTH_DISCORD_ID}&response_type=code&scope=identify%20guilds`
})

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    guilds?: any[];
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [discord],
  secret: process.env.NEXTAUTH_SECRET, 
  callbacks: {
    async session({ session, token }) {
      session.user.id = token.id;
      session.accessToken = token.accessToken;
      return session;
    },
    async jwt({ token, account, profile }) {
      if (account?.provider === "discord") {
        token.id = profile.id;
        token.accessToken = account.access_token;
        const response = await axios.get("https://discord.com/api/users/@me/guilds", {
          headers: {
            Authorization: `Bearer ${account.access_token}`
          }
        });
      }
      return token;
    }
  }
})