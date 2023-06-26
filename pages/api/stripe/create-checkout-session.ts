import type { NextApiRequest, NextApiResponse } from "next";
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

type Data = { id: string };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method === "POST") {
    try {
      const { items, email, mode, shipping_rate } = JSON.parse(req.body);

      const transformedItems = items.map((item: any) => ({
        quantity: 1,
        price_data: {
          currency: "usd",
          unit_amount: item.price * 100,
          product_data: {
            name: item.title,
            description: item.description,
            images: [item.image],
          },
        },
      }));

      // Create Checkout Sessions from body params.
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        shipping_options: [{ shipping_rate }],
        line_items: transformedItems,
        mode,
        success_url: `${req.headers.origin}/success`,
        cancel_url: `${req.headers.origin}/checkout`,
        automatic_tax: { enabled: true },
        metadata: {
          email,
          images: JSON.stringify(items.map((item: any) => item.image)),
        },
        shipping_address_collection: { allowed_countries: ["UY"] },
      });

      res.status(200).json({ id: session.id });
    } catch (err) {
      if (err instanceof Error) {
        res.status(err.statusCode || 500).json(err.message);
      }
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}
