import NextAuth from "next-auth";
import authOptions from "src/constants/authOptions";

const handler = NextAuth(authOptions);

export default handler;
