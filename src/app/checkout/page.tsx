import { Nunito } from "next/font/google";
import Image from "next/image";

const nunito = Nunito({ subsets: ["latin"] });

export default async function CheckoutPage() {
  return (
    <main
      className={`${nunito.className} max-w-screen-2xl mx-auto bg-gray-100`}
    >
      {/*  LEFT */}
      <div>
        <Image
          src={"https://links.papareact.com/ikj"}
          className={"object-contain"}
          alt={"checkout image"}
          width={1020}
          height={250}
        />
      </div>
      {/*  RIGHT */}
      <div></div>
    </main>
  );
}
