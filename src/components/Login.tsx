import {
  ArrowLeftIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/solid";
import { signIn } from "next-auth/react";
import Link from "next/link";

export default function Login() {
  return (
    <div
      className={
        "bg-[rgb(var(--background-start-rgb))] h-screen flex flex-col items-center justify-center text-center"
      }
    >
      <ArrowRightOnRectangleIcon
        className={"w-10 h-10 text-[rgb(var(--primary))]"}
      />
      <button
        className={
          "text-[rgb(var(--primary))] font-bold text-2xl animate-pulse cursor-pointer"
        }
        onClick={() => signIn("google")}
      >
        Sign In with Google
      </button>
      <div
        className={
          "mt-20 px-5 flex flex-row items-center justify-center w-full h-5 text-[rgb(var(--primary))]"
        }
      >
        <Link
          href={"/"}
          className={
            "flex flex-row items-center gap-1 font-bold underline text-sm"
          }
        >
          <ArrowLeftIcon className={"h-4 w-4"} /> Back
        </Link>
      </div>
    </div>
  );
}
