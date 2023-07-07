import { ChangeEvent, useEffect, useState } from "react";
import {
  PrometeoBankAccount,
  PrometeoBankLogin,
  PrometeoSession,
} from "../../../typings";
import { banks } from "src/constants/prometeo";

type Props = {
  goToNext?: (data: any) => void;
  data?: any;
  goToPrevious?: () => void;
};

const getBankFields = (bank: {
  fields: { name: string; placeholder: string; type: string }[];
}): PrometeoBankLogin =>
  bank.fields.reduce(
    (acc: PrometeoBankLogin, field) => {
      acc[field.name as keyof PrometeoBankLogin] = "";

      return acc;
    },
    {
      username: "",
      password: "",
    }
  );

export default function BankLoginForm({ goToNext, goToPrevious }: Props) {
  const [provider, setProvider] = useState(banks.UY[0]);
  const [bankLoginData, setBankLoginData] = useState<PrometeoBankLogin>(
    getBankFields(provider)
  );

  useEffect(() => {
    setBankLoginData(getBankFields(provider));
  }, [provider]);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setBankLoginData({ ...bankLoginData, [e.target.name]: e.target.value });
  };

  const handleBankChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const bankIndex = banks.UY.findIndex(
      (bank) => bank.code === e.target.value
    );

    setProvider(banks.UY[bankIndex]);
  };

  const handleOnNext = async () => {
    try {
      const response = await fetch("/api/prometeo/bank-login", {
        method: "POST",
        body: JSON.stringify({ provider: provider.code, ...bankLoginData }),
      });
      const result: {
        session?: PrometeoSession;
        accounts?: {
          status: string;
          message: string;
          accounts: PrometeoBankAccount[];
        };
      } = await response.json();

      if (result?.accounts?.status === "error") {
        throw new Error(
          result?.accounts?.message || "Error logging into your bank account"
        );
      }

      return goToNext?.({
        session: result?.session,
        accounts: result?.accounts?.accounts,
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
        <h2 className={"mb-2"}>Iniciar sesión de banco</h2>
        <select
          className={"input"}
          onChange={handleBankChange}
          name={"provider"}
          placeholder={"Banco"}
          value={provider.code}
        >
          {banks.UY.map((type) => (
            <option key={type.code} value={type.code}>
              {type.name}
            </option>
          ))}
        </select>
        {provider.fields.map((field) => (
          <input
            key={field.name}
            type={field.type}
            placeholder={field.placeholder}
            onChange={handleInputChange}
            className={"input"}
            name={field.name}
            value={bankLoginData[field.name as keyof PrometeoBankLogin]}
          />
        ))}
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
