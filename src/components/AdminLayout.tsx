import AdminNav from "src/components/AdminNav";
import { adminNavigation } from "src/constants/adminNavigation";
import { Nunito } from "next/font/google";
import { ReactNode } from "react";
const nunito = Nunito({ subsets: ["latin"] });

type Props = {
  children: ReactNode;
};

export default function AdminLayout({ children }: Props) {
  return (
    <main
      className={`${nunito.className} w-screen min-h-screen bg-gray-700 flex`}
    >
      <div className={"pl-4 pb-4 pt-4 pr-0"}>
        <AdminNav navigation={adminNavigation} />
      </div>
      <div
        className={
          "bg-white flex-1 flex-grow rounded-lg mt-2 mb-2 mr-2 px-4 py-2"
        }
      >
        {children}
      </div>
    </main>
  );
}
