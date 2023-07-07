import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      const { account, session, currency, amount, concept } = JSON.parse(
        req.body
      );
      const baseUrl = process.env.PROMETEO_BASE_URL;
      const API_KEY = process.env.PROMETEO_API_KEY;

      try {
        const transfer_data = {
          origin_account: account.number,
          destination_account: "037069523",
          destination_institution: "5600010",
          currency,
          amount,
          concept,
          destination_owner_name: "",
          branch: "",
        };
        const transfer_preprocess = await fetch(
          `${baseUrl}/transfer/preprocess?key=${session.key}`,
          {
            method: "post",
            body: new URLSearchParams({
              key: session.key,
              ...transfer_data,
            }),
            // @ts-ignore
            headers: {
              "X-API-Key": API_KEY,
            },
          }
        );
        const preprocess_json = await transfer_preprocess.json();

        res.status(200).json(preprocess_json);
      } catch (e: any) {
        console.error("ERROR", e.message);
      }
    } catch (err: any) {
      res.status(err.statusCode || 500).json(err.message);
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}
