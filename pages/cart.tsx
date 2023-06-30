import { Nunito } from "next/font/google";
import Image from "next/image";
import { useSelector } from "react-redux";
import {
  selectItems,
  selectQuantity,
  selectSubtotal,
} from "src/slices/cartReducer";
import { CartItem } from "../typings";
import CheckoutProduct from "src/components/CheckoutProduct";
import { signIn, useSession } from "next-auth/react";
import { UYUPeso } from "src/utils/currency";
import { loadStripe } from "@stripe/stripe-js";
import { useRouter } from "next/router";

const nunito = Nunito({ subsets: ["latin"] });

const stripePromise = loadStripe(process.env.STRIPE_PUBLISHABLE_KEY || "");

export default function CartPage() {
  const items = useSelector(selectItems);
  const subtotal = useSelector(selectSubtotal);
  const quantity = useSelector(selectQuantity);
  const { data: session } = useSession();
  const router = useRouter();
  const paymentProvider = process.env.PAYMENT_PROCESSOR;

  // TODO: Fetch Shipping options from Stripe for shipping payment

  const createCheckoutSession = async () => {
    if (paymentProvider === "bamboo") {
      router.push("/checkout");
    } else if (paymentProvider === "stripe") {
      const stripe = await stripePromise;

      const response = await fetch("/api/stripe/create-checkout-session", {
        method: "POST",
        body: JSON.stringify({
          items,
          email: session?.user?.email,
          // TODO: Change with subscription/one-time payment selector
          mode: "payment",
          // TODO: Change with shipping options selector
          shipping_rate: "shr_1NLtK8GldcbwgI7WGoeqKcE1",
        }),
      });

      const checkoutSession = await response.json();

      const result = await stripe?.redirectToCheckout({
        sessionId: checkoutSession.id,
      });

      // @ts-ignore
      if (result.error) console.error(result?.error?.message);
    }
  };

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
            {items.length === 0 ? "Tu carrito está vacío" : "Tu carrito"}
          </h1>

          {items.map((item: CartItem) => (
            <CheckoutProduct
              key={item.product.id}
              product={item.product}
              quantity={item.quantity}
            />
          ))}
        </div>
      </div>
      {/*  RIGHT */}
      <div className={"flex flex-col bg-white p-10 shadow-md"}>
        {quantity > 0 && (
          <>
            <h2 className={"whitespace-nowrap"}>
              Subtotal ({quantity} items)
              <span className={"font-bold"}>
                <span>
                  <p>{UYUPeso.format(subtotal)}</p>
                </span>
              </span>
            </h2>
            <button
              onClick={
                !session ? () => signIn("google") : createCheckoutSession
              }
              role={"link"}
              className={`button mt-2`}
            >
              {!session ? "Sign in to Checkout" : "Proceed to Checkout"}
            </button>
          </>
        )}
      </div>
    </main>
  );
}
