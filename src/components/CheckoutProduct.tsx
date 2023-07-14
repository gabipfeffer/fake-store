import { Product } from "../../typings";
import Image from "next/image";
import { useDispatch } from "react-redux";
import { updateQuantity, removeFromCart } from "src/slices/cartReducer";
import { UYUPeso } from "src/utils/currency";

type Props = {
  product: Product;
  quantity: number;
};

export default function CheckoutProduct({ product, quantity }: Props) {
  const dispatch = useDispatch();

  const updateItemQuantity = (updatedQuantity: number) => {
    // @ts-ignore
    dispatch(updateQuantity({ id: product.id, quantity: updatedQuantity }));
  };
  const removeItemFromCart = () => {
    // @ts-ignore
    dispatch(removeFromCart({ id: product.id }));
  };

  return (
    <div
      className={"flex flex-col md:flex-row items-center justify-center w-full"}
    >
      <div className={"flex items-center justify-start flex-1"}>
        <Image
          src={product.images?.[0]?.imageUrl as string}
          width={200}
          height={200}
          alt={product.title}
          className={"object-contain h-20 w-20 md:h-56 md:w-56"}
        />
        <div className={"mx-5"}>
          <p>{product.title}</p>
          {/* TODO: Add Review Rating from product once implemented in Backend*/}
          {/*<div className={"flex"}>*/}
          {/*  {Array(Math.floor(product.rating.rate))*/}
          {/*    .fill(undefined)*/}
          {/*    .map((_, index) => (*/}
          {/*      <StarIcon key={index} className={"h-5 text-yellow-500"} />*/}
          {/*    ))}*/}
          {/*</div>*/}
          <p className={"text-xs my-2 line-clamp-3 max-w-xl"}>
            {product.description}
          </p>
          <p>{UYUPeso.format(product.price)}</p>
        </div>
      </div>

      <div
        className={
          "flex md:flex-col space-x-2 md:space-y-2 items-center justify-center w-full md:w-auto mt-2"
        }
      >
        <label className={"flex items-center gap-2 text-xs md:text-base"}>
          Cantidad:{" "}
          <input
            type={"number"}
            value={quantity}
            min={1}
            onChange={(e) => updateItemQuantity(Number(e.target.value))}
            className={
              "w-10 text-center p-2 bg-gray-100 rounded-lg focus:outline-none"
            }
          />
        </label>
        <button className={"button"} onClick={removeItemFromCart}>
          Quitar del carrito
        </button>
      </div>
    </div>
  );
}
