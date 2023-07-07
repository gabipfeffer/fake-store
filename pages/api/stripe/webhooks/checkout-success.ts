import type { NextApiRequest, NextApiResponse } from "next";
import { buffer } from "micro";
import { Order } from "../../../../typings";
import * as admin from "firebase-admin";
import { app, getUserByEmail } from "src/utils/firestore";

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const stripeSecret = process.env.STRIPE_SIGNING_SECRET;

// TODO: Replace mock fn with real fn
const saveOrderToDb = async (order: Order) => {
  console.log("Saving order to DB", order.id);
  return app.firestore().collection("orders").doc(order.id).set(order);
};

const fulfillOrder = async (session: any) => {
  console.log("Fulfilling order", session.id);
  const user = await getUserByEmail(session.metadata.email);

  if (!user)
    throw new Error(
      `User ${session.metadata.email} associated to order was not found on DB`
    );
  return saveOrderToDb({
    id: session.id,
    amount: session.amount_total / 100,
    amount_shipping: session.total_details.amount_shipping / 100,
    images: JSON.parse(session.metadata.images),
    timestamp: admin.firestore.FieldValue.serverTimestamp(),
    user_id: user.id,
  })
    .then(() =>
      console.log(`SUCCESS: Order ${session.id} has been added to the DB`)
    )
    .catch((err) =>
      console.error(
        `ERROR: There was an error fulfilling ${session.id} to the DB: ${err.message}`
      )
    );
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const requestBuffer = await buffer(req);
    const payload = requestBuffer.toString();
    const sig = req.headers["stripe-signature"];
    let event;

    try {
      event = stripe.webhooks.constructEvent(payload, sig, stripeSecret);
    } catch (err: any) {
      res.status(err.statusCode || 400).json(`Webhook error: ${err.message}`);
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      return fulfillOrder(session)
        .then(() => res.status(200).json({ id: session.id }))
        .catch((err: any) =>
          res.status(err.statusCode || 500).json(err.message)
        );
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}

export const config = {
  api: {
    bodyParser: false,
    externalResolver: true,
  },
};
