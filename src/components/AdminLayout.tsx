import AdminNav from "src/components/AdminNav";
import { adminNavigation } from "src/constants/adminNavigation";
import { Nunito } from "next/font/google";
import { ReactNode } from "react";
import { signOut, useSession } from "next-auth/react";
const nunito = Nunito({ subsets: ["latin"] });

type Props = {
  children: ReactNode;
};

export default function AdminLayout({ children }: Props) {
  const { data: session } = useSession();

  return (
    <main className={`${nunito.className} min-h-screen bg-gray-700 flex`}>
      <div
        className={
          "pl-4 pb-4 pt-4 pr-0 flex flex-col justify-between min-h-full"
        }
      >
        <AdminNav navigation={adminNavigation} />
        <div className={"flex flex-col items-start"}>
          <div
            className={
              "flex items-end justify-center gap-1 text-white cursor-pointer"
            }
            onClick={() => signOut()}
          >
            <img
              src={session?.user?.image!}
              className={"h-8 w-8 rounded-full"}
              alt={session?.user?.name!}
            />
            <p>{session?.user?.name}</p>
          </div>
        </div>
      </div>
      <div
        className={"bg-white flex-1 flex-grow rounded-lg mt-2 mb-2 mr-2 p-4"}
      >
        {children}
      </div>
    </main>
  );
}
