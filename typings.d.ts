import { FieldValue } from "@firebase/firestore-types";
import { ReactNode } from "react";

export type SortDirection = "asc" | "desc";

export type NavItem = {
  url: string;
  title: string;
  icon: ReactNode;
};

export type User = {
  id: string;
  name: string;
  emailVerified: boolean | null;
  email: string;
  image: string;
};

export type Product = {
  id: string;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  status: "active" | "inactive";
  last_updated_at: number | FieldValue;
  created_at: number | FieldValue;
  rating?: {
    rate: number;
    count: number;
  };
};

export type Order = {
  id: string;
  amount: number;
  amount_shipping: number;
  images: string[];
  timestamp: number | FieldValue;
  items?: any[];
  user_id: string;
};

export type BambooAddress = {
  Country: string;
  City: string;
  State: string;
  PostalCode: string;
  AddressDetail: string;
};

export type BambooCustomer = {
  Email: string;
  DocNumber: string;
  PhoneNumber: string;
  FirstName: string;
  LastName: string;
  DocumentTypeId: number;
  ShippingAddress?: BambooAddress;
  BillingAddress?: BambooAddress;
};

export type BambooCardDetails = {
  CardHolderName: string;
  Pan: string;
  CVV: string;
  Expiration: string;
  Email: string;
  Document: string;
};

export type CartItem = { quantity: number; product: Product };

export type CartShipping = {
  name: string;
  price: number | string;
};

export type BambooPaymentData = {
  Description: string;
  Amount: number;
  TaxableAmount: string;
  Order: string;
  Invoice: string;
  ShippingAddress: {
    Country: string;
    City: string;
    State: string;
    PostalCode: string;
    AddressDetail: string;
  };
  BillingAddress: {
    Country: string;
    City: string;
    State: string;
    PostalCode: string;
    AddressDetail: string;
  };
  Customer: {
    Email: string;
    DocNumber: string;
    PhoneNumber: string;
    FirstName: string;
    LastName: string;
    DocumentTypeId: number;
  };
  CardData: {
    CardHolderName: string;
    Pan: string;
    CVV: string;
    Expiration: string;
    Email: string;
    Document: string;
  };
};
