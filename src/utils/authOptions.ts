import GoogleProvider from "next-auth/providers/google";
import { FirestoreAdapter } from "@auth/firebase-adapter";
import { cert } from "firebase-admin/app";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { getAdminUserByEmail } from "src/utils/firestore";

const serviceAccount = JSON.parse(
  process.env.FIREBASE_SERVICE_ACCOUNT_KEY as string
);

const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  adapter: FirestoreAdapter({
    credential: cert(serviceAccount),
  }),
};

export default authOptions;

export async function isAdminRequest(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const session: null | {
      user: { email: string; name: string; image: string };
    } = await getServerSession(req as any, res as any, authOptions as any);

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
