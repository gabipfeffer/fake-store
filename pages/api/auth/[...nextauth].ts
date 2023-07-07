import NextAuth from "next-auth";
import authOptions from "src/constants/authOptions";

// @ts-ignore
const handler = NextAuth(authOptions);

export default handler;
