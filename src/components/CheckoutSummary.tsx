import { CartItem, CartShipping } from "../../typings";
import Image from "next/image";
import { UYUPeso } from "src/utils/currency";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

type Props = {
  items: CartItem[];
  subtotal: number;
  shipping: CartShipping;
  total: number;
};

export default function CheckoutSummary({
  items,
  subtotal,
  shipping,
  total,
}: Props) {
  const [isSummaryOpen, setIsSummaryOpen] = useState(false);
  return (
    <>
      <div
        className={
          "flex flex-col md:hidden items-center justify-between space-y-2 w-full"
        }
      >
        <div className={"flex items-center justify-between space-x-2 w-full"}>
          <div className={"flex flex-1 items-center justify-between"}>
            <p>Resumen del Pedido</p>
            <p className={"font-bold text-lg"}>{UYUPeso.format(total)}</p>
          </div>
          <div>
            {isSummaryOpen ? (
              <ChevronUpIcon
                className={"h-6"}
                onClick={() => setIsSummaryOpen(false)}
              />
            ) : (
              <ChevronDownIcon
                className={"h-6"}
                onClick={() => setIsSummaryOpen(true)}
              />
            )}
          </div>
        </div>
        <div
          className={`transition-height ease-in-out duration-500 ${
            isSummaryOpen ? "h-auto" : "h-0"
          } w-full overflow-hidden`}
        >
          <CheckoutProductList items={items} />
        </div>
      </div>
      <div className={"hidden md:block"}>
        <CheckoutProductList items={items} />
        <div className={"flex flex-col space-y-2 mt-10"}>
          <div className={"flex justify-between items-center"}>
            <p>Subtotal</p>
            <p>{UYUPeso.format(subtotal)}</p>
          </div>
          <div className={"flex justify-between items-center"}>
            <p>Envío</p>
            <p>
              {typeof shipping.price === "number"
                ? UYUPeso.format(shipping.price)
                : shipping.price}
            </p>
          </div>
          <div className={"flex justify-between items-center"}>
            <p className={"font-bold text-lg"}>Total</p>
            <p className={"font-bold text-lg"}>{UYUPeso.format(total)}</p>
          </div>
        </div>
      </div>
    </>
  );
}

function CheckoutProductList({ items }: { items: CartItem[] }) {
  return (
    <div className={"flex flex-col space-y-5 w-full"}>
      {items?.map((item: CartItem) => (
        <div
          key={item.product.id}
          className={"flex justify-between items-center"}
        >
          <div
            className={
              "flex items-center space-x-2 max-w-[200px] md:max-w-[300px] "
            }
          >
            <Image
              src={item.product.image}
              width={80}
              height={80}
              alt={item.product.title}
              className={
                "object-contain rounded-lg border-gray-200 border-2 w-full h-full max-h-[80px] max-w-[80px]"
              }
            />

            <p className={"text-sm md:text-md"}>{item.product.title}</p>
          </div>
          <div className={"flex flex-col justify-center items-end"}>
            <p className={"text-xs md:text-sm"}>
              {UYUPeso.format(item.product.price * item.quantity)}
            </p>
            <p className={"text-xs whitespace-nowrap md:text-sm"}>
              Cantidad: {item.quantity}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
