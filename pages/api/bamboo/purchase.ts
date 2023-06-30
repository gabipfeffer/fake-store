import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const baseUrl = process.env.BAMBOO_BASE_URL;
    try {
      const {
        Customer,
        ShippingAddress,
        BillingAddress,
        Description,
        Amount,
        TaxableAmount,
        Order,
        Invoice,
        CardData,
      } = JSON.parse(req.body);

      const response = await fetch(`${baseUrl}/purchase`, {
        method: "POST",
        headers: {
          Authorization: `Basic ${process.env.BAMBOO_PRIVATE_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Order,
          DataUY: {
            IsFinalConsumer: true,
            Invoice,
            TaxableAmount,
          },
          CardData: { ...CardData, Pan: CardData.Pan.replace(/ /g, "") },
          Capture: true,
          Amount,
          Currency: "UYU",
          TargetCountryISO: "UY",
          Installments: 1,
          Description,
          Customer: {
            ...Customer,
            ShippingAddress,
            BillingAddress,
          },
        }),
      }).then((res) => res.json());

      res.status(200).json(response);
    } catch (err: any) {
      res.status(err.statusCode || 500).json(err.message);
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}
