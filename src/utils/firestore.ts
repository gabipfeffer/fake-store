import { Order, Product, User } from "../../typings";
import db from "../../firebase";
import * as admin from "firebase-admin";
import moment from "moment/moment";
import { FieldValue } from "@firebase/firestore-types";

const serviceAccount = JSON.parse(
  process.env.FIREBASE_SERVICE_ACCOUNT_KEY as string
);

export const app = !admin.apps.length
  ? admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    })
  : admin.app();

const formatFireStoreDate = (date: number | FieldValue) => {
  // @ts-ignore
  return moment(date?.toDate?.()).unix();
};

export const getUserByEmail = async (email: string): Promise<User> => {
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

export const getOrdersByUserId = async (id: string): Promise<Order[]> => {
  const firebaseOrders = await db
    .collection("orders")
    .where("user_id", "==", id)
    .orderBy("timestamp", "desc")
    .get();

  return await Promise.all(
    firebaseOrders.docs.map(async (document) => {
      const order = document.data() as Order;
      const timestamp = formatFireStoreDate(order.timestamp);

      return {
        id: document.id,
        amount: order.amount,
        amount_shipping: order.amount_shipping,
        images: order.images,
        user_id: order.user_id,
        timestamp,
      };
    })
  );
};

export const getProducts = async (): Promise<Product[]> => {
  const productsSnapshots = await db
    .collection("products")
    .orderBy("title", "desc")
    .get();

  return await Promise.all(
    productsSnapshots.docs.map(async (document) => {
      const product = document.data() as Product;
      const last_updated_at = formatFireStoreDate(product.last_updated_at);
      const created_at = formatFireStoreDate(product.created_at);

      return {
        id: document.id,
        ...product,
        last_updated_at,
        created_at,
      };
    })
  );
};

export const getProductById = async (id: string): Promise<Product> => {
  const productSnapshot = await db.collection("products").doc(id).get();

  if (!productSnapshot.exists) {
    return;
  }

  const product = productSnapshot.data() as Product;
  const last_updated_at = formatFireStoreDate(product.last_updated_at);
  const created_at = formatFireStoreDate(product.created_at);

  return { ...product, created_at, last_updated_at };
};

export const createProduct = async (
  product: Product
): Promise<Product | undefined> => {
  try {
    return app.firestore().collection("products").doc(product?.id).set(product);
  } catch (e: any) {
    throw new Error(`Error creating product: ${e.message}`);
  }
};

export const updateProduct = async (
  product: Product
): Promise<Product | undefined> => {
  try {
    return app
      .firestore()
      .collection("products")
      .doc(product?.id)
      .update(product);
  } catch (e: any) {
    throw new Error(`Error updating product: ${e.message}`);
  }
};
