import { Nunito } from "next/font/google";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/router";

const nunito = Nunito({ subsets: ["latin"] });

export default function Success() {
  const router = useRouter();
  return (
    <main className={`${nunito.className} max-w-screen-lg mx-auto bg-gray-100`}>
      <div className={"flex flex-col p-10 bg-white w-full"}>
        <div className={"flex items-center space-x-2 mb-5"}>
          <CheckCircleIcon className={"text-green-500 h-10"} />
          <h1 className={"text-3xl"}>
            Thank you, your order has been confirmed!
          </h1>
        </div>
        <p>
          Thank you for shopping with us. We&apos;ll send a confirmation once
          your item has been shipped. If you would like to check the status of
          your order(s) please press the link below.
        </p>
        <button
          className={"button mt-8"}
          onClick={() => router.push("/orders")}
        >
          Go to my orders
        </button>
      </div>
    </main>
  );
}
