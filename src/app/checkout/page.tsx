"use client";
import { Nunito } from "next/font/google";
import Image from "next/image";
import { useSelector } from "react-redux";
import { selectItems, selectTotal } from "src/slices/cartReducer";
import { Product } from "../../../typings";
import CheckoutProduct from "src/components/CheckoutProduct";
import { useSession } from "next-auth/react";
import { USDollar } from "src/utils/currency";

const nunito = Nunito({ subsets: ["latin"] });

export default async function CheckoutPage() {
  const items = useSelector(selectItems);
  const total = useSelector(selectTotal);
  const { data: session } = useSession();

  return (
    <main
      className={`${nunito.className} max-w-screen-2xl mx-auto bg-gray-100 lg:flex`}
    >
      {/*  LEFT */}
      <div className={"flex-grow m-5 shadow-sm"}>
        <Image
          src={"https://links.papareact.com/ikj"}
          className={"object-contain"}
          alt={"checkout image"}
          width={1220}
          height={250}
        />

        <div className={"flex flex-col p-5 space-y-10 bg-white"}>
          <h1 className={"text-3xl border-b pb-4"}>
            {items.length === 0 ? "Your cart is empty" : "Your shopping basket"}
          </h1>

          {items.map((item: Product) => (
            <CheckoutProduct key={item.id} product={item} />
          ))}
        </div>
      </div>
      {/*  RIGHT */}
      <div className={"flex flex-col bg-white p-10 shadow-md"}>
        {items.length > 0 && (
          <>
            <h2 className={"whitespace-nowrap"}>
              Subtotal ({items.length} items)
              <span className={"font-bold"}>
                <span>
                  <p>{USDollar.format(total)}</p>
                </span>
              </span>
            </h2>
            <button
              disabled={!session}
              className={`button mt-2 ${
                !session &&
                "from-gray-300 to-gray-500 border-gray-200 text-gray-300 cursor-not-allowed"
              }`}
            >
              {!session ? "Sign in to Checkout" : "Proceed to Checkout"}
            </button>
          </>
        )}
      </div>
    </main>
  );
}
