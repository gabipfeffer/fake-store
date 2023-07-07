import type { NextApiRequest, NextApiResponse } from "next";
import multiparty from "multiparty";
import { deleteFile, uploadFiles } from "src/utils/firestore";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      const form = new multiparty.Form();
      const { files }: { files: any } = await new Promise((resolve, reject) => {
        form.parse(req, (err, fields, files) => {
          if (err) reject(err);
          resolve({ files });
        });
      });

      const response = await uploadFiles(files);

      res.status(200).json(response);
    } catch (err: any) {
      res.status(err.statusCode || 500).json(err.message);
    }
  } else if (req.method === "DELETE") {
    try {
      const { file } = req.query;
      const response = await deleteFile(file as string);

      res.status(200).json(response);
    } catch (err: any) {
      res.status(err.statusCode || 500).json(err.message);
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};
