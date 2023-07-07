import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      const { provider, username, password } = JSON.parse(req.body);
      const baseUrl = process.env.PROMETEO_BASE_URL;
      const API_KEY = process.env.PROMETEO_API_KEY;

      const credentials = {
        provider,
        username,
        password,
      };

      const session_response = await fetch(baseUrl + "/login/", {
        method: "post",
        body: new URLSearchParams(credentials),
        // @ts-ignore
        headers: {
          "X-API-Key": API_KEY,
        },
      });
      const session = await session_response.json();

      try {
        const accounts_response = await fetch(
          `${baseUrl}/account/?key=${session.key}`,
          {
            // @ts-ignore
            headers: {
              "X-API-Key": API_KEY,
            },
          }
        );
        const accounts = await accounts_response.json();

        res.status(200).json({ session, accounts });
      } catch (err: any) {
        res.status(err.statusCode || 500).json(err.message);
      }
    } catch (err: any) {
      res.status(err.statusCode || 500).json(err.message);
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}
