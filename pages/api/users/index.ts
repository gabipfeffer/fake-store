import type { NextApiRequest, NextApiResponse } from "next";
import { createUser, updateUser, deleteUser } from "src/utils/firestore";
import { firestore } from "firebase-admin";
import { isAdminRequest } from "src/utils/authOptions";

type Data = { id: string };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  await isAdminRequest(req, res);
  if (req.method === "POST") {
    try {
      const { user } = JSON.parse(req.body);
      const timestamp = firestore.FieldValue.serverTimestamp();
      const createdUser = await createUser({
        ...user,
        last_updated_at: timestamp,
        created_at: timestamp,
      });

      if (!createdUser) {
        throw new Error("Error creating user");
      }

      res.status(200).json({ id: user.id });
    } catch (err: any) {
      res.status(err.statusCode || 500).json(err.message);
    }
  }

  if (req.method === "PUT") {
    try {
      const { user } = JSON.parse(req.body);
      const updatedUser = await updateUser({
        ...user,
        last_updated_at: firestore.FieldValue.serverTimestamp(),
      });

      if (!updatedUser) {
        throw new Error("Error updating user" + user.id);
      }

      res.status(200).json({ id: user.id });
    } catch (err: any) {
      res.status(err.statusCode || 500).json(err.message);
    }
  }

  if (req.method === "DELETE") {
    try {
      const { id } = req.query;
      const deletedUser = await deleteUser(id as string);

      if (!deletedUser) {
        throw new Error("Error deleting user" + id);
      }

      res.status(200).json({ id: id as string });
    } catch (err: any) {
      res.status(err.statusCode || 500).json(err.message);
    }
  }

  res.setHeader("Allow", "POST");
  res.status(405).end("Method Not Allowed");
}
