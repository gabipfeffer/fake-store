import type { NextApiRequest, NextApiResponse } from "next";
import {
  createProduct,
  deleteProduct,
  updateProduct,
} from "src/utils/firestore";
import { firestore } from "firebase-admin";

type Data = { id: string };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method === "POST") {
    try {
      const { product } = JSON.parse(req.body);
      const timestamp = firestore.FieldValue.serverTimestamp();
      const createdProduct = await createProduct({
        ...product,
        last_updated_at: timestamp,
        created_at: timestamp,
      });

      if (!createdProduct) {
        throw new Error("Error creating product");
      }

      res.status(200).json({ id: product.id });
    } catch (err: any) {
      res.status(err.statusCode || 500).json(err.message);
    }
  } else if (req.method === "PUT") {
    try {
      const { product } = JSON.parse(req.body);
      const updatedProduct = await updateProduct({
        ...product,
        last_updated_at: firestore.FieldValue.serverTimestamp(),
      });

      if (!updatedProduct) {
        throw new Error("Error updating product" + product.id);
      }

      res.status(200).json({ id: product.id });
    } catch (err: any) {
      res.status(err.statusCode || 500).json(err.message);
    }
  } else if (req.method === "DELETE") {
    try {
      const { id } = req.query;
      const deletedProduct = await deleteProduct(id as string);

      if (!deletedProduct) {
        throw new Error("Error deleting product" + id);
      }

      res.status(200).json({ id: id as string });
    } catch (err: any) {
      res.status(err.statusCode || 500).json(err.message);
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}
