import OnboardingFlow from "src/components/OnboardingFlow";
import ShippingMethodPaymentForm from "src/components/ShippingMethodPaymentForm";
import { useState } from "react";
import SelectPaymentTypeForm from "src/components/PaymentForm/SelectPaymentTypeForm";
import { PaymentData } from "../../../typings";
import { useSelector } from "react-redux";
import { useSession } from "next-auth/react";
import BasicCustomerPaymentForm from "src/components/PaymentForm/BasicCustomerPaymentForm";
import CardDetailsPaymentForm from "src/components/PaymentForm/CardDetailsPaymentForm";
import BankLoginForm from "src/components/PaymentForm/BankLoginForm";
import PreProcessBankTransactionForm from "src/components/PaymentForm/PreProcessBankTransactionForm";
import ConfirmBankTransactionForm from "src/components/PaymentForm/ConfirmBankTransactionForm";
import {
  selectItems,
  selectShipping,
  selectTotal,
} from "src/slices/cartReducer";

type Props = {
  handlePayment: (data: any) => void;
};

export default function PaymentForm({ handlePayment }: Props) {
  const total = useSelector(selectTotal);
  const shipping = useSelector(selectShipping);
  const items = useSelector(selectItems);
  const { data: session } = useSession();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [paymentData, setPaymentData] = useState<PaymentData>({
    PaymentType: "card",
    Description: `Envío: ${shipping.name} - ${shipping.price} | Items: ${items
      .map((item) => `Cantidad: ${item.quantity}, ID: ${item.product.id}`)
      .join(", ")}`,
    Amount: total * 100,
    TaxableAmount: Math.ceil(total * 0.22 * 100).toString(),
    Order: "",
    Invoice: "1005",
    ShippingAddress: {
      Country: "UY",
      City: "",
      State: "Montevideo",
      PostalCode: "",
      AddressDetail: "",
    },
    BillingAddress: {
      Country: "UY",
      City: "",
      State: "Montevideo",
      PostalCode: "",
      AddressDetail: "",
    },
    Customer: {
      Email: session?.user?.email || "",
      DocNumber: "",
      PhoneNumber: "",
      FirstName: "",
      LastName: "",
      DocumentTypeId: 2,
    },
    CardData: {
      CardHolderName: "",
      Pan: "",
      CVV: "",
      Expiration: "",
      Email: session?.user?.email || "",
      Document: "",
    },
    authorization_type: "otp",
    authorization_data: "",
    authorization_device_number: "",
  });

  const onNext = (stepData: any) => {
    const updatedData = { ...paymentData, ...stepData };
    setPaymentData(updatedData);
    setCurrentIndex(currentIndex + 1);
  };

  const onPrevious = () => {
    setCurrentIndex(currentIndex - 1);
  };

  const onFinish = (data?: PaymentData) => handlePayment(data);

  return (
    <div
      className={
        "flex flex-col items-center justify-center max-w-xl mx-auto py-5 h-full"
      }
    >
      <div className={"w-full h-full min-h-[100vh-]"}>
        <OnboardingFlow
          currentIndex={currentIndex}
          onNext={onNext}
          onPrevious={onPrevious}
          data={paymentData}
          onFinish={onFinish}
        >
          <ShippingMethodPaymentForm />
          <BasicCustomerPaymentForm />
          <SelectPaymentTypeForm />
          {paymentData?.PaymentType === "bank_transfer" && <BankLoginForm />}
          {paymentData?.PaymentType === "bank_transfer" && (
            <PreProcessBankTransactionForm />
          )}
          {paymentData?.PaymentType === "bank_transfer" && (
            <ConfirmBankTransactionForm />
          )}
          {paymentData?.PaymentType === "card" && <CardDetailsPaymentForm />}
        </OnboardingFlow>
      </div>
    </div>
  );
}
