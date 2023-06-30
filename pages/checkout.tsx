import { Nunito } from "next/font/google";
import { useDispatch, useSelector } from "react-redux";
import {
  selectItems,
  selectShipping,
  selectSubtotal,
  selectTotal,
} from "src/slices/cartReducer";
import { signIn, useSession } from "next-auth/react";
import BambooPaymentForm from "src/components/BambooPaymentForms/BambooPaymentForm";
import CheckoutSummary from "src/components/CheckoutSummary";
import { BambooPaymentData } from "../typings";
import { setLoader } from "src/slices/loaderReducer";
import { useRouter } from "next/router";

const nunito = Nunito({ subsets: ["latin"] });

export default function CheckoutPage() {
  const dispatch = useDispatch();
  const items = useSelector(selectItems);
  const subtotal = useSelector(selectSubtotal);
  const shipping = useSelector(selectShipping);
  const total = useSelector(selectTotal);
  const router = useRouter();
  const { data: session } = useSession();

  //TODO: Fetch shipping options from Admin Console DB

  const processBambooPurchase = async (body: BambooPaymentData) => {
    try {
      const response = await fetch("/api/bamboo/purchase", {
        method: "POST",
        body: JSON.stringify(body),
      });

      return await response.json();
    } catch (e) {
      throw new Error(e.message);
    }
  };

  const handlePayment = async (data: BambooPaymentData) => {
    try {
      // @ts-ignore
      dispatch(setLoader(true));
      const response = await processBambooPurchase(data);

      // @ts-ignore
      dispatch(setLoader(false));
      if (response.Response.PurchaseId) {
        router.push("/success");
      } else {
        //  TODO: purchase failed, Show Message
      }
    } catch (e) {
      //  TODO: return error message (error handling o be determined)
    }
  };

  return (
    <main
      className={`${nunito.className} max-w-screen-2xl mx-auto bg-gray-100 lg:flex`}
    >
      <div className={"flex flex-col-reverse w-full md:flex-row"}>
        {/* LEFT SIDE CAPTURE INFO*/}
        {!session ? (
          <div
            className={
              "w-screen h-[calc(100vh-7rem)] flex items-center justify-center"
            }
          >
            <p>
              Por favor,{" "}
              <span
                onClick={() => signIn("google")}
                className={
                  "underline text-black cursor-pointer hover:scale-125"
                }
              >
                inicia tu sesión
              </span>{" "}
              para finalizar tu pedido
            </p>
          </div>
        ) : (
          <>
            <div className={"bg-white w-full md:w-1/2"}>
              <BambooPaymentForm handlePayment={handlePayment} />
            </div>
            {/*  RIGHT SIDE PRODUCTS*/}
            <div
              className={
                "bg-gray-100 w-full md:w-1/2 p-5 md:p-10 mx-auto max-w-xl"
              }
            >
              <CheckoutSummary
                items={items}
                subtotal={subtotal}
                shipping={shipping}
                total={total}
              />
            </div>
          </>
        )}
      </div>
    </main>
  );
}
