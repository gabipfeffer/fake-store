import { User } from "../../typings";
import db from "../../firebase";

export const getUserByEmail = async (
  email: string
): Promise<User | undefined> => {
  let user = undefined;
  const userSnapshots = await db
    .collection("users")
    .where("email", "==", email)
    .get();

  if (userSnapshots.empty) {
    return user;
  }

  userSnapshots.forEach((doc) => {
    user = { id: doc.id, ...doc.data() };
  });

  return user;
};
