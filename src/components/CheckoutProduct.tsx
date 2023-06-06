"use client";
import { Product } from "../../typings";
import Image from "next/image";
import { StarIcon } from "@heroicons/react/24/solid";
import { useDispatch } from "react-redux";
import { addToCart, removeFromCart } from "src/slices/cartReducer";
import { USDollar } from "src/utils/currency";

type Props = {
  product: Product;
};

export default function CheckoutProduct({ product }: Props) {
  const dispatch = useDispatch();

  const addItemToCart = () => {
    // @ts-ignore
    dispatch(addToCart(product));
  };
  const removeItemFromCart = () => {
    // @ts-ignore
    dispatch(removeFromCart({ id: product.id }));
  };

  return (
    <div className={"grid grid-cols-5"}>
      <Image
        src={product.image}
        width={200}
        height={200}
        alt={product.title}
        className={"object-contain"}
      />
      <div className={"col-span-3 mx-5"}>
        <p>{product.title}</p>
        <div className={"flex"}>
          {Array(Math.floor(product.rating.rate))
            .fill(undefined)
            .map((_, index) => (
              <StarIcon key={index} className={"h-5 text-yellow-500"} />
            ))}
        </div>
        <p className={"text-xs my-2 line-clamp-3"}>{product.description}</p>
        <p>{USDollar.format(product.price)}</p>
        {product.hasPrime && (
          <div className={"flex items-center space-x-2"}>
            <Image
              className={"w-12"}
              src={"https://links.papareact.com/fdw"}
              alt={"prime"}
              width={300}
              height={300}
            />
            <p className={"text-xs text-gray-500"}>FREE Next-day Delivery</p>
          </div>
        )}
      </div>

      {/*  ADD REMOVE BUTTONS*/}
      <div className={"flex flex-col space-y-2 my-auto justify-self-end"}>
        <button className={"button"} onClick={addItemToCart}>
          Add to Cart
        </button>
        <button className={"button"} onClick={removeItemFromCart}>
          Remove from Cart
        </button>
      </div>
    </div>
  );
}
