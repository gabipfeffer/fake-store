import { useEffect, useState } from "react";
import { documentTypes, shippingLocations } from "src/constants/bamboo";
import { BambooAddress, BambooCustomer } from "../../../typings";
import { useRouter } from "next/router";

type Props = { goToNext?: (data: any) => void; data?: any };

export default function BasicCustomerPaymentForm({ goToNext, data }: Props) {
  const router = useRouter();
  const [customerData, setCustomerData] = useState<BambooCustomer>(
    data.Customer
  );
  const [shippingData, setShippingData] = useState<BambooAddress>(
    data.ShippingAddress
  );
  const [availableCities, setAvailableCities] = useState(
    shippingLocations.UY.find((state) => state.name === shippingData?.State)
      ?.cities || []
  );

  useEffect(() => {
    const cities =
      shippingLocations.UY.find((state) => state.name === shippingData?.State)
        ?.cities || [];

    setAvailableCities(cities);
  }, [shippingData?.State]);

  const handleShippingDataInputChange = (e) => {
    setShippingData({ ...shippingData, [e.target.name]: e.target.value });
  };

  const handleCustomerDataInputChange = (e) => {
    setCustomerData({ ...customerData, [e.target.name]: e.target.value });
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
        <h2 className={"mb-2"}>Detalles del Cliente</h2>
        <input
          type={"text"}
          placeholder={"Nombre"}
          onChange={handleCustomerDataInputChange}
          className={"input"}
          name={"FirstName"}
          value={customerData.FirstName}
        />
        <input
          type={"text"}
          placeholder={"Apellido"}
          onChange={handleCustomerDataInputChange}
          className={"input"}
          name={"LastName"}
          value={customerData.LastName}
        />
        <select
          className={"input"}
          onChange={handleCustomerDataInputChange}
          name={"DocumentTypeId"}
          placeholder={"Tipo de Documento"}
          value={customerData.DocumentTypeId}
        >
          {documentTypes.UY.map((type) => (
            <option key={type.code} value={type.code}>
              {type.name}
            </option>
          ))}
        </select>
        <input
          type={"text"}
          placeholder={"Número de Documento"}
          onChange={handleCustomerDataInputChange}
          className={"input"}
          name={"DocNumber"}
          value={customerData.DocNumber}
        />
        <input
          type={"text"}
          placeholder={"Número de Teléfono"}
          onChange={handleCustomerDataInputChange}
          name={"PhoneNumber"}
          value={customerData.PhoneNumber}
          className={"input"}
        />
      </div>
      <div
        className={
          "flex flex-col items-center justify-center space-y-2 w-full mt-5"
        }
      >
        <h2 className={"mb-2"}>Dirección de Envío</h2>
        <input
          type={"text"}
          placeholder={"Dirección"}
          onChange={handleShippingDataInputChange}
          className={"input"}
          name={"AddressDetail"}
          value={shippingData.AddressDetail}
        />
        <select
          className={"input"}
          onChange={handleShippingDataInputChange}
          name={"State"}
          placeholder={"Departamento"}
          value={shippingData.State}
        >
          {shippingLocations.UY.map((state) => (
            <option key={state.code} value={state.name}>
              {state.name}
            </option>
          ))}
        </select>
        <select
          className={"input"}
          onChange={handleShippingDataInputChange}
          name={"City"}
          placeholder={"Localidad"}
          value={shippingData.City}
        >
          {availableCities?.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
        <input
          type={"text"}
          placeholder={"Código Postal"}
          onChange={handleShippingDataInputChange}
          name={"PostalCode"}
          value={shippingData.PostalCode}
          className={"input"}
        />
      </div>
      <div className={"flex items-center justify-center space-x-2 mt-10"}>
        <button
          className={`secondaryButton`}
          onClick={() => router.push("/cart")}
        >
          Volver al Carrito
        </button>
        <button
          className={`${!goToNext && "hidden"} button`}
          onClick={() =>
            goToNext?.({
              Customer: customerData,
              ShippingAddress: shippingData,
            })
          }
        >
          Continuar al Envío
        </button>
      </div>
    </div>
  );
}
