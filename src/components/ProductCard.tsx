import { Product } from "../../typings";
import Image from "next/image";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { addToCart } from "src/slices/cartReducer";
import { UYUPeso } from "src/utils/currency";

type Props = {
  product: Product;
};

export default function ProductCard({ product }: Props) {
  const [quantity, setQuantity] = useState(1);
  const dispatch = useDispatch();

  const addItemToCart = () => {
    // @ts-ignore
    dispatch(
      addToCart({
        quantity,
        product,
      })
    );
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

      <p className={"text-sm my-2 line-clamp-2"}>{product.description}</p>

      <div className={"mb-5"}>
        <p>{UYUPeso.format(product.price)}</p>
      </div>

      <div className={"flex items-center justify-center space-x-2"}>
        <label className={"flex items-center gap-2"}>
          Quantity:{" "}
          <input
            type={"number"}
            value={quantity}
            min={1}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className={
              "w-10 text-center p-2 bg-gray-100 rounded-lg focus:outline-none"
            }
          />
        </label>

        <button className={"mt-auto button flex-1"} onClick={addItemToCart}>
          Add to Cart
        </button>
      </div>
    </div>
  );
}
