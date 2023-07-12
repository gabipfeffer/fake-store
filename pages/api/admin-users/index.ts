import type { NextApiRequest, NextApiResponse } from "next";
import {
  createAdminUser,
  updateAdminUser,
  deleteAdminUser,
  getAdminUserByEmail,
} from "src/utils/firestore";
import { firestore } from "firebase-admin";
import { isAdminRequest } from "src/utils/authOptions";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    try {
      const { email } = req.query;
      const adminUser = await getAdminUserByEmail(email as string);

      if (!adminUser) {
        throw new Error("Error fetching admin user");
      }

      res.status(200).json(adminUser);
    } catch (err: any) {
      res.status(err.statusCode || 500).json(err.message);
    }
  }

  await isAdminRequest(req, res);
  if (req.method === "POST") {
    try {
      const { user } = JSON.parse(req.body);
      const timestamp = firestore.FieldValue.serverTimestamp();
      const createdAdminUser = await createAdminUser({
        ...user,
        last_updated_at: timestamp,
        created_at: timestamp,
      });

      if (!createdAdminUser) {
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
      const updatedAdminUser = await updateAdminUser({
        ...user,
        last_updated_at: firestore.FieldValue.serverTimestamp(),
      });

      if (!updatedAdminUser) {
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
      const deletedAdminUser = await deleteAdminUser(id as string);

      if (!deletedAdminUser) {
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
