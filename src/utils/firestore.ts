import { Category, Order, Product, User } from "../../typings";
import db from "../../firebase";
import * as admin from "firebase-admin";
import moment from "moment/moment";
import { FieldValue } from "@firebase/firestore-types";
import { firestore } from "firebase-admin";
import WriteResult = firestore.WriteResult;

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

// ORDERS
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

// PRODUCTS
export const getProducts = async (): Promise<Product[]> => {
  try {
    const productsSnapshots = await db
      .collection("products")
      .orderBy("title", "desc")
      .get();

    return await Promise.all(
      productsSnapshots.docs.map(async (document) => {
        const product = document.data() as Product;
        const last_updated_at = formatFireStoreDate(product.last_updated_at);
        const created_at = formatFireStoreDate(product.created_at);
        let category;
        if (
          product?.category &&
          typeof product?.category === "string" &&
          product?.category?.length
        ) {
          category = await getCategoryById(product.category);
        }

        return {
          ...product,
          id: document.id,
          last_updated_at,
          created_at,
          category: category || null,
        };
      })
    );
  } catch (e: any) {
    throw new Error(`Error fetching products: ${e.message}`);
  }
};

export const getProductById = async (id: string): Promise<Product> => {
  try {
    const productSnapshot = await db.collection("products").doc(id).get();

    if (!productSnapshot.exists) {
      throw new Error(`Product snapshot does not exist`);
    }

    const product = productSnapshot.data() as Product;
    const last_updated_at = formatFireStoreDate(product.last_updated_at);
    const created_at = formatFireStoreDate(product.created_at);

    const images = await getImages(product.id);
    console.log("product", product);
    let category;
    if (
      product?.category &&
      typeof product?.category === "string" &&
      product?.category?.length
    ) {
      console.log("fetch category");
      category = await getCategoryById(product.category);
    }
    return {
      ...product,
      created_at,
      last_updated_at,
      images: images || [],
      category: category || null,
    };
  } catch (e: any) {
    throw new Error(`Error fetching product by id: ${e.message}`);
  }
};

export const createProduct = async (product: Product): Promise<WriteResult> => {
  try {
    return app.firestore().collection("products").doc(product?.id).set(product);
  } catch (e: any) {
    throw new Error(`Error creating product: ${e.message}`);
  }
};

export const updateProduct = async (product: Product): Promise<WriteResult> => {
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

export const deleteProduct = async (productId: string): Promise<any> => {
  try {
    return app.firestore().collection("products").doc(productId).delete();
  } catch (e: any) {
    throw new Error(`Error deleting product: ${e.message}`);
  }
};

// FILES
export const uploadFiles = async (
  files: any
): Promise<Awaited<{ name: string; imageUrl: string }>[]> => {
  try {
    const bucket = app
      .storage()
      .bucket(`${serviceAccount.project_id}.appspot.com`);

    return Promise.all(
      Object.values(files).map(async ([file]: any) => {
        const uploadedFile = await bucket
          .upload(file.path, {
            destination: file.fieldName,
          })
          .then(([uploadedFile]) => uploadedFile);

        return getFileSignedUrl(uploadedFile.name);
      })
    );
  } catch (e: any) {
    throw new Error(`Error uploading files: ${e.message}`);
  }
};

export const getImages = async (
  documentID: string
): Promise<{ name: string; imageUrl: string }[]> => {
  try {
    const bucket = app
      .storage()
      .bucket(`${serviceAccount.project_id}.appspot.com`);

    return bucket
      .getFiles({
        prefix: documentID,
      })
      .then((files) => {
        return Promise.all(
          files?.[0]?.map(async (file: any) => getFileSignedUrl(file.name))
        );
      });
  } catch (e: any) {
    throw new Error(`Error getting images: ${e.message}`);
  }
};

export const getFileSignedUrl = async (
  fileName: string
): Promise<{ name: string; imageUrl: string }> => {
  try {
    const bucket = app
      .storage()
      .bucket(`${serviceAccount.project_id}.appspot.com`);

    const file = bucket.file(fileName);
    return await file
      .getSignedUrl({
        action: "read",
        expires: "03-09-2030",
      })
      .then(([signedUrl]) => ({
        name: fileName,
        imageUrl: signedUrl,
      }));
  } catch (e: any) {
    throw new Error(`Error get signed URLs for files: ${e.message}`);
  }
};

export const deleteFile = (name: string) => {
  try {
    return app
      .storage()
      .bucket(`${serviceAccount.project_id}.appspot.com`)
      .file(name)
      .delete();
  } catch (e: any) {
    throw new Error(`Error deleting file ${name}: ${e.message}`);
  }
};

// CATEGORIES
export const getCategories = async (): Promise<Category[]> => {
  try {
    const categoriesSnapshots = await db
      .collection("categories")
      .orderBy("title", "desc")
      .get();

    return await Promise.all(
      categoriesSnapshots.docs.map(async (document) => {
        const category = document.data() as Category;
        const last_updated_at = formatFireStoreDate(category.last_updated_at);
        const created_at = formatFireStoreDate(category.created_at);

        return {
          ...category,
          id: document.id,
          last_updated_at,
          created_at,
        };
      })
    );
  } catch (e: any) {
    throw new Error(`Error fetching categories: ${e.message}`);
  }
};

export const getCategoryById = async (id: string): Promise<Category> => {
  try {
    const categorySnapshot = await db.collection("categories").doc(id).get();

    if (!categorySnapshot.exists) {
      throw new Error(`Category snapshot does not exist`);
    }

    const category = categorySnapshot.data() as Category;
    const last_updated_at = formatFireStoreDate(category.last_updated_at);
    const created_at = formatFireStoreDate(category.created_at);

    const images = await getImages(category.id);

    return {
      ...category,
      created_at,
      last_updated_at,
      images: images || [],
    };
  } catch (e: any) {
    throw new Error(`Error fetching product by id: ${e.message}`);
  }
};

export const createCategory = async (
  category: Category
): Promise<WriteResult> => {
  try {
    return app
      .firestore()
      .collection("categories")
      .doc(category?.id)
      .set(category);
  } catch (e: any) {
    throw new Error(`Error creating category: ${e.message}`);
  }
};

export const updateCategory = async (
  category: Category
): Promise<WriteResult> => {
  try {
    return app
      .firestore()
      .collection("categories")
      .doc(category?.id)
      .update(category);
  } catch (e: any) {
    throw new Error(`Error updating category: ${e.message}`);
  }
};

export const deleteCategory = async (categoryId: string): Promise<any> => {
  try {
    return app.firestore().collection("categories").doc(categoryId).delete();
  } catch (e: any) {
    throw new Error(`Error deleting category: ${e.message}`);
  }
};

// USERS
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

// ADMIN USERS
export const getAdminUsers = async (): Promise<User[]> => {
  try {
    const usersSnapshots = await db
      .collection("admin_users")
      .orderBy("last_updated_at", "desc")
      .get();

    return await Promise.all(
      usersSnapshots.docs.map(async (document) => {
        const user = document.data() as User;
        const last_updated_at = formatFireStoreDate(user.last_updated_at);
        const created_at = formatFireStoreDate(user.created_at);

        return {
          ...user,
          id: document.id,
          last_updated_at,
          created_at,
        };
      })
    );
  } catch (e: any) {
    throw new Error(`Error fetching admin users: ${e.message}`);
  }
};

export const getAdminUserById = async (id: string): Promise<User> => {
  try {
    const userSnapshot = await db.collection("admin_users").doc(id).get();

    if (!userSnapshot.exists) {
      throw new Error(`Admin user snapshot does not exist`);
    }

    const user = userSnapshot.data() as User;
    const last_updated_at = formatFireStoreDate(user.last_updated_at);
    const created_at = formatFireStoreDate(user.created_at);

    return {
      ...user,
      created_at,
      last_updated_at,
    };
  } catch (e: any) {
    throw new Error(`Error fetching admin user by id: ${e.message}`);
  }
};
export const getAdminUserByEmail = async (email: string): Promise<User> => {
  try {
    let adminUser = undefined;
    const adminUserSnapshots = await db
      .collection("admin_users")
      .where("email", "==", email)
      .get();

    if (adminUserSnapshots.empty) {
      return adminUser;
    }

    adminUserSnapshots.forEach((doc) => {
      adminUser = { id: doc.id, ...doc.data() };
    });

    return adminUser;
  } catch (e: any) {
    throw new Error(`Error fetching admin user by id: ${e.message}`);
  }
};

export const createAdminUser = async (user: User): Promise<WriteResult> => {
  try {
    return app.firestore().collection("admin_users").doc(user?.id).set(user);
  } catch (e: any) {
    throw new Error(`Error creating admin user: ${e.message}`);
  }
};

export const updateAdminUser = async (user: User): Promise<WriteResult> => {
  try {
    return app.firestore().collection("admin_users").doc(user?.id).update(user);
  } catch (e: any) {
    throw new Error(`Error updating admin user: ${e.message}`);
  }
};

export const deleteAdminUser = async (userId: string): Promise<any> => {
  try {
    return app.firestore().collection("admin_users").doc(userId).delete();
  } catch (e: any) {
    throw new Error(`Error deleting admin user: ${e.message}`);
  }
};
