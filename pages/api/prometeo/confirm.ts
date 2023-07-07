import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      const {
        session,
        request_id,
        authorization_type,
        authorization_data,
        authorization_device_number,
      } = JSON.parse(req.body);
      const baseUrl = process.env.PROMETEO_BASE_URL;
      const API_KEY = process.env.PROMETEO_API_KEY;

      try {
        const transfer_confirm = await fetch(
          `${baseUrl}/transfer/confirm?key=${session.key}`,
          {
            method: "post",
            body: new URLSearchParams({
              key: session.key,
              request_id,
              authorization_type,
              authorization_data,
              authorization_device_number,
            }),
            // @ts-ignore
            headers: {
              "X-API-Key": API_KEY,
            },
          }
        );
        const confirm_json = await transfer_confirm.json();

        res.status(200).json(confirm_json);
      } catch (err: any) {
        res.status(err.statusCode || 500).json(err.message);
      } finally {
        await fetch(`${URL}/logout/?key=${session.key}`, {
          // @ts-ignore
          headers: {
            "X-API-Key": API_KEY,
          },
        });
      }
    } catch (err: any) {
      res.status(err.statusCode || 500).json(err.message);
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}
