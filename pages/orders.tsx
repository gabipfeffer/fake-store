import { Nunito } from "next/font/google";
import { getSession, useSession } from "next-auth/react";
import moment from "moment";
import db from "../firebase";
import OrderCard from "src/components/OrderCard";

const nunito = Nunito({ subsets: ["latin"] });

export default function Orders({ orders }) {
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

export async function getServerSideProps(context) {
  const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
  const session = await getSession(context);
  console.log("session", session);

  if (!session) {
    return {
      props: {},
    };
  }

  const firebaseOrders = await db
    .collection("users")
    .doc(session.user?.email!)
    .collection("orders")
    .orderBy("timestamp", "desc")
    .get();

  const orders = await Promise.all(
    firebaseOrders.docs.map(async (order) => ({
      id: order.id,
      amount: order.data().amount,
      amount_shipping: order.data().amount_shipping,
      images: order.data().images,
      timestamp: moment(order.data().timestamp.toDate()).unix(),
      items: (
        await stripe.checkout.sessions.listLineItems(order.id, {
          limit: 100,
        })
      ).data,
    }))
  );

  return {
    props: {
      orders,
    },
  };
}
