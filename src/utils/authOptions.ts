import GoogleProvider from "next-auth/providers/google";
import { FirestoreAdapter } from "@auth/firebase-adapter";
import { cert } from "firebase-admin/app";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";

const serviceAccount = JSON.parse(
  process.env.FIREBASE_SERVICE_ACCOUNT_KEY as string
);

// TODO: Refactor into admin collection at DB
export const adminEmails = ["gabrielpfeffer@gmail.com"];

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
    const session = await getServerSession(
      req as any,
      res as any,
      authOptions as any
    );

    if (!session || !adminEmails.includes(session?.user?.email!)) {
      throw new Error("User is not an admin");
    }
    return true;
  } catch (e: any) {
    throw new Error(e);
  }
}
