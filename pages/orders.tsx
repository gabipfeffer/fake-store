import { Nunito } from "next/font/google";
import { getSession, useSession } from "next-auth/react";
import moment from "moment";
import db from "../firebase";
import OrderCard from "src/components/OrderCard";
import { Order } from "../typings";
import { GetServerSidePropsContext } from "next";
import { getUserByEmail } from "src/utils/firestore";

const nunito = Nunito({ subsets: ["latin"] });

type Props = {
  orders: Order[];
};

export default function Orders({ orders }: Props) {
  const { data: session } = useSession();

  return (
    <main className={`${nunito.className} max-w-screen-lg mx-auto p-10`}>
      <h1 className={"text-3xl border-b mb-2 pb-1 border-yellow-400"}>
        Your Orders
      </h1>
      {session ? (
        <h2>
          {orders.length} Order{orders.length > 1 && "s"}
        </h2>
      ) : (
        <h2>Please sign in to see your orders.</h2>
      )}
      <div className={"mt-5 space-y-4"}>
        {orders?.map((order) => (
          <OrderCard key={order.id} order={order} />
        ))}
      </div>
    </main>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
  const session = await getSession(context);
  const user = await getUserByEmail(session?.user?.email!);

  if (!session) {
    return {
      props: {},
    };
  }

  const firebaseOrders = await db
    .collection("users")
    .doc(user?.id)
    .collection("orders")
    .orderBy("timestamp", "desc")
    .get();

  const orders: Awaited<Order>[] = await Promise.all(
    firebaseOrders.docs.map(async (document) => {
      const order = document.data() as Order;
      //@ts-ignore
      const timestamp = moment(order.timestamp.toDate()).unix();
      return {
        id: document.id,
        amount: order.amount,
        amount_shipping: order.amount_shipping,
        images: order.images,
        timestamp,
        items: (
          await stripe.checkout.sessions.listLineItems(document.id, {
            limit: 100,
          })
        ).data,
      };
    })
  );

  return {
    props: {
      orders,
    },
  };
}
