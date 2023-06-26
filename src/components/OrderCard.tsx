import { Order } from "../../typings";
import { USDollar } from "src/utils/currency";
import moment from "moment";

type Props = {
  order: Order;
};

export default function OrderCard({ order }: Props) {
  return (
    <div className={"relative border rounded-md"}>
      <div
        className={
          "flex items-center space-x-10 p-5 bg-gray-100 text-sm text-gray-600"
        }
      >
        <div>
          <p className={"font-bold text-sm"}>Order Placed</p>
          <p>{moment.unix(order.timestamp as number).format("DD MMM YYYY")}</p>
        </div>

        <div>
          <p className={"text-xs font-bold"}>TOTAL</p>
          <p>
            {USDollar.format(order.amount)} - Next Day Delivery{" "}
            {USDollar.format(order.amount_shipping)}
          </p>
        </div>
        <p
          className={
            "text-sm whitespace-nowrap sm:text-xl self-end flex-1 text-right text-blue-500"
          }
        >
          {order.items?.length} items
        </p>

        <p
          className={
            "absolute top-2 right-2 w-40 lg:w-72 truncate text-xm whitespace-nowrap"
          }
        >
          Order #{order.id}
        </p>
      </div>

      <div className={"p-5 sm:p-10"}>
        <div className={"flex space-x-6 overflow-x-auto"}>
          {order.images.map((image, index) => (
            <img
              key=""
              src={image}
              alt={`order-${order.id}-image-${index}`}
              className={"h-20 object-contain sm:h-32"}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
