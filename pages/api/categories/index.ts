import type { NextApiRequest, NextApiResponse } from "next";
import {
  createCategory,
  updateCategory,
  deleteCategory,
} from "src/utils/firestore";
import { firestore } from "firebase-admin";

type Data = { id: string };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method === "POST") {
    try {
      const { category } = JSON.parse(req.body);
      const timestamp = firestore.FieldValue.serverTimestamp();
      const createdCategory = await createCategory({
        ...category,
        last_updated_at: timestamp,
        created_at: timestamp,
      });

      if (!createdCategory) {
        throw new Error("Error creating category");
      }

      res.status(200).json({ id: category.id });
    } catch (err: any) {
      res.status(err.statusCode || 500).json(err.message);
    }
  } else if (req.method === "PUT") {
    try {
      const { category } = JSON.parse(req.body);
      const updatedCategory = await updateCategory({
        ...category,
        last_updated_at: firestore.FieldValue.serverTimestamp(),
      });

      if (!updatedCategory) {
        throw new Error("Error updating category" + category.id);
      }

      res.status(200).json({ id: category.id });
    } catch (err: any) {
      res.status(err.statusCode || 500).json(err.message);
    }
  } else if (req.method === "DELETE") {
    try {
      const { id } = req.query;
      const deletedCategory = await deleteCategory(id as string);

      if (!deletedCategory) {
        throw new Error("Error deleting category" + id);
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
