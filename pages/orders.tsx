import { Nunito } from "next/font/google";
import { getSession, useSession } from "next-auth/react";
import OrderCard from "src/components/OrderCard";
import { Order } from "../typings";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { getOrdersByUserId, getUserByEmail } from "src/utils/firestore";

const nunito = Nunito({ subsets: ["latin"] });

export default function Orders({
  orders,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { data: session } = useSession();

  return (
    <main className={`${nunito.className} max-w-screen-lg mx-auto p-10`}>
      <h1 className={"text-3xl border-b mb-2 pb-1 border-yellow-400"}>
        Your Orders
      </h1>
      {session ? (
        <h2>
          {orders?.length} Order{orders?.length && orders?.length > 1 && "s"}
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
  if (!session) {
    return {
      props: {},
    };
  }

  const user = await getUserByEmail(session?.user?.email!);
  const firebaseOrders = await getOrdersByUserId(user?.id!);

  const orders: Order[] = await Promise.all(
    firebaseOrders.map(async (order) => {
      return {
        ...order,
        items: (
          await stripe.checkout.sessions.listLineItems(order.id, {
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
