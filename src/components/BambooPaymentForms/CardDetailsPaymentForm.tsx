import { useEffect, useState } from "react";
import { BambooAddress, BambooCardDetails } from "../../../typings";
import { shippingLocations } from "src/constants/bamboo";
import { formatCCExpDate, formatCCNumber } from "src/utils/payment";

export default function CardDetailsPaymentForm({
  onFinish,
  goToPrevious,
  data,
}) {
  const [cardData, setCardData] = useState<BambooCardDetails>(data.CardData);
  const [billingData, setBillingData] = useState<BambooAddress>(
    data.BillingAddress
  );
  const [billingSameAsShipping, setBillingSameAsShipping] = useState(false);
  const [availableCities, setAvailableCities] = useState(
    shippingLocations.UY.find((state) => state.name === billingData?.State)
      ?.cities || []
  );

  useEffect(() => {
    const cities =
      shippingLocations.UY.find((state) => state.name === billingData?.State)
        ?.cities || [];

    setAvailableCities(cities);
  }, [billingData?.State]);

  const handleCardDataInputChange = (e) => {
    setCardData({ ...cardData, [e.target.name]: e.target.value });
  };

  const handleBillingDataInputChange = (e) => {
    setBillingData({ ...billingData, [e.target.name]: e.target.value });
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
        <h2 className={"mb-2"}>Detalles del Método de Pago</h2>
        <input
          type={"text"}
          placeholder={"Nombre del Titular"}
          onChange={handleCardDataInputChange}
          className={"input"}
          name={"CardHolderName"}
          value={cardData.CardHolderName}
          autoComplete={"cc-name"}
        />
        <input
          type={"text"}
          placeholder={"Número de la Tarjeta"}
          onChange={handleCardDataInputChange}
          className={"input"}
          name={"Pan"}
          value={cardData.Pan}
          autoComplete={"cc-number"}
          onKeyUp={formatCCNumber}
          maxLength={19}
        />
        <input
          type={"text"}
          placeholder={"Código de Seguridad"}
          onChange={handleCardDataInputChange}
          className={"input"}
          name={"CVV"}
          value={cardData.CVV}
          autoComplete={"cc-csc"}
          maxLength={3}
        />
        <input
          type={"text"}
          placeholder={"Fecha de Vencimiento: MM/AA"}
          onChange={handleCardDataInputChange}
          name={"Expiration"}
          value={cardData.Expiration}
          className={"input"}
          autoComplete={"cc-exp"}
          onKeyUp={formatCCExpDate}
          maxLength={5}
        />
        <input
          type={"text"}
          placeholder={"Número de Documento"}
          onChange={handleCardDataInputChange}
          name={"Document"}
          value={cardData.Document}
          className={"input"}
        />
      </div>
      <div
        className={
          "flex flex-col items-center justify-center space-y-2 w-full mt-5"
        }
      >
        <h2 className={"mb-2"}>Dirección de Facturación</h2>
        <label>
          <input
            type="checkbox"
            defaultChecked={billingSameAsShipping}
            className={"mr-2"}
            onClick={(event) =>
              // @ts-ignore
              setBillingSameAsShipping(event.target.checked)
            }
          />
          Misma dirección que el envío
        </label>
        {!billingSameAsShipping && (
          <>
            <input
              type={"text"}
              placeholder={"Dirección"}
              onChange={handleBillingDataInputChange}
              className={"input"}
              name={"AddressDetail"}
              value={billingData.AddressDetail}
            />
            <select
              className={"input"}
              onChange={handleBillingDataInputChange}
              name={"State"}
              placeholder={"Departamento"}
              value={billingData.State}
            >
              {shippingLocations.UY.map((state) => (
                <option key={state.code} value={state.name}>
                  {state.name}
                </option>
              ))}
            </select>
            <select
              className={"input"}
              onChange={handleBillingDataInputChange}
              name={"City"}
              placeholder={"Localidad"}
              value={billingData.City}
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
              onChange={handleBillingDataInputChange}
              name={"PostalCode"}
              value={billingData.PostalCode}
              className={"input"}
            />
          </>
        )}
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
            onFinish({
              ...data,
              CardData: cardData,
              BillingAddress: billingSameAsShipping
                ? data.ShippingAddress
                : billingData,
            })
          }
        >
          Confirmar Pedido
        </button>
      </div>
    </div>
  );
}
