import { useEffect, useState } from "react";
import { shippingMethods } from "src/constants/bamboo";
import { CartShipping } from "../../../typings";
import { UYUPeso } from "src/utils/currency";
import { useDispatch, useSelector } from "react-redux";
import { selectShipping, updatedShippingMethod } from "src/slices/cartReducer";

type Props = {
  goToNext?: (data?: any) => void;
  goToPrevious?: () => void;
  data?: any;
};

export default function ShippingMethodPaymentForm({
  goToNext,
  goToPrevious,
}: Props) {
  const dispatch = useDispatch();
  const shipping = useSelector(selectShipping);
  const [selectedShipping, setSelectedShipping] =
    useState<CartShipping>(shipping);

  const updateShipping = (shippingMethod: CartShipping) => {
    // @ts-ignore
    dispatch(updatedShippingMethod({ shippingMethod }));
  };

  useEffect(() => {
    updateShipping(selectedShipping);
  }, [selectedShipping]);

  return (
    <div
      className={
        "flex flex-col items-center justify-center max-w-xl mx-auto pb-10 h-full w-full"
      }
    >
      <div
        className={"flex flex-col items-center justify-center space-y-2 w-full"}
      >
        <h2 className={"mb-2"}>Selecciona el método de envío</h2>

        <div
          className={
            "flex flex-col items-center justify-center w-full space-y-2"
          }
        >
          {shippingMethods.UY?.map((method) => (
            <div
              onClick={() => setSelectedShipping(method)}
              key={method.name}
              className={`flex items-center justify-between input p-5 cursor-pointer ${
                selectedShipping.name === method.name && "border-amazon_blue"
              }`}
            >
              <p>{method.name}</p>
              <p>
                {typeof method.price === "number"
                  ? UYUPeso.format(method.price)
                  : method.price}
              </p>
            </div>
          ))}
        </div>
      </div>
      <div className={"flex items-center justify-center space-x-2 mt-10"}>
        <button
          className={`${!goToPrevious && "hidden"} secondaryButton`}
          onClick={goToPrevious}
        >
          Volver
        </button>
        <button
          className={`${!goToNext && "hidden"} button`}
          onClick={() => goToNext?.()}
        >
          Continuar al Método de Pago
        </button>
      </div>
    </div>
  );
}
