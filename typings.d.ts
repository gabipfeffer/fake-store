import { FieldValue } from "@firebase/firestore-types";

export type Product = {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
  hasPrime?: boolean;
};

export type Order = {
  id: string;
  amount: number;
  amount_shipping: number;
  images: string[];
  timestamp: number | FieldValue;
  items?: any[];
};
