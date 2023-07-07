import { PaymentType } from "../../../typings";
import { useState } from "react";
import { BanknotesIcon, CreditCardIcon } from "@heroicons/react/24/outline";

type Props = {
  goToNext?: (data: any) => void;
  goToPrevious?: () => void;
};

export default function SelectPaymentTypeForm({
  goToNext,
  goToPrevious,
}: Props) {
  const [paymentType, setPaymentType] = useState<PaymentType>("card");
  const handleOnNext = async () => {
    try {
      return goToNext?.({
        PaymentType: paymentType,
      });
    } catch (e: any) {
      alert("Error logging into bank: " + e.message);
    }
  };
  return (
    <div
      className={
        "flex flex-col items-center justify-center max-w-xl mx-auto pb-10 h-full w-full"
      }
    >
      <div
        className={"flex flex-col items-center justify-center space-y-2 w-full"}
      >
        <h2 className={"mb-2"}>Elige tu método de pago</h2>
        <div className={"flex items-center justify-center gap-5"}>
          <div
            onClick={() => setPaymentType("card")}
            className={`flex flex-col items-center justify-center border border-2 rounded-lg p-4 w-36 h-36 text-center space-y-2 cursor-pointer transition-scale duration-500 ease-in-out ${
              paymentType === "card" && "border-gray-700 scale-110"
            }`}
          >
            <CreditCardIcon className={"w-10 h-10"} />
            <p>Tarjeta</p>
          </div>
          <div
            onClick={() => setPaymentType("bank_transfer")}
            className={`flex flex-col items-center justify-center border border-2 rounded-lg p-4 w-36 h-36 text-center space-y-2 cursor-pointer transition-scale duration-500 ease-in-out ${
              paymentType === "bank_transfer" && "border-gray-700 scale-110"
            }`}
          >
            <BanknotesIcon className={"w-10 h-10"} />
            <p>Transferencia Bancaria</p>
          </div>
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
          onClick={handleOnNext}
        >
          Continuar
        </button>
      </div>
    </div>
  );
}
