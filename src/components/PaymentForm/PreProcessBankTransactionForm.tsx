import { ChangeEvent, useState } from "react";
import { PrometeoBankAccount } from "../../../typings";
import { UYUPeso } from "src/utils/currency";
import { useSelector } from "react-redux";
import { selectTotal } from "src/slices/cartReducer";

type Props = {
  goToPrevious?: () => void;
  goToNext?: (data: any) => void;
  data?: any;
};

export default function PreProcessBankTransactionForm({
  goToNext,
  data,
  goToPrevious,
}: Props) {
  const total = useSelector(selectTotal);
  const [account, setAccount] = useState<PrometeoBankAccount>(
    data?.accounts?.[0]
  );

  const handleAccountChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const accountIndex = data.accounts.findIndex(
      (account: PrometeoBankAccount) => account.id === e.target.value
    );

    setAccount(data.accounts?.[accountIndex]);
  };

  const handleOnNext = async () => {
    try {
      const response = await fetch("/api/prometeo/preprocess", {
        method: "POST",
        body: JSON.stringify({
          account,
          session: data.session,
          currency: "UYU",
          amount: total,
          concept: "ORDER",
        }),
      });
      const responseJson = await response.json();

      if (!responseJson) throw new Error("Error preprocessing your payment");

      return goToNext?.({
        request_id: responseJson.result.request_id,
        pre_process_approved: responseJson.result.approved,
        account,
      });
    } catch (e: any) {
      alert("Error preprocessing your payment" + e.message);
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
        <h2 className={"mb-2"}>Elige tu cuenta</h2>
        <select
          className={"input"}
          onChange={handleAccountChange}
          name={"provider"}
          placeholder={"Banco"}
          value={account?.id}
        >
          {data?.accounts?.map((account: PrometeoBankAccount) => (
            <option key={account.id} value={account.id}>
              {account.name} - {UYUPeso.format(account.balance)}
            </option>
          ))}
        </select>
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
