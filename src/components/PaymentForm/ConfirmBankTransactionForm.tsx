import { UYUPeso } from "src/utils/currency";
import { PaymentData } from "../../../typings";
import { ChangeEvent, useState } from "react";

type Props = {
  goToPrevious?: () => void;
  onFinish?: (data: PaymentData) => void;
  data?: any;
};

export default function ConfirmBankTransactionForm({
  onFinish,
  data,
  goToPrevious,
}: Props) {
  const [authorizationData, setAuthorizationData] = useState("");
  return (
    <div
      className={
        "flex flex-col items-center justify-center max-w-xl mx-auto pb-10 h-full w-full"
      }
    >
      <div
        className={"flex flex-col items-center justify-center space-y-2 w-full"}
      >
        <h2 className={"mb-2"}>Confirmar Pago</h2>
        <div className={"flex flex-col justify-center space-y-2"}>
          <p>
            Cuenta: {data.account.name} - {UYUPeso.format(data.account.balance)}
          </p>
          <input
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setAuthorizationData(e.target.value)
            }
            value={authorizationData}
            className={"input"}
            type={"text"}
            name={"authorization_data"}
            placeholder={"Código de Autorización"}
          />
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
          className={`${!onFinish && "hidden"} button`}
          onClick={() =>
            onFinish?.({ ...data, authorization_data: authorizationData })
          }
        >
          Confirmar Pedido
        </button>
      </div>
    </div>
  );
}
