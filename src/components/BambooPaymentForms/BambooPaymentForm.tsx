import OnboardingFlow from "src/components/OnboardingFlow";
import BasicCustomerPaymentForm from "src/components/BambooPaymentForms/BasicCustomerPaymentForm";
import CardDetailsPaymentForm from "src/components/BambooPaymentForms/CardDetailsPaymentForm";
import ShippingMethodPaymentForm from "src/components/BambooPaymentForms/ShippingMethodPaymentForm";
import { useState } from "react";
import { useSelector } from "react-redux";
import {
  selectItems,
  selectShipping,
  selectTotal,
} from "src/slices/cartReducer";
import { useSession } from "next-auth/react";

type Props = {
  handlePayment: (data) => void;
};

export default function BambooPaymentForm({ handlePayment }: Props) {
  const total = useSelector(selectTotal);
  const shipping = useSelector(selectShipping);
  const items = useSelector(selectItems);

  const { data: session } = useSession();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [paymentData, setPaymentData] = useState({
    Description: `Shipping: ${shipping.name} - ${
      shipping.price
    } || Productos: ${items
      .map((item) => `Cantidad: ${item.quantity}: ID: ${item.product.id}`)
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
      Email: session?.user?.email,
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
      Email: session?.user?.email,
      Document: "",
    },
  });

  const onNext = (stepData: any) => {
    // TODO: Validate stepData to check for empty fields
    const updatedData = { ...paymentData, ...stepData };
    setPaymentData(updatedData);
    setCurrentIndex(currentIndex + 1);
  };

  const onPrevious = () => {
    setCurrentIndex(currentIndex - 1);
  };

  const onFinish = (data) => handlePayment(data);

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
          <BasicCustomerPaymentForm />
          <ShippingMethodPaymentForm />
          <CardDetailsPaymentForm />
        </OnboardingFlow>
      </div>
    </div>
  );
}
