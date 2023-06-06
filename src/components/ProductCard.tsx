"use client";
import { Product } from "../../typings";
import Image from "next/image";
import { useState } from "react";
import { StarIcon } from "@heroicons/react/24/solid";
import { useDispatch } from "react-redux";
import { addToCart } from "src/slices/cartReducer";
import { USDollar } from "src/utils/currency";

type Props = {
  product: Product;
};

export default function ProductCard({ product }: Props) {
  const [hasPrime] = useState(Math.random() < 0.5);
  const dispatch = useDispatch();

  const addItemToCart = () => {
    // @ts-ignore
    dispatch(addToCart({ ...product, hasPrime }));
  };

  return (
    <div className={"relative flex flex-col m-5 bg-white z-30 p-10"}>
      <p className={"absolute top-2 right-2 font-sx italic text-gray-400"}>
        {product.category}
      </p>
      <Image
        src={product.image}
        height={200}
        width={200}
        alt={product.title}
        className={"object-contain mx-auto"}
      />
      <h4 className={"my-3"}>{product.title}</h4>

      <div className={"flex"}>
        {Array(Math.floor(product.rating.rate))
          .fill(undefined)
          .map((_, index) => (
            <StarIcon key={index} className={"h-5 text-yellow-500"} />
          ))}
      </div>

      <p className={"text-sm my-2 line-clamp-2"}>{product.description}</p>

      <div className={"mb-5"}>
        <p>{USDollar.format(product.price)}</p>
      </div>

      {hasPrime && (
        <div className={"flex items-center space-x-2 -mt-5"}>
          <Image
            className={"w-12"}
            src={"https://links.papareact.com/fdw"}
            alt={"prime"}
            width={300}
            height={300}
          />
          <p className={"text-sm text-gray-500"}>FREE Next-day Delivery</p>
        </div>
      )}

      <button className={"mt-auto button"} onClick={addItemToCart}>
        Add to Cart
      </button>
    </div>
  );
}
