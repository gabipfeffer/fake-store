import GoogleProvider from "next-auth/providers/google";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession, Session } from "next-auth";
import { getAdminUserByEmail } from "src/utils/firestore";

const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  callbacks: {
    async signIn({ account, profile }) {
      return !!(
        account?.provider === "google" &&
        profile?.email_verified &&
        profile?.email?.endsWith("@vusler.com")
      );
    },
  },
};

export default authOptions;

export async function isAdminRequest(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const session: Session | null = await getServerSession(
      req as any,
      res as any,
      authOptions as any
    );

    if (!session) {
      throw new Error("User is not logged in");
    }

    const fetchedAdminUser = await getAdminUserByEmail(session?.user?.email!);

    if (!fetchedAdminUser) {
      throw new Error("User is not an admin");
    }
    return true;
  } catch (e: any) {
    res.status(400).json({ message: e.message });
  }
}
