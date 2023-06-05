import "./globals.css";
import { Nunito } from "next/font/google";
import { getServerSession } from "next-auth";
import authOptions from "src/constants/authOptions";
import SessionProvider from "src/components/SessionProvider";
import Header from "src/components/Header";

const nunito = Nunito({ subsets: ["latin"] });

export const metadata = {
  title: "Fake Store",
  description: "Generated by create next app",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  //@ts-ignore
  const session = await getServerSession(authOptions);

  return (
    <html lang="en">
      <body className={nunito.className}>
        <SessionProvider session={session}>
          <main className={`flex flex-col h-full w-full`}>
            <Header />
            {children}
          </main>
        </SessionProvider>
      </body>
    </html>
  );
}
