import Image from "next/image";
import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";
import {
  MagnifyingGlassIcon,
  ShoppingCartIcon,
  Bars3Icon,
} from "@heroicons/react/24/outline";
import { useSelector } from "react-redux";
import { selectItems } from "src/slices/cartReducer";
import { useRouter } from "next/router";

export default function Header() {
  const { data: session } = useSession();
  const items = useSelector(selectItems);
  const router = useRouter();

  return (
    <header>
      {/* TOP NAV*/}
      <div className={"flex items-center bg-amazon_blue flex-grow px-1 py-2"}>
        <div className={"mt-2 flex items-center flex-grow sm:flex-grow-0"}>
          <Link href={"/"} className={"mr-2"}>
            <Image
              src={"https://links.papareact.com/f90"}
              alt={"Logo"}
              width={110}
              height={40}
              style={{ objectFit: "contain" }}
              className={"cursor-pointer"}
            />
          </Link>
        </div>

        <div
          className={
            "bg-yellow-400 hover:bg-yellow-500 hidden sm:flex items-center h-10 rounded-md flex-grow cursor-pointer"
          }
        >
          <input
            type={"text"}
            className={
              "p-2 h-full w-6 flex-grow flex-shrink rounded-l-md focus:outline-none px-4"
            }
          />
          <MagnifyingGlassIcon className={"h-12 p-4"} />
        </div>

        {/*  RIGHT*/}
        <div
          className={
            "text-white flex flex-row items-center text-xs space-x-6 mx-6 whitespace-nowrap"
          }
        >
          <div
            className={"link"}
            onClick={!session ? () => signIn() : () => signOut()}
          >
            {session?.user ? <p>Hello {session.user.name}</p> : <p>Sign In</p>}
            <p className={"font-extrabold md:text-sm"}>Account & Lists</p>
          </div>
          <div
            className={"link"}
            onClick={() => session && router.push("/orders")}
          >
            <p>Returns</p>
            <p className={"font-extrabold md:text-sm"}>& Orders</p>
          </div>
          <Link
            href={"/checkout"}
            className={"relative link flex items-center"}
          >
            <span
              className={
                "absolute top-0 right-0 md:right-7 h-4 w-4 bg-yellow-400 rounded-full text-black font-bold text-center"
              }
            >
              {items.length}
            </span>
            <ShoppingCartIcon className={"h-10"} />
            <p className={"font-extrabold md:text-sm hidden md:inline mt-2"}>
              Cart
            </p>
          </Link>
        </div>
      </div>

      {/*  BOTTOM NAV*/}
      <div
        className={
          "flex items-center space-x-3 p-2 pl-6 bg-amazon_blue-light text-white text-sm"
        }
      >
        <p className={"link flex items-center"}>
          <Bars3Icon className={"h-6 mr-1"} /> All
        </p>
        <p className={"link"}>Prime Video</p>
        <p className={"link"}>Amazon Business</p>
        <p className={"link"}>Today&rsquo;s Deals</p>
        <p className={"link hidden lg:inline-flex"}>Electronics</p>
        <p className={"link hidden lg:inline-flex"}>Food & Grocery</p>
        <p className={"link hidden lg:inline-flex"}>Prime</p>
        <p className={"link hidden lg:inline-flex"}>Buy Again</p>
        <p className={"link hidden lg:inline-flex"}>Shopper Toolkit</p>
        <p className={"link hidden lg:inline-flex"}>Health & Personal Care</p>
      </div>
    </header>
  );
}
